import type { VideoItem } from "@/server/videos/rapidapi";

const STORAGE_KEY = "phantasm-video-preferences";

interface VideoPreferences {
  searches: string[];
  viewedVideoIds: string[];
  channelWeights: Record<string, number>;
  termWeights: Record<string, number>;
}

const stopWords = new Set([
  "a", "an", "and", "for", "from", "in", "of", "on", "the", "to", "with",
]);

function emptyPreferences(): VideoPreferences {
  return {
    searches: [],
    viewedVideoIds: [],
    channelWeights: {},
    termWeights: {},
  };
}

export function readVideoPreferences(): VideoPreferences {
  if (typeof window === "undefined") return emptyPreferences();

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}") as Partial<VideoPreferences>;
    return {
      searches: Array.isArray(saved.searches) ? saved.searches.slice(-20) : [],
      viewedVideoIds: Array.isArray(saved.viewedVideoIds) ? saved.viewedVideoIds.slice(-50) : [],
      channelWeights: saved.channelWeights ?? {},
      termWeights: saved.termWeights ?? {},
    };
  } catch {
    return emptyPreferences();
  }
}

function savePreferences(preferences: VideoPreferences) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

function terms(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length >= 3 && !stopWords.has(term));
}

export function recordVideoSearch(query: string) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery || typeof window === "undefined") return;

  const preferences = readVideoPreferences();
  preferences.searches.push(normalizedQuery);
  preferences.searches = preferences.searches.slice(-20);

  for (const term of new Set(terms(normalizedQuery))) {
    preferences.termWeights[term] = (preferences.termWeights[term] ?? 0) + 2;
  }

  savePreferences(preferences);
}

export function recordViewedVideo(video: VideoItem) {
  if (typeof window === "undefined") return;

  const preferences = readVideoPreferences();
  preferences.viewedVideoIds.push(video.id);
  preferences.viewedVideoIds = preferences.viewedVideoIds.slice(-50);

  const channel = video.channelTitle.trim().toLowerCase();
  if (channel) {
    preferences.channelWeights[channel] = (preferences.channelWeights[channel] ?? 0) + 2;
  }

  for (const term of new Set(terms(`${video.title} ${video.channelTitle}`))) {
    preferences.termWeights[term] = (preferences.termWeights[term] ?? 0) + 1;
  }

  savePreferences(preferences);
}

export function rankVideosLocally(videos: VideoItem[]) {
  const preferences = readVideoPreferences();

  return [...videos].sort((left, right) => {
    const leftChannel = preferences.channelWeights[left.channelTitle.trim().toLowerCase()] ?? 0;
    const rightChannel = preferences.channelWeights[right.channelTitle.trim().toLowerCase()] ?? 0;
    const leftTerms = terms(`${left.title} ${left.channelTitle}`)
      .reduce((score, term) => score + (preferences.termWeights[term] ?? 0), 0);
    const rightTerms = terms(`${right.title} ${right.channelTitle}`)
      .reduce((score, term) => score + (preferences.termWeights[term] ?? 0), 0);
    const leftViewed = preferences.viewedVideoIds.includes(left.id) ? 1 : 0;
    const rightViewed = preferences.viewedVideoIds.includes(right.id) ? 1 : 0;

    return (rightChannel * 3 + rightTerms - rightViewed * 0.5) -
      (leftChannel * 3 + leftTerms - leftViewed * 0.5);
  });
}

export function getRecommendedQueries(limit = 3): string[] {
  const preferences = readVideoPreferences();
  const weightedTerms = Object.entries(preferences.termWeights)
    .sort((left, right) => right[1] - left[1])
    .map(([term]) => term)
    .slice(0, limit * 2);

  if (weightedTerms.length === 0) {
    return preferences.searches.slice(-limit).reverse();
  }

  return Array.from({
    length: Math.min(limit, Math.max(1, Math.ceil(weightedTerms.length / 2))),
  }, (_, index) => {
    const first = weightedTerms[index * 2];
    const second = weightedTerms[index * 2 + 1];
    return second ? `${first} ${second}` : first;
  }).filter(Boolean);
}

export const PHILIPPINES_DISCOVERY_QUERIES = [
  "trending Philippines today",
  "Philippines breaking news",
  "OPM songs Philippines",
  "Filipino entertainment viral",
  "Philippines sports highlights",
  "Philippines travel culture",
  "Filipino comedy viral",
  "educational videos Philippines",
] as const;

export function getRotatingDiscoveryQuery(): string {
  if (typeof window === "undefined") return PHILIPPINES_DISCOVERY_QUERIES[0];

  const indexKey = "phantasm-discovery-index";
  const lastQueryKey = "phantasm-last-discovery-query";
  const currentIndex = Number.parseInt(
    window.sessionStorage.getItem(indexKey) || "-1",
    10,
  );
  const lastQuery = window.sessionStorage.getItem(lastQueryKey);
  let nextIndex = currentIndex + 1;

  if (
    nextIndex >= PHILIPPINES_DISCOVERY_QUERIES.length ||
    !Number.isInteger(currentIndex) ||
    currentIndex < 0
  ) {
    nextIndex = Math.floor(Math.random() * PHILIPPINES_DISCOVERY_QUERIES.length);
  }

  let query = PHILIPPINES_DISCOVERY_QUERIES[nextIndex];
  if (query === lastQuery) {
    nextIndex = (nextIndex + 1) % PHILIPPINES_DISCOVERY_QUERIES.length;
    query = PHILIPPINES_DISCOVERY_QUERIES[nextIndex];
  }

  window.sessionStorage.setItem(indexKey, String(nextIndex));
  window.sessionStorage.setItem(lastQueryKey, query);
  return query;
}
