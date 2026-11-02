"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function WatchRouteRedirect() {
  const router = useRouter();

  useEffect(() => {
    const navigation = window.performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigation?.type === "reload") {
      window.sessionStorage.removeItem("phantasm-last-video");
      return;
    }

    const videoId = window.sessionStorage.getItem("phantasm-last-video");
    if (!videoId) return;

    router.replace(`/dashboard/watch/${encodeURIComponent(videoId)}`);
  }, [router]);

  return null;
}
