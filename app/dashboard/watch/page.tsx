import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getVideoPage } from "@/server/videos/rapidapi";
import { VideoFeed } from "@/features/videos/video-feed";
import { WatchRouteRedirect } from "@/components/watch-route-redirect";

export const metadata: Metadata = {
  title: "Watch",
};

async function WatchContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  await auth.protect();
  const params = await searchParams;
  const queryValue = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = queryValue?.trim().slice(0, 100) || "trending Philippines news music entertainment";
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
    <main className="dashboard-content watch-page-content">
      <WatchRouteRedirect />
      <section className="watch-page-heading">
        <p className="dashboard-eyebrow">WATCH NOW</p>
        <h1>Trending videos</h1>
        <p>Explore a continuous stream of music, culture, entertainment, and popular stories.</p>
      </section>

      {videoError ? (
        <div className="dashboard-empty-state" role="alert">
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
    </main>
  );
}

export default function WatchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="dashboard-content watch-page-content" aria-busy="true">
          <div className="dashboard-loading-heading shimmer" />
          <div className="dashboard-loading-grid">
            <div className="shimmer" />
            <div className="shimmer" />
            <div className="shimmer" />
          </div>
        </main>
      }
    >
      <WatchContent searchParams={searchParams} />
    </Suspense>
  );
}
