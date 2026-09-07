import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./streamThanksMorningSlotStoryVideo.json" with { type: "json" };

/**
 * 2026-09-08 未明の Instagram Story（配信お礼・「明日の朝枠は7:30〜8:20」/
 * batch b66-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 公開派生は video-only。「明日の朝枠」は画面表示の引用に留め、
 * streamSchedule へは転記しない。
 */
export const streamThanksMorningSlotStoryVideo = manifest as MorningStoryVideo;
