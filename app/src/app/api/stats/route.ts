import { NextRequest } from "next/server";
import { eq, and, lte, sql, gte, between, asc } from "drizzle-orm";
import db from "@/utils/database";
import { patientTable } from "@/utils/schema";

// http://localhost:3000/api/stats
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const hospital = searchParams.get("hospital");
  const time = searchParams.get("time");

  const totalSq = db.$with("total").as(
    db
      .select({
        total: sql<number>`count(1)`.as("total"),
      })
      .from(patientTable)
      .where(
        and(
          ...(hospital ? [eq(patientTable.establishmentCode, hospital)] : []),
          ...(time
            ? [
                lte(patientTable.presentationDatetime, sql`${time}::timestamp`),
                gte(patientTable.dischargeDatetime, sql`${time}::timestamp`),
              ]
            : [])
        )
      )
  );
  const admittedDSq = db.$with("admitted").as(
    db
      .select({
        admitted:
          sql<number>`SUM(CASE WHEN coalesce(presentation_datetime, null) < ${time}::timestamp THEN 1 ELSE 0 END)`.as(
            "admitted"
          ),
      })
      .from(patientTable)
      .where(
        and(
          ...(hospital ? [eq(patientTable.establishmentCode, hospital)] : []),
          ...(time
            ? [
                between(
                  patientTable.presentationDatetime,
                  sql`${time}::timestamp - INTERVAL '1 hour'`,
                  sql`${time}::timestamp`
                ),
              ]
            : [])
        )
      )
  );
  const dischargedSq = db.$with("discharged").as(
    db
      .select({
        discharged:
          sql<number>`SUM(CASE WHEN coalesce(discharge_datetime, null) < ${time}::timestamp THEN 1 ELSE 0 END)`.as(
            "discharged"
          ),
      })
      .from(patientTable)
      .where(
        and(
          ...(hospital ? [eq(patientTable.establishmentCode, hospital)] : []),
          ...(time
            ? [
                between(
                  patientTable.dischargeDatetime,
                  sql`${time}::timestamp - INTERVAL '1 hour'`,
                  sql`${time}::timestamp`
                ),
              ]
            : [])
        )
      )
  );

  const sq = db.$with("total_patients").as(
    db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM presentation_datetime)`.as("hour"),
        day: sql<number>`EXTRACT(DAY FROM presentation_datetime)`.as("day"),
        count: sql<number>`COUNT(1)`.as("count"),
      })
      .from(patientTable)
      .where(
        and(
          ...(hospital ? [eq(patientTable.establishmentCode, hospital)] : []),
          ...(time
            ? [lte(patientTable.presentationDatetime, sql`${time}::timestamp`)]
            : [])
        )
      )
      .groupBy(
        sql`EXTRACT(HOUR FROM presentation_datetime)`,
        sql`EXTRACT(DAY FROM presentation_datetime)`
      )
  );

  const peakHours = await db
    .with(sq)
    .select({
      hour: sql<number>`hour`.as("hour"),
      count: sql<number>`ROUND(AVG(count))`.as("count"),
    })
    .from(sq)
    .groupBy(sq.hour)
    .orderBy(asc(sq.hour));

  const [data, avgTimes] = await Promise.all([
    db
      .with(totalSq, admittedDSq, dischargedSq)
      .select({
        total: totalSq.total,
        discharged: dischargedSq.discharged,
        admitted: admittedDSq.admitted,
      })
      .from(totalSq)
      .fullJoin(admittedDSq, sql`TRUE`)
      .fullJoin(dischargedSq, sql`TRUE`),
    // avg times by triage category
    db
      .select({
        triageCategory: patientTable.triageCategory,
        waitingTime: sql<number>`
        ROUND(AVG(to_seconds(CASE WHEN COALESCE(clinical_care_commencement_datetime, discharge_datetime) > ${time}::timestamp
        THEN ${time}::timestamp - presentation_datetime
        ELSE COALESCE(clinical_care_commencement_datetime, discharge_datetime) - presentation_datetime END)))
      `.as("waitingTime"),
        lengthOfStay:
          sql<number>`ROUND(AVG(to_seconds((coalesce(discharge_datetime, null) - presentation_datetime))))`.as(
            "lengthOfStay"
          ),
      })
      .from(patientTable)
      .where(
        and(
          ...(hospital ? [eq(patientTable.establishmentCode, hospital)] : []),
          ...(time
            ? [
                lte(patientTable.presentationDatetime, sql`${time}::timestamp`),
                gte(patientTable.dischargeDatetime, sql`${time}::timestamp`),
              ]
            : [])
        )
      )
      .groupBy(patientTable.triageCategory)
      .orderBy(asc(patientTable.triageCategory)),
  ]);

  return Response.json({
    data: {
      ...data[0],
      avgTimes,
      peakHours,
    },
  });
}
