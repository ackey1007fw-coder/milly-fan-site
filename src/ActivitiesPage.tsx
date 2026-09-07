import { useState, type ReactNode } from "react";
import { radioProgram } from "../shared/radio-program.js";
import { ExternalLink } from "./components/ExternalLink";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { NewsImage } from "./components/NewsImage";
import {
  activities,
  type Activity,
  type ActivityId,
} from "./data/activities";
import { contest } from "./data/contest";
import { seasideCircleMessageFormLink } from "./data/links";
import { radioEpisode20260830 } from "./data/radioEpisodes";
import { streamRecaps, type StreamRecap as StreamRecapData } from "./data/streamRecaps";
import { visibleRadioStoryVideos } from "./data/radioStoryB42";
import type { NewsImageMedia, NewsItem } from "./data/news";
import {
  selectActivityHighlights,
  selectActivityPageContent,
  type ActivityResource,
} from "./lib/activityContent";
import type { ActivityMediaItem } from "./lib/activityMedia";
import {
  activityByRoute,
  isActivitiesHubRoute,
} from "./lib/activityRoute";
import {
  selectLiveActivityStatus,
  selectRadioActivityStatus,
} from "./lib/activityStatus";
import {
  appendContestOfficialWindows,
  contestOfficialWindowLines,
  contestPhaseDateRangeLabel,
} from "./lib/contestPhaseDisplay";
import { resolveNewsLinks } from "./lib/newsLinks";
import { useMilyRealtimeStatus } from "./lib/useMilyRealtimeStatus";
import { useSupportEventClock } from "./lib/useSupportEventClock";
import {
  formatSlotDate,
  useStreamSchedule,
} from "./lib/useStreamSchedule";

const primaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep";
const secondaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-sage/25 bg-paper px-4 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft";

function formatDate(value: string): string {
  return value.replace(/-/g, ".");
}

function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return href.startsWith("/") ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <ExternalLink href={href} className={className}>
      {children}
    </ExternalLink>
  );
}

function StatusLine({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-sage/15 bg-sage-soft/45 px-4 py-3">
      <p className="text-xs font-semibold text-sage-deep">{label}</p>
      <p className="mt-1 font-bold leading-relaxed text-ink">{value}</p>
      {note ? (
        <p className="mt-1 whitespace-pre-line text-xs leading-6 text-ink-muted">
          {note}
        </p>
      ) : null}
    </div>
  );
}

function HubMissCircleStatus() {
  if (!contest.currentPhase) return null;
  const range = contestPhaseDateRangeLabel(contest.currentPhase);
  const verified = `${formatDate(contest.lastVerifiedAt)}確認`;
  return (
    <StatusLine
      label="現在の審査段階"
      value={contest.currentPhase.name}
      note={appendContestOfficialWindows(
        range ? `${range} / ${verified}` : verified,
        contest.currentPhase,
      )}
    />
  );
}

function HubRadioStatus() {
  const { radio, schedulePhase } = useMilyRealtimeStatus();
  const status = selectRadioActivityStatus(radio, schedulePhase);
  return <StatusLine label={status.label} value={status.value} />;
}

function HubLiveStatus() {
  const { live } = useMilyRealtimeStatus();
  const { slots, roomUrl } = useStreamSchedule();
  const status = selectLiveActivityStatus(live, slots, roomUrl);
  if (!status || status.state === "offline") {
    const latestRecap = streamRecaps[0];
    return latestRecap ? (
      <StatusLine
        label="最新の配信記録"
        value={`${latestRecap.dateLabel} ${latestRecap.theme}`}
        note={latestRecap.broadcastLabel}
      />
    ) : null;
  }

  return (
    <StatusLine
      label={status.label}
      value={
        status.slot
          ? `${formatSlotDate(status.slot)} ${status.slot.time}〜${status.slot.endTime ?? ""}`
          : status.value
      }
      note={
        status.slot
          ? [status.slot.note, !status.slot.endTime ? "終了時刻は確認できていません。" : null].filter(Boolean).join(" / ") || undefined
          : undefined
      }
    />
  );
}

