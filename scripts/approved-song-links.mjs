// Owner-requested song links, verified against artist/label or accompaniment creator channels.
// Removing only these exact URLs lets existing private-archive checks keep running.
const approved = new Set([
  "https://www.youtube.com/watch?v=aRDURmIYBZ4",
  "https://www.youtube.com/watch?v=Rlk3i0sEQR8",
  "https://www.youtube.com/watch?v=MDZSdjLqiGA",
  "https://www.youtube.com/watch?v=gU5oN0KVofU",
  "https://www.youtube.com/watch?v=W5ykal8c4rY",
  "https://www.youtube.com/watch?v=dD5Djc_HoGU",
  "https://www.youtube.com/watch?v=O3xpEoW_uao",
  "https://www.youtube.com/watch?v=_8TmGHhPjAw",
]);

export function withoutApprovedSongLinks(source) {
  return source.replace(/https?:\/\/[^\s"'<>()[\]]+/g, (url) => approved.has(url) ? "[approved song link]" : url);
}
