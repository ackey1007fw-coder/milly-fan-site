// 配信メモの共有定型文のうち、実際にページへ出る文だけを1本にまとめる。
//
// 承認ハッシュは「読者が目にする文」に掛けたい。ファイル全体を対象にすると、
// コメントの手直しや未使用の定数追加でも回別テストの baseline を動かすことになり、
// 再レビューの意味が薄れる。ここで公開文だけを集めてから掛ける。
import {
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  buildRankingNote,
  RECAP_FIGURES_NOTE,
  RECAP_WITHHOLD_NOTE,
  REPORT_MATERIAL_NOTE,
  SINGLE_STILL_NOTE,
  streamRecapRadioStill,
  TRANSCRIPT_MATERIAL_NOTE,
  VIDEO_MATERIAL_NOTE,
} from "../src/data/streamRecapRules.ts";

/** 共有定型文の公開文。並び順を変えるとハッシュが変わるので、追加は末尾へ。 */
export const streamRecapRulesPublicCopy = [
  RECAP_WITHHOLD_NOTE,
  RECAP_FIGURES_NOTE,
  buildRankingNote(),
  buildRankingNote(13, 1),
  VIDEO_MATERIAL_NOTE,
  TRANSCRIPT_MATERIAL_NOTE,
  REPORT_MATERIAL_NOTE,
  AUTO_TRANSCRIPT_MATERIAL_NOTE,
  SINGLE_STILL_NOTE,
  streamRecapRadioStill.alt,
  streamRecapRadioStill.caption,
].join("\n");
