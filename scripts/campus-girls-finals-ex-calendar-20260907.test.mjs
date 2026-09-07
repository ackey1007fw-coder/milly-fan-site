import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contest } from "../src/data/contest.ts";
import { events } from "../src/data/events.ts";
import {
  CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL,
} from "../src/data/campusGirlsFinalsExImages.ts";
import {
  campusGirlsFinalsExFive,
  campusGirlsFinalsExFour,
  campusGirlsFinalsExPatonReview,
  campusGirlsFinalsExSix,
  campusGirlsFinalsExSnsReview,
  campusGirlsFinalsExThree,
  campusGirlsFinalsExTwo,
  isValidSupportEvent,
  supportEvents,
} from "../src/data/supportEvents.ts";
import {
  adaptSupportEvents,
  buildSupportCalendar,
  displayStatus,
} from "../src/lib/supportCalendar.ts";
import { expandScheduleItemsByDate } from "../src/lib/monthCalendar.ts";
import { nextSupportEventBoundary } from "../src/lib/useSupportEventClock.ts";
import { siteShareText } from "../src/lib/siteShare.ts";

const SOURCE = CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL;
const SNS_START = Date.parse("2026-09-07T12:00:00+09:00");
const SNS_END = Date.parse("2026-09-20T12:00:00+09:00");
const PATON_START = Date.parse("2026-09-16T18:00:00+09:00");
const PATON_END = Date.parse("2026-09-22T23:59:00+09:00");
const VOL2_START = Date.parse("2026-09-28T12:00:00+09:00");
const VOL2_END = Date.parse("2026-10-11T12:00:00+09:00");
const VOL6_END = Date.parse("2027-01-03T12:00:00+09:00");
const CONTEST_END = Date.parse("2026-09-14T00:00:00+09:00");

const laterVolumes = [
  campusGirlsFinalsExTwo,
  campusGirlsFinalsExThree,
  campusGirlsFinalsExFour,
  campusGirlsFinalsExFive,
  campusGirlsFinalsExSix,
];

function calendarAt(now) {
  return buildSupportCalendar({
    contest,
    supportEvents,
    fanEvents: events,
    streamSlots: [],
    streamAvailability: "ok",
    includeRadio: false,
    now,
    daysAhead: 14,
  });
}

function titlesOn(date, now = SNS_START) {
  const grouped = expandScheduleItemsByDate(calendarAt(now).days);
  return (grouped.get(date) ?? [])
    .filter((item) => item.origin === "support-event")
    .map((item) => item.title);
}

