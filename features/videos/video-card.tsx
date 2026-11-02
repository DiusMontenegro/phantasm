import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { VideoItem } from "@/server/videos/rapidapi";

function formatPublishedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function VideoCard({ video }: { video: VideoItem }) {
  return (
    <Link
      className="video-card"
      href={`/dashboard/watch/${encodeURIComponent(video.id)}`}
      aria-label={`Play ${video.title}`}
    >
      <div className="video-thumbnail">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        ) : (
          <div className="video-thumbnail-placeholder" />
        )}
        <span className="video-play">
          <Play size={18} fill="currentColor" />
        </span>
      </div>
      <div className="video-card-copy">
        <h3>{video.title || "Untitled video"}</h3>
        <p>{video.channelTitle || "Unknown channel"}</p>
        <time dateTime={video.publishedAt}>{formatPublishedDate(video.publishedAt)}</time>
      </div>
    </Link>
  );
}
