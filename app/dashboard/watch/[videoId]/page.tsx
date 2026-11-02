import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function VideoPlayer({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  void videoId;

  return (
    <main className="video-player-page">
      <Link className="video-back-link" href="/dashboard/watch">
        <ArrowLeft size={17} />
        Back to feed
      </Link>
      <div className="video-player-frame video-player-placeholder" aria-hidden="true" />
    </main>
  );
}

export default function VideoPlayerPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  return (
    <Suspense fallback={<div className="video-player-loading" role="status">Loading video...</div>}>
      <VideoPlayer params={params} />
    </Suspense>
  );
}
