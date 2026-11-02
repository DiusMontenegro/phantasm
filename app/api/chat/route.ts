import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { OPENROUTER_MODELS } from "@/lib/openrouter-models";
import { streamChatCompletion } from "@/server/openrouter/chat";
import { planVideoSearch } from "@/server/openrouter/search";
import { getVideos } from "@/server/videos/rapidapi";
import { getServerEnv } from "@/lib/env";

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
  model: z.enum([
    OPENROUTER_MODELS[0].id,
    OPENROUTER_MODELS[1].id,
    OPENROUTER_MODELS[2].id,
  ]),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid chat request." },
      { status: 400 },
    );
  }

  try {
    const env = getServerEnv();
    const intentResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: parsed.data.model,
          messages: [
            {
              role: "system",
              content:
                "Classify the latest user request as \"search\" only when it asks to find, show, recommend, or discover videos. Treat questions, explanations, summaries, and general conversation as \"chat\". Return only one lowercase word: search or chat.",
            },
            ...parsed.data.messages,
          ],
        }),
      },
    );

    if (intentResponse.ok) {
      const intentBody = (await intentResponse.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const intent =
        intentBody.choices?.[0]?.message?.content?.trim().toLowerCase();

      if (intent?.includes("search")) {
        const plan = await planVideoSearch(
          parsed.data.messages,
          parsed.data.model,
        );
        const videos = await getVideos(plan.query);

        return Response.json({
          kind: "search",
          message: videos.length
            ? plan.message
            : "I could not find matching videos. Try a broader or different search.",
          query: plan.query,
          videos,
        });
      }
    }

    const stream = await streamChatCompletion(
      parsed.data.messages,
      parsed.data.model,
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reach the AI provider.";
    return Response.json({ error: message }, { status: 502 });
  }
}
