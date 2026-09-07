/**
 * Confirmed milestones. Keep every claim tied to the exact source.
 */
export type Highlight = {
  id: string;
  year: number;
  dateLabel?: string;
  title: string;
  body?: string;
  source: string;
};

export const highlights: Highlight[] = [
  {
    id: "campus-girls-2027-prelim-final-result",
    year: 2026,
    dateLabel: "2026年9月6日",
    title: "CAMPUS GIRLS 2027 予選ファイナル 審査員賞・本戦進出",
    body: "予選ファイナルで総合審査員賞、面接審査1位、Paton投票審査2位を報告し、本戦進出が決まりました。",
    source: "https://x.com/mily_chan36/status/2096422147476627841",
  },
  {
    id: "campus-girls-2027-second-stage-jury-award",
    year: 2026,
    dateLabel: "2026年8月22日",
    title: "CAMPUS GIRLS 2027 予選A 2nd STAGE 審査員賞・予選ファイナル進出",
    body: "予選A 2nd STAGEで審査員賞を受賞し、予選ファイナルへの進出を報告しました。",
    source: "https://x.com/mily_chan36/status/2090988000813654232",
  },
  {
    id: "showroom-first-stream-2026-08-01",
    year: 2026,
    dateLabel: "2026年8月1日",
    title: "SHOWROOMで初配信",
    body: "コンテスト用ルームで本格的なライブ配信を開始しました。",
    source: "https://www.showroom-live.com/room/profile?room_id=573253",
  },
  {
    id: "campus-girls-2027-jury-award",
    year: 2026,
    dateLabel: "2026年7月",
    title: "CAMPUS GIRLS 2027 予選A 1st STAGE 審査員賞",
    body: "ポイント順位とは別枠の審査員賞に、三橋莉子として選出されました。",
    source: "https://x.com/campusgirlsboys/status/2082346311865848187",
  },
  {
    id: "miss-circle-2026-entry-734",
    year: 2026,
    dateLabel: "2026年",
    title: "MISS CIRCLE CONTEST 2026に挑戦",
    body: "ENTRY 734・三橋莉子としてBブロックに出場し、二次審査へ進出しました。",
    source: "https://2026.misscircle.jp/list/2",
  },
  {
    id: "miss-circle-2026-third-round",
    year: 2026,
    dateLabel: "2026年8月19日",
    title: "MISS CIRCLE CONTEST 2026 2次審査通過・三次審査進出",
    body: "2次審査を通過し、主催者が公開する三次審査進出者の一覧に掲載されました。",
    source: "https://2026.misscircle.jp/list/3",
  },
];
