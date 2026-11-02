import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, MessageSquareText, Sparkles } from "lucide-react";
import { getVideoPage } from "@/server/videos/rapidapi";
import { AiChatWidget } from "@/features/chat/AiChatWidget";
import { VideoFeed } from "@/features/videos/video-feed";

async function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  await auth.protect();
  const params = await searchParams;
  const queryValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = queryValue?.trim().slice(0, 100) || "technology";
  let initialPage: Awaited<ReturnType<typeof getVideoPage>> = {
    videos: [],
    nextPageToken: null,
  };
  let videoError = false;

  try {
    initialPage = await getVideoPage(query);
  } catch {
    videoError = true;
  }

  return (
    <main className="dashboard-content">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">YOUR INTELLIGENT WORKSPACE</p>
          <h1>What do you want to explore?</h1>
          <p className="dashboard-lede">
            Discover video, search the web, or start a conversation from one
            focused space.
          </p>
        </div>

        <Link className="dashboard-ai-launcher" href="/dashboard/chat">
          <Sparkles size={16} />
          Ask PHANTASM
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="dashboard-video-section" id="watch">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">CONTINUE EXPLORING</p>
            <h2>For you</h2>
          </div>
        </div>

          {videoError ? (
            <div className="dashboard-empty-state" role="alert">
              <div className="dashboard-empty-orb" aria-hidden="true">
                <Sparkles size={22} />
              </div>
              <h3>Videos are temporarily unavailable</h3>
              <p>Check the video provider configuration and try again later.</p>
            </div>
          ) : (
            <VideoFeed
              query={query}
              initialVideos={initialPage.videos}
              initialNextPageToken={initialPage.nextPageToken}
            />
          )}
      </section>

      <section className="dashboard-tools" aria-label="AI tools">
        <article id="chat">
          <MessageSquareText size={20} />
          <div>
            <h2>AI Chat</h2>
            <p>Analyze ideas with an adaptive model copilot.</p>
          </div>
          <ArrowRight className="dashboard-tool-arrow" size={18} />
        </article>
      </section>
      <AiChatWidget />
    </main>
  );
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="dashboard-content" aria-busy="true">
          <div className="dashboard-loading-heading shimmer" />
          <div className="dashboard-loading-copy shimmer" />
          <div className="dashboard-loading-grid">
            <div className="shimmer" />
            <div className="shimmer" />
            <div className="shimmer" />
          </div>
        </main>
      }
    >
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
