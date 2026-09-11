import { canonicalUrl, site } from "../data/site.ts";
import { contest } from "../data/contest.ts";
import {
  radioProgram,
  schedulePhase,
  type SchedulePhase,
} from "../data/radio.ts";
import {
  campusGirlsFinalStagePatonVote,
  supportEvents,
  type SupportEvent,
} from "../data/supportEvents.ts";
import { patonVoteLiveShareText } from "./patonVoteLiveCopy.ts";
import {
  displayStatus,
  formatScheduleEndLabel,
  formatShortTokyoDate,
} from "./supportCalendar.ts";

export type SiteSharePayload = {
  title: string;
  text: string;
  url: string;
};

export type WebShareResult = "shared" | "cancelled" | "unsupported";

export type SiteShareContext = {
  now?: number;
  radioPhase?: SchedulePhase;
};

type WebShareApi = {
  share?: (data: SiteSharePayload) => Promise<void>;
  canShare?: (data: SiteSharePayload) => boolean;
};

type ClipboardWriter = {
  writeText: (text: string) => Promise<void>;
};

type ShareTopic = {
  id: string;
  activityId?: SupportEvent["activityId"];
  priority: number;
  text: string;
  campaignHashtags?: readonly string[];
};

type XSafeShareSelection = {
  topics: ShareTopic[];
  compact: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const UPCOMING_CONTEST_DAYS = 7;
const MAX_SHARE_TOPICS = 2;
const PERSON_HASHTAG = "#三橋莉子";
const X_MAX_WEIGHTED_LENGTH = 280;
const X_URL_WEIGHT_WITH_SEPARATOR = 24;
const SHARE_INTRO = "みりぃ（三橋莉子 / Mily）さんを応援しています🍅✨";
const SHARE_FOOTER = "最新の活動・応援情報はこちら👇";

function safeRadioPhase(now: number): SchedulePhase {
  try {
    return schedulePhase(now);
  } catch {
    return "idle";
  }
}

function radioShareTopic(phase: SchedulePhase): ShareTopic | null {
  if (phase === "upcoming") {
    return {
      id: "radio-upcoming",
      priority: 400,
      text: `今日${radioProgram.scheduledStart}〜は「${radioProgram.programName}」📻`,
      campaignHashtags: radioProgram.shareHashtags,
    };
  }
  if (phase === "window") {
    return {
      id: "radio-window",
      priority: 400,
      text: `ただいま「${radioProgram.programName}」の放送時間です📻`,
      campaignHashtags: radioProgram.shareHashtags,
    };
  }
  return null;
}

function compactEndLabel(event: SupportEvent): string | null {
  return formatScheduleEndLabel(event.schedule)?.replace("（JST）", "") ?? null;
}

function supportEventShareTopics(now: number): ShareTopic[] {
  return supportEvents
    .filter(
      (event) =>
        event.shareText !== undefined &&
        displayStatus(event.schedule, now) === "live",
    )
    .map((event) => {
      const end = compactEndLabel(event);
      const share =
        event.id === campusGirlsFinalStagePatonVote.id
          ? patonVoteLiveShareText(event.shareText ?? "", now)
          : event.shareText;
      return {
        id: event.id,
        activityId: event.activityId,
        priority: 200 + (event.priority ?? 0),
        text: `${share}${end ? `（${end}まで）` : ""}`,
        ...(event.shareHashtag
          ? { campaignHashtags: [event.shareHashtag] }
          : {}),
      };
    });
}

function contestPhaseShareTopic(now: number): ShareTopic | null {
  const phase = contest.currentPhase;
  if (!phase?.start || !phase.end) return null;

  const start = Date.parse(`${phase.start}T00:00:00+09:00`);
  const endExclusive = Date.parse(`${phase.end}T00:00:00+09:00`) + DAY_MS;
  if (!Number.isFinite(start) || !Number.isFinite(endExclusive)) return null;

  const phaseLabel = phase.name.replace(/進出$/, "");
  if (now >= start && now < endExclusive) {
    return {
      id: "contest-active",
      priority: 180,
      text: `${contest.contestName}の${phaseLabel}を応援してください🔥（${formatShortTokyoDate(phase.end)}まで）`,
      ...(contest.shareHashtag
        ? { campaignHashtags: [contest.shareHashtag] }
        : {}),
    };
  }

  if (now < start && start - now <= UPCOMING_CONTEST_DAYS * DAY_MS) {
    return {
      id: "contest-upcoming",
      priority: 160,
      text: `${formatShortTokyoDate(phase.start)}から${contest.contestName}の${phaseLabel}が始まります🔥`,
      ...(contest.shareHashtag
        ? { campaignHashtags: [contest.shareHashtag] }
        : {}),
    };
  }

  return null;
}

function hashtagLineForTopics(topics: readonly ShareTopic[]): string {
  const campaignHashtags =
    topics.find((topic) => topic.campaignHashtags?.length)?.campaignHashtags ?? [];
  return [PERSON_HASHTAG, ...campaignHashtags].join(" ");
}

function formatSiteShareText(
  topics: readonly ShareTopic[],
  compact = false,
): string {
  const hashtagLine = hashtagLineForTopics(topics);
  if (topics.length === 0) return [site.description, hashtagLine].join("\n");

  return [
    ...(compact ? [] : [SHARE_INTRO]),
    ...topics.map(({ text }) => text),
    SHARE_FOOTER,
    hashtagLine,
  ].join("\n");
}

function isSingleWeightCodePoint(codePoint: number): boolean {
  return (
    codePoint <= 0x10ff ||
    (codePoint >= 0x2000 && codePoint <= 0x200d) ||
    (codePoint >= 0x2010 && codePoint <= 0x201f) ||
    (codePoint >= 0x2032 && codePoint <= 0x2037)
  );
}

/** X/twitter-text v3 の文字重みを安全側に見積もる。 */
function xWeightedTextLengthUpperBound(text: string): number {
  let weightedLength = 0;
  for (const character of text) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) continue;
    weightedLength += isSingleWeightCodePoint(codePoint) ? 1 : 2;
  }
  return weightedLength;
}

