import { NextRequest } from "next/server";
import { eq, and, sql, between, asc } from "drizzle-orm";
import db from "@/utils/database";
import { patientTable } from "@/utils/schema";

// http://localhost:3000/api/patient
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const hospital = searchParams.get("hospital");
  const time = searchParams.get("time");

  const admittedDSq = db.$with("admitted").as(
    db
      .select({
        date: sql<string>`DATE(presentation_datetime)`.as("date"),
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
                  sql`${time}::timestamp - INTERVAL '30 days'`,
                  sql`${time}::timestamp`
                ),
              ]
            : [])
        )
      )
      .groupBy(sql`DATE(presentation_datetime)`)
  );
  const dischargedSq = db.$with("discharged").as(
    db
      .select({
        date: sql<string>`DATE(discharge_datetime)`.as("date"),
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
                  sql`${time}::timestamp - INTERVAL '30 days'`,
                  sql`${time}::timestamp`
                ),
              ]
            : [])
        )
      )
      .groupBy(sql`DATE(discharge_datetime)`)
  );
  const waitingSq = db.$with("waiting").as(
    db
      .select({
        date: sql<string>`DATE(presentation_datetime)`.as("date"),
        waiting:
          sql`ROUND(AVG(to_seconds(clinical_care_commencement_datetime - presentation_datetime)/60))`.as(
            "waitingTime"
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
                  sql`${time}::timestamp - INTERVAL '30 days'`,
                  sql`${time}::timestamp`
                ),
              ]
            : [])
        )
      )
      .groupBy(sql`DATE(presentation_datetime)`)
  );

  const qb = db
    .with(dischargedSq, admittedDSq, waitingSq)
    .select({
      date: sql`admitted.date`,
      discharged: dischargedSq.discharged,
      admitted: admittedDSq.admitted,
      waiting: waitingSq.waiting,
    })
    .from(dischargedSq)
    .leftJoin(admittedDSq, sql`admitted.date = discharged.date`)
    .leftJoin(waitingSq, sql`admitted.date = waiting.date`)
    .orderBy(asc(sql`admitted.date`));

  const data = await qb;

  return Response.json({ data });
}
