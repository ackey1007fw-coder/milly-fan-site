/**
 * Gallery の表示用selector。
 *
 * 正本は既存の media / driveGallery / galleryVideos のまま。
 * ここでは並べ方と件数だけを決める。別配列へコピーしない。
 */
import {
  driveGallerySections,
  driveVideoView,
  visibleDriveGallery,
  type DrivePhotoView,
  type DriveVideoView,
} from "../data/driveGallery.ts";
import {
  isSelfHostedGalleryVideo,
  visibleGalleryVideos,
} from "../data/galleryVideos.ts";
import { isMixchMovie, type MixchMovie } from "../data/mixchMovies.ts";
import { media, visibleMedia, type MediaItem } from "../data/media.ts";

export type GalleryEntry =
  | { kind: "media"; key: string; item: MediaItem }
  | { kind: "drive-photo"; key: string; item: DrivePhotoView }
  | { kind: "video"; key: string; item: DriveVideoView }
  | { kind: "mixch"; key: string; item: MixchMovie };

function partition<T>(items: T[], pred: (item: T) => boolean): [T[], T[]] {
  const matched: T[] = [];
  const rest: T[] = [];
  for (const item of items) {
    (pred(item) ? matched : rest).push(item);
  }
  return [matched, rest];
}

function mentionsMily(text: string): boolean {
  return /みりぃ/.test(text);
}

/** SHOWROOM配信画面のスクリーンショット（メイク / ラジオ枠）。 */
export function isShowroomUiScreenshot(item: MediaItem): boolean {
  return /makeup-showroom|evening-radio-showroom/.test(item.basePath);
}

/** ラジオ出演者3人が並ぶスタジオショット。 */
export function isRadioTrioPhoto(item: MediaItem): boolean {
  return /seaside-circle-musical-special/.test(item.basePath);
}

/** 人物が写っていない空・建物の写真。 */
export function isSkyOrLandscapePhoto(item: MediaItem): boolean {
  return /skytree|dragon-cloud/.test(item.basePath);
}

/** みりぃ本人が写っていない物撮り。 */
export function isObjectWithoutPerson(item: MediaItem): boolean {
  if (mentionsMily(item.alt) || mentionsMily(item.caption ?? "")) return false;
  return /necklace|birthday-cake|kakigori-closeup|cinema-poster/.test(item.basePath);
}

/** みりぃの顔・姿が主役の写真。 */
export function isMilyPortraitPhoto(item: MediaItem): boolean {
  if (item.kind !== "photo") return false;
  if (isShowroomUiScreenshot(item)) return false;
  if (isRadioTrioPhoto(item)) return false;
  if (isSkyOrLandscapePhoto(item)) return false;
  if (isObjectWithoutPerson(item)) return false;
  return true;
}

export function isDrivePortraitPhoto(item: DrivePhotoView): boolean {
  return mentionsMily(item.img.alt);
}

export function selectGalleryEntries(): GalleryEntry[] {
  const photos = visibleMedia(media);
  const drive = driveGallerySections(visibleDriveGallery());
  const standalone = visibleGalleryVideos();
  const mixch = standalone.filter(isMixchMovie);
  const selfHosted = standalone.filter(isSelfHostedGalleryVideo);

  const [mediaPortraits, laterMedia] = partition(photos, isMilyPortraitPhoto);
  const [drivePortraits, laterDrive] = partition(
    drive.photos,
    isDrivePortraitPhoto,
  );

  // 本人写真を先頭にし、HOME preview と Gallery 初期窓が Mixch / 画面写真 / 空に
  // ならないようにする。Mixch outbound は残すが、ポートレートの後ろ
  // （動画ブロック側）へ送る。配列のコピーは作らず、既存正本を並べ替えるだけ。
  return [
    ...mediaPortraits.map((item) => ({
      kind: "media" as const,
      key: item.id,
      item,
    })),
    ...drivePortraits.map((item) => ({
      kind: "drive-photo" as const,
      key: item.key,
      item,
    })),
    ...laterMedia.map((item) => ({
      kind: "media" as const,
      key: item.id,
      item,
    })),
    ...laterDrive.map((item) => ({
      kind: "drive-photo" as const,
      key: item.key,
      item,
    })),
    ...mixch.map((item) => ({
      kind: "mixch" as const,
      key: item.id,
      item,
    })),
    ...selfHosted.map(driveVideoView).map((item) => ({
      kind: "video" as const,
      key: item.key,
      item,
    })),
    ...drive.videos.map((item) => ({
      kind: "video" as const,
      key: item.key,
      item,
    })),
  ];
}

/**
 * 同じイベントの映画館カット（basePath に cinema、同一 mily-bNN バッチ）。
 * HOME preview で連続して並ぶと映画の夜だけに見えるため、イベント単位で識別する。
 */
export function cinemaEventKey(entry: GalleryEntry): string | null {
  if (entry.kind !== "media") return null;
  if (entry.item.kind !== "photo") return null;
  if (!/cinema/.test(entry.item.basePath)) return null;
  const match = entry.item.id.match(/^(mily-b\d+)/);
  return match?.[1] ?? entry.item.id;
}

/**
 * HOME の先頭窓。ポートレート優先の並びは維持したまま、同じ映画館イベントの
 * 連続カットは1枚だけ先に出し、残りは他の本人カットの後ろへ送る。
 * 正本配列はコピーせず、渡された entries を選ぶだけ。
 */
export function pickHomeGalleryPreview(
  entries: readonly GalleryEntry[],
  limit: number,
): GalleryEntry[] {
  const picked: GalleryEntry[] = [];
  const seenCinemaEvents = new Set<string>();
  const deferredCinema: GalleryEntry[] = [];

  for (const entry of entries) {
    if (picked.length >= limit) break;
    const cinemaKey = cinemaEventKey(entry);
    if (cinemaKey && seenCinemaEvents.has(cinemaKey)) {
      deferredCinema.push(entry);
      continue;
    }
    if (cinemaKey) seenCinemaEvents.add(cinemaKey);
    picked.push(entry);
  }

  for (const entry of deferredCinema) {
    if (picked.length >= limit) break;
    picked.push(entry);
  }

  if (picked.length < limit) {
    const used = new Set(picked.map((entry) => entry.key));
    for (const entry of entries) {
      if (picked.length >= limit) break;
      if (used.has(entry.key)) continue;
      picked.push(entry);
    }
  }

  return picked;
}

export function selectGalleryPreview(limit: number): GalleryEntry[] {
  return pickHomeGalleryPreview(selectGalleryEntries(), limit);
}
