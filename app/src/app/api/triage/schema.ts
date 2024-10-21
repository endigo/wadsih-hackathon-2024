import { z } from "zod";

export const triageSchema = z.object({
  triage: z.array(
    z.object({
      sex: z.string().describe("Sex"),
      age: z.string().describe("Age"),
      message: z.string().describe("Description of the patient"),
      triageCategory: z.number().describe("Triage Category"),
      triageCategoryLabel: z.string().describe("Triage Category Label"),
    })
  ),
});
