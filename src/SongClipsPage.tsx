import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { streamRecaps } from "./data/streamRecaps";
import { buildStreamSongClips, songClipAnchor } from "./lib/streamSongClips";

const clips = buildStreamSongClips(streamRecaps);

export default function SongClipsPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main>
        <header className="px-4 pb-8 pt-10 sm:pb-10 sm:pt-14">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="パンくず" className="text-sm text-ink-muted">
              <a href="/activities/" className="font-semibold text-sage-deep underline underline-offset-4">Activities</a>
              <span aria-hidden="true" className="px-2">/</span>
              <a href="/activities/live/" className="font-semibold text-sage-deep underline underline-offset-4">ライブ配信</a>
              <span aria-hidden="true" className="px-2">/</span>
              <span>Song Clips</span>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-sage-deep">Live Song Clips</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">みりぃの歌唱クリップ</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">配信で歌った場面から、公開できる短い抜粋だけをまとめています。歌った回の記録と一緒に、みりぃの表情や歌声を楽しめるアーカイブです。</p>
            <div className="mt-5 rounded-2xl border border-sage/20 bg-sage-soft/45 p-4 text-sm leading-7 text-ink-muted">
              <p><strong className="text-ink">{clips.length}本公開中。</strong> オーナー確認済みの録画から作った短い抜粋で、録画全編や歌詞は掲載していません。</p>
              <p className="mt-2">楽曲・伴奏などの権利は各権利者に帰属します。原曲は各カードの公式YouTubeリンクから確認できます。</p>
            </div>
          </div>
        </header>

        <section aria-labelledby="clips-title" className="px-4 pb-14">
          <div className="mx-auto max-w-3xl">
            <h2 id="clips-title" className="sr-only">歌唱クリップ一覧</h2>
            {clips.length === 0 ? (
              <div className="rounded-3xl border border-sage/20 bg-paper-card p-6 shadow-card">
                <p className="text-sm leading-7 text-ink-muted">公開できる歌唱クリップを準備中です。</p>
              </div>
            ) : (
              <ol className="grid grid-cols-1 gap-6">
                {clips.map((item) => {
                  const { performance } = item;
                  return (
                    <li key={`${item.key}-${performance.id}-${performance.clip.sourceTimestamp}`} id={songClipAnchor(item)} className="scroll-mt-24">
                      <article className="overflow-hidden rounded-3xl border border-sage/20 bg-paper-card shadow-card">
                        <video
                          className="aspect-video w-full bg-black object-contain"
                          controls
                          playsInline
                          preload="metadata"
                          poster={performance.clip.poster}
                          aria-label={`${item.title}を歌うみりぃの短い歌唱クリップ`}
                        >
                          <source src={performance.clip.src} type="video/mp4" />
                          動画を再生できない環境です。
                        </video>
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h2 className="text-xl font-bold leading-relaxed text-ink sm:text-2xl">{item.title}</h2>
                              <p className="mt-1 text-sm text-ink-muted">{item.artist}</p>
                            </div>
                            <span className="rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-sage-deep">約{performance.clip.durationSeconds}秒</span>
                          </div>
                          <p className="mt-4 text-sm leading-7 text-ink-muted">{performance.dateLabel}「{performance.theme}」の録画内 {performance.clip.sourceTimestamp}頃からの短い抜粋です。</p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <a href={`/activities/live/#recap-${performance.id}`} className="inline-flex min-h-11 items-center rounded-full bg-sage px-4 py-2 text-sm font-bold text-white">配信レポートを見る</a>
                            <a href={item.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-sage/30 px-4 py-2 text-sm font-bold text-sage-deep">原曲をYouTubeで聴く ↗</a>
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
