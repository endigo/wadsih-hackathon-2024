import { NextRequest } from "next/server";
import db from "@/utils/database";
import { patientTable } from "@/utils/schema";
import { sql } from "drizzle-orm";

// http://localhost:3000/api/hospitals
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const data = await db
    .select({
      id: patientTable.establishmentCode,
      count: sql<number>`count(1)`,
    })
    .from(patientTable)
    .groupBy(patientTable.establishmentCode)
    .orderBy(sql`count(1) desc`)
    .limit(limit);

  return Response.json({ data });
}
