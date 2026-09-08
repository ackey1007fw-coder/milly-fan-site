import { contest } from "../data/contest";
import { amiMilyKoreaPromise } from "../data/challengeConnection";
import { ExternalLink } from "./ExternalLink";

export function ChallengeConnection() {
  const item = amiMilyKoreaPromise;

  return (
    <section id="connected-challenge" className="px-4 pb-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-rose-200/70 bg-paper-card shadow-card">
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-paper-card to-sage-soft px-5 py-7 sm:px-6">
          <div aria-hidden="true" className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-rose-200/40" />
          <div aria-hidden="true" className="absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-sage/10" />
          <p className="relative text-center text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
            Together toward the final
          </p>
          <div className="relative mt-4 flex items-center justify-center gap-2 sm:gap-6">
            <div className="min-w-0 flex-1 rounded-2xl border border-sage/20 bg-white/80 px-2 py-3 sm:px-4 text-center shadow-sm">
              <p className="font-bold text-ink">みりぃ</p>
              <p className="mt-1 text-[10px] leading-tight text-ink-muted">MISS CIRCLE 2026</p>
            </div>
            <span aria-hidden="true" className="shrink-0 text-2xl">🤝✈️</span>
            <div className="min-w-0 flex-1 rounded-2xl border border-rose-200 bg-white/80 px-2 py-3 sm:px-4 text-center shadow-sm">
              <p className="font-bold text-ink">天宮あみ</p>
              <p className="mt-1 text-[10px] leading-tight text-ink-muted">FRESH CAMPUS 2026</p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
            {item.eyebrow}
          </p>
          <p className="mt-2 text-xs text-ink-muted">{item.date}</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-ink">{item.title}</h2>
          <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <ExternalLink
              href={item.amiEntry.url}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              {item.amiEntry.label}
            </ExternalLink>
            <ExternalLink
              href={item.amiX.url}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100"
            >
              {item.amiX.label}
            </ExternalLink>
            <ExternalLink
              href={contest.entryUrl}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-sage/30 bg-paper px-5 py-2.5 text-sm font-semibold text-sage-deep hover:bg-sage-soft"
            >
              みりぃを応援する
            </ExternalLink>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <ExternalLink href={item.source.url} className="font-medium text-sage hover:underline">
              {item.source.label}
            </ExternalLink>
            <ExternalLink href={item.milyReply.url} className="font-medium text-sage hover:underline">
              {item.milyReply.label}
            </ExternalLink>
          </p>
        </div>
      </div>
    </section>
  );
}
