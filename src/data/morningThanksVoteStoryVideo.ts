import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./morningThanksVoteStoryVideo.json" with { type: "json" };

/**
 * 2026-09-07 朝の Instagram Story（朝配信のお礼・次枠22:00〜・
 * 「5日目ポチッはこちらから」/ batch b65-02）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 公開派生は video-only。画面の「次枠は22:00〜」「5日目ポチッ」は
 * Storyの表示そのままの引用に留め、リンク先は補わない。
 */
export const morningThanksVoteStoryVideo = manifest as MorningStoryVideo;
