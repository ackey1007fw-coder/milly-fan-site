// Owner-requested song links, verified against artist/label or accompaniment creator channels.
// Removing only these exact URLs lets existing private-archive checks keep running.
const approved = new Set([
  "https://www.youtube.com/watch?v=3-kV0xU5aNc",
  "https://www.youtube.com/watch?v=kzZ6KXDM1RI",
  "https://www.youtube.com/watch?v=F3P8vcZkIh4",
  "https://www.youtube.com/watch?v=vtJEXV-ZZBw",

  "https://www.youtube.com/watch?v=PwlB-rXk1gM",
  "https://www.youtube.com/watch?v=Wuyx1pDlDvg",
  "https://www.youtube.com/watch?v=ZVUxJsPfoX8",
  "https://www.youtube.com/watch?v=d0rOHgzCe6s",
  "https://www.youtube.com/watch?v=UykGAa6AfbA",
  "https://www.youtube.com/watch?v=2LVVH_D-mR4",
  "https://www.youtube.com/watch?v=K4xLi8IF1FM",
  "https://www.youtube.com/watch?v=ZRtdQ81jPUQ",
  "https://www.youtube.com/watch?v=nAjJluQCSGE",
  "https://www.youtube.com/watch?v=l8-RA3B0YRc",
  "https://www.youtube.com/watch?v=aRDURmIYBZ4",
  "https://www.youtube.com/watch?v=Rlk3i0sEQR8",
  "https://www.youtube.com/watch?v=MDZSdjLqiGA",
  "https://www.youtube.com/watch?v=gU5oN0KVofU",
  "https://www.youtube.com/watch?v=W5ykal8c4rY",
  "https://www.youtube.com/watch?v=dD5Djc_HoGU",
  "https://www.youtube.com/watch?v=O3xpEoW_uao",
  "https://www.youtube.com/watch?v=_8TmGHhPjAw",
  "https://www.youtube.com/watch?v=glsH4Mgxz-g",
  "https://www.youtube.com/watch?v=OwV-IccMBZs",
]);

export function withoutApprovedSongLinks(source) {
  return source.replace(/https?:\/\/[^\s"'<>()[\]]+/g, (url) => approved.has(url) ? "[approved song link]" : url);
}
