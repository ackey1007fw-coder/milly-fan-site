import type { StreamRecapSongClip } from "../data/streamRecaps.ts";
import { buildStreamSongCatalog, type CatalogSong, type SongPerformance, type SongRecap } from "./streamSongCatalog.ts";

export type StreamSongClipItem = {
  key: string;
  title: string;
  artist: string;
  youtubeUrl: string;
  youtubeVersionNote?: string;
  performance: SongPerformance & { clip: StreamRecapSongClip };
};

function broadcastMinutes(label: string): number {
  const match = /^(\d{1,2}):(\d{2})/.exec(label);
  return match ? Number(match[1]) * 60 + Number(match[2]) : -1;
}

function newestFirst(a: StreamSongClipItem, b: StreamSongClipItem): number {
  return b.performance.date.localeCompare(a.performance.date)
    || broadcastMinutes(b.performance.broadcastLabel) - broadcastMinutes(a.performance.broadcastLabel)
    || a.performance.clip.sourceTimestamp.localeCompare(b.performance.clip.sourceTimestamp, "en", { numeric: true })
    || a.title.localeCompare(b.title, "ja");
}

export function songClipPerformanceAnchor(performance: SongPerformance & { clip: StreamRecapSongClip }): string {
  return `clip-${performance.id}-${performance.clip.sourceTimestamp.replace(/[^0-9]/g, "")}`;
}

export function songClipAnchor(item: StreamSongClipItem): string {
  return songClipPerformanceAnchor(item.performance);
}

export function buildStreamSongClips(recaps: readonly SongRecap[]): StreamSongClipItem[] {
  const catalog = buildStreamSongCatalog(recaps);
  const clips: StreamSongClipItem[] = [];
  for (const song of catalog) {
    for (const performance of song.performances) {
      if (!performance.clip) continue;
      clips.push({
        key: song.key,
        title: song.title,
        artist: song.artist,
        youtubeUrl: song.youtubeUrl,
        ...(song.youtubeVersionNote ? { youtubeVersionNote: song.youtubeVersionNote } : {}),
        performance: { ...performance, clip: { ...performance.clip } },
      });
    }
  }
  return clips.sort(newestFirst);
}

export function catalogSongClipCount(catalog: readonly CatalogSong[]): number {
  return catalog.reduce((count, song) => count + song.performances.filter((performance) => performance.clip).length, 0);
}
