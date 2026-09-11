import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./miripochiStoryVideo.json" with { type: "json" };

/**
 * 2026-09-11 夜の Instagram Story（「今日のみりぽち完了していますか!?」 / batch b97-03）。
 * リンクスタンプの遷移先は素材から確認できないため、manifestにはURLを持たせない。
 * Latest / NEWS と Gallery が同じ公開MP4・posterを共有する。
 */
export const miripochiStoryVideo = manifest as MorningStoryVideo;
