import "server-only";

import { getServerEnv } from "@/lib/env";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function streamChatCompletion(
  messages: ChatMessage[],
  model: string,
) {
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
            "You are PHANTASM, a concise and helpful assistant. Answer questions directly. Do not search videos, browse the web, or call tools. If the user asks for searches, explain that AI Search is a separate feature.",
        },
        ...messages,
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || "OpenRouter request failed.");
  }

  if (!response.body) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const line = event.trim();
            if (!line.startsWith("data:")) continue;

            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;

            const parsed = JSON.parse(data) as {
              choices?: Array<{ delta?: { content?: string } }>;
            };
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(new TextEncoder().encode(content));
          }
        }
      } catch (error) {
        controller.error(error);
        return;
      }

      controller.close();
    },
  });
}
