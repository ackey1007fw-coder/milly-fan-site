import { useState } from "react";
import { streamRecaps } from "../data/streamRecaps";
import { buildStreamSongCatalog, catalogArtists, catalogBroadcastCount, selectCatalogSongs, type SongOrder } from "../lib/streamSongCatalog";

const catalog = buildStreamSongCatalog(streamRecaps);
const artists = catalogArtists(catalog);
const INITIAL_SONG_COUNT = 6;
const inputClass = "min-h-11 w-full min-w-0 rounded-xl border border-sage/30 bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sage";
const linkClass = "inline-flex min-h-11 items-center text-sm font-semibold text-sage-deep underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage";

export function StreamSongCatalogEntry() {
  if (catalog.length === 0) return null;
  return (
    <a href="#song-catalog" className="mt-6 flex min-w-0 items-center gap-4 rounded-3xl border-2 border-sage/40 bg-sage-soft p-5 shadow-card transition-colors hover:bg-sage-soft/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage sm:p-6">
      <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sage text-3xl text-white">♪</span>
      <span className="min-w-0 flex-1">
        <span className="block text-xl font-bold text-ink sm:text-2xl">みりぃの歌リスト</span>
        <span className="mt-1 block text-sm leading-6 text-ink-muted">配信で歌った{catalog.length}曲。原曲を聴く・歌った回を探す</span>
        <span className="mt-3 inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2 text-sm font-bold text-white">歌リストを見る ↓</span>
      </span>
    </a>
  );
}