function HubCampusGirlsStatus() {
  const latest = selectActivityHighlights("campus-girls")[0];
  return latest ? (
    <StatusLine
      label="最新の確認済み記録"
      value={latest.title}
      note={latest.dateLabel}
    />
  ) : null;
}

function HubActivityStatus({ activityId }: { activityId: ActivityId }) {
  if (activityId === "miss-circle") return <HubMissCircleStatus />;
  if (activityId === "radio") return <HubRadioStatus />;
  if (activityId === "live-stream") return <HubLiveStatus />;
  return <HubCampusGirlsStatus />;
}

function ActivityHubCard({ activity }: { activity: Activity }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-sage/15 bg-paper-card p-5 shadow-card sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
        {activity.eyebrow}
      </p>
      <p className="mt-3 text-sm font-semibold text-apricot-ink">{activity.label}</p>
      <h2 className="mt-1 text-2xl font-bold leading-relaxed text-ink">
        {activity.title}
      </h2>
      <p className="mt-3 grow text-sm leading-7 text-ink-muted">{activity.summary}</p>
      <div className="mt-5">
        <HubActivityStatus activityId={activity.id} />
      </div>
      <p className="mt-5">
        <a href={activity.route} className={primaryCta}>
          詳細を見る
        </a>
      </p>
    </article>
  );
}