function isWithinXLimit(topics: readonly ShareTopic[], compact: boolean): boolean {
  return (
    xWeightedTextLengthUpperBound(formatSiteShareText(topics, compact)) +
      X_URL_WEIGHT_WITH_SEPARATOR <=
    X_MAX_WEIGHTED_LENGTH
  );
}

function selectXSafeTopics(topics: ShareTopic[]): XSafeShareSelection {
  let selected = topics.slice(0, MAX_SHARE_TOPICS);
  if (isWithinXLimit(selected, false)) {
    return { topics: selected, compact: false };
  }
  if (isWithinXLimit(selected, true)) {
    return { topics: selected, compact: true };
  }

  while (selected.length > 1) {
    selected = selected.slice(0, -1);
    if (isWithinXLimit(selected, false)) {
      return { topics: selected, compact: false };
    }
    if (isWithinXLimit(selected, true)) {
      return { topics: selected, compact: true };
    }
  }

  return { topics: selected, compact: true };
}

export function siteShareText(context: SiteShareContext = {}): string {
  const now = context.now ?? Date.now();
  if (!Number.isFinite(now)) throw new Error("now must be a finite timestamp");

  const supportTopics = supportEventShareTopics(now);
  const hasContestSpecificSupport = supportTopics.some(
    (topic) => topic.activityId === "miss-circle",
  );
  const candidates = [
    radioShareTopic(context.radioPhase ?? safeRadioPhase(now)),
    ...supportTopics,
    hasContestSpecificSupport ? null : contestPhaseShareTopic(now),
  ]
    .filter((topic): topic is ShareTopic => topic !== null)
    .sort((a, b) => b.priority - a.priority);
  const selection = selectXSafeTopics(candidates);

  return formatSiteShareText(selection.topics, selection.compact);
}

/**
 * Public share payload for the fan site itself.
 * URL is canonical; text is selected from verified, date-aware site data.
 */
export function siteSharePayload(context: SiteShareContext = {}): SiteSharePayload {
  return {
    title: site.displayTitle,
    text: siteShareText(context),
    url: canonicalUrl(),
  };
}

export function xShareUrl(payload: SiteSharePayload = siteSharePayload()): string {
  const text = encodeURIComponent(payload.text);
  const url = encodeURIComponent(payload.url);
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
}

export function lineShareUrl(
  payload: SiteSharePayload = siteSharePayload(),
): string {
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(payload.url)}`;
}

export function facebookShareUrl(
  payload: SiteSharePayload = siteSharePayload(),
): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(payload.url)}`;
}

export function threadsShareUrl(
  payload: SiteSharePayload = siteSharePayload(),
): string {
  const text = encodeURIComponent(payload.text);
  const url = encodeURIComponent(payload.url);
  return `https://www.threads.com/intent/post?text=${text}&url=${url}`;
}

export function canUseWebShare(
  payload: SiteSharePayload = siteSharePayload(),
  shareApi: WebShareApi | undefined = globalThis.navigator,
): boolean {
  if (!shareApi || typeof shareApi.share !== "function") {
    return false;
  }

  if (typeof shareApi.canShare !== "function") {
    return true;
  }

  try {
    return shareApi.canShare(payload) === true;
  } catch {
    return true;
  }
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

/**
 * Opens the OS share sheet. Call only from a user gesture.
 * Does not run at module load or on mount.
 */
export async function shareWithWebShare(
  payload: SiteSharePayload = siteSharePayload(),
  shareApi: WebShareApi | undefined = globalThis.navigator,
): Promise<WebShareResult> {
  if (!shareApi || typeof shareApi.share !== "function") {
    return "unsupported";
  }

  try {
    await shareApi.share(payload);
    return "shared";
  } catch (error) {
    if (isAbortError(error)) {
      return "cancelled";
    }
    return "unsupported";
  }
}

export function copyWithExecCommand(text: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const previous =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.setAttribute("aria-hidden", "true");
  textarea.tabIndex = -1;
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
    if (previous && previous.isConnected) {
      previous.focus({ preventScroll: true });
    }
  }
}

export async function copyUrlToClipboard(
  url: string,
  clipboard: ClipboardWriter | undefined = globalThis.navigator?.clipboard,
  fallback: (text: string) => boolean = copyWithExecCommand,
): Promise<boolean> {
  try {
    if (clipboard && typeof clipboard.writeText === "function") {
      await clipboard.writeText(url);
      return true;
    }
  } catch {
    // Clipboard API can be missing or blocked; try the fallback.
  }

  try {
    return fallback(url) === true;
  } catch {
    return false;
  }
}
