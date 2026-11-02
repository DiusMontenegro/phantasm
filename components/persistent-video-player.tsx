"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

let reloadCleanedInThisDocument = false;

export function PersistentVideoPlayer() {
  const pathname = usePathname();
  const router = useRouter();
  const playerMatch = pathname.match(/^\/dashboard\/watch\/([^/?#]+)$/);
  const routeVideoId = playerMatch ? decodeURIComponent(playerMatch[1]) : null;
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playerHidden, setPlayerHidden] = useState(false);

  useEffect(() => {
    const navigation = window.performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navigation?.type === "reload" && !reloadCleanedInThisDocument) {
      reloadCleanedInThisDocument = true;
      window.sessionStorage.removeItem("phantasm-last-video");
      const resetFrame = window.requestAnimationFrame(() => {
        setVideoId(null);
      });
      if (routeVideoId) {
        router.replace("/dashboard/watch");
      }
      return () => window.cancelAnimationFrame(resetFrame);
    }

    const frame = window.requestAnimationFrame(() => {
      if (routeVideoId) {
        window.sessionStorage.setItem("phantasm-last-video", routeVideoId);
        setPlayerHidden(false);
        setVideoId(routeVideoId);
        return;
      }

      const lastVideoId = window.sessionStorage.getItem("phantasm-last-video");
      if (lastVideoId) {
        setPlayerHidden(false);
        setVideoId(lastVideoId);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [routeVideoId, router]);

  if (!videoId || playerHidden) return null;

  const embedUrl = new URL(
    `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`
  );
  embedUrl.searchParams.set("controls", "1");
  embedUrl.searchParams.set("playsinline", "1");
  embedUrl.searchParams.set("rel", "0");
  embedUrl.searchParams.set("autoplay", "1");

  return (
    <div
      className={`persistent-video-player${routeVideoId ? " persistent-video-player-active" : ""}`}
      aria-label="Background video player"
    >
      {!routeVideoId && (
        <button
          className="persistent-video-player-close"
          type="button"
          aria-label="Close video player"
          onClick={() => setPlayerHidden(true)}
        >
          <X size={16} />
        </button>
      )}
      <iframe
        key={videoId}
        src={embedUrl.toString()}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
