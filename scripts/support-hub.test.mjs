import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { radioProgram } from "../shared/radio-program.js";
import { contest } from "../src/data/contest.ts";
import { supportEvents } from "../src/data/supportEvents.ts";
import { sitemapXml, supportUrl } from "../src/data/site.ts";
import {
  RADIO_APPEARANCE_NOTE,
  selectSupportNow,
  selectSupportPending,
  selectSupportToday,
} from "../src/lib/supportHub.ts";
import {
  supportPageMetadata,
  supportPageStructuredData,
} from "../src/lib/supportMetadata.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

const unknownLive = {
  state: "unknown",
  startedAt: null,
  observedAt: null,
  roomUrl: null,
  next: { state: "unknown", at: null },
};

function radioFixture(updatedAt, onAirConfirmed = true) {
  return {
    ok: true,
    programName: radioProgram.programName,
    todayScheduled: true,
    scheduledStart: radioProgram.scheduledStart,
    scheduledEnd: radioProgram.scheduledEnd,
    inScheduledWindow: true,
    schedulePhase: "window",
    nextStartAt: null,
    onAirConfirmed,
    milyAppearanceConfirmed: null,
    listenUrl: radioProgram.listenUrl,
    sourceUrl: radioProgram.nowOnAirSourceUrl,
    lastVerifiedAt: radioProgram.lastVerifiedAt,
    updatedAt,
  };
}

function supportEvent(schedule, id = "fixture") {
  return {
    id,
    activityId: "miss-circle",
    kind: "support-campaign",
    title: `support ${id}`,
    schedule,
    source: `https://example.com/${id}`,
    verifiedAt: "2026-08-22",
  };
}

