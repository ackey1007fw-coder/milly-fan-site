import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./voteDayFiveSoonStoryVideo.json" with { type: "json" };

/**
 * 2026-09-06 夜の Instagram Story（三次審査WEB投票「30分後5日目の投票できるよ」/
 * batch b65-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 公開派生は video-only。画面の「30分後」「5日目」「4日目まだの方は」は
 * Storyの表示そのままの引用に留め、リンク先や投票の仕組みは補わない。
 */
export const voteDayFiveSoonStoryVideo = manifest as MorningStoryVideo;
