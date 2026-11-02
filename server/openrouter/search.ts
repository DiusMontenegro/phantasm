import "server-only";

import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import type { ChatMessage } from "@/server/openrouter/chat";

const searchPlanSchema = z.object({
  query: z.string().trim().min(1).max(100),
  message: z.string().trim().min(1).max(500),
});

function extractSearchPlan(content: string) {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  const candidate = start >= 0 && end > start ? content.slice(start, end + 1) : content;
  const parsed = searchPlanSchema.safeParse(JSON.parse(candidate));
  return parsed.success ? parsed.data : null;
}

export async function planVideoSearch(messages: ChatMessage[], model: string) {
  const env = getServerEnv();
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You help users find YouTube videos. Use the full conversation to understand the current request and follow-ups. Return only valid JSON with this shape: {\"query\":\"concise video search query\",\"message\":\"brief conversational explanation\"}. Do not answer general knowledge questions. If the request is unclear, use a general query and ask a clarifying question in the message.",
        },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Video search AI request failed.");
  }

  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = result.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Video search AI returned an empty response.");
  }

  try {
    const plan = extractSearchPlan(content);
    if (plan) return plan;
  } catch {
    // Fall back to a direct search using the latest user request.
  }

  const latestRequest = messages.at(-1)?.content ?? "";
  return {
    query: latestRequest.trim().slice(0, 100),
    message: "Here are videos I found for your request.",
  };
}
