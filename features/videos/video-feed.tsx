"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { VideoCard } from "@/features/videos/video-card";
import type { VideoItem, VideoPage } from "@/server/videos/rapidapi";
import {
  getRotatingDiscoveryQuery,
  rankVideosLocally,
  recordVideoSearch,
} from "@/lib/video-preferences";

interface VideoFeedProps {
  query: string;
  initialVideos: VideoItem[];
  initialNextPageToken: string | null;
  personalized?: boolean;
}

async function fetchVideoPage(query: string, pageToken?: string): Promise<VideoPage> {
  const params = new URLSearchParams({ q: query });
  if (pageToken) params.set("pageToken", pageToken);

  const response = await fetch(`/api/videos?${params.toString()}`);
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error ?? "Unable to load videos.");
  }
  return response.json() as Promise<VideoPage>;
}

export function VideoFeed({
  query,
  initialVideos,
  initialNextPageToken,
  personalized = false,
}: VideoFeedProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [activeQuery, setActiveQuery] = useState(query);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["videos", activeQuery],
    queryFn: ({ pageParam }) => fetchVideoPage(activeQuery, pageParam),
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

  const sourceVideos = useMemo(
    () => data?.pages.flatMap((page) => page.videos) ?? [],
    [data],
  );
  const [videos, setVideos] = useState(sourceVideos);

  useEffect(() => {
    recordVideoSearch(query);
  }, [query]);

  useEffect(() => {
    if (!personalized) return;

    const frame = window.requestAnimationFrame(() => {
      setActiveQuery(getRotatingDiscoveryQuery());
    });

    return () => window.cancelAnimationFrame(frame);
  }, [personalized]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVideos(rankVideosLocally(sourceVideos));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [sourceVideos]);

  if (error && videos.length === 0) {
    const quotaExceeded = error.message.includes("quota");

    return (
      <div className="dashboard-empty-state" role="alert">
        <h3>{quotaExceeded ? "Video provider quota reached" : "Videos are temporarily unavailable"}</h3>
        <p>
          {quotaExceeded
            ? "The provider's daily request limit is exhausted. Try again after the quota resets."
            : error.message}
        </p>
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
