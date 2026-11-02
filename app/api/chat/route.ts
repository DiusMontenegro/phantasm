import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { OPENROUTER_MODELS } from "@/lib/openrouter-models";
import { streamChatCompletion } from "@/server/openrouter/chat";

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
