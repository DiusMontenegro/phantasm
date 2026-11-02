import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function VideoPlayerPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;

  return (
    <main className="video-player-page">
      <Link className="video-back-link" href="/dashboard#watch">
        <ArrowLeft size={17} />
        Back to feed
      </Link>
      <div className="video-player-frame">
        <iframe
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </main>
  );
}
