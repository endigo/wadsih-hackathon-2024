// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import fs from "fs";

export const predictTriageCategory = async (
  age: string,
  sex: string,
  description: string
) => {
  const result = await streamText({
    // model: openai("gpt-4o"),
    model: google("gemini-1.5-flash"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Learn form the triage categories and their thresholds.",
          },
          {
            type: "file",
            mimeType: "application/pdf",
            data: fs.readFileSync("./public/triage.pdf"),
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `What is the triage category for the following age, sex and description: Age: ${age}, Sex: ${sex}, Description: ${description}`,
          },
        ],
      },
    ],
  });

  return result;
};
