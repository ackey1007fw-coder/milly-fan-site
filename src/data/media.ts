/**
 * Photo / video manifest.
 *
 * - Derivative files live in /public/media/gallery as
 *   `<basePath>-<width>.jpg` and `.webp`. Originals stay outside the
 *   repository (media/original/, gitignored) and are never overwritten.
 * - Filenames start with `mily-` — Mily is 本人の公開表記 (Instagram
 *   @mily_chan36), not a typo. Once published, a filename is immutable —
 *   changed content gets a new name.
 * - Daily add flow: docs/CONTENT-OPS.md and docs/MEDIA.md.
 * - sourceUrl / sourceDate / credit hold confirmed values only.
 *   Keep them null rather than guessing; docs/MEDIA.md tracks what is
 *   still unconfirmed.
 */
import { eveningRadioShowroomPhoto } from "./eveningRadioShowroom.ts";
import { pandaPastPicPhoto } from "./pandaPastPic.ts";
import { ohayoWhitePoloPeacePhoto } from "./ohayoWhitePoloPeace.ts";
import { birthdayIndoorSelfiePhoto } from "./birthdayIndoorSelfie.ts";
import { girlsawardShowroomSixthPhoto } from "./girlsawardShowroom6th.ts";
import {
  patonVoteCollageStillPhoto,
  patonVoteMirrorStillPhoto,
} from "./patonVoteStoryStills.ts";
import { morningMakeupShowroomPhoto } from "./morningMakeupShowroomImage.ts";
import { gandaBeforeNightStreamPhoto } from "./gandaBeforeNightStream.ts";
import { movieNightPhotos } from "./movieNightPhotos.ts";
import { campusGirlsPrelimFinalResultPhoto } from "./campusGirlsPrelimFinalResultImage.ts";

export type MediaKind = "photo" | "video";

export type MediaProvenance =
  /** Received directly from the site owner. */
  | "owner-provided"
  /** From a confirmed post on みりぃさん's own SNS (sourceUrl required). */
  | "sns-post"
  /** Shot by a third party (credit required). */
  | "third-party";

export type MediaItem = {
  /** Stable id, never reused. */
  id: string;
  kind: MediaKind;
  /** Public path prefix, e.g. "/media/gallery/mily-b01-03-bouquet-smile". */
  basePath: string;
  /** Derivative widths in px, ascending. */
  widths: readonly number[];
  /** Intrinsic size of the largest derivative (for width/height attrs). */
  width: number;
  height: number;
  alt: string;
  caption?: string;
  provenance: MediaProvenance;
  sourceUrl: string | null;
  /** Confirmed post date, `YYYY-MM-DD`. Never inferred from the image. */
  sourceDate: string | null;
  credit: string | null;
  /** CSS object-position keeping the subject in frame when cropped. */
  focal?: string;
  /**
   * CSS aspect-ratio for the gallery tile, e.g. "1152 / 2048".
   * Omit for the default 4/3 tile. Set it on portrait photos so the
   * composition is kept instead of being cropped to landscape.
   */
  aspect?: string;
  featured?: boolean;
  published: boolean;
};

const BIRTHDAY_POST = "https://www.instagram.com/p/DbiY3PHk1c8/";
const MANGO_KAKIGORI_POST = "https://www.instagram.com/p/DcQqmIwk1_l/";
const DRAGON_CLOUD_POST = "https://www.instagram.com/p/DcYbkvOk4Te/";
const FM_SMW_X_BEFORE =
  "https://x.com/fm_smw856/status/2091322098954490025";
const FM_SMW_X_AFTER =
  "https://x.com/fm_smw856/status/2091499993102524714";

