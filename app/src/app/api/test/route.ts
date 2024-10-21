import { NextRequest } from "next/server";
import { PythonShell } from "python-shell";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// http://localhost:3000/api/stats
export async function POST(request: NextRequest) {
  const context = await request.json();
  console.log(context);

  const inputString = JSON.stringify({
    // sex: "male",
    // age: 25,
    // triageCategory: "emergency",
    age: [25],
    sex: ["male"],
    ethnicity: ["Caucasian"],
    triage_category: [3],
    mode_of_arrival: ["ambulance"],
    metropolitan_hospital_flag: [1],
    affected_by_drugs_and_or_alcohol: [0],
    self_harm_attendance: [0],
    mental_health_attendance: [1],
    doctors_available: [5],
    beds_available: [20],
    presentation_hour: [14],
    presentation_day_of_week: [2],
    is_weekend: [0],
    doctor_to_patient_ratio: [0.1],
    bed_to_patient_ratio: [0.2],
  });
  // const context = await request.json();

  // Run the Python script to make predictions
  const result = await PythonShell.run("predict.py", {
    mode: "text",
    pythonOptions: ["-u"], // unbuffered output
    args: [inputString],
  })
    .then((output) => {
      console.log(output);
      return output;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

  console.log(result);

  return result;
}
