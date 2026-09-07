import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { contest } from "../src/data/contest.ts";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import {
  links,
  missCircleShowroomEventLink,
  missCircleWebVoteLink,
} from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b58.ts";
import { stories } from "../src/data/stories.ts";
import {
  streamSchedule,
  upcomingSlots,
} from "../src/data/streamSchedule.ts";
import {
  isValidSupportEvent,
  missCircleThirdRoundShowroomReview,
  missCircleThirdRoundWebVote,
  supportEvents,
} from "../src/data/supportEvents.ts";
import {
  THIRD_ROUND_TIMETABLE_SRC,
  thirdRoundTimetableImage,
} from "../src/data/thirdRoundTimetableImage.ts";
import {
  thirdRoundGoalsStoryImage,
  thirdRoundReviewScheduleStoryImage,
  thirdRoundStoryAdditionalMedia,
  thirdRoundSupportMethodStoryVideo,
} from "../src/data/thirdRoundStoryMedia.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { contestOfficialWindowLines, contestPhaseDisplayNote } from "../src/lib/contestPhaseDisplay.ts";
import {
  selectHomeVoteAction,
  selectHomeVoteActions,
  selectHomeVoteSpotlight,
} from "../src/lib/homePortal.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import {
  adaptStreamSlots,
  adaptSupportEvents,
  buildSupportCalendar,
  nextDisplayStatusBoundary,
} from "../src/lib/supportCalendar.ts";
import {
  nextSupportEventBoundary,
  voteStartDayBoundary,
} from "../src/lib/useSupportEventClock.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-09-02-miss-circle-third-round";
const TITLE = "ミスサー三次審査、9/3から9/13";
const BODY = `MISS CIRCLE CONTEST 2026の三次審査が、9月3日から始まります。みりぃはENTRY 734、Bブロックです。

WEB投票は9月3日12:00〜9月13日23:59、SHOWROOMの無料ギフト審査・イベント審査は9月3日5:00〜9月12日21:59です。配信予定は、本人配布のタイムテーブル画像と「応援・予定」で確認できます。予定は変更になる場合があります。`;
const WEB_VOTE_URL =
  "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734";
const SHOWROOM_EVENT_URL = "https://www.showroom-live.com/event/circle2026_3rd";
const SHOWROOM_ROOM_URL = "https://www.showroom-live.com/r/circle2026_0734";
const ENTRY_URL = "https://2026.misscircle.jp/entry/734";
const SCHEDULE_URL = "https://www.misscircle.jp/";
const WEB_START = Date.parse("2026-09-03T12:00:00+09:00");
const WEB_END = Date.parse("2026-09-13T23:59:59+09:00");
const SHOWROOM_START = Date.parse("2026-09-03T05:00:00+09:00");
const SHOWROOM_END = Date.parse("2026-09-12T21:59:59+09:00");
const SPOTLIGHT_DAY_START = Date.parse("2026-09-03T00:00:00+09:00");
const CONTEST_END = Date.parse("2026-09-14T00:00:00+09:00");
const PATON_END = Date.parse("2026-09-01T23:59:00+09:00");
const TIMETABLE_FILE = path.join(root, "public", THIRD_ROUND_TIMETABLE_SRC.slice(1));
const TIMETABLE_SHA256 =
  "bf4d4c5f6396bebe9c4a74ae3a5143d226e2b5a537e46ea30d850fed1dc169f9";
