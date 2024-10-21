import { SelectPatientModel } from "@/utils/schema";

export const TRIAGE_CATEGORIES = {
  1: "Resuscitation",
  2: "Emergency",
  3: "Urgent",
  4: "Semi-Urgent",
  5: "Non-Urgent",
};

export const TRIAGE_THRESHOLDS = {
  1: 0,
  2: 10 * 60,
  3: 30 * 60,
  4: 60 * 60,
  5: 120 * 60,
};

export type Patient = SelectPatientModel & {
  waitingTime: string;
  waitingTimeInSec: number;
  lengthOfStay: string;
  isCommenced: boolean;
  isDischarged: boolean;
};
