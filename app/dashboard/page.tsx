import { auth } from "@clerk/nextjs/server";
import { ArrowRight, MessageSquareText, Search, Sparkles } from "lucide-react";
import { getVideos } from "@/server/videos/rapidapi";
import { VideoCard } from "@/features/videos/video-card";
import { AiChatWidget } from "@/features/chat/AiChatWidget";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  await auth.protect();
  const params = await searchParams;
  const queryValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = queryValue?.trim().slice(0, 100) || "technology";
  let videos: Awaited<ReturnType<typeof getVideos>> = [];
  let videoError = false;

  try {
    videos = await getVideos(query);
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

        <button className="dashboard-ai-launcher" type="button">
          <Sparkles size={16} />
          Ask PHANTASM
          <ArrowRight size={16} />
        </button>
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
          ) : videos.length === 0 ? (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-orb" aria-hidden="true">
                <Sparkles size={22} />
              </div>
              <h3>No videos found</h3>
              <p>Try again when more recommendations are available.</p>
            </div>
          ) : (
            <div className="video-grid">
              {videos.map((video) => (
                <VideoCard video={video} key={video.id} />
              ))}
            </div>
          )}
      </section>

      <section className="dashboard-tools" aria-label="AI tools">
        <article id="search">
          <Search size={20} />
          <div>
            <h2>AI Search</h2>
            <p>Find precise answers without breaking your flow.</p>
          </div>
          <ArrowRight className="dashboard-tool-arrow" size={18} />
        </article>
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