const STORY_MEDIA = [
  {
    file: "public/media/news/mily-b50-01-third-round-goals.jpg",
    sha256: "7be4ce8f9a15d1a80ec2bb0175d8205851f2e9c93f93118cb4fa7b01061cbb48",
    width: 864,
    height: 1536,
  },
  {
    file: "public/media/news/mily-b50-02-third-round-review-schedule.jpg",
    sha256: "ca36e6663e7fc2c1464706d966109893972315b1d1a36a6d9dd76ec02fc904f4",
    width: 864,
    height: 1536,
  },
  {
    file: "public/media/news/mily-b50-03-third-round-support-method-poster.jpg",
    sha256: "3786b3ec766fd4de224bcd030590a583119ccc35122c6383d358686d9d7bf36e",
    width: 512,
    height: 910,
  },
  {
    file: "public/media/news/mily-b50-03-third-round-support-method.mp4",
    sha256: "7e90c1ff29f88ade92a9cec6a30a285255f7fcaf9eacdda99b18f4fa37010930",
  },
];
const EXPECTED_SLOTS = [
  { date: "2026-09-03", time: "07:30", endTime: "08:00" },
  { date: "2026-09-03", time: "14:40", endTime: "15:20" },
  { date: "2026-09-03", time: "21:00", endTime: "21:50" },
  { date: "2026-09-04", time: "07:00", endTime: "07:40" },
  { date: "2026-09-04", time: "14:50", endTime: "15:10" },
  { date: "2026-09-04", time: "22:30", endTime: "23:30" },
  { date: "2026-09-05", time: "09:00", endTime: "09:20" },
  { date: "2026-09-05", time: "14:30", endTime: "15:20" },
  { date: "2026-09-05", time: "21:00", endTime: "21:50" },
  { date: "2026-09-06", time: "05:30", endTime: "07:00" },
  { date: "2026-09-06", time: "21:30" },
  { date: "2026-09-07", time: "06:30", endTime: "07:30" },
  { date: "2026-09-07", time: "22:00", endTime: "23:00" },
  { date: "2026-09-08", time: "07:00", endTime: "08:00" },
  {
    date: "2026-09-09",
    time: "00:00",
    endTime: "01:00",
    note: "本人表記 24:00-25:00（9/9 0:00-1:00）",
  },
  { date: "2026-09-09", time: "10:00", endTime: "11:00" },
  { date: "2026-09-09", time: "14:40", endTime: "15:20" },
  { date: "2026-09-09", time: "21:30", endTime: "21:50" },
  { date: "2026-09-11", time: "10:00", endTime: "10:30" },
  { date: "2026-09-11", time: "14:50", endTime: "15:20" },
  { date: "2026-09-11", time: "21:00", endTime: "22:00" },
  { date: "2026-09-12", time: "08:00", endTime: "08:30" },
  { date: "2026-09-12", time: "14:40", endTime: "15:10" },
  { date: "2026-09-12", time: "21:00", endTime: "22:00" },
];

function entry() {
  return news.find((item) => item.id === NEWS_ID);
}

