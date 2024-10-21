import { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
export const patientTable = pgTable("patients", {
  id: integer("id").primaryKey(),
  personID: varchar("person_ID").notNull(),
  age: integer("age").notNull(),
  sex: integer("sex").notNull(),
  ethnicity: integer("ethnicity"),
  triageCategory: integer("triage_category").notNull(),
  establishmentCode: varchar("establishment_code").notNull(),
  presentationDatetime: timestamp("presentation_datetime"),
  clinicalCareCommencementDatetime: timestamp(
    "clinical_care_commencement_datetime"
  ),
  bedRequestDatetime: timestamp("bed_request_datetime"),
  dischargeDatetime: timestamp("discharge_datetime"),
  departureStatus: integer("departure_status"),
  modeOfArrival: integer("mode_of_arrival"),
  primaryDiagnosisICD10AMChapter: varchar("primary_diagnosis_ICD10AM_chapter"),
  affectedByDrugsAndOrAlcohol: boolean("affected_by_drugs_and_or_alcohol"),
  selfHarmAttendance: boolean("self_harm_attendance"),
  metropolitanHospitalFlag: boolean("metropolitan_hospital_flag"),
  mentalHealthAttendance: boolean("mental_health_attendance"),
  mentalHealthAdmission: boolean("mental_health_admission"),
  potentiallyAvoidableGeneralPractitionerTypeAttendance: boolean(
    "potentially_avoidable_general_practitioner_type_attendance"
  ),
  doctorsAvailable: integer("doctors_available"),
  bedsAvailable: integer("beds_available"),
});

export type SelectPatientModel = InferSelectModel<typeof patientTable>;