describe("Support MPA route and metadata", () => {
  it("keeps /support/ as a physical Vite input with canonical metadata", () => {
    const html = source("support/index.html");
    const vite = source("vite.config.ts");
    assert.match(vite, /support:\s*"support\/index\.html"/);
    assert.match(html, /href="__SUPPORT_CANONICAL__"/);
    assert.match(html, /content="__SUPPORT_CANONICAL__"/);
    assert.match(html, /__SUPPORT_JSON_LD__/);
    assert.equal(supportPageMetadata.canonical, supportUrl());
    assert.match(sitemapXml(), new RegExp(`<loc>${supportUrl()}</loc>`));
  });

  it("publishes fan-made, unofficial WebPage and BreadcrumbList metadata", () => {
    const html = source("support/index.html");
    const structured = supportPageStructuredData();
    const serialized = JSON.stringify(structured);
    assert.match(supportPageMetadata.title, /非公式/);
    assert.match(supportPageMetadata.description, /ファン運営.*非公式/);
    assert.match(html, /みりぃ ファンサイト（非公式）/);
    assert.match(serialized, /BreadcrumbList/);
    assert.match(serialized, /Support/);
    assert.match(serialized, /非公式/);
  });

  it("keeps the monthly schedule and Agenda on the Hub itself, off the top page", () => {
    const page = source("src/SupportPage.tsx");
    assert.match(page, /みりぃスケジュール/);
    assert.match(page, /MonthlyScheduleCalendar/);
    assert.match(page, /buildSupportCalendar\(/);
    assert.match(page, /fanEvents: events/);
    assert.match(page, /streamAvailability: availability/);
    assert.match(page, /includeRadio: true/);
    assert.doesNotMatch(page, /Coming soon/i);
    // ホームは compact gateway から `/support/` へ送るだけ。Hub本体は複製しない。
    assert.doesNotMatch(source("src/App.tsx"), /SupportPage|buildSupportCalendar/);
    assert.match(source("src/components/Support.tsx"), /SUPPORT_HUB_ROUTE/);
    assert.match(source("src/lib/useStreamSchedule.ts"), /availability/);
    assert.match(page, /useMilyRealtimeStatus\(\)/);
    assert.match(page, /useStreamSchedule\(\)/);
    assert.match(page, /useTokyoNow\(\)/);
    assert.doesNotMatch(page, /fetch\(|setInterval\(|createPollStore/);
    assert.match(page, /role="status" aria-live="polite" aria-atomic="true"/);
  });
});

describe("Support NOW selector", () => {
  const period = {
    state: "confirmed-period",
    start: "2026-08-22T10:00:00+09:00",
    end: "2026-08-22T12:00:00+09:00",
    allDay: false,
    timezone: "Asia/Tokyo",
  };

  function select(events, now, overrides = {}) {
    return selectSupportNow({
      supportEvents: events,
      live: unknownLive,
      radio: null,
      now,
      ...overrides,
    });
  }

  it("includes only a confirmed-period while it is live", () => {
    const event = supportEvent(period, "period");
    assert.equal(select([event], Date.parse(period.start) - 1).length, 0);
    assert.deepEqual(
      select([event], Date.parse("2026-08-22T11:00:00+09:00")).map(({ key }) => key),
      ["now:support-event:period"],
    );
    assert.equal(select([event], Date.parse(period.end) + 1).length, 0);
  });

  it("never promotes a timed instant or date-pending item into NOW", () => {
    const instant = supportEvent(
      {
        state: "confirmed-instant",
        at: "2026-08-22T12:00:00+09:00",
        allDay: false,
        timezone: "Asia/Tokyo",
      },
      "instant",
    );
    const pending = supportEvent({ state: "date-pending" }, "pending");
    for (const now of [
      Date.parse("2026-08-22T11:59:59+09:00"),
      Date.parse("2026-08-22T12:00:00+09:00"),
    ]) {
      assert.equal(select([instant, pending], now).length, 0);
    }
  });

  it("uses the JST civil date for an all-day instant", () => {
    const allDay = supportEvent(
      {
        state: "confirmed-instant",
        at: "2026-08-22",
        allDay: true,
        timezone: "Asia/Tokyo",
      },
      "all-day",
    );
    assert.equal(select([allDay], Date.parse("2026-08-21T23:59:59+09:00")).length, 0);
    assert.equal(select([allDay], Date.parse("2026-08-22T00:00:00+09:00")).length, 1);
    assert.equal(select([allDay], Date.parse("2026-08-22T23:59:59+09:00")).length, 1);
    assert.equal(select([allDay], Date.parse("2026-08-23T00:00:00+09:00")).length, 0);
  });

  it("requires SHOWROOM realtime live and never uses a passed schedule time", () => {
    const now = Date.parse("2026-08-22T12:00:00+09:00");
    const live = {
      ...unknownLive,
      state: "live",
      roomUrl: "https://www.showroom-live.com/example",
    };
    assert.deepEqual(select([], now, { live }).map(({ origin }) => origin), ["showroom-live"]);
    assert.equal(select([], now, { live: { ...unknownLive, state: "offline" } }).length, 0);
    assert.equal(select([], now, { live: unknownLive }).length, 0);
    assert.equal(select([], now).length, 0);
  });

  it("requires a fresh radio confirmation and never infers personal appearance", () => {
    const now = Date.parse("2026-08-23T10:30:00+09:00");
    const fresh = radioFixture(new Date(now).toISOString());
    const stale = radioFixture(new Date(now - 10 * 60 * 1000).toISOString());
    const confirmed = select([], now, { radio: fresh });
    assert.deepEqual(confirmed.map(({ origin }) => origin), ["radio-program"]);
    assert.match(confirmed[0].title, /番組放送中/);
    assert.equal(confirmed[0].note, RADIO_APPEARANCE_NOTE);
    assert.equal(select([], now, { radio: stale }).length, 0);
    assert.equal(select([], now, { radio: radioFixture(new Date(now).toISOString(), null) }).length, 0);
    assert.equal(select([], now, { radio: null }).length, 0);
    const afterWindow = Date.parse("2026-08-23T13:00:00+09:00");
    assert.equal(
      select([], afterWindow, {
        radio: radioFixture(new Date(afterWindow).toISOString()),
      }).length,
      0,
    );
    assert.doesNotMatch(JSON.stringify(confirmed), /みりぃ出演中|みりぃ放送中|みりぃが現在出演/);
  });
});

describe("Support Today and pending separation", () => {
  it("keeps static contest information when the schedule API yields zero slots", () => {
    const today = selectSupportToday({
      contest,
      streamSlots: [],
      streamRoomUrl: null,
      liveRoomUrl: null,
      radioPhase: "idle",
      now: Date.parse("2026-08-22T12:00:00+09:00"),
    });
    assert.ok(today.some(({ activityId }) => activityId === "miss-circle"));
    assert.equal(today.some(({ activityId }) => activityId === "live-stream"), false);
    assert.doesNotMatch(
      source("src/SupportPage.tsx") + source("src/lib/supportHub.ts"),
      /予定なし|本日の配信なし|応援なし/,
    );
  });

  it("shows radio in Today only for today's upcoming or window phase", () => {
    const build = (radioPhase) =>
      selectSupportToday({
        contest: { ...contest, currentPhase: null },
        streamSlots: [],
        streamRoomUrl: null,
        liveRoomUrl: null,
        radioPhase,
        now: Date.parse("2026-08-23T09:00:00+09:00"),
      });
    assert.equal(build("upcoming").some(({ activityId }) => activityId === "radio"), true);
    assert.equal(build("window").some(({ activityId }) => activityId === "radio"), true);
    assert.equal(build("ended").some(({ activityId }) => activityId === "radio"), false);
    assert.equal(build("idle").some(({ activityId }) => activityId === "radio"), false);
  });

  it("shows only a JST-today stream slot in Today", () => {
    const now = Date.parse("2026-08-22T12:00:00+09:00");
    const build = (streamSlots) =>
      selectSupportToday({
        contest: { ...contest, currentPhase: null },
        streamSlots,
        streamRoomUrl: null,
        liveRoomUrl: null,
        radioPhase: "idle",
        now,
      });

    assert.deepEqual(
      build([
        { date: "2026-08-22", time: "20:00" },
        { date: "2026-08-23", time: "10:00" },
      ]).map(({ key }) => key),
      ["today:showroom:2026-08-22T20:00"],
    );
    assert.equal(
      build([{ date: "2026-08-23", time: "10:00" }]).some(
        ({ activityId }) => activityId === "live-stream",
      ),
      false,
    );
  });

  it("skips an ended confirmed slot and renders the next confirmed range", () => {
    const today = selectSupportToday({
      contest: { ...contest, currentPhase: null },
      streamSlots: [
        { date: "2026-08-22", time: "07:30", endTime: "08:00" },
        { date: "2026-08-22", time: "14:40", endTime: "15:20" },
      ],
      streamRoomUrl: null,
      liveRoomUrl: null,
      radioPhase: "idle",
      now: Date.parse("2026-08-22T08:15:00+09:00"),
    });
    const slot = today.find(({ activityId }) => activityId === "live-stream");
    assert.equal(slot?.key, "today:showroom:2026-08-22T14:40");
    assert.equal(slot?.value, "2026.08.22 14:40〜15:20");
    assert.equal(slot?.note, undefined);
  });

  it("puts null contest dates and date-pending SupportEvents only in pending", () => {
    const contestPending = selectSupportPending({
      contest: {
        ...contest,
        currentPhase: contest.currentPhase
          ? { ...contest.currentPhase, start: null, end: null }
          : null,
      },
      supportEvents: [],
    });
    assert.deepEqual(contestPending.map(({ key }) => key), ["contest:current-phase"]);
    assert.equal("date" in contestPending[0], false);

    const event = supportEvent({ state: "date-pending" }, "event-pending");
    const eventPending = selectSupportPending({
      contest: { ...contest, currentPhase: null },
      supportEvents: [event],
    });
    assert.deepEqual(eventPending.map(({ key }) => key), ["support-event:event-pending"]);
    assert.equal("date" in eventPending[0], false);
    assert.equal(
      selectSupportNow({ supportEvents: [event], live: unknownLive, radio: null, now: Date.now() }).length,
      0,
    );
  });

  it("keeps the live contest phase off pending once official dates are confirmed", () => {
    assert.deepEqual(selectSupportPending({ contest, supportEvents: [] }), []);
    assert.equal(contest.currentPhase?.start, "2026-09-03");
    assert.equal(contest.currentPhase?.end, "2026-09-13");
    assert.equal(contest.currentPhase?.source, "https://www.misscircle.jp/");
    assert.doesNotMatch(JSON.stringify(contest.currentPhase), /12:00|05:00|21:59/);
  });

  it("does not create pending when the contest phase has confirmed dates", () => {
    const confirmedContest = {
      ...contest,
      currentPhase: {
        ...contest.currentPhase,
        start: "2026-08-23",
        end: "2026-08-25",
      },
    };
    assert.deepEqual(
      selectSupportPending({ contest: confirmedContest, supportEvents: [] }),
      [],
    );
  });

  it("keeps the confirmed CAMPUS GIRLS Paton voting period in SupportEvents", () => {
    assert.equal(supportEvents.length, 10);
    assert.equal(supportEvents[0].activityId, "campus-girls");
    assert.equal(supportEvents[0].kind, "vote");
    assert.deepEqual(supportEvents[0].schedule, {
      state: "confirmed-period",
      start: "2026-08-26T18:00:00+09:00",
      end: "2026-09-01T23:59:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    });
  });
});