export const media: MediaItem[] = [
  campusGirlsPrelimFinalResultPhoto,
  ...movieNightPhotos,
  eveningRadioShowroomPhoto,
  pandaPastPicPhoto,
  ohayoWhitePoloPeacePhoto,
  birthdayIndoorSelfiePhoto,
  girlsawardShowroomSixthPhoto,
  patonVoteMirrorStillPhoto,
  patonVoteCollageStillPhoto,
  morningMakeupShowroomPhoto,
  {
    id: "mily-b22-01",
    kind: "photo",
    basePath: "/media/gallery/mily-b22-01-seaside-circle-musical-special-before",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1600,
    alt: "ラジオスタジオでヘッドホンをつけた3人が並ぶ、『真夏のミュージカル特集』放送前のショット",
    caption: "『真夏のミュージカル特集』放送前のスタジオショット。",
    provenance: "owner-provided",
    sourceUrl: FM_SMW_X_BEFORE,
    sourceDate: "2026-08-23",
    credit: null,
    aspect: "1600 / 1600",
    published: true,
  },
  {
    id: "mily-b22-02",
    kind: "photo",
    basePath: "/media/gallery/mily-b22-02-seaside-circle-musical-special-after",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "ラジオスタジオでヘッドホンをつけた3人が並ぶ、放送後のスタジオショット",
    caption: "放送を終えたあとのスタジオショット。",
    provenance: "owner-provided",
    sourceUrl: FM_SMW_X_AFTER,
    sourceDate: "2026-08-23",
    credit: null,
    published: true,
  },
  {
    id: "mily-b20-01",
    kind: "photo",
    basePath: "/media/gallery/mily-b20-01-skytree-upward",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1206,
    alt: "青空を背景に足元付近から見上げた東京スカイツリー",
    provenance: "owner-provided",
    sourceUrl: DRAGON_CLOUD_POST,
    sourceDate: "2026-08-23",
    credit: null,
    published: true,
  },
  {
    id: "mily-b20-02",
    kind: "photo",
    basePath: "/media/gallery/mily-b20-02-dragon-cloud-close",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "青空に龍のようにも見える白い雲が広がる様子",
    provenance: "owner-provided",
    sourceUrl: DRAGON_CLOUD_POST,
    sourceDate: "2026-08-23",
    credit: null,
    published: true,
  },
  {
    id: "mily-b20-03",
    kind: "photo",
    basePath: "/media/gallery/mily-b20-03-dragon-cloud-city",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "街並みの上に広がる青空と、龍のようにも見える白い雲",
    provenance: "owner-provided",
    sourceUrl: DRAGON_CLOUD_POST,
    sourceDate: "2026-08-23",
    credit: null,
    published: true,
  },
  gandaBeforeNightStreamPhoto,
  {
    id: "mily-b10-01",
    kind: "photo",
    basePath: "/media/gallery/mily-b10-01-mango-kakigori-closeup",
    widths: [480, 960, 1600],
    width: 960,
    height: 1280,
    alt: "マンゴーをのせたかき氷のクローズアップ",
    provenance: "owner-provided",
    sourceUrl: MANGO_KAKIGORI_POST,
    sourceDate: "2026-08-20",
    credit: null,
    aspect: "960 / 1280",
    published: true,
  },
  {
    id: "mily-b10-02",
    kind: "photo",
    basePath: "/media/gallery/mily-b10-02-mango-kakigori-spoon",
    widths: [480, 960, 1600],
    width: 960,
    height: 1280,
    alt: "スプーンを手にマンゴーかき氷を見つめるみりぃ",
    provenance: "owner-provided",
    sourceUrl: MANGO_KAKIGORI_POST,
    sourceDate: "2026-08-20",
    credit: null,
    aspect: "960 / 1280",
    published: true,
  },
  {
    id: "mily-b10-03",
    kind: "photo",
    basePath: "/media/gallery/mily-b10-03-mango-kakigori-looking-down",
    widths: [480, 960, 1600],
    width: 960,
    height: 1280,
    alt: "マンゴーかき氷を前に目を閉じるみりぃ",
    provenance: "owner-provided",
    sourceUrl: MANGO_KAKIGORI_POST,
    sourceDate: "2026-08-20",
    credit: null,
    aspect: "960 / 1280",
    published: true,
  },
  {
    id: "mily-b10-04",
    kind: "photo",
    basePath: "/media/gallery/mily-b10-04-mango-kakigori-expression",
    widths: [480, 960, 1600],
    width: 960,
    height: 1280,
    alt: "マンゴーかき氷を前にスプーンを持つみりぃ",
    provenance: "owner-provided",
    sourceUrl: MANGO_KAKIGORI_POST,
    sourceDate: "2026-08-20",
    credit: null,
    aspect: "960 / 1280",
    published: true,
  },
  {
    id: "mily-b10-05",
    kind: "photo",
    basePath: "/media/gallery/mily-b10-05-mango-kakigori-front",
    widths: [480, 960, 1600],
    width: 960,
    height: 1280,
    alt: "マンゴーかき氷を前にスプーンを持ってカメラを見るみりぃ",
    provenance: "owner-provided",
    sourceUrl: MANGO_KAKIGORI_POST,
    sourceDate: "2026-08-20",
    credit: null,
    aspect: "960 / 1280",
    published: true,
  },
  {
    id: "mily-b08-01",
    kind: "photo",
    basePath: "/media/gallery/mily-b08-01-do-what-you-can-morning",
    // 元素材が 1538px 幅のため、`-1600` の派生は拡大せず 1538x2048 のまま。
    // （`pnpm media:build` は withoutEnlargement で元素材幅を上限にする）
    widths: [480, 960, 1600],
    width: 1538,
    height: 2048,
    alt: "室内の鏡の前でスマートフォンを持って撮影するみりぃ",
    provenance: "owner-provided",
    sourceUrl: "https://x.com/mily_chan36/status/2090242507586322892",
    sourceDate: "2026-08-20",
    credit: null,
    aspect: "1538 / 2048",
    published: true,
  },
  {
    id: "mily-b05-01",
    kind: "photo",
    basePath: "/media/gallery/mily-b05-01-autumn-leaf",
    // 元素材が 1152px 幅のため、`-1600` の派生は拡大せず 1152x2048 のまま。
    // （`pnpm media:build` は withoutEnlargement で元素材幅を上限にする）
    widths: [480, 960, 1600],
    width: 1152,
    height: 2048,
    alt: "夜の並木道で、大きな落ち葉を手に持つみりぃさん",
    provenance: "owner-provided",
    sourceUrl: null,
    sourceDate: null,
    credit: null,
    aspect: "1152 / 2048",
    published: true,
  },
  {
    id: "mily-b01-03",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-03-bouquet-smile",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "花束と緑のバッグを持ち、笑顔でカメラを見るみりぃさん",
    caption: "21歳の誕生日投稿より",
    provenance: "sns-post",
    sourceUrl: BIRTHDAY_POST,
    sourceDate: null,
    credit: null,
    focal: "49% 28%",
    featured: true,
    published: true,
  },
  {
    id: "mily-b01-05",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-05-bouquet-closeup",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "水色の紙に包まれた花束を抱えるみりぃさん",
    provenance: "sns-post",
    sourceUrl: BIRTHDAY_POST,
    sourceDate: null,
    credit: null,
    focal: "48% 26%",
    published: true,
  },
  {
    id: "mily-b01-02",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-02-bouquet-standing",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "花束を両手に持って立つみりぃさん",
    provenance: "sns-post",
    sourceUrl: BIRTHDAY_POST,
    sourceDate: null,
    credit: null,
    focal: "52% 26%",
    published: true,
  },
  {
    id: "mily-b01-04",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-04-bouquet-pose",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "花束と緑のバッグを持って壁の前に立つみりぃさん",
    provenance: "sns-post",
    sourceUrl: BIRTHDAY_POST,
    sourceDate: null,
    credit: null,
    focal: "49% 26%",
    published: true,
  },
  {
    id: "mily-b01-06",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-06-necklace-gift",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "ジュエリーボックスに入ったCanal 4℃のネックレス",
    caption: "Canal 4℃のネックレス",
    provenance: "owner-provided",
    sourceUrl: null,
    sourceDate: null,
    credit: null,
    published: true,
  },
  {
    id: "mily-b01-01",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-01-birthday-cake",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "ハートで飾られたプレートに載ったバースデーケーキと、2つの花束",
    caption: "誕生日のテーブル",
    provenance: "sns-post",
    sourceUrl: BIRTHDAY_POST,
    sourceDate: null,
    credit: null,
    focal: "50% 70%",
    published: true,
  },
];

export function srcSetFor(item: MediaItem, format: "jpg" | "webp"): string {
  return item.widths
    .map((width) => `${item.basePath}-${width}.${format} ${width}w`)
    .join(", ");
}

export function defaultSrc(item: MediaItem): string {
  const middle = item.widths[Math.min(1, item.widths.length - 1)];
  return `${item.basePath}-${middle}.jpg`;
}

export function visibleMedia(items: MediaItem[] = media): MediaItem[] {
  return items.filter((item) => item.published);
}

export function featuredPhoto(items: MediaItem[] = media): MediaItem | undefined {
  return visibleMedia(items).find(
    (item) => item.kind === "photo" && item.featured,
  );
}
