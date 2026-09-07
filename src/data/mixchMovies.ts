/**
 * Mixch outbound player cards.
 *
 * Mixch has no official oEmbed / iframe embed. Playing Mixch `_movie_mps` files
 * on this site would hotlink Mixch CDN and take CAMPUS GIRLS contest views off
 * Mixch. These objects are the NEWS + Gallery shared source for Mixch movies:
 * poster + play overlay, click opens the Mixch page. Files stay on Mixch.
 *
 * Allowed only for owner-named public movies on the confirmed person account.
 */
export const CONFIRMED_MIXCH_ACCOUNT_URL = "https://mixch.tv/u/10114673";

export type MixchMovie = {
  id: string;
  kind: "mixch";
  mixchUrl: string;
  /** Official Mixch thumbnail (thumbnailUrl / og:image). The only SNS-thumbnail exception. */
  poster: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  published: boolean;
  sourceDate: string;
  accountUrl: typeof CONFIRMED_MIXCH_ACCOUNT_URL;
};

export function isMixchMovie(item: { kind: string }): item is MixchMovie {
  return item.kind === "mixch";
}

/** 2026-09-07 Mixch「キャンガル2027Aブロック本選進出決定」 https://mixch.tv/m/Tfb8i9dy */
export const mixchABlockFinalsMovie: MixchMovie = {
  id: "mixch-m-Tfb8i9dy",
  kind: "mixch",
  mixchUrl: "https://mixch.tv/m/Tfb8i9dy",
  poster:
    "https://d2jtsb989t238a.cloudfront.net/m/lyh4d7mdxf6d6oprm8xif7hdq2bs7967hmshi0szbwruvgu1ko65si61wvk73khzy06dsrtd6c1vv10yn8ynlewjl90ky4yzdxxl98qkqhfmqkmla6kvg3js8uz1xzyl/thumb_normal",
  width: 480,
  height: 853,
  alt: "Mixch動画「キャンガル2027Aブロック本選進出決定」のサムネイル。再生するとMixchで開きます",
  title: "キャンガル2027Aブロック本選進出決定",
  published: true,
  sourceDate: "2026-09-07",
  accountUrl: CONFIRMED_MIXCH_ACCOUNT_URL,
};

/** 2026-08-30 Mixch「配信＆ムービーは今日が最終日」 https://mixch.tv/m/UBHJplv4 */
export const mixchFinalDayMovie: MixchMovie = {
  id: "mixch-m-UBHJplv4",
  kind: "mixch",
  mixchUrl: "https://mixch.tv/m/UBHJplv4",
  poster:
    "https://d2jtsb989t238a.cloudfront.net/m/2tsdxnj2piovgatx1rzg53hk4oge2mmuh9l30bkc2gmbho284ipo3ami68wmx006hlrt840aprzz3rt2zxjan20k22i1g2km8861m6ap727oqgz12w3sos03j6prf4nt/thumb_normal",
  width: 480,
  height: 853,
  alt: "Mixch動画「配信＆ムービーは今日が最終日」のサムネイル。再生するとMixchで開きます",
  title: "配信＆ムービーは今日が最終日",
  published: true,
  sourceDate: "2026-08-30",
  accountUrl: CONFIRMED_MIXCH_ACCOUNT_URL,
};

/** 2026-08-27 Mixch「表情豊かなみりぃと魅力的でしょう？？？？」 https://mixch.tv/m/VDojsMY5 */
export const mixchExpressiveMovie: MixchMovie = {
  id: "mixch-m-VDojsMY5",
  kind: "mixch",
  mixchUrl: "https://mixch.tv/m/VDojsMY5",
  poster:
    "https://d2jtsb989t238a.cloudfront.net/m/awxtu96sp9bu1i86qdz9omxpx5ne7lc33cnefgmqdigpcv4r809xepkxwuqojmnilaodl3kjmse2v36ng92np919914kfcrrxwxuvzg1qfklclepvmhyw5xrt85fh2zn/thumb_normal",
  width: 480,
  height: 853,
  alt: "Mixch動画「表情豊かなみりぃと魅力的でしょう？？？？」のサムネイル。再生するとMixchで開きます",
  title: "表情豊かなみりぃと魅力的でしょう？？？？",
  published: true,
  sourceDate: "2026-08-27",
  accountUrl: CONFIRMED_MIXCH_ACCOUNT_URL,
};

/** 2026-08-26 Mixch「今日は1.5倍デーだってよ？！」 https://mixch.tv/m/nxqYblH8 */
export const mixch15xDayMovie: MixchMovie = {
  id: "mixch-m-nxqYblH8",
  kind: "mixch",
  mixchUrl: "https://mixch.tv/m/nxqYblH8",
  poster:
    "https://d2jtsb989t238a.cloudfront.net/m/kin373og30ocd8fg4r0d8dyje9odes85znm6qypd8x1q37chbuob27vp5jopaixjf7t1p60xnf5u4wiartxfocwe32x74j9ud2jo65m9hadotecymvax5gehlal1osab/thumb_normal",
  width: 480,
  height: 853,
  alt: "Mixch動画「今日は1.5倍デーだってよ？！」のサムネイル。再生するとMixchで開きます",
  title: "今日は1.5倍デーだってよ？！",
  published: true,
  sourceDate: "2026-08-26",
  accountUrl: CONFIRMED_MIXCH_ACCOUNT_URL,
};

/** 2026-08-25 Mixch「自信のないあなたへ」 https://mixch.tv/m/ZY4hSt3K */
export const mixchConfidenceMessageMovie: MixchMovie = {
  id: "mixch-m-ZY4hSt3K",
  kind: "mixch",
  mixchUrl: "https://mixch.tv/m/ZY4hSt3K",
  poster:
    "https://d2jtsb989t238a.cloudfront.net/m/zccboujbxfe3nq1gzwmfil2cb3p4ur8ogue3fky0r9toxgs1i9pj5u02r3ci35rpaw19ris2nrrdig2aefv629baj4tuhh7utpz70vvaqixh4sworf4ufu08bvdd2h8f/thumb_normal",
  width: 480,
  height: 853,
  alt: "Mixch動画「自信のないあなたへ」のサムネイル。再生するとMixchで開きます",
  title: "自信のないあなたへ",
  published: true,
  sourceDate: "2026-08-25",
  accountUrl: CONFIRMED_MIXCH_ACCOUNT_URL,
};

/** Newest first. NEWS and Gallery import these objects; do not copy Mixch files. */
export const mixchMovies: MixchMovie[] = [
  mixchABlockFinalsMovie,
  mixchFinalDayMovie,
  mixchExpressiveMovie,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
];
