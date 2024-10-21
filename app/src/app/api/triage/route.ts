import { NextRequest } from "next/server";
import { streamObject } from "ai";
// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import fs from "fs";
import { triageSchema } from "./schema";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// http://localhost:3000/api/stats
export async function POST(request: NextRequest) {
  const context = await request.json();

  const result = await streamObject({
    model: google("gemini-1.5-flash"),
    // model: openai("gpt-4-turbo"),
    schema: triageSchema,
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
            text: `Based on the following medical document content, determine the appropriate triage category. Provide only the triage category as the response. ${context.description}`,
          },
        ],
      },
    ],
  });

  return result.toTextStreamResponse();
}
