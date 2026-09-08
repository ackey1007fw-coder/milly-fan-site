import { contest } from "../data/contest";
import { amiMilyKoreaPromise } from "../data/challengeConnection";
import { ExternalLink } from "./ExternalLink";

export function ChallengeConnection() {
  const item = amiMilyKoreaPromise;

  return (
    <section id="connected-challenge" className="px-4 pb-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-rose-200/70 bg-paper-card shadow-card">
        <img
          src={item.image.src}
          width={item.image.width}
          height={item.image.height}
          alt={item.image.alt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full bg-rose-50 object-contain"
        />
        <div className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">
            {item.eyebrow}
          </p>
          <p className="mt-2 text-xs text-ink-muted">{item.date}</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-ink">{item.title}</h2>
          <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <ExternalLink
              href={item.amiEntry.url}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
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
          <p className="mt-3 text-xs leading-5 text-ink-muted">
            {item.sourceNote}
          </p>
        </div>
      </div>
    </section>
  );
}
