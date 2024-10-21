import { NextRequest } from "next/server";
import {
  eq,
  and,
  SQLWrapper,
  lte,
  getTableColumns,
  sql,
  desc,
  gte,
} from "drizzle-orm";
import db from "@/utils/database";
import { patientTable } from "@/utils/schema";

// http://localhost:3000/api/patient
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const hospital = searchParams.get("hospital");
  const time = searchParams.get("time");

  const qb = db
    .select({
      ...getTableColumns(patientTable),
      waitingTime: sql<string>`
        CASE WHEN COALESCE(clinical_care_commencement_datetime, discharge_datetime) > ${time}::timestamp 
        THEN ${time}::timestamp - presentation_datetime 
        ELSE COALESCE(clinical_care_commencement_datetime, discharge_datetime) - presentation_datetime END
      `,
      waitingTimeInSec: sql<number>`to_seconds((CASE WHEN COALESCE(clinical_care_commencement_datetime, discharge_datetime) > ${time}::timestamp 
        THEN ${time}::timestamp - presentation_datetime 
        ELSE COALESCE(clinical_care_commencement_datetime, discharge_datetime) - presentation_datetime END))`,
      isCommenced: sql<string>`clinical_care_commencement_datetime < ${time}::timestamp`,
      lengthOfStay: sql<string>`to_seconds((coalesce(discharge_datetime, null) - presentation_datetime))`,
      isDischarged: sql<boolean>`coalesce(discharge_datetime, null) < ${time}::timestamp`,
    })
    .from(patientTable)
    .orderBy(desc(patientTable.presentationDatetime))
    .limit(limit)
    .offset((page - 1) * limit);

  const conds: SQLWrapper[] = [];

  if (hospital) {
    conds.push(eq(patientTable.establishmentCode, hospital));
  }

  if (time) {
    // filtering discharged patients
    conds.push(lte(patientTable.presentationDatetime, sql`${time}::timestamp`));
    // showing patients discharged in the last hour
    conds.push(
      gte(
        patientTable.dischargeDatetime,
        sql`${time}::timestamp - interval '1 hour'`
      )
    );
  }

  qb.where(and(...conds));

  const data = await qb;

  return Response.json({ data });
}
