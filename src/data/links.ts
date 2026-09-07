/**
 * Extra fan-site links (not the person's own SNS).
 * Keep empty until a destination is confirmed and clearly unofficial.
 */
export type SiteLink = {
  id: string;
  label: string;
  url: string;
  note?: string;
};

export const campusGirlsPatonVoteLink: SiteLink = {
  id: "campus-girls-paton-11380",
  label: "Patonでみりぃに投票する",
  url: "https://paton.jp/event/entrant/11380",
  note:
    "CAMPUS GIRLS 2027 予選A FinalSTAGE。投票にはPatonへのログインが必要です。",
};

export const missCircleWebVoteLink: SiteLink = {
  id: "miss-circle-2026-web-vote-734",
  label: "WEB投票する",
  url: "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734",
  note: "MISS CIRCLE CONTEST 2026 三次審査。ENTRY 734 三橋莉子。",
};

export const missCircleShowroomEventLink: SiteLink = {
  id: "miss-circle-2026-3rd-showroom-event",
  label: "CanCamモデル発掘オーディション",
  url: "https://www.showroom-live.com/event/circle2026_3rd",
  note: "MISS CIRCLE CONTEST 2026 三次審査のCanCamモデル発掘オーディション。",
};

export const seasideCircleMessageFormLink: SiteLink = {
  id: "fm-smw-ssc-message-form",
  label: "番組へメッセージを送る",
  url: "https://docs.google.com/forms/d/e/1FAIpQLSf3xWju0r3sR4nePYv7O0nDqfvy03Ik5DS0dFdD7FYhY_ib6A/viewform",
  note:
    "『湘南シーサイドサークル』メッセージ募集。メールアドレスとGoogleアカウントは回答に含まれず、ラジオネームで送れます。",
};

export const links: SiteLink[] = [
  {
    id: "miss-circle-2026-734",
    label: "MISS CIRCLE CONTEST 2026 ENTRY 734",
    url: "https://2026.misscircle.jp/entry/734",
    note: "投票方法・最新情報はENTRY 734ページへ。",
  },
  missCircleWebVoteLink,
  missCircleShowroomEventLink,
  campusGirlsPatonVoteLink,
  {
    id: "fm-smw-staff",
    label: "FM湘南マジックウェイブ スタッフ",
    url: "https://fm-smw.jp/staff",
    note: "Mily（ミリー） / 湘南シーサイドサークル",
  },
  {
    id: "fm-smw-mily-profile",
    label: "MilyのFMプロフィール",
    url: "https://fm-smw.jp/staff/mily%EF%BC%88%E3%83%9F%E3%83%AA%E3%83%BC%EF%BC%89",
    note: "FM湘南マジックウェイブ / Mily（ミリー）",
  },
  {
    id: "fm-smw-ssc-program",
    label: "湘南シーサイドサークル 番組ページ",
    url: "https://fm-smw.jp/program/%E3%80%8E-%E6%B9%98%E5%8D%97%E3%82%B7%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB-%E3%80%8F%E3%80%80%EF%BC%83ssc",
    note: "FM湘南マジックウェイブ / 湘南シーサイドサークル",
  },
  seasideCircleMessageFormLink,
  {
    id: "fm-smw-ssc-instagram",
    label: "湘南シーサイドサークル Instagram",
    url: "https://www.instagram.com/seasidecircle",
    note: "湘南シーサイドサークル @seasidecircle",
  },
  {
    id: "fm-smw-ssc-tiktok",
    label: "湘南シーサイドサークル TikTok",
    url: "https://www.tiktok.com/@seasidecircle",
    note: "湘南シーサイドサークル @seasidecircle",
  },
];
