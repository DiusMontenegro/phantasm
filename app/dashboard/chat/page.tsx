import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { AiChatWorkspace } from "@/features/chat/AiChatWorkspace";

export const metadata: Metadata = {
  title: "AI Chat",
  robots: { index: false, follow: false },
};

export default async function ChatPage() {
  await auth.protect();
  return <AiChatWorkspace />;
}
