import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./finalDayNightStoryVideo.json" with { type: "json" };

/**
 * 2026-09-11 夜の Instagram Story（夜配信のお礼・翌9/12の最終日案内 / batch b97-02）。
 * Story内の「8/12」は本人がその後「9月」の誤記と訂正。公開動画自体は改変しない。
 * 元音声には楽曲が含まれるため、公開派生は video-only。
 */
export const finalDayNightStoryVideo = manifest as MorningStoryVideo;
