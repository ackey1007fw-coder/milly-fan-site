import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./miripochiWaitingStoryVideo.json" with { type: "json" };

/**
 * 2026-09-08 の Instagram Story（リンクスタンプ「みりぽち待ってます」/
 * batch b79-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 公開派生は video-only。リンクスタンプの遷移先は未確認のため、CTAは
 * 確認済みの三次審査WEB投票リンクだけを付ける。
 */
export const miripochiWaitingStoryVideo = manifest as MorningStoryVideo;