export function StreamSongCatalog() {
  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState("");
  const [order, setOrder] = useState<SongOrder>("recent");
  const [showAll, setShowAll] = useState(false);
  const songs = selectCatalogSongs(catalog, query, artist, order);
  const hasActiveFilter = query.trim().length > 0 || artist.length > 0;
  const visibleSongs = hasActiveFilter || showAll ? songs : songs.slice(0, INITIAL_SONG_COUNT);
  if (catalog.length === 0) return null;

  return (
    <section id="song-catalog" aria-labelledby="song-catalog-title" className="scroll-mt-24 border-t border-sage/15 px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Song Collection</p>
        <h2 id="song-catalog-title" className="mt-2 text-2xl font-bold text-ink sm:text-3xl">みりぃが歌った曲</h2>
        <p className="mt-3 text-sm font-semibold text-sage-deep">確認できた{catalog.length}曲 · {catalogBroadcastCount(catalog)}配信の記録</p>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          配信で出会った曲を、原曲でもう一度。掲載済みの配信メモから、歌唱を確認できた曲をまとめています。過去の全配信を網羅した一覧ではありません。
        </p>
        <p className="mt-2 text-xs leading-6 text-ink-muted">
          リンク先は原曲の公式音源、または版を明記した公式歌唱動画です。みりぃの歌唱映像ではありません。カラオケは練習用の参考伴奏で、配信での使用音源は未確認です。
        </p>
        <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block min-w-0 text-xs font-semibold text-ink sm:col-span-2">
            曲名・アーティストで検索
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="曲名やアーティスト名" className={`mt-2 ${inputClass}`} />
          </label>
          <label className="block min-w-0 text-xs font-semibold text-ink">
            アーティスト
            <select value={artist} onChange={(event) => setArtist(event.target.value)} className={`mt-2 ${inputClass}`}>
              <option value="">すべてのアーティスト</option>
              {artists.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label className="block min-w-0 text-xs font-semibold text-ink">
            並び順
            <select value={order} onChange={(event) => setOrder(event.target.value === "title" ? "title" : "recent")} className={`mt-2 ${inputClass}`}>
              <option value="recent">歌った配信が新しい順</option>
              <option value="title">曲名順</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
          <p role="status" aria-live="polite" aria-atomic="true">{catalog.length}曲中 {visibleSongs.length}曲を表示</p>
          <p>曲名をタップすると、原曲リンクと歌った配信を開けます。</p>
        </div>
        {visibleSongs.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-sage/15 bg-paper-card p-5">
            <p className="text-sm text-ink-muted">条件に合う曲はありません。曲名の一部でも検索できます。</p>
            <button type="button" onClick={() => { setQuery(""); setArtist(""); }} className={`mt-2 ${linkClass}`}>検索条件をクリア</button>
          </div>
        ) : (
          <>
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {visibleSongs.map((song) => {
                const broadcastCount = new Set(song.performances.map((performance) => performance.id)).size;
                const latestPerformance = song.performances[0];
                return (
                  <li key={song.key} className="min-w-0">
                    <details className="group rounded-2xl border border-sage/20 bg-paper-card shadow-card">
                      <summary className="cursor-pointer list-none p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden sm:p-5">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="break-words text-base font-bold leading-relaxed text-ink sm:text-lg">{song.title}</h3>
                            <p className="mt-0.5 break-words text-sm leading-6 text-ink-muted">{song.artist}</p>
                            {song.youtubeVersionNote ? <p className="mt-1 break-words text-xs leading-5 text-ink-muted">{song.youtubeVersionNote}</p> : null}
                          </div>
                          <span className="shrink-0 rounded-full bg-sage-soft px-2.5 py-1 text-[11px] font-semibold text-sage-deep">{broadcastCount}配信</span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
                          <span>{latestPerformance ? `最近: ${latestPerformance.dateLabel} ${latestPerformance.theme}` : ""}</span>
                          <span className="font-semibold text-sage-deep">
                            <span className="group-open:hidden">詳細を見る ↓</span>
                            <span className="hidden group-open:inline">閉じる ↑</span>
                          </span>
                        </div>
                      </summary>
                      <div className="border-t border-sage/15 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                        <p>
                          <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label={`${song.title} — ${song.youtubeVersionNote ? "公式歌唱動画" : "原曲の公式動画"}をYouTubeで聴く（新しいタブ）`}>{song.youtubeVersionNote ? "YouTubeで公式歌唱を聴く ↗" : "YouTubeで原曲を聴く ↗"}</a>
                        </p>
                        {song.karaoke ? (
                          <div className="mt-1">
                            <a href={song.karaoke.youtubeUrl} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label={`${song.title} — カラオケの参考動画をYouTubeで開く（新しいタブ）`}>カラオケで歌う ↗</a>
                            <p className="break-words text-xs leading-5 text-ink-muted">{song.karaoke.channel}の参考伴奏</p>
                          </div>
                        ) : null}
                        <div className="mt-4 rounded-xl bg-sage-soft/40 px-3 py-3">
                          <p className="text-sm font-semibold text-sage-deep">歌った配信（{broadcastCount}回）</p>
                          <ul className="mt-2 space-y-3">
                            {song.performances.map((performance) => (
                              <li key={`${performance.id}-${performance.timestamp}`} className="text-xs leading-6 text-ink-muted">
                                <a
                                  href={`#recap-${performance.id}`}
                                  className={linkClass}
                                  onClick={(event) => {
                                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                                    const target = document.getElementById(`recap-${performance.id}`);
                                    if (target instanceof HTMLDetailsElement) target.open = true;
                                  }}
                                >
                                  {performance.dateLabel} {performance.theme}
                                </a>
                                <p>{performance.broadcastLabel} · 歌唱は録画内 {performance.timestamp}頃〜</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </details>
                  </li>
                );
              })}
            </ul>
            {!hasActiveFilter && songs.length > INITIAL_SONG_COUNT ? (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll((value) => !value)}
                  className="min-h-11 rounded-full border border-sage/30 bg-paper-card px-5 py-2 text-sm font-bold text-sage-deep shadow-card transition-colors hover:bg-sage-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                >
                  {showAll ? `最近の${INITIAL_SONG_COUNT}曲だけに戻す ↑` : `全${songs.length}曲を見る ↓`}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
