import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { activities } from "../src/data/activities.ts";
import { contest } from "../src/data/contest.ts";
import {
  campusGirlsPatonVoteLink,
  links,
} from "../src/data/links.ts";
import { news } from "./fixtures/news-before-b41.ts";
import {
  campusGirlsFinalStagePatonVote,
  isValidSupportEvent,
  supportEvents,
} from "../src/data/supportEvents.ts";
import {
  selectHomeVoteAction,
  selectHomeVoteActions,
} from "../src/lib/homePortal.ts";
import { selectHomeToday } from "../src/lib/homeToday.ts";
import { selectActivityResources } from "./fixtures/activity-content-before-b41.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import {
  adaptSupportEvents,
  nextDisplayStatusBoundary,
} from "../src/lib/supportCalendar.ts";
import { selectSupportNow } from "../src/lib/supportHub.ts";
import { nextSupportEventBoundary } from "../src/lib/useSupportEventClock.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PATON_URL = "https://paton.jp/event/entrant/11380";
const START = Date.parse("2026-08-26T18:00:00+09:00");
const END = Date.parse("2026-09-01T23:59:00+09:00");
const unknownLive = {
  state: "unknown",
  startedAt: null,
  observedAt: null,
  roomUrl: null,
  next: { state: "unknown", at: null },
};

