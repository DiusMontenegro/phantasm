import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  CLERK_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  OPENROUTER_API_KEY: z.string().min(1),
  RAPIDAPI_KEY: z.string().min(1),
  RAPIDAPI_HOST: z.string().min(1).optional().default("youtube-v31.p.rapidapi.com"),
  OPENROUTER_MODEL: z
    .string()
    .optional()
    .default("nvidia/nemotron-3-ultra-550b-a55b:free"),
});

export function getServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${result.error.issues
        .map((issue) => issue.path.join("."))
        .join(", ")}`,
    );
  }

  return result.data;
}
