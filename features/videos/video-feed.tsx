"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { VideoCard } from "@/features/videos/video-card";
import type { VideoItem, VideoPage } from "@/server/videos/rapidapi";

interface VideoFeedProps {
  query: string;
  initialVideos: VideoItem[];
  initialNextPageToken: string | null;
}

async function fetchVideoPage(query: string, pageToken?: string): Promise<VideoPage> {
  const params = new URLSearchParams({ q: query });
  if (pageToken) params.set("pageToken", pageToken);

  const response = await fetch(`/api/videos?${params.toString()}`);
  if (!response.ok) throw new Error("Unable to load videos.");
  return response.json() as Promise<VideoPage>;
}

export function VideoFeed({
  query,
  initialVideos,
  initialNextPageToken,
}: VideoFeedProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["videos", query],
    queryFn: ({ pageParam }) => fetchVideoPage(query, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    initialData: {
      pages: [{
        videos: initialVideos,
        nextPageToken: initialNextPageToken,
      }],
      pageParams: [undefined],
    },
  });

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const scrollRoot = target.closest(".dashboard-main") as HTMLElement | null;
    let frame = 0;

    const loadWhenVisible = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const bounds = target.getBoundingClientRect();
        const viewport = scrollRoot?.getBoundingClientRect();
        const visible =
          viewport &&
          bounds.top < viewport.bottom + 240 &&
          bounds.bottom > viewport.top;

        if (visible) {
          void fetchNextPage();
        }
      });
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !isFetchingNextPage) {
        void fetchNextPage();
      }
    }, {
      root: scrollRoot,
      rootMargin: "240px 0px",
    });

    observer.observe(target);
    loadWhenVisible();
    scrollRoot?.addEventListener("scroll", loadWhenVisible, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      scrollRoot?.removeEventListener("scroll", loadWhenVisible);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, query]);

  const videos = data?.pages.flatMap((page) => page.videos) ?? [];

  if (error && videos.length === 0) {
    return (
      <div className="dashboard-empty-state" role="alert">
        <h3>Videos are temporarily unavailable</h3>
        <p>Check the video provider configuration and try again later.</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="dashboard-empty-state">
        <h3>No videos found</h3>
        <p>Try a different video search.</p>
      </div>
    );
  }

  return (
    <>
      <div className="video-grid">
        {videos.map((video, index) => (
          <VideoCard video={video} key={`${video.id}-${index}`} />
        ))}
      </div>
      <div ref={loadMoreRef} className="video-feed-loader" aria-live="polite">
        {isFetchingNextPage && "Loading more videos..."}
      </div>
    </>
  );
}