describe("2026-09-02 MISS CIRCLE 三次審査 NEWS + calendar", () => {
  it("keeps one concise NEWS item above the two 9/2 Story cards", () => {
    const item = entry();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(item);
    assert.equal(item.date, "2026-09-02");
    assert.equal(item.sameDayOrder, 10);
    assert.deepEqual(item.activityIds, ["miss-circle"]);
    assert.equal(item.title, TITLE);
    assert.equal(item.body, BODY);
    assert.equal(news.filter(({ id }) => id === NEWS_ID).length, 1);
    assert.equal(news.length, 75);
    assert.equal(ordered[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(ordered[1], item);
    assert.equal(ordered[2]?.id, "2026-09-02-oyasumily-sr-story");
    assert.equal(ordered[3]?.id, "2026-09-02-paton-second-story");
    assert.deepEqual(verifyNews([item]), []);
    assert.doesNotMatch(`${item.title}\n${item.body}`, /JST|live|作業メモ|公式|公認/i);
    assert.ok(item.body.length <= 220);
    assert.doesNotMatch(
      item.body,
      /CanCamモデル発掘|オリジナルアバター|AGESTOCK|横浜アリーナ|9\/3（木）|未定|昼枠なし/,
    );
    assert.doesNotMatch(item.body, /一票で届ける|贈れます|遊びに来て|応援よろしく/);
  });

  it("uses confirmed organizer links only and the owner-provided timetable still", async () => {
    const item = entry();
    assert.equal(item.source, SCHEDULE_URL);
    assert.equal(item.sourceLabel, "MISS CIRCLE CONTEST 2026");
    assert.deepEqual(item.additionalSources, [
      { label: "ENTRY 734", url: ENTRY_URL },
      { label: "SHOWROOMイベント", url: SHOWROOM_EVENT_URL },
    ]);
    assert.equal(item.relatedUrl, WEB_VOTE_URL);
    assert.equal(item.ctaLabel, "WEB投票する");
    assert.deepEqual(item.additionalCtas, [
      { label: "ENTRY 734", url: ENTRY_URL },
      { label: "SHOWROOMイベント", url: SHOWROOM_EVENT_URL },
      { label: "SHOWROOM", url: SHOWROOM_ROOM_URL },
    ]);
    assert.equal(item.media, thirdRoundTimetableImage);
    assert.deepEqual(item.additionalMedia, [...thirdRoundStoryAdditionalMedia]);
    assert.deepEqual(item.additionalMedia, [
      thirdRoundGoalsStoryImage,
      thirdRoundReviewScheduleStoryImage,
      thirdRoundSupportMethodStoryVideo,
    ]);
    assert.equal(item.message, undefined);
    assert.equal(thirdRoundTimetableImage.src, THIRD_ROUND_TIMETABLE_SRC);
    assert.equal(thirdRoundTimetableImage.width, 1206);
    assert.equal(thirdRoundTimetableImage.height, 950);
    assert.equal(
      thirdRoundTimetableImage.alt,
      "みりぃの配信タイムテーブル（ミスサークルコンテスト2026 3次審査）",
    );
    assert.equal(thirdRoundTimetableImage.published, true);
    assert.equal(thirdRoundTimetableImage.provenance, "owner-provided");
    assert.equal(thirdRoundTimetableImage.sourceUrl, null);
    for (const mediaItem of item.additionalMedia) {
      assert.equal(mediaItem.published, true);
      assert.equal(mediaItem.provenance, "owner-provided");
      assert.equal(mediaItem.sourceDate, "2026-09-03");
      assert.equal(mediaItem.sourceUrl, null);
    }
    assert.equal(existsSync(TIMETABLE_FILE), true, TIMETABLE_FILE);
    assert.equal(
      existsSync(
        path.join(
          root,
          "public/media/news/mily-b49-01-third-round-timetable.jpg",
        ),
      ),
      false,
    );
    assert.equal(
      createHash("sha256").update(await readFile(TIMETABLE_FILE)).digest("hex"),
      TIMETABLE_SHA256,
    );
    const metadata = await sharp(TIMETABLE_FILE).metadata();
    assert.equal(metadata.format, "jpeg");
    assert.equal(metadata.width, 1206);
    assert.equal(metadata.height, 950);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
    assert.ok((await stat(TIMETABLE_FILE)).size > 0);
    for (const expected of STORY_MEDIA) {
      const file = path.join(root, expected.file);
      assert.equal(existsSync(file), true, file);
      assert.equal(
        createHash("sha256").update(await readFile(file)).digest("hex"),
        expected.sha256,
      );
      if (expected.width && expected.height) {
        const metadata = await sharp(file).metadata();
        assert.equal(metadata.width, expected.width);
        assert.equal(metadata.height, expected.height);
        assert.equal(metadata.exif, undefined);
        assert.equal(metadata.iptc, undefined);
        assert.equal(metadata.xmp, undefined);
        assert.equal(metadata.icc, undefined);
      }
    }
    assert.equal(media.some((entry) => String(entry.id).includes("b49")), false);
    assert.equal(
      galleryVideos.some((entry) => String(entry.id ?? "").includes("b49")),
      false,
    );
    assert.equal(
      existsSync(
        path.join(root, "public/media/gallery/mily-b49-01-third-round-timetable-480.jpg"),
      ),
      false,
    );
    assert.equal(
      stories.some((story) => JSON.stringify(story).includes("b49")),
      false,
    );
  });

  it("surfaces the item on the miss-circle Activity only", () => {
    const missNews = selectActivityNews("miss-circle", news, news.length);
    assert.equal(missNews[0]?.id, "2026-09-03-miss-circle-goals-support");
    assert.equal(missNews[1]?.id, NEWS_ID);
    for (const activityId of ["live-stream", "campus-girls", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (item) => item.id === NEWS_ID,
        ),
        false,
      );
    }
  });

  it("registers timed SupportEvents that the monthly calendar actually reads", () => {
    assert.equal(isValidSupportEvent(missCircleThirdRoundWebVote), true);
    assert.equal(isValidSupportEvent(missCircleThirdRoundShowroomReview), true);
    assert.equal(missCircleThirdRoundWebVote.activityId, "miss-circle");
    assert.equal(missCircleThirdRoundWebVote.kind, "vote");
    assert.equal(
      missCircleThirdRoundWebVote.shareText,
      "MISS CIRCLE CONTEST 2026 3次審査のWEB投票をお願いします🗳️",
    );
    assert.equal(
      missCircleThirdRoundWebVote.shareHashtag,
      "#ミスサークル2026",
    );
    assert.deepEqual(missCircleThirdRoundWebVote.schedule, {
      state: "confirmed-period",
      start: "2026-09-03T12:00:00+09:00",
      end: "2026-09-13T23:59:59+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    });
    assert.equal(missCircleThirdRoundWebVote.ctaLinkId, missCircleWebVoteLink.id);
    assert.equal(missCircleWebVoteLink.url, WEB_VOTE_URL);
    assert.equal(missCircleThirdRoundShowroomReview.activityId, "miss-circle");
    assert.equal(missCircleThirdRoundShowroomReview.kind, "stream-event");
    assert.deepEqual(missCircleThirdRoundShowroomReview.schedule, {
      state: "confirmed-period",
      start: "2026-09-03T05:00:00+09:00",
      end: "2026-09-12T21:59:59+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    });
    assert.equal(
      missCircleThirdRoundShowroomReview.ctaLinkId,
      missCircleShowroomEventLink.id,
    );
    assert.equal(missCircleShowroomEventLink.url, SHOWROOM_EVENT_URL);
    assert.equal(
      supportEvents.filter((event) => event.id === missCircleThirdRoundWebVote.id)
        .length,
      1,
    );
    assert.equal(
      supportEvents.filter(
        (event) => event.id === missCircleThirdRoundShowroomReview.id,
      ).length,
      1,
    );
    assert.equal(supportEvents.filter((event) => event.kind === "vote").length, 2);
    assert.equal(events.length, 0);
  });

  it("puts both periods and the personal SHOWROOM slots on the calendar", () => {
    const calendar = buildSupportCalendar({
      contest,
      supportEvents,
      fanEvents: events,
      streamSlots: streamSchedule,
      streamAvailability: "ok",
      includeRadio: false,
      now: Date.parse("2026-09-02T12:00:00+09:00"),
      daysAhead: 14,
    });
    const items = calendar.days.flatMap((day) => day.items);
    const web = items.find((item) => item.key === "support-event:miss-circle-2026-3rd-web-vote");
    const showroom = items.find(
      (item) => item.key === "support-event:miss-circle-2026-3rd-showroom-review",
    );
    const phase = items.find((item) => item.key === "contest:current-phase");
    const showroomSlots = items.filter((item) => item.origin === "showroom-schedule");

    assert.ok(web);
    assert.equal(web.date, "2026-09-03");
    assert.equal(web.startTime, "12:00");
    assert.equal(web.endTime, "23:59");
    assert.equal(web.endDate, "2026-09-13");
    assert.equal(web.title, "WEB投票");
    assert.equal(web.activityId, "miss-circle");
    assert.ok(showroom);
    assert.equal(showroom.date, "2026-09-03");
    assert.equal(showroom.startTime, "05:00");
    assert.equal(showroom.endTime, "21:59");
    assert.equal(showroom.endDate, "2026-09-12");
    assert.equal(showroom.title, "SHOWROOM無料ギフト審査・イベント審査");
    assert.ok(phase);
    assert.equal(phase.date, "2026-09-03");
    assert.equal(phase.endDate, "2026-09-13");
    assert.equal(phase.allDay, true);
    assert.equal(showroomSlots.length, EXPECTED_SLOTS.length);
    assert.deepEqual(
      showroomSlots.map((item) => ({
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        note: item.note,
      })),
      EXPECTED_SLOTS.map((slot) => ({
        date: slot.date,
        startTime: slot.time,
        endTime: slot.endTime ?? null,
        note: slot.note,
      })),
    );
    assert.equal(
      items.some((item) => /AGESTOCK|横浜アリーナ|通過発表|会場三次/.test(item.title)),
      false,
    );
  });

  it("gates the WEB vote CTA to the confirmed window and keeps ENTRY 734", () => {
    const item = entry();
    const before = resolveNewsLinks(item, WEB_START - 1);
    const finalMinute = Date.parse("2026-09-13T23:59:30+09:00");
    const during = resolveNewsLinks(item, WEB_START);
    const after = resolveNewsLinks(item, WEB_END + 1);

    assert.equal(before.cta, undefined);
    assert.equal(
      (before.additionalCtas ?? []).some((cta) => cta.url === WEB_VOTE_URL),
      false,
    );
    assert.deepEqual(during.cta, { label: "WEB投票する", url: WEB_VOTE_URL });
    assert.deepEqual(
      resolveNewsLinks(item, finalMinute).cta,
      { label: "WEB投票する", url: WEB_VOTE_URL },
    );
    assert.equal(after.cta, undefined);

    const voteAt = (now) =>
      selectHomeVoteActions({ contest, supportEvents, links, now }).map(
        ({ kind, url }) => ({ kind, url }),
      );
    assert.deepEqual(voteAt(WEB_START - 1), [
      { kind: "contest", url: contest.entryUrl },
    ]);
    assert.deepEqual(voteAt(WEB_START), [
      { kind: "support-event", url: WEB_VOTE_URL },
      { kind: "contest", url: contest.entryUrl },
    ]);
    assert.deepEqual(voteAt(WEB_END + 1), [
      { kind: "contest", url: contest.entryUrl },
    ]);
    assert.deepEqual(voteAt(finalMinute), [
      { kind: "support-event", url: WEB_VOTE_URL },
      { kind: "contest", url: contest.entryUrl },
    ]);
    assert.equal(
      selectHomeVoteAction({
        contest,
        supportEvents,
        links,
        now: WEB_START,
      }).url,
      WEB_VOTE_URL,
    );
  });

  it("spotlights today's 12:00 launch, then switches to the direct WEB vote", async () => {
    const spotlightAt = (now) =>
      selectHomeVoteSpotlight({ contest, supportEvents, links, now });
    const previousDay = spotlightAt(Date.parse("2026-09-02T23:59:59+09:00"));
    const before = spotlightAt(Date.parse("2026-09-03T11:59:59+09:00"));
    const during = spotlightAt(WEB_START);
    const after = spotlightAt(WEB_END + 1);

    assert.equal(previousDay, null);
    assert.equal(before?.state, "upcoming");
    assert.equal(before?.eyebrow, "3次審査・本日スタート");
    assert.equal(before?.title, "本日12:00からWEB投票");
    assert.equal(before?.action.label, "開始前にENTRY 734を見る");
    assert.equal(before?.action.mobileLabel, "12:00 投票開始");
    assert.equal(before?.action.url, ENTRY_URL);
    assert.doesNotMatch(JSON.stringify(before), /liff\.line\.me/);

    assert.equal(during?.state, "live");
    assert.equal(during?.eyebrow, "3次審査・WEB投票");
    assert.equal(during?.title, "WEB投票受付中");
    assert.equal(during?.action.label, "ENTRY 734に投票する");
    assert.equal(during?.action.mobileLabel, "WEB投票する");
    assert.equal(during?.action.url, WEB_VOTE_URL);
    assert.match(during?.note ?? "", /9\/13 23:59/);
    assert.equal(after, null);

    const spotlight = await readFile(
      path.join(root, "src/components/VoteSpotlight.tsx"),
      "utf8",
    );
    const hero = await readFile(path.join(root, "src/components/Hero.tsx"), "utf8");
    const dock = await readFile(
      path.join(root, "src/components/MobileActionDock.tsx"),
      "utf8",
    );
    const support = await readFile(path.join(root, "src/SupportPage.tsx"), "utf8");
    assert.match(spotlight, /data-vote-state=\{spotlight\.state\}/);
    assert.match(spotlight, /border-2 border-apricot/);
    assert.match(spotlight, /bg-apricot-ink[^\n]+text-white/);
    assert.match(hero, /<VoteSpotlight/);
    assert.match(hero, /headingAs="p"/);
    assert.match(support, /<VoteSpotlight/);
    assert.match(dock, /spotlight\?\.action\.mobileLabel/);
    assert.match(dock, /const additionalVoteActions = voteActions\.filter/);
  });

  it("aligns the shared clock with #131 contest end and the new review bounds", () => {
    const snsStart = Date.parse("2026-09-07T12:00:00+09:00");
    const snsEnd = Date.parse("2026-09-20T12:00:00+09:00");
    const patonExStart = Date.parse("2026-09-16T18:00:00+09:00");
    const patonExEnd = Date.parse("2026-09-22T23:59:00+09:00");
    const vol2Start = Date.parse("2026-09-28T12:00:00+09:00");
    assert.equal(nextSupportEventBoundary(PATON_END + 1), SPOTLIGHT_DAY_START);
    assert.equal(nextSupportEventBoundary(SPOTLIGHT_DAY_START), SHOWROOM_START);
    assert.equal(nextDisplayStatusBoundary(missCircleThirdRoundShowroomReview.schedule, SHOWROOM_START - 1), SHOWROOM_START);
    assert.equal(nextSupportEventBoundary(SHOWROOM_START), WEB_START);
    assert.equal(nextSupportEventBoundary(WEB_START), snsStart);
    assert.equal(nextSupportEventBoundary(snsStart), SHOWROOM_END + 1);
    assert.equal(nextSupportEventBoundary(SHOWROOM_END + 1), WEB_END + 1);
    assert.equal(nextSupportEventBoundary(WEB_END + 1), CONTEST_END);
    assert.equal(nextSupportEventBoundary(CONTEST_END - 1), CONTEST_END);
    assert.equal(nextSupportEventBoundary(CONTEST_END), patonExStart);
    assert.equal(nextSupportEventBoundary(patonExStart), snsEnd + 1);
    assert.equal(nextSupportEventBoundary(snsEnd), snsEnd + 1);
    assert.equal(nextSupportEventBoundary(snsEnd + 1), patonExEnd + 1);
    assert.equal(nextSupportEventBoundary(patonExEnd + 1), vol2Start);
  });

  it("derives the vote start day from the Tokyo instant, not the timestamp text", () => {
    const startDay = Date.parse("2026-09-04T00:00:00+09:00");
    assert.equal(
      voteStartDayBoundary(
        {
          state: "confirmed-period",
          start: "2026-09-03T18:00:00Z",
          end: "2026-09-04T20:00:00Z",
          allDay: false,
          timezone: "Asia/Tokyo",
        },
        startDay - 1,
      ),
      startDay,
    );
  });

  it("keeps ContestPhase date-only and the confirmed personal SHOWROOM slots", async () => {
    assert.equal(contest.currentPhase?.name, "3次審査");
    assert.equal(contest.currentPhase?.start, "2026-09-03");
    assert.equal(contest.currentPhase?.end, "2026-09-13");
    assert.equal(contest.lastVerifiedAt, "2026-09-03");
    assert.doesNotMatch(JSON.stringify(contest.currentPhase), /12:00|05:00|21:59/);
    assert.deepEqual(contestOfficialWindowLines(contest.currentPhase), [
      "WEB投票 9/3 12:00〜9/13 23:59",
      "SHOWROOM無料ギフト審査 9/3 5:00〜9/12 21:59",
      "SHOWROOMイベント審査 9/3 5:00〜9/12 21:59",
      "SHOWROOMは9/12 21:59終了",
    ]);
    assert.match(contestPhaseDisplayNote(contest.currentPhase), /3次審査（9\/3〜9\/13）/);
    assert.deepEqual(streamSchedule, EXPECTED_SLOTS);
    assert.ok(
      streamSchedule.some(
        (slot) =>
          slot.date === "2026-09-07" &&
          slot.time === "06:30" &&
          slot.endTime === "07:30",
      ),
    );
    assert.ok(
      streamSchedule.some(
        (slot) =>
          slot.date === "2026-09-07" &&
          slot.time === "22:00" &&
          slot.endTime === "23:00",
      ),
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-10"),
      false,
    );
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-08" && slot.time.startsWith("14")),
      false,
    );
    assert.ok(
      streamSchedule.some((slot) => slot.date === "2026-09-08" && slot.time === "07:00"),
    );
    assert.ok(
      streamSchedule.some(
        (slot) =>
          slot.date === "2026-09-09" &&
          slot.time === "00:00" &&
          slot.endTime === "01:00" &&
          slot.note === "本人表記 24:00-25:00（9/9 0:00-1:00）",
      ),
    );
    const afterFirstEnd = upcomingSlots(
      streamSchedule,
      [],
      Date.parse("2026-09-03T08:15:00+09:00"),
    );
    assert.equal(afterFirstEnd[0]?.time, "14:40");
    assert.equal(
      afterFirstEnd.some(
        (slot) => slot.date === "2026-09-03" && slot.time === "07:30",
      ),
      false,
    );
    assert.equal(events.length, 0);

    const serialized = JSON.stringify({
      news: entry(),
      supportEvents: supportEvents.filter((event) =>
        event.id.startsWith("miss-circle-2026-3rd"),
      ),
      contest,
    });
    assert.doesNotMatch(serialized, /2026-09-02T20:00:00\+09:00/);
    assert.doesNotMatch(serialized, /2026-09-12T12:59/);
    assert.doesNotMatch(serialized, /通過発表|会場三次/);
    assert.doesNotMatch(serialized, /09-02T20:00|12:59:00/);
    assert.doesNotMatch(
      entry().body,
      /CanCamモデル発掘|オリジナルアバター|AGESTOCK|横浜アリーナ|MISCOLLEステージ/,
    );

    const calendarPayload = JSON.stringify({
      supportEvents: supportEvents.filter((event) =>
        event.id.startsWith("miss-circle-2026-3rd"),
      ),
      events,
      streamSchedule,
    });
    assert.doesNotMatch(calendarPayload, /AGESTOCK|横浜アリーナ|通過発表|会場三次/);
    assert.doesNotMatch(calendarPayload, /2026-09-02T20:00|2026-09-12T12:59/);

    const calendarCtas = adaptSupportEvents(supportEvents, WEB_START).items;
    assert.equal(
      calendarCtas.some((item) =>
        /ヘッダー|通過発表|AGESTOCK|会場三次/.test(item.title),
      ),
      false,
    );
    const adapted = adaptStreamSlots(streamSchedule);
    assert.deepEqual(
      adapted.map((item) => item.endTime),
      EXPECTED_SLOTS.map((slot) => slot.endTime ?? null),
    );
    assert.equal(adapted.every((item) => item.origin === "showroom-schedule"), true);

    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    assert.match(
      latest,
      /whitespace-pre-line text-sm leading-relaxed text-ink-muted">\{item\.body\}/,
    );

    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const start = ops.indexOf("### 2026-09-02 ミスサー三次審査 NEWS と Calendar");
    const end = ops.indexOf("### 2026-09-02 Instagram Story おやすみりぃ・パトン2位");
    assert.notEqual(start, -1);
    assert.notEqual(end, -1);
    const section = ops.slice(start, end);
    assert.match(section, /sameDayOrder: 10/);
    assert.match(section, /supportEvents\.ts/);
    assert.match(section, /events\.ts[`\s]+は空のまま/);
    assert.match(section, /SHOWROOMヘッダー枠/);
    assert.match(section, /streamSchedule\.ts/);
    assert.doesNotMatch(section, /#133|copy-tweak|title\/body/);
    assert.doesNotMatch(section, /9\/2 20:00〜9\/12 12:59 を載せる/);
  });
});