async function source(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("2026-08-26 CAMPUS GIRLS Paton vote", () => {
  it("registers the confirmed entrant URL and timed voting period once", () => {
    assert.equal(campusGirlsPatonVoteLink.url, PATON_URL);
    assert.equal(campusGirlsPatonVoteLink.label, "Patonでみりぃに投票する");
    assert.equal(
      links.filter(({ id }) => id === campusGirlsPatonVoteLink.id).length,
      1,
    );

    assert.equal(isValidSupportEvent(campusGirlsFinalStagePatonVote), true);
    assert.equal(campusGirlsFinalStagePatonVote.activityId, "campus-girls");
    assert.equal(campusGirlsFinalStagePatonVote.kind, "vote");
    assert.deepEqual(campusGirlsFinalStagePatonVote.schedule, {
      state: "confirmed-period",
      start: "2026-08-26T18:00:00+09:00",
      end: "2026-09-01T23:59:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    });
    assert.equal(campusGirlsFinalStagePatonVote.ctaLinkId, campusGirlsPatonVoteLink.id);
    assert.equal(campusGirlsFinalStagePatonVote.source, "https://paton.jp/event/detail/499");
    assert.equal(campusGirlsFinalStagePatonVote.verifiedAt, "2026-08-26");
  });

  it("uses Paton only during the confirmed period and falls back afterward", () => {
    const select = (now) =>
      selectHomeVoteAction({ contest, supportEvents, links, now });

    assert.equal(select(START - 1).url, contest.entryUrl);
    assert.deepEqual(
      [select(START), select(END)].map(({ kind, url }) => ({ kind, url })),
      [
        { kind: "support-event", url: PATON_URL },
        { kind: "support-event", url: PATON_URL },
      ],
    );
    assert.match(select(START).deadlineLabel ?? "", /投票締切/);
    assert.match(select(START).deadlineLabel ?? "", /JST/);
    assert.equal(select(END + 1).url, contest.entryUrl);
    assert.equal(select(END + 1).deadlineLabel, undefined);
  });

  it("shows Paton prominently and ENTRY 734 together on HOME during the window, then drops only Paton", () => {
    const homeAt = (now) =>
      selectHomeToday({
        contest,
        supportEvents,
        streamSlots: [],
        streamRoomUrl: null,
        live: unknownLive,
        radio: null,
        radioPhase: "idle",
        banner: { kind: "NONE", stateLabel: "", title: "" },
        now,
      });

    const during = homeAt(START);
    const nowVote = during.nowItems.find((item) => item.cta?.url === PATON_URL);
    assert.ok(nowVote);
    assert.equal(nowVote.cta?.label, "Patonでみりぃに投票する");
    assert.equal(
      during.dashboardVoteButtons.some((action) => action.url === PATON_URL),
      false,
    );
    assert.equal(
      during.dashboardVoteButtons.some(
        (action) => action.url === contest.entryUrl && action.kind === "contest",
      ),
      true,
    );
    assert.equal(
      during.dashboardVoteButtons.find((action) => action.kind === "contest")
        ?.label,
      "ENTRY 734を応援する",
    );

    const ended = homeAt(END + 1);
    assert.equal(
      ended.nowItems.some((item) => item.cta?.url === PATON_URL),
      false,
    );
    assert.equal(
      ended.voteActions.some((action) => action.url === PATON_URL),
      false,
    );
    assert.equal(
      ended.dashboardVoteButtons.some((action) => action.url === PATON_URL),
      false,
    );
    assert.equal(ended.nowItems[0]?.origin, "contest");
    assert.equal(ended.nowItems[0]?.cta?.url, contest.entryUrl);
    assert.equal(ended.nowItems[0]?.cta?.label, "ENTRY 734を応援する");
    assert.equal(ended.voteActions[0].url, contest.entryUrl);
    assert.equal(ended.voteActions[0].label, "ENTRY 734を応援する");
  });

  it("keeps Paton and MISS CIRCLE available together during the confirmed period", () => {
    const select = (now) =>
      selectHomeVoteActions({ contest, supportEvents, links, now }).map(
        ({ kind, url }) => ({ kind, url }),
      );

    const contestOnly = [{ kind: "contest", url: contest.entryUrl }];
    const both = [
      { kind: "support-event", url: PATON_URL },
      { kind: "contest", url: contest.entryUrl },
    ];

    assert.deepEqual(select(START - 1), contestOnly);
    assert.deepEqual(select(START), both);
    assert.deepEqual(select(END), both);
    assert.deepEqual(select(END + 1), contestOnly);
  });

  it("schedules a render refresh at both voting boundaries", () => {
    assert.equal(
      nextDisplayStatusBoundary(campusGirlsFinalStagePatonVote.schedule, START - 1),
      START,
    );
    assert.equal(
      nextDisplayStatusBoundary(campusGirlsFinalStagePatonVote.schedule, START),
      END + 1,
    );
    assert.equal(nextSupportEventBoundary(START - 1), START);
    assert.equal(nextSupportEventBoundary(START), Date.parse("2026-08-31T00:00:00+09:00"));
    assert.equal(
      nextSupportEventBoundary(Date.parse("2026-08-31T00:00:00+09:00")),
      Date.parse("2026-08-31T23:59:00+09:00") + 1,
    );
    assert.equal(
      nextSupportEventBoundary(Date.parse("2026-08-31T23:59:00+09:00") + 1),
      END + 1,
    );
    assert.equal(nextSupportEventBoundary(END), END + 1);
    const thirdRoundVoteStartDay = Date.parse("2026-09-03T00:00:00+09:00");
    const showroomStart = Date.parse("2026-09-03T05:00:00+09:00");
    const contestEnd = Date.parse("2026-09-14T00:00:00+09:00");
    const patonExStart = Date.parse("2026-09-16T18:00:00+09:00");
    const snsEnd = Date.parse("2026-09-20T12:00:00+09:00");
    const patonExEnd = Date.parse("2026-09-22T23:59:00+09:00");
    const vol2Start = Date.parse("2026-09-28T12:00:00+09:00");
    assert.equal(nextSupportEventBoundary(END + 1), thirdRoundVoteStartDay);
    assert.equal(nextSupportEventBoundary(thirdRoundVoteStartDay), showroomStart);
    assert.equal(nextSupportEventBoundary(contestEnd - 1), contestEnd);
    assert.equal(nextSupportEventBoundary(contestEnd), patonExStart);
    assert.equal(nextSupportEventBoundary(patonExStart), snsEnd + 1);
    assert.equal(nextSupportEventBoundary(snsEnd + 1), patonExEnd + 1);
    assert.equal(nextSupportEventBoundary(patonExEnd + 1), vol2Start);
  });

  it("surfaces the same CTA in Support NOW while voting is live", () => {
    const items = selectSupportNow({
      supportEvents,
      live: unknownLive,
      radio: null,
      now: START,
    });

    assert.equal(items.length, 1);
    assert.equal(items[0].activityId, "campus-girls");
    assert.equal(items[0].cta?.url, PATON_URL);
    assert.equal(items[0].cta?.label, "Patonでみりぃに投票する");
    assert.match(items[0].note ?? "", /Patonへのログインが必要/);
  });

  it("gates Calendar, Activity, and NEWS actions to the confirmed period", () => {
    const activity = activities.find(({ id }) => id === "campus-girls");
    const item = news.find(
      ({ id }) => id === "2026-08-24-campus-girls-final-stage-guide",
    );

    assert.equal(
      activity?.relatedLinkIds.includes(campusGirlsPatonVoteLink.id),
      false,
    );
    const resourceAt = (now) =>
      selectActivityResources("campus-girls", now).find(
        ({ id }) => id === campusGirlsPatonVoteLink.id,
      );
    assert.equal(resourceAt(START - 1), undefined);
    assert.equal(resourceAt(START)?.url, PATON_URL);
    assert.equal(resourceAt(END)?.url, PATON_URL);
    assert.equal(resourceAt(END + 1), undefined);

    const calendarCtaAt = (now) =>
      adaptSupportEvents([campusGirlsFinalStagePatonVote], now).items[0]?.cta;
    assert.equal(calendarCtaAt(START - 1), undefined);
    assert.equal(calendarCtaAt(START)?.url, PATON_URL);
    assert.equal(calendarCtaAt(END)?.url, PATON_URL);
    assert.equal(calendarCtaAt(END + 1), undefined);

    assert.ok(item);
    assert.equal(item?.url, PATON_URL);
    assert.equal(item?.ctaLabel, "Patonでみりぃに投票する");
    assert.deepEqual(resolveNewsLinks(item, START - 1), {});
    assert.deepEqual(resolveNewsLinks(item, START), {
      relatedUrl: PATON_URL,
      cta: {
        label: "Patonでみりぃに投票する",
        url: PATON_URL,
      },
    });
    assert.deepEqual(resolveNewsLinks(item, END + 1), {});
    assert.match(item?.body ?? "", /8月26日にPatonの三橋莉子（みりぃ）ページの公開を確認/);
    assert.match(item?.body ?? "", /投票にはPatonへのログインが必要/);
  });

  it("re-renders every time-bound surface without duplicating the URL", async () => {
    for (const relative of [
      "src/components/Hero.tsx",
      "src/components/Support.tsx",
      "src/components/MobileActionDock.tsx",
    ]) {
      const component = await source(relative);
      assert.match(component, /selectHomeVoteActions/);
      assert.match(component, /useSupportEventClock/);
      assert.match(component, /voteAction\.url/);
      assert.match(component, /additionalVoteActions/);
      assert.doesNotMatch(component, /paton\.jp/);
    }

    for (const relative of [
      "src/SupportPage.tsx",
      "src/ActivitiesPage.tsx",
      "src/components/Latest.tsx",
      "src/components/TodayDashboard.tsx",
    ]) {
      const component = await source(relative);
      assert.match(component, /useSupportEventClock/);
    }

    const dashboard = await source("src/components/TodayDashboard.tsx");
    assert.match(dashboard, /voteActions/);
    assert.match(dashboard, /liveVoteOnNow/);
    assert.match(dashboard, /dashboardVoteButtons/);
    assert.match(dashboard, /投票受付中/);
    assert.doesNotMatch(dashboard, /additionalVotes/);
    assert.doesNotMatch(dashboard, /paton\.jp/);

    const clock = await source("src/lib/useSupportEventClock.ts");
    assert.match(clock, /nextDisplayStatusBoundary/);
    assert.match(clock, /setTimeout/);
    assert.match(clock, /visibilitychange/);
    assert.match(clock, /addEventListener\("focus"/);

    const dock = await source("src/components/MobileActionDock.tsx");
    assert.match(dock, /target="_blank"/);
    assert.match(dock, /rel="noopener noreferrer"/);
  });
});