function ActivitiesHub() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#activities-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <Header />
      <main id="activities-main" className="px-4 pb-16 pt-10 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="パンくず" className="text-xs text-ink-muted">
            <a href="/" className="hover:text-sage-deep hover:underline">
              ホーム
            </a>
            <span aria-hidden="true" className="px-2">/</span>
            <span>Activities</span>
          </nav>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-sage-deep">
            Activities
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            みりぃの活動
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            みりぃは今、何をしている人？ 確認済みの活動情報と、それぞれの歩み・記録を活動単位でたどれます。
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {activities.map((activity) => (
              <ActivityHubCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ActivityHero({ activity }: { activity: Activity }) {
  return (
    <header className="relative overflow-hidden px-4 pb-10 pt-10 sm:pb-14 sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-16 h-64 w-64 rounded-full bg-sage-soft"
      />
      <div className="relative mx-auto max-w-3xl">
        <nav aria-label="パンくず" className="text-xs text-ink-muted">
          <a href="/" className="hover:text-sage-deep hover:underline">
            ホーム
          </a>
          <span aria-hidden="true" className="px-2">/</span>
          <a href="/activities/" className="hover:text-sage-deep hover:underline">
            Activities
          </a>
          <span aria-hidden="true" className="px-2">/</span>
          <span>{activity.label}</span>
        </nav>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-sage-deep">
          {activity.eyebrow}
        </p>
        <p className="mt-3 text-sm font-semibold text-apricot-ink">{activity.label}</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
          {activity.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
          {activity.summary}
        </p>
      </div>
    </header>
  );
}

function MissCircleCurrent() {
  if (!contest.currentPhase) return null;
  const range = contestPhaseDateRangeLabel(contest.currentPhase);
  const windows = contestOfficialWindowLines(contest.currentPhase);
  return (
    <section aria-labelledby="contest-current" className="px-4 pb-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-sage/20 bg-sage-soft/45 p-5 shadow-card sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Current
        </p>
        <h2 id="contest-current" className="mt-2 text-2xl font-bold text-ink">
          現在の審査段階
        </h2>
        <p className="mt-4 text-2xl font-bold text-ink">{contest.currentPhase.name}</p>
        {range ? (
          <p className="mt-2 text-sm font-semibold text-ink">{range}</p>
        ) : null}
        {windows.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm leading-6 text-ink">
            {windows.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
        <p className="mt-2 text-sm text-ink-muted">
          {formatDate(contest.lastVerifiedAt)}確認
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ExternalLink href={contest.entryUrl} className={primaryCta}>
            ENTRY 734を見る
          </ExternalLink>
          <ExternalLink href={contest.currentPhase.source} className={secondaryCta}>
            審査段階の出典を見る
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}

function RadioCurrent() {
  const { radio, schedulePhase } = useMilyRealtimeStatus();
  const status = selectRadioActivityStatus(radio, schedulePhase);
  return (
    <section aria-labelledby="radio-current" className="px-4 pb-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-apricot/30 bg-apricot-soft/55 p-5 shadow-card sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-apricot-ink">
          Program
        </p>
        <h2 id="radio-current" className="mt-2 text-2xl font-bold text-ink">
          {radioProgram.programName}
        </h2>
        <div className="mt-5" role="status" aria-live="polite">
          <StatusLine label={status.label} value={status.value} note={status.note} />
        </div>
        <p className="mt-3 text-xs leading-6 text-ink-muted">
          番組情報は{formatDate(radioProgram.lastVerifiedAt)}確認。
        </p>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          {seasideCircleMessageFormLink.note}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ExternalLink
            href={seasideCircleMessageFormLink.url}
            className={primaryCta}
          >
            {seasideCircleMessageFormLink.label}
          </ExternalLink>
          <ExternalLink href={radioProgram.programUrl} className={secondaryCta}>
            湘南シーサイドサークル 番組ページを見る
          </ExternalLink>
          <ExternalLink href={status.href} className={secondaryCta}>
            番組のNOW ON AIRを確認
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}

function RadioStorySpotlight({ activityId }: { activityId: ActivityId }) {
  const videos = visibleRadioStoryVideos();
  if (activityId !== "radio" || videos.length === 0) return null;
  return (
    <SectionShell eyebrow="Program Videos" title="2026年8月30日の番組動画">
      <p className="mt-4 text-sm leading-7 text-ink-muted">
        当日のトークテーマは「映画」。番組へのメッセージ募集と、生放送の案内動画です。
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {videos.map((video) => (
          <li
            key={video.id}
            className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card p-2 shadow-card"
          >
            <video
              src={video.src}
              poster={video.poster}
              width={video.width}
              height={video.height}
              controls
              playsInline
              preload="none"
              aria-label={video.alt}
              className="mx-auto aspect-[9/16] max-h-[70vh] w-full rounded-xl bg-sage-soft object-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            />
            <p className="px-3 pb-2 pt-3 text-xs leading-6 text-ink-muted">
              {video.caption}
            </p>
            <p className="px-3 pb-3 text-xs leading-6 text-ink-muted">
              出典: {video.sourceLabel} · {formatDate(video.sourceDate)}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-2xl border border-apricot/30 bg-apricot-soft/55 p-5">
        <p className="text-sm leading-7 text-ink-muted">
          現在の番組へのメッセージはこちら。ラジオネームで送れます。
        </p>
        <p className="mt-4">
          <ExternalLink
            href={seasideCircleMessageFormLink.url}
            className={primaryCta}
          >
            {seasideCircleMessageFormLink.label}
          </ExternalLink>
        </p>
      </div>
    </SectionShell>
  );
}

function RadioEpisodeRecap({ activityId }: { activityId: ActivityId }) {
  if (activityId !== "radio") return null;
  const episode = radioEpisode20260830;

  return (
    <SectionShell eyebrow="On Air Archive" title={`${episode.dateLabel} ${episode.theme}`}>
      <div className="mt-5 rounded-3xl border border-apricot/30 bg-apricot-soft/45 p-5 shadow-card sm:p-7">
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-apricot-ink">
          <span className="rounded-full bg-paper px-3 py-1.5">{episode.broadcastLabel}</span>
          <span className="rounded-full bg-paper px-3 py-1.5">
            パーソナリティ：{episode.presenters.join("・")}
          </span>
        </div>
        <p className="mt-5 text-sm leading-7 text-ink-muted sm:text-base sm:leading-8">
          {episode.summary}
        </p>
      </div>

      <section aria-labelledby="radio-mily-highlights" className="mt-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Mily Highlights
        </p>
        <h3 id="radio-mily-highlights" className="mt-2 text-xl font-bold text-ink sm:text-2xl">
          みりぃの見どころ
        </h3>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {episode.milyHighlights.map((highlight) => (
            <li
              key={highlight.timestamp}
              className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card"
            >
              <p className="text-xs font-semibold text-sage-deep">{highlight.timestamp}</p>
              <h4 className="mt-2 text-lg font-bold leading-relaxed text-ink">
                {highlight.title}
              </h4>
              <p className="mt-2 text-sm leading-7 text-ink-muted">{highlight.body}</p>
              {highlight.quote ? (
                <blockquote className="mt-4 border-l-2 border-apricot pl-4 text-sm font-medium leading-7 text-ink">
                  {highlight.quote}
                </blockquote>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="radio-listener-messages" className="mt-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Listener Messages
        </p>
        <h3 id="radio-listener-messages" className="mt-2 text-xl font-bold text-ink sm:text-2xl">
          番組で紹介されたリスナーメッセージ
        </h3>
        <ul className="mt-5 space-y-4">
          {episode.listenerMessages.map((message) => (
            <li
              key={message.timestamp}
              className="rounded-2xl border border-sage/15 bg-sage-soft/35 p-5"
            >
              <p className="text-xs font-semibold text-sage-deep">{message.timestamp}</p>
              <h4 className="mt-2 text-lg font-bold leading-relaxed text-ink">
                {message.title}
              </h4>
              <p className="mt-2 text-sm leading-7 text-ink-muted">{message.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <details className="mt-9 rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card">
        <summary className="cursor-pointer font-bold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
          主なコーナーとタイムスタンプを見る
        </summary>
        <ol className="mt-5 space-y-3">
          {episode.timeline.map((item) => (
            <li key={item.timestamp} className="flex gap-3 text-sm leading-7">
              <span className="shrink-0 font-semibold tabular-nums text-sage-deep">
                {item.timestamp}
              </span>
              <span className="text-ink-muted">{item.label}</span>
            </li>
          ))}
        </ol>
      </details>

      <div className="mt-6 rounded-2xl border border-sage/15 bg-paper-card p-5">
        <p className="text-sm leading-7 text-ink-muted">{episode.nextEpisodeNote}</p>
        <p className="mt-3 text-xs leading-6 text-ink-muted">
          出典: {episode.sourceLabel} · {formatDate(episode.verifiedAt)}確認
        </p>
        <p className="mt-2 text-xs leading-6 text-ink-muted">{episode.transcriptionNote}</p>
      </div>
    </SectionShell>
  );
}

function StreamRecap({ activityId }: { activityId: ActivityId }) {
  if (activityId !== "live-stream") return null;

  return (
    <SectionShell eyebrow="Stream Archive" title="配信メモ">
      <p className="mt-4 text-sm leading-7 text-ink-muted">
        新しい回を上に置いています。どの回も同じ並び（見どころ → スクショ → 目標 →
        ランキング → タイムスタンプと次枠 → 出典）で書いています。スクショは写真のある回だけです。閉じても日付と一言は残り、画像がある回は静止画も残します。
      </p>
      <ul className="mt-6 space-y-4">
        {streamRecaps.map((recap, index) => (
          <li key={recap.id}>
            <StreamRecapArticle recap={recap} defaultOpen={index === 0} />
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function StreamRecapSection({
  title,
  id,
  note,
  children,
}: {
  title: string;
  id?: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-6">
      <h4 id={id} className="text-sm font-bold text-ink">
        {title}
      </h4>
      {note ? (
        <p className="mt-2 text-sm leading-6 text-ink-muted">{note}</p>
      ) : null}
      {children}
    </section>
  );
}

function StreamRecapArticle({
  recap,
  defaultOpen,
}: {
  recap: StreamRecapData;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      className="group rounded-3xl border border-sage/20 bg-paper-card p-5 shadow-card open:shadow-card sm:p-6"
      open={open}
      onToggle={(event) => {
        const next = event.currentTarget.open;
        if (next !== open) setOpen(next);
      }}
    >
      <summary className="cursor-pointer list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sage [&::-webkit-details-marker]:hidden">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sage-deep">
          <span>{recap.dateLabel}</span>
          <span className="rounded-full bg-sage-soft px-3 py-1">{recap.platformLabel}</span>
          <span className="rounded-full bg-sage-soft px-3 py-1">{recap.broadcastLabel}</span>
          <span className="ml-auto text-[11px] font-semibold text-sage-deep">
            <span className="group-open:hidden">開く</span>
            <span className="hidden group-open:inline">閉じる</span>
          </span>
        </div>
        <h3 className="mt-3 text-xl font-bold text-ink sm:text-2xl">{recap.theme}</h3>
        <p className="mt-3 text-sm leading-7 text-ink-muted">{recap.summary}</p>
        {recap.image ? (
          <figure className="mx-auto mt-4 max-w-[640px] overflow-hidden rounded-2xl bg-sage-soft/40">
            <div className="flex aspect-[16/9] items-center justify-center">
              <img
                src={recap.image.src}
                width={recap.image.width}
                height={recap.image.height}
                alt={recap.image.alt}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            {recap.image.caption ? (
              <figcaption className="px-3 py-2 text-xs leading-5 text-ink-muted">
                {recap.image.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
      </summary>

      {recap.songs && recap.songs.length > 0 ? (
        <StreamRecapSection
          title="この回に歌った曲"
          id={`${recap.id}-songs`}
          note="「原曲を聴く」は原曲の公式動画、「カラオケで歌う」は参考伴奏です。みりぃの歌唱映像ではありません。時刻は録画内の目安です。"
        >
          <ol className="mt-3 space-y-3">
            {recap.songs.map((song, index) => (
              <li
                key={`${song.timestamp}-${song.title}`}
                className="flex gap-3 rounded-2xl border border-sage/15 bg-sage-soft/30 p-4"
              >
                <span
                  aria-hidden="true"
                  className="pt-0.5 text-xs font-semibold tabular-nums text-sage-deep"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-bold leading-relaxed text-ink">
                    {song.title}
                  </p>
                  <p className="mt-1 break-words text-sm leading-6 text-ink-muted">
                    {song.artist}
                  </p>
                  <p className="mt-1 text-xs tabular-nums text-ink-muted">
                    {song.timestamp}頃〜
                  </p>
                  <a
                    href={song.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-sage-deep underline underline-offset-4"
                    aria-label={`${song.title} — 原曲の公式動画をYouTubeで聴く（新しいタブ）`}
                  >
                    YouTubeで原曲を聴く ↗
                  </a>
                  {song.karaoke ? (
                    <div className="mt-1">
                      <a
                        href={song.karaoke.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center text-sm font-semibold text-sage-deep underline underline-offset-4"
                        aria-label={`${song.title} — カラオケの参考動画をYouTubeで開く（新しいタブ）`}
                      >
                        カラオケで歌う ↗
                      </a>
                      <p className="break-words text-xs leading-5 text-ink-muted">
                        {song.karaoke.channel}の参考伴奏（ガイドメロディなし）
                      </p>
                      <p className="text-xs leading-5 text-ink-muted">
                        練習用の参考リンクです。配信での使用音源は未確認です。
                      </p>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </StreamRecapSection>
      ) : null}

      {recap.highlights.length > 0 ? (
        <StreamRecapSection title="この回の見どころ" id={`${recap.id}-highlights`}>
          <ul className="mt-3 space-y-3">
            {recap.highlights.map((highlight) => (
              <li
                key={highlight.timestamp + highlight.title}
                className="rounded-2xl border border-sage/15 bg-sage-soft/30 p-4"
              >
                <p className="text-xs font-semibold tabular-nums text-sage-deep">
                  {highlight.timestamp}
                </p>
                <h5 className="mt-1 text-sm font-bold leading-relaxed text-ink">
                  {highlight.title}
                </h5>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{highlight.body}</p>
                {highlight.quote ? (
                  <blockquote className="mt-3 border-l-2 border-apricot pl-3 text-sm font-medium leading-6 text-ink">
                    {highlight.quote}
                  </blockquote>
                ) : null}
              </li>
            ))}
          </ul>
        </StreamRecapSection>
      ) : null}

      {recap.gallery && recap.gallery.length > 0 ? (
        <StreamRecapSection
          title="この回のスクショ"
          id={`${recap.id}-stills`}
          note={`かわいいカットを${recap.gallery.length}枚。コメントや他の方の表示は外してあります。各写真を保存できます。`}
        >
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {recap.gallery.map((still) => (
              <li key={still.src}>
                <figure className="overflow-hidden rounded-2xl bg-sage-soft/40">
                  <img
                    src={still.src}
                    width={still.width}
                    height={still.height}
                    alt={still.alt}
                    className="h-auto w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="flex min-h-11 flex-col gap-1 px-2 py-2">
                    <span className="text-[11px] leading-4 text-ink-muted">{still.caption}</span>
                    <a
                      href={still.src}
                      download={still.downloadName ?? still.src.split("/").pop()}
                      className="inline-flex min-h-11 items-center text-xs font-semibold text-sage-deep underline-offset-2 hover:underline"
                    >
                      保存
                    </a>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          {recap.galleryZip ? (
            <p className="mt-4">
              <a
                href={recap.galleryZip.src}
                download={recap.galleryZip.filename}
                className="inline-flex min-h-11 items-center rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white hover:bg-sage-deep"
              >
                {recap.galleryZip.label}
              </a>
            </p>
          ) : null}
        </StreamRecapSection>
      ) : null}

      {recap.goals.length > 0 ? (
        <StreamRecapSection title="この回の目標" id={`${recap.id}-goals`}>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {recap.goals.map((goal) => (
              <li
                key={goal.item}
                className="rounded-2xl border border-sage/15 bg-sage-soft/50 px-3 py-2 text-xs leading-5"
              >
                <span className="block font-semibold text-ink">{goal.item}</span>
                <span className="mt-1 block text-ink-muted">目標 {goal.target}</span>
                <span className="block text-ink-muted">この回 {goal.statusThen}</span>
              </li>
            ))}
          </ul>
        </StreamRecapSection>
      ) : null}

      {recap.ranking.length > 0 ? (
        <StreamRecapSection title="読み上げたランキング" id={`${recap.id}-ranking`}>
          <div className="mt-3 rounded-2xl border border-sage/15 bg-sage-soft/35 p-4">
            {recap.ranking.map((entry) => (
              <p key={entry} className="text-sm leading-7 text-ink-muted">
                {entry}
              </p>
            ))}
          </div>
        </StreamRecapSection>
      ) : null}

      {recap.timeline.length > 0 || recap.nextNote ? (
        <details className="mt-6 rounded-2xl border border-sage/15 bg-paper px-4 py-3">
          <summary className="cursor-pointer text-sm font-bold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sage">
            タイムスタンプと次枠
          </summary>
          {recap.timeline.length > 0 ? (
            <ol className="mt-3 space-y-2">
              {recap.timeline.map((item) => (
                <li key={item.timestamp} className="flex gap-3 text-sm leading-6">
                  <span className="w-14 shrink-0 font-semibold tabular-nums text-sage-deep">
                    {item.timestamp}
                  </span>
                  <span className="text-ink-muted">{item.label}</span>
                </li>
              ))}
            </ol>
          ) : null}
          {recap.nextNote ? (
            <p className="mt-3 text-sm leading-6 text-ink-muted">{recap.nextNote}</p>
          ) : null}
        </details>
      ) : null}

      <div className="mt-4 rounded-2xl border border-sage/15 bg-paper px-4 py-3">
        <p className="text-xs leading-5 text-ink-muted">
          出典: {recap.sourceLabel} · {formatDate(recap.verifiedAt)}確認
        </p>
        <p className="mt-2 text-xs leading-5 text-ink-muted">{recap.transcriptionNote}</p>
      </div>
    </details>
  );
}

function LiveCurrent() {
  const { live } = useMilyRealtimeStatus();
  const { slots, roomUrl } = useStreamSchedule();
  const status = selectLiveActivityStatus(live, slots, roomUrl);
  if (!status) return null;

  const value = status.slot
    ? `${formatSlotDate(status.slot)} ${status.slot.time}〜${status.slot.endTime ?? ""}`
    : status.value;
  return (
    <section aria-labelledby="live-current" className="px-4 pb-10">
      <div
        className="mx-auto max-w-3xl rounded-3xl border border-sage/20 bg-sage-soft/45 p-5 shadow-card sm:p-7"
        role="status"
        aria-live="polite"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Realtime
        </p>
        <h2 id="live-current" className="mt-2 text-2xl font-bold text-ink">
          ライブ配信の現在情報
        </h2>
        <div className="mt-5">
          <StatusLine
            label={status.label}
            value={value}
            note={
              status.slot
                ? [status.slot.note, !status.slot.endTime ? "終了時刻は確認できていません。" : null].filter(Boolean).join(" / ") || undefined
                : undefined
            }
          />
        </div>
        {status.href ? (
          <p className="mt-5">
            <ExternalLink href={status.href} className={primaryCta}>
              SHOWROOMを見る
            </ExternalLink>
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ActivityCurrent({ activityId }: { activityId: ActivityId }) {
  if (activityId === "miss-circle") return <MissCircleCurrent />;
  if (activityId === "radio") return <RadioCurrent />;
  if (activityId === "live-stream") return <LiveCurrent />;
  return null;
}

function SectionShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-sage/15 px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function ActivityNews({ items, now }: { items: NewsItem[]; now: number }) {
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow="Latest" title="関連する最新情報">
      <ul className="mt-6 space-y-4">
        {items.map((item) => {
          const resolvedLinks = resolveNewsLinks(item, now);
          return (
            <li key={item.id} className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card">
              <time dateTime={item.date} className="text-xs text-ink-muted">
                {formatDate(item.date)}
              </time>
              <h3 className="mt-2 text-lg font-bold leading-relaxed text-ink">{item.title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-ink-muted">{item.body}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {item.source ? (
                  <ExternalLink href={item.source} className="text-sm font-semibold text-sage hover:underline">
                    {item.sourceLabel ?? "出典を見る"}
                  </ExternalLink>
                ) : item.sourceLabel ? (
                  <span className="text-sm font-medium text-ink-muted">{item.sourceLabel}</span>
                ) : null}
                {item.additionalSources?.map((source) => (
                  <ExternalLink
                    key={source.url}
                    href={source.url}
                    className="text-sm font-semibold text-sage hover:underline"
                  >
                    {source.label}
                  </ExternalLink>
                ))}
                {resolvedLinks.relatedUrl && resolvedLinks.relatedUrl !== item.source ? (
                  <SmartLink href={resolvedLinks.relatedUrl} className="text-sm font-semibold text-sage hover:underline">
                    関連ページを見る
                  </SmartLink>
                ) : null}
              </div>
              {resolvedLinks.cta || resolvedLinks.additionalCtas?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {resolvedLinks.cta ? (
                    <SmartLink href={resolvedLinks.cta.url} className={secondaryCta}>
                      {resolvedLinks.cta.label}
                    </SmartLink>
                  ) : null}
                  {resolvedLinks.additionalCtas?.map((cta) => (
                    <SmartLink key={cta.url} href={cta.url} className={secondaryCta}>
                      {cta.label}
                    </SmartLink>
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

function ActivityHighlights({
  items,
}: {
  items: ReturnType<typeof selectActivityHighlights>;
}) {
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow="History" title="確認済みの歩み">
      <ol className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card">
            {item.dateLabel ? <p className="text-xs text-ink-muted">{item.dateLabel}</p> : null}
            <h3 className="mt-1 text-lg font-bold leading-relaxed text-ink">{item.title}</h3>
            {item.body ? <p className="mt-2 text-sm leading-7 text-ink-muted">{item.body}</p> : null}
            <p className="mt-3">
              <ExternalLink href={item.source} className="text-sm font-semibold text-sage hover:underline">
                出典を見る
              </ExternalLink>
            </p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

function ActivityStories({ items }: { items: ReturnType<typeof selectActivityPageContent>["stories"] }) {
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow="Stories" title="関連するSTORY">
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((story) => (
          <li key={story.slug} className="rounded-2xl border border-sage/15 bg-paper-card p-5 shadow-card">
            <p className="text-xs font-semibold text-sage-deep">{story.eyebrow}</p>
            <p className="mt-2 text-xs text-ink-muted">{story.dateLabel}</p>
            <h3 className="mt-2 text-lg font-bold leading-relaxed text-ink">{story.cardTitle}</h3>
            <p className="mt-2 text-sm leading-7 text-ink-muted">{story.cardDescription}</p>
            <p className="mt-4">
              <a href={story.href} className={secondaryCta}>
                STORYを読む
              </a>
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function mediaLabel(media: ActivityMediaItem): string {
  if (media.kind === "video" && "label" in media) return media.label;
  return "alt" in media ? media.alt : "みりぃの関連動画";
}

function mediaCaption(media: ActivityMediaItem): string | undefined {
  return "caption" in media ? media.caption : undefined;
}

function activityMediaKey(media: ActivityMediaItem): string {
  if ("id" in media && typeof media.id === "string") return media.id;
  return media.src;
}

function isNewsImageMedia(media: ActivityMediaItem): media is NewsImageMedia {
  return media.kind === "image" && "srcSet" in media;
}

function ActivityMedia({ items }: { items: ActivityMediaItem[] }) {
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow="Media" title="関連するメディア">
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((media) => {
          const key = activityMediaKey(media);
          const caption = mediaCaption(media);
          return (
            <li key={key} className="overflow-hidden rounded-2xl border border-sage/15 bg-paper-card p-2 shadow-card">
              {media.kind === "video" ? (
                <video
                  src={media.src}
                  poster={media.poster}
                  width={media.width}
                  height={media.height}
                  controls
                  playsInline
                  preload="none"
                  aria-label={mediaLabel(media)}
                  className="mx-auto aspect-[9/16] max-h-[70vh] w-full rounded-xl bg-sage-soft object-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                />
              ) : isNewsImageMedia(media) ? (
                <NewsImage
                  media={media}
                  className="max-h-[42rem] w-full rounded-xl bg-sage-soft/30 object-contain"
                />
              ) : (
                <img
                  src={media.src}
                  width={media.width}
                  height={media.height}
                  alt={media.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[42rem] w-full rounded-xl bg-sage-soft/30 object-contain"
                />
              )}
              {caption ? <p className="px-3 pb-2 pt-3 text-xs leading-6 text-ink-muted">{caption}</p> : null}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

const resourceKindLabel: Record<ActivityResource["kind"], string> = {
  "personal-social": "本人SNS・配信プロフィール",
  "related-link": "関連リンク",
  source: "確認済み出典",
};

function ActivityResources({ items }: { items: ActivityResource[] }) {
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow="Links & Sources" title="関連リンクと出典">
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((resource) => (
          <li key={`${resource.kind}-${resource.id}`} className="rounded-2xl border border-sage/15 bg-paper-card p-4 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-sage-deep">
              {resourceKindLabel[resource.kind]}
            </p>
            <p className="mt-2">
              <ExternalLink href={resource.url} className="font-semibold leading-relaxed text-sage hover:underline">
                {resource.label}
              </ExternalLink>
            </p>
            {resource.note ? <p className="mt-2 text-xs leading-6 text-ink-muted">{resource.note}</p> : null}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function ActivityDetail({ activity }: { activity: Activity }) {
  const now = useSupportEventClock();
  const content = selectActivityPageContent(activity.id, now);
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#activity-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <Header />
      <main id="activity-main">
        <ActivityHero activity={content.activity} />
        <ActivityCurrent activityId={content.activity.id} />
        <RadioEpisodeRecap activityId={content.activity.id} />
        <StreamRecap activityId={content.activity.id} />
        <RadioStorySpotlight activityId={content.activity.id} />
        <ActivityNews items={content.news} now={now} />
        <ActivityHighlights items={content.highlights} />
        <ActivityStories items={content.stories} />
        <ActivityMedia items={content.media} />
        <ActivityResources items={content.resources} />
      </main>
      <Footer />
    </div>
  );
}

export default function ActivitiesPage({ pathname }: { pathname: string }) {
  if (isActivitiesHubRoute(pathname)) return <ActivitiesHub />;
  const activity = activityByRoute(pathname);
  if (!activity) throw new Error(`Activity page not found: ${pathname}`);
  return <ActivityDetail activity={activity} />;
}
