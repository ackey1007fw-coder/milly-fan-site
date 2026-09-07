import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./webVoteDay2StoryVideo.json" with { type: "json" };

/**
 * 2026-09-04 の Instagram Story（三次審査WEB投票2日目の呼びかけ /
 * batch b59-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 公開派生は video-only。画面の「2日目」「毎日連続投票者の特典」は
 * Storyの表示そのままの引用に留め、特典の内容・条件は補わない。
 */
export const webVoteDay2StoryVideo = manifest as MorningStoryVideo;
