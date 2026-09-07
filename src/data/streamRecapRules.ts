/**
 * LIVE STREAM の全カードで共有する、ランキングと素材注記の定型文。
 * 配信カード本体から分離して、各回のデータが registry と循環しないようにする。
 */

/**
 * ランキングは確認できた事実だけを残し、個人名は掲載しない。
 * 範囲まで確認できた回は、実際の範囲を引数にして組み立てる。
 * 範囲を確認できないが読み上げ自体は確認できた回は引数なしで使う。
 */
export function buildRankingNote(fromPlace?: number, toPlace?: number): string {
  const range =
    fromPlace === undefined || toPlace === undefined
      ? ""
      : `、${fromPlace}位から${toPlace}位まで`;
  return `配信終了時に${range}ランキングを読み上げました。個人名は掲載していません。`;
}

/** 既存の確認済みカードで、読み上げ範囲まで確認できている定型文。 */
export const RANKING_NOTE = buildRankingNote(13, 1);

/** 読み上げは確認できたが、公開用記録で順位範囲を確定していない回。 */
export const RANKING_NOTE_WITHOUT_RANGE = buildRankingNote();

/** 全カードに共通する非掲載範囲。回ごとに言い換えない。 */
export const RECAP_WITHHOLD_NOTE =
  "録音音声・画面録画・全文文字起こしは掲載していません。視聴者の表示名・コメント画面も載せていません。";

/** 数字はカード作成時点の記録であり、現在値として固定しない。 */
export const RECAP_FIGURES_NOTE = "フォロワー数や目標の数字は配信時点の記録です。";

/**
 * 注記を「素材 → 非掲載範囲 → 静止画 → 補足 → 数字」の順に組み立てる。
 * 回ごとに違うのは material / stills / extra だけ。
 */
export function buildTranscriptionNote({
  material,
  stills,
  extra,
}: {
  material: string;
  stills: string;
  extra?: string;
}): string {
  return [material, RECAP_WITHHOLD_NOTE, stills, extra, RECAP_FIGURES_NOTE]
    .filter(Boolean)
    .join("");
}

export const VIDEO_MATERIAL_NOTE = "オーナー提供の動画の音声をもとに整文しています。";
export const TRANSCRIPT_MATERIAL_NOTE =
  "オーナー提供の自動文字起こしをもとに整理しています。固有名詞や数字には聞き取り誤りの可能性があります。";
export const REPORT_MATERIAL_NOTE =
  "オーナー提供の配信レポートと文字起こし抜粋をもとに整理しています。原音声・映像の再確認は行っていません。";
export const AUTO_TRANSCRIPT_MATERIAL_NOTE =
  "オーナー提供録画の自動文字起こしをもとに整理しています。全編の手動聴取は行っておらず、本文は自動文字起こしの範囲で整理しています。";
export const SINGLE_STILL_NOTE = "静止画は録画の実フレームを1枚だけ掲載しています。";

/** 9/2朝・夜で共有する、確認済みの代表静止画。 */
export const streamRecapRadioStill = {
  src: "/media/live/mily-b51-01-morning-radio-showroom.jpg",
  width: 640,
  height: 360,
  alt: "SHOWROOMラジオ配信で使われた静止画。室内の木の椅子に座り、白いトップスと黒いスカート、白い靴下で、右手を口元に当てているみりぃ。画面左上にSHOWROOM、左下にみりぃの文字",
  caption: "配信中に使われていた静止画",
};
