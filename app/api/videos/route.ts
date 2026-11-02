import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getVideoPage } from "@/server/videos/rapidapi";
import { VideoProviderError } from "@/server/videos/rapidapi";

export async function GET(request: NextRequest) {
  await auth.protect();

  const query = request.nextUrl.searchParams.get("q")?.trim().slice(0, 100);
  const pageToken = request.nextUrl.searchParams.get("pageToken")?.trim().slice(0, 200);

  try {
    const page = await getVideoPage(query || "technology", pageToken || undefined);
    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof VideoProviderError && error.status === 429) {
      return NextResponse.json(
        { error: "Daily video provider quota exhausted." },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Unable to load videos." },
      { status: 502 },
    );
  }
}