describe("CAMPUS GIRLS 本選EX 日程をカレンダーへ", () => {
  it("keeps the existing SNS period and adds Paton plus vol.2–6 from the same X graphic", () => {
    assert.equal(isValidSupportEvent(campusGirlsFinalsExPatonReview), true);
    for (const volume of laterVolumes) {
      assert.equal(isValidSupportEvent(volume), true, volume.id);
    }

    assert.equal(campusGirlsFinalsExSnsReview.ctaLinkId, undefined);
    assert.equal(campusGirlsFinalsExPatonReview.ctaLinkId, undefined);
    assert.equal(campusGirlsFinalsExPatonReview.kind, "support-campaign");
    assert.equal(campusGirlsFinalsExPatonReview.shareText, undefined);
    assert.deepEqual(campusGirlsFinalsExPatonReview.schedule, {
      state: "confirmed-period",
      start: "2026-09-16T18:00:00+09:00",
      end: "2026-09-22T23:59:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    });

    assert.deepEqual(
      laterVolumes.map((volume) => ({
        id: volume.id,
        title: volume.title,
        start: volume.schedule.start,
        end: volume.schedule.end,
      })),
      [
        {
          id: "campus-girls-finals-ex-vol-2-2026",
          title: "CAMPUS GIRLS 2027 本選EX vol.2",
          start: "2026-09-28T12:00:00+09:00",
          end: "2026-10-11T12:00:00+09:00",
        },
        {
          id: "campus-girls-finals-ex-vol-3-2026",
          title: "CAMPUS GIRLS 2027 本選EX vol.3",
          start: "2026-10-19T12:00:00+09:00",
          end: "2026-11-01T12:00:00+09:00",
        },
        {
          id: "campus-girls-finals-ex-vol-4-2026",
          title: "CAMPUS GIRLS 2027 本選EX vol.4",
          start: "2026-11-09T12:00:00+09:00",
          end: "2026-11-22T12:00:00+09:00",
        },
        {
          id: "campus-girls-finals-ex-vol-5-2026",
          title: "CAMPUS GIRLS 2027 本選EX vol.5",
          start: "2026-11-30T12:00:00+09:00",
          end: "2026-12-13T12:00:00+09:00",
        },
        {
          id: "campus-girls-finals-ex-vol-6-2026",
          title: "CAMPUS GIRLS 2027 本選EX vol.6",
          start: "2026-12-21T12:00:00+09:00",
          end: "2027-01-03T12:00:00+09:00",
        },
      ],
    );

    for (const event of [campusGirlsFinalsExPatonReview, ...laterVolumes]) {
      assert.equal(event.source, SOURCE);
      assert.equal(event.verifiedAt, "2026-09-07");
      assert.equal(event.activityId, "campus-girls");
      assert.equal(event.ctaLinkId, undefined);
      assert.equal(event.shareText, undefined);
      assert.equal(event.shareHashtag, undefined);
      assert.doesNotMatch(event.title + event.note, /公式|公認|本人運営/);
      assert.equal(event.note.toLowerCase().includes("millie"), false);
    }

    assert.equal(supportEvents.length, 10);
    assert.equal(supportEvents.filter((event) => event.kind === "vote").length, 2);
    assert.deepEqual(events, []);
  });

  it("shows the overlapping vol.1 windows and the later volumes on the month grid", () => {
    const sept7 = titlesOn("2026-09-07");
    assert.equal(
      sept7.includes("CAMPUS GIRLS 2027 本選EX vol.1 SNS審査"),
      true,
    );
    assert.equal(
      sept7.includes("CAMPUS GIRLS 2027 本選EX vol.1 Paton投票審査"),
      false,
    );

    const sept16 = titlesOn("2026-09-16");
    assert.deepEqual(
      sept16.filter((title) => title.includes("本選EX")),
      [
        "CAMPUS GIRLS 2027 本選EX vol.1 SNS審査",
        "CAMPUS GIRLS 2027 本選EX vol.1 Paton投票審査",
      ],
    );

    const sept21 = titlesOn("2026-09-21");
    assert.equal(sept21.includes("CAMPUS GIRLS 2027 本選EX vol.1 SNS審査"), false);
    assert.equal(
      sept21.includes("CAMPUS GIRLS 2027 本選EX vol.1 Paton投票審査"),
      true,
    );
    assert.equal(sept21.includes("CAMPUS GIRLS 2027 本選EX vol.2"), false);

    const sept28 = titlesOn("2026-09-28");
    assert.equal(sept28.includes("CAMPUS GIRLS 2027 本選EX vol.2"), true);
    assert.equal(
      sept28.includes("CAMPUS GIRLS 2027 本選EX vol.1 Paton投票審査"),
      false,
    );

    const jan3 = titlesOn("2027-01-03", Date.parse("2026-12-21T12:00:00+09:00"));
    assert.equal(jan3.includes("CAMPUS GIRLS 2027 本選EX vol.6"), true);

    const adapted = adaptSupportEvents(supportEvents, SNS_START).items;
    for (const item of adapted.filter((entry) => entry.title.includes("本選EX"))) {
      assert.equal(item.cta, undefined);
      assert.equal(item.source, SOURCE);
      assert.equal(item.allDay, false);
    }
  });

  it("does not invent a Paton vote button or take over the share hashtag", () => {
    assert.equal(displayStatus(campusGirlsFinalsExPatonReview.schedule, PATON_START - 1), "upcoming");
    assert.equal(displayStatus(campusGirlsFinalsExPatonReview.schedule, PATON_START), "live");
    assert.equal(displayStatus(campusGirlsFinalsExPatonReview.schedule, PATON_END), "live");
    assert.equal(displayStatus(campusGirlsFinalsExPatonReview.schedule, PATON_END + 1), "ended");

    const duringOverlap = siteShareText({
      now: Date.parse("2026-09-07T12:00:00+09:00"),
      radioPhase: "idle",
    });
    assert.match(duringOverlap, /WEB投票をお願いします/);
    assert.match(duringOverlap, /#三橋莉子 #ミスサークル2026$/);
    assert.doesNotMatch(duringOverlap, /#キャンガル$/m);

    const afterWebVote = siteShareText({
      now: Date.parse("2026-09-17T12:00:00+09:00"),
      radioPhase: "idle",
    });
    assert.match(afterWebVote, /本選EX vol\.1のSNS審査期間/);
    assert.doesNotMatch(afterWebVote, /Paton投票審査/);
    assert.match(afterWebVote, /#三橋莉子 #キャンガル$/);
  });

  it("extends the shared clock through Paton and vol.2 without a vote CTA", () => {
    assert.equal(nextSupportEventBoundary(CONTEST_END), PATON_START);
    assert.equal(nextSupportEventBoundary(PATON_START), SNS_END + 1);
    assert.equal(nextSupportEventBoundary(SNS_END), SNS_END + 1);
    assert.equal(nextSupportEventBoundary(SNS_END + 1), PATON_END + 1);
    assert.equal(nextSupportEventBoundary(PATON_END + 1), VOL2_START);
    assert.equal(nextSupportEventBoundary(VOL2_START), VOL2_END + 1);
    assert.equal(nextSupportEventBoundary(VOL6_END), VOL6_END + 1);
    assert.equal(nextSupportEventBoundary(VOL6_END + 1), null);
  });
});
