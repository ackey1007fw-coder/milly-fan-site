import type { StreamRecap, StreamRecapSong } from "../data/streamRecaps.ts";

export type SongRecap = Pick<StreamRecap, "id" | "date" | "dateLabel" | "theme" | "broadcastLabel" | "songs">;
export type SongPerformance = Omit<SongRecap, "songs"> & { timestamp: string; clip?: StreamRecapSong["clip"] };
export type CatalogSong = Omit<StreamRecapSong, "timestamp" | "clip"> & {
  key: string;
  performances: SongPerformance[];
};
export type SongOrder = "recent" | "title";

function normalize(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("ja");
}

function broadcastMinutes(label: string): number {
  const match = /^(\d{1,2}):(\d{2})/.exec(label);
  return match ? Number(match[1]) * 60 + Number(match[2]) : -1;
}

function newestFirst(a: SongPerformance, b: SongPerformance): number {
  return b.date.localeCompare(a.date)
    || broadcastMinutes(b.broadcastLabel) - broadcastMinutes(a.broadcastLabel)
    || a.id.localeCompare(b.id)
    || a.timestamp.localeCompare(b.timestamp, "en", { numeric: true });
}

/** Only explicit songs are indexed; summaries, song suggestions and instrument performances are not inferred. */
export function buildStreamSongCatalog(recaps: readonly SongRecap[]): CatalogSong[] {
  const catalog = new Map<string, CatalogSong>();
  const ordered = [...recaps].sort((a, b) => newestFirst({ ...a, timestamp: "" }, { ...b, timestamp: "" }));
  for (const recap of ordered) {
    for (const song of recap.songs ?? []) {
      const key = JSON.stringify([normalize(song.title), normalize(song.artist)]);
      let entry = catalog.get(key);
      if (!entry) {
        entry = {
          key,
          title: song.title,
          artist: song.artist,
          youtubeUrl: song.youtubeUrl,
          ...(song.youtubeVersionNote ? { youtubeVersionNote: song.youtubeVersionNote } : {}),
          ...(song.karaoke ? { karaoke: { ...song.karaoke } } : {}),
          performances: [],
        };
        catalog.set(key, entry);
      }
      if (!entry.karaoke && song.karaoke) entry.karaoke = { ...song.karaoke };
      if (entry.performances.some((p) => p.id === recap.id && p.timestamp === song.timestamp)) continue;
      entry.performances.push({
        id: recap.id,
        date: recap.date,
        dateLabel: recap.dateLabel,
        theme: recap.theme,
        broadcastLabel: recap.broadcastLabel,
        timestamp: song.timestamp,
        ...(song.clip ? { clip: { ...song.clip } } : {}),
      });
    }
  }
  return [...catalog.values()].map((entry) => ({
    ...entry,
    performances: [...entry.performances].sort(newestFirst),
  }));
}

export function selectCatalogSongs(
  catalog: readonly CatalogSong[],
  query = "",
  artist = "",
  order: SongOrder = "recent",
): CatalogSong[] {
  const terms = normalize(query).split(" ").filter(Boolean);
  return catalog.filter((song) => {
    const text = normalize(`${song.title} ${song.artist}`);
    return (!artist || normalize(song.artist) === normalize(artist))
      && terms.every((term) => text.includes(term));
  }).sort((a, b) => {
    const byTitle = a.title.localeCompare(b.title, "ja") || a.artist.localeCompare(b.artist, "ja");
    return order === "title" ? byTitle : newestFirst(a.performances[0], b.performances[0]) || byTitle;
  });
}

export function catalogArtists(catalog: readonly CatalogSong[]): string[] {
  const artists = new Map<string, string>();
  for (const song of catalog) {
    const key = normalize(song.artist);
    if (!artists.has(key)) artists.set(key, song.artist);
  }
  return [...artists.values()].sort((a, b) => a.localeCompare(b, "ja"));
}

export function catalogBroadcastCount(catalog: readonly CatalogSong[]): number {
  return new Set(catalog.flatMap((song) => song.performances.map((p) => p.id))).size;
}
