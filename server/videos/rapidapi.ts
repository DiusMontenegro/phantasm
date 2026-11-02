import "server-only";

import { z } from "zod";
import { getServerEnv } from "@/lib/env";

export interface VideoItem {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt: string;
}

const searchResponseSchema = z.object({
  items: z.array(z.unknown()).default([]),
});

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function getVideos(query = "technology"): Promise<VideoItem[]> {
  const env = getServerEnv();
  const url = new URL(`https://${env.RAPIDAPI_HOST}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "12");

  const response = await fetch(url, {
    headers: {
      "x-rapidapi-key": env.RAPIDAPI_KEY,
      "x-rapidapi-host": env.RAPIDAPI_HOST,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Video provider request failed with ${response.status}`);
  }

  const parsed = searchResponseSchema.parse(await response.json());

  return parsed.items.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const idValue = record.id;
    const snippetValue = record.snippet;
    if (!idValue || typeof idValue !== "object" || !snippetValue || typeof snippetValue !== "object") {
      return [];
    }

    const idRecord = idValue as Record<string, unknown>;
    const snippet = snippetValue as Record<string, unknown>;
    const thumbnails = snippet.thumbnails;
    const thumbnailRecord =
      thumbnails && typeof thumbnails === "object"
        ? (thumbnails as Record<string, unknown>)
        : {};
    const highThumbnail =
      thumbnailRecord.high && typeof thumbnailRecord.high === "object"
        ? (thumbnailRecord.high as Record<string, unknown>)
        : null;
    const mediumThumbnail =
      thumbnailRecord.medium && typeof thumbnailRecord.medium === "object"
        ? (thumbnailRecord.medium as Record<string, unknown>)
        : null;
    const defaultThumbnail =
      thumbnailRecord.default && typeof thumbnailRecord.default === "object"
        ? (thumbnailRecord.default as Record<string, unknown>)
        : null;
    const selectedThumbnail = highThumbnail ?? mediumThumbnail ?? defaultThumbnail;
    const videoId = readString(idRecord.videoId);

    if (!videoId) {
      return [];
    }

    return [
      {
        id: videoId,
        title: readString(snippet.title),
        channelTitle: readString(snippet.channelTitle),
        thumbnailUrl: readString(selectedThumbnail?.url),
        publishedAt: readString(snippet.publishedAt),
      },
    ];
  });
}
