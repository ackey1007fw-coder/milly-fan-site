import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { radioProgram } from "../shared/radio-program.js";
import { contest } from "../src/data/contest.ts";
import { links } from "../src/data/links.ts";
import { mixchFinalDayMovie } from "../src/data/mixchMovies.ts";
import { news } from "./fixtures/news-before-b58.ts";
import {
  MIXCH_FINAL_DAY_NEWS_ID,
  PATON_FIFTEEN_X_NEWS_IDS,
} from "../src/data/patonVoteBonus.ts";
import { supportEvents } from "../src/data/supportEvents.ts";
import {
  GALLERY_ARCHIVE_INITIAL,
  HOME_GALLERY_LIMIT,
  selectHomeVoteAction,
} from "../src/lib/homePortal.ts";
import {
  cinemaEventKey,
  isDrivePortraitPhoto,
  isMilyPortraitPhoto,
  isObjectWithoutPerson,
  isRadioTrioPhoto,
  isShowroomUiScreenshot,
  isSkyOrLandscapePhoto,
  pickHomeGalleryPreview,
  selectGalleryEntries,
  selectGalleryPreview,
} from "../src/lib/galleryItems.ts";
import * as galleryBeforeLaterBatches from "./fixtures/gallery-items-before-b41.ts";
import { selectHomeToday } from "../src/lib/homeToday.ts";
import { selectHomeHeroNews } from "../src/lib/patonVoteLiveCopy.ts";
import { siteShareText } from "../src/lib/siteShare.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");
const PATON_URL = "https://paton.jp/event/entrant/11380";
const START = Date.parse("2026-08-26T18:00:00+09:00");
const BONUS_START = Date.parse("2026-08-31T00:00:00+09:00");
const BONUS_END = Date.parse("2026-08-31T23:59:00+09:00");
const END = Date.parse("2026-09-01T23:59:00+09:00");
const FIFTEEN_X = /1\.5x|1\.5倍/;
const MIXCH_LIVE = /mixch\.tv|今日が最終日/;

const unknownLive = {
  state: "unknown",
  startedAt: null,
  observedAt: null,
  roomUrl: null,
  next: { state: "unknown", at: null },
};

const NONE_BANNER = { kind: "NONE", stateLabel: "", title: "" };

function homeToday(now, overrides = {}) {
  return selectHomeToday({
    contest,
    supportEvents,
    streamSlots: [],
    streamRoomUrl: null,
    live: unknownLive,
    radio: null,
    radioPhase: "idle",
    banner: NONE_BANNER,
    now,
    ...overrides,
  });
}

function radioOnAir(now) {
  return {
    ok: true,
    programName: radioProgram.programName,
    todayScheduled: true,
    scheduledStart: radioProgram.scheduledStart,
    scheduledEnd: radioProgram.scheduledEnd,
    inScheduledWindow: true,
    schedulePhase: "window",
    nextStartAt: null,
    onAirConfirmed: true,
    milyAppearanceConfirmed: null,
    listenUrl: radioProgram.listenUrl,
    sourceUrl: radioProgram.nowOnAirSourceUrl,
    lastVerifiedAt: radioProgram.lastVerifiedAt,
    updatedAt: new Date(now).toISOString(),
  };
}

describe("HOME 今日のみりぃ — Paton vote window", () => {
  it("makes Paton the now-path primary CTA with a JST deadline during the window", () => {
    const during = homeToday(START);
    const vote = during.voteActions[0];
    const nowVote = during.nowItems.find((item) => item.cta?.url === PATON_URL);

    assert.equal(vote.kind, "support-event");
    assert.equal(vote.label, "Patonでみりぃに投票する");
    assert.equal(vote.url, PATON_URL);
    assert.match(vote.deadlineLabel ?? "", /投票締切/);
    assert.match(vote.deadlineLabel ?? "", /JST/);
    assert.ok(nowVote);
    assert.equal(nowVote.cta?.label, "Patonでみりぃに投票する");
    assert.match(nowVote.note ?? "", /投票締切/);
    assert.match(nowVote.note ?? "", /JST/);
    assert.equal(
      during.nowItems.filter((item) => item.cta?.url === PATON_URL).length,
      1,
    );
    assert.equal(
      during.voteActions.filter((action) => action.url === PATON_URL).length,
      1,
    );
  });

  it("does not leave a dead Paton button after 9/1 23:59 JST", () => {
    const ended = homeToday(END + 1);
    const nowHero = ended.nowItems.find((item) => item.origin === "contest");
    assert.equal(
      ended.nowItems.some((item) => item.cta?.url === PATON_URL),
      false,
    );
    assert.equal(
      ended.voteActions.some((action) => action.url === PATON_URL),
      false,
    );
    assert.equal(ended.voteActions.length, 1);
    assert.equal(ended.voteActions[0].kind, "contest");
    assert.equal(ended.voteActions[0].url, contest.entryUrl);
    assert.equal(ended.voteActions[0].label, "ENTRY 734を応援する");
    assert.equal(ended.voteActions[0].deadlineLabel, undefined);
    assert.match(ended.voteActions[0].note ?? "", /3次審査/);
    assert.ok(nowHero);
    assert.equal(nowHero.cta?.url, contest.entryUrl);
    assert.equal(nowHero.cta?.label, "ENTRY 734を応援する");
    assert.match(nowHero.note ?? "", /3次審査/);
    assert.doesNotMatch(nowHero.title, /CAMPUS GIRLS|FinalSTAGE|Paton/i);
  });

  it("keeps the live vote in the compact NOW cap even when SHOWROOM and radio are live", () => {
    const now = START;
    const live = {
      ...unknownLive,
      state: "live",
      roomUrl: "https://www.showroom-live.com/r/example",
    };
    const view = homeToday(now, {
      live,
      radio: radioOnAir(now),
      radioPhase: "window",
    });
    assert.equal(view.nowItems[0]?.cta?.url, PATON_URL);
    assert.ok(view.nowItems.length <= 2);
    assert.equal(
      view.nowItems.filter((item) => item.cta?.url === PATON_URL).length,
      1,
    );
    assert.equal(
      view.dashboardVoteButtons.some((action) => action.url === PATON_URL),
      false,
    );
    assert.equal(
      view.dashboardVoteButtons.some((action) => action.url === contest.entryUrl),
      true,
    );
  });

  it("keeps both Paton (prominent NOW) and ENTRY 734 during the window, without stacking Paton", async () => {
    const dashboard = source("src/components/TodayDashboard.tsx");
    assert.match(dashboard, /voteActions/);
    assert.match(dashboard, /liveVoteOnNow/);
    assert.match(dashboard, /dashboardVoteButtons/);
    assert.match(dashboard, /投票受付中/);
    assert.doesNotMatch(dashboard, /additionalVotes/);
    assert.doesNotMatch(dashboard, /contest\.entryUrl/);
    assert.doesNotMatch(dashboard, /paton\.jp/);
    assert.match(dashboard, /今これ/);

    const during = homeToday(START);
    const nowVote = during.nowItems.find((item) => item.cta?.url === PATON_URL);
    const buttons = during.dashboardVoteButtons;

    assert.ok(nowVote);
    assert.equal(nowVote.cta?.label, "Patonでみりぃに投票する");
    assert.match(nowVote.note ?? "", /投票締切/);
    assert.equal(
      during.nowItems.filter((item) => item.cta?.url === PATON_URL).length,
      1,
    );
    assert.equal(
      buttons.some((action) => action.url === PATON_URL),
      false,
    );
    assert.equal(buttons.length >= 1, true);
    assert.equal(buttons[0]?.kind, "contest");
    assert.equal(buttons[0]?.url, contest.entryUrl);
    assert.equal(buttons[0]?.label, "ENTRY 734を応援する");
    assert.equal(
      during.voteActions.some((action) => action.url === contest.entryUrl),
      true,
    );
  });

  it("removes the dead Paton button after the window and still shows ENTRY 734", () => {
    const ended = homeToday(END + 1);
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
    assert.equal(
      ended.dashboardVoteButtons.some((action) => action.url === contest.entryUrl),
      false,
    );
    assert.equal(ended.nowItems[0]?.origin, "contest");
    assert.equal(ended.nowItems[0]?.cta?.url, contest.entryUrl);
    assert.equal(ended.nowItems[0]?.cta?.label, "ENTRY 734を応援する");
    assert.equal(ended.voteActions[0].url, contest.entryUrl);
  });

  it("does not render a second Paton button from the vote guide", () => {
    const guide = source("src/components/PatonVoteGuide.tsx");
    const support = source("src/components/Support.tsx");
    assert.match(guide, /isSupportEventUrlActive/);
    assert.match(guide, /campusGirlsPatonVoteLink\.url/);
    assert.doesNotMatch(guide, /href=\{campusGirlsPatonVoteLink\.url\}/);
    assert.match(support, /voteAction\.kind === "support-event"/);
    assert.match(support, /voteAction\.url/);
  });
});

describe("Gallery portrait-first order", () => {
  it("leads HOME preview and the Gallery initial window with みりぃ portraits", () => {
    const preview = selectGalleryPreview(HOME_GALLERY_LIMIT);
    const initial = selectGalleryEntries().slice(0, GALLERY_ARCHIVE_INITIAL);

    assert.equal(preview.length, HOME_GALLERY_LIMIT);
    assert.equal(initial.length, GALLERY_ARCHIVE_INITIAL);

    for (const [label, window] of [
      ["preview", preview],
      ["initial", initial],
    ]) {
      assert.equal(
        window.some((entry) => entry.kind === "mixch"),
        false,
        `${label} must not lead with Mixch`,
      );
      for (const entry of window) {
        if (entry.kind === "media") {
          assert.equal(isMilyPortraitPhoto(entry.item), true, entry.key);
          assert.equal(isShowroomUiScreenshot(entry.item), false, entry.key);
          assert.equal(isRadioTrioPhoto(entry.item), false, entry.key);
          assert.equal(isSkyOrLandscapePhoto(entry.item), false, entry.key);
          assert.equal(isObjectWithoutPerson(entry.item), false, entry.key);
        } else {
          assert.equal(entry.kind, "drive-photo", entry.key);
          assert.equal(isDrivePortraitPhoto(entry.item), true, entry.key);
        }
      }
    }

    const cinemaKeys = preview
      .map((entry) => cinemaEventKey(entry))
      .filter((key) => key !== null);
    assert.equal(new Set(cinemaKeys).size, cinemaKeys.length);
    assert.ok(cinemaKeys.length <= 1);

    assert.deepEqual(
      preview.map((entry) => entry.key),
      [
        "mily-b63-01",
        "mily-b38-01",
        "mily-b31-01",
        "mily-b30-01",
        "mily-b29-01",
        "mily-b28-01",
      ],
    );
  });

  it("keeps one cinema cut and does not copy media arrays into the HOME picker", () => {
    const preview = selectGalleryPreview(HOME_GALLERY_LIMIT);
    const cinemaCount = preview.filter(
      (entry) => cinemaEventKey(entry) === "mily-b38",
    ).length;
    assert.equal(cinemaCount, 1);
    assert.equal(preview[0]?.key, "mily-b63-01");
    assert.equal(
      preview.filter((entry) => entry.key.startsWith("mily-b38-")).length,
      1,
    );

    const selector = source("src/lib/galleryItems.ts");
    assert.match(selector, /pickHomeGalleryPreview/);
    assert.match(selector, /cinemaEventKey/);
    assert.doesNotMatch(selector, /basePath: "\/media\//);
    assert.doesNotMatch(selector, /const photos = \[/);
    assert.match(source("src/components/Gallery.tsx"), /selectGalleryPreview\(limit\)/);
    assert.equal(
      pickHomeGalleryPreview(selectGalleryEntries(), HOME_GALLERY_LIMIT).map(
        (entry) => entry.key,
      ).join(),
      preview.map((entry) => entry.key).join(),
    );
  });

  it("keeps Mixch, SHOWROOM screenshots, radio trio, and sky after portraits", () => {
    const entries = selectGalleryEntries();
    const firstMixch = entries.findIndex((entry) => entry.kind === "mixch");
    const firstPortraitEnd = entries.findIndex(
      (entry) =>
        (entry.kind === "media" && !isMilyPortraitPhoto(entry.item)) ||
        (entry.kind === "drive-photo" && !isDrivePortraitPhoto(entry.item)) ||
        entry.kind === "mixch" ||
        entry.kind === "video",
    );

    assert.ok(firstMixch > 0);
    assert.ok(firstPortraitEnd > 0);
    assert.ok(firstMixch >= firstPortraitEnd);

    const mixch = galleryBeforeLaterBatches.selectGalleryEntries().filter(
      (entry) => entry.kind === "mixch",
    );
    assert.equal(mixch.length, 3);
    assert.equal(
      entries.some(
        (entry) =>
          entry.kind === "media" && isShowroomUiScreenshot(entry.item),
      ),
      true,
    );
    assert.equal(
      entries.some(
        (entry) => entry.kind === "media" && isSkyOrLandscapePhoto(entry.item),
      ),
      true,
    );
    assert.equal(entries.every((entry) => entry.key.length > 0), true);
  });

  it("does not unpublish items or copy media arrays into the selector", () => {
    const selector = source("src/lib/galleryItems.ts");
    assert.match(selector, /visibleMedia\(media\)/);
    assert.match(selector, /isMilyPortraitPhoto/);
    assert.doesNotMatch(selector, /basePath: "\/media\//);
    assert.doesNotMatch(selector, /const photos = \[/);
    assert.equal(
      galleryBeforeLaterBatches.selectGalleryEntries().filter(
        (entry) => entry.kind === "mixch",
      ).length,
      3,
    );
    assert.ok(
      selectGalleryEntries().filter((entry) => entry.kind === "mixch").length >=
        3,
    );
  });
});

describe("confirmed Miss Circle third-round dates", () => {
  it("records official SCHEDULE dates and keeps ContestPhase date-only", () => {
    assert.equal(contest.currentPhase?.name, "3次審査");
    assert.equal(contest.currentPhase?.start, "2026-09-03");
    assert.equal(contest.currentPhase?.end, "2026-09-13");
    assert.equal(contest.currentPhase?.source, "https://www.misscircle.jp/");
    assert.equal(contest.lastVerifiedAt, "2026-09-03");
    assert.doesNotMatch(JSON.stringify(contest.currentPhase), /12:00|05:00|21:59/);

    const afterPaton = selectHomeVoteAction({
      contest,
      supportEvents,
      links,
      now: END + 1,
    });
    assert.equal(afterPaton.url, contest.entryUrl);
    assert.match(afterPaton.note ?? "", /9\/3/);
    assert.match(afterPaton.note ?? "", /9\/13/);
  });

  it("makes 3rd-round support the HOME now-path from 9/2 through 9/13", () => {
    const approaching = homeToday(Date.parse("2026-09-02T00:00:00+09:00"));
    const during = homeToday(Date.parse("2026-09-03T12:00:00+09:00"));
    const lastDay = homeToday(Date.parse("2026-09-13T23:59:00+09:00"));
    const after = homeToday(Date.parse("2026-09-14T00:00:00+09:00"));
    const stillPaton = homeToday(END);
    const webVoteUrl =
      "https://liff.line.me/1656040756-GwmBkdPY/vote/misscircle2026/N/734";

    assert.equal(approaching.nowItems.some((item) => item.cta?.url === PATON_URL), false);
    assert.equal(approaching.nowItems[0]?.origin, "contest");
    assert.equal(approaching.nowItems[0]?.cta?.url, contest.entryUrl);
    assert.equal(approaching.nowItems[0]?.cta?.label, "ENTRY 734を応援する");
    assert.match(approaching.nowItems[0]?.note ?? "", /3次審査/);
    assert.match(approaching.nowItems[0]?.note ?? "", /9\/3/);
    assert.match(approaching.nowItems[0]?.note ?? "", /9\/13/);
    assert.match(approaching.nowItems[0]?.note ?? "", /WEB投票 9\/3 12:00〜9\/13 23:59/);
    assert.match(approaching.nowItems[0]?.note ?? "", /SHOWROOM無料ギフト審査 9\/3 5:00〜9\/12 21:59/);
    assert.match(approaching.nowItems[0]?.note ?? "", /SHOWROOMイベント審査 9\/3 5:00〜9\/12 21:59/);
    assert.match(approaching.nowItems[0]?.note ?? "", /SHOWROOMは9\/12 21:59終了/);
    assert.equal(approaching.voteActions[0].kind, "contest");

    for (const view of [during, lastDay]) {
      assert.equal(view.nowItems.some((item) => item.cta?.url === PATON_URL), false);
      assert.equal(view.nowItems[0]?.origin, "support-event");
      assert.equal(view.nowItems[0]?.cta?.url, webVoteUrl);
      assert.equal(
        view.voteActions.some(
          (action) => action.kind === "contest" && action.url === contest.entryUrl,
        ),
        true,
      );
      assert.doesNotMatch(
        `${view.nowItems[0]?.title}\n${view.nowItems[0]?.note ?? ""}`,
        /CAMPUS GIRLS|FinalSTAGE|Paton/,
      );
    }

    assert.equal(stillPaton.nowItems[0]?.cta?.url, PATON_URL);
    assert.equal(stillPaton.nowItems.some((item) => item.origin === "contest"), false);
    assert.equal(after.nowItems.some((item) => item.origin === "contest"), false);
    assert.equal(after.voteActions[0].url, contest.entryUrl);
    assert.equal(after.dashboardVoteButtons[0]?.url, contest.entryUrl);
  });
});

function liveHomeCopy(now) {
  const view = homeToday(now);
  const hero = selectHomeHeroNews(news, now);
  return {
    view,
    hero,
    text: [
      JSON.stringify(view.nowItems),
      JSON.stringify(view.voteActions),
      siteShareText({ now, radioPhase: "idle" }),
      hero?.title ?? "",
      hero?.body ?? "",
    ].join("\n"),
  };
}

describe("Paton 1.5x bonus ends at 8/31 23:59 JST", () => {
  it("keeps exactly one live Paton CTA through 9/1 23:59 JST", () => {
    for (const now of [START, BONUS_END, BONUS_END + 1, END]) {
      const view = homeToday(now);
      assert.equal(
        view.nowItems.filter((item) => item.cta?.url === PATON_URL).length,
        1,
      );
      assert.equal(
        view.voteActions.filter((action) => action.url === PATON_URL).length,
        1,
      );
      assert.equal(view.voteActions[0].url, PATON_URL);
      assert.equal(view.voteActions[0].label, "Patonでみりぃに投票する");
    }
  });

  it("allows 1.5x on 8/31 NEWS and live copy until 23:59 JST", () => {
    for (const id of PATON_FIFTEEN_X_NEWS_IDS) {
      const item = news.find((entry) => entry.id === id);
      assert.ok(item, id);
      assert.match(`${item.title}\n${item.body}`, FIFTEEN_X);
    }

    const during = liveHomeCopy(BONUS_END);
    assert.match(during.text, FIFTEEN_X);
    assert.equal(during.hero?.id, "2026-09-03-miss-circle-goals-support");
    assert.match(during.view.nowItems[0]?.note ?? "", /1\.5倍/);
    assert.match(during.view.voteActions[0].note ?? "", /1\.5倍/);
    assert.doesNotMatch(during.view.voteActions[0].label, FIFTEEN_X);
    assert.doesNotMatch(during.view.voteActions[0].deadlineLabel ?? "", FIFTEEN_X);
  });

  it("strips 1.5x from live HOME/now/vote/share/hero after 8/31 23:59 JST", () => {
    const after = liveHomeCopy(BONUS_END + 1);
    assert.equal(after.view.voteActions[0].url, PATON_URL);
    assert.doesNotMatch(after.text, FIFTEEN_X);
    assert.notEqual(after.hero?.id, "2026-08-31-paton-first-place-story");
    assert.equal(
      PATON_FIFTEEN_X_NEWS_IDS.includes(after.hero?.id ?? ""),
      false,
    );

    for (const id of PATON_FIFTEEN_X_NEWS_IDS) {
      const item = news.find((entry) => entry.id === id);
      assert.ok(item, id);
      assert.match(`${item.title}\n${item.body}`, FIFTEEN_X);
    }
  });
});

describe("Mixch final-day stays an 8/30 archive", () => {
  it("does not present Mixch final-day as a live HOME/now deadline", () => {
    const mixchNews = news.find((entry) => entry.id === MIXCH_FINAL_DAY_NEWS_ID);
    assert.ok(mixchNews);
    assert.equal(mixchFinalDayMovie.title, "配信＆ムービーは今日が最終日");
    assert.equal(mixchNews.media, mixchFinalDayMovie);
    assert.equal(
      selectGalleryEntries().some(
        (entry) => entry.kind === "mixch" && entry.item === mixchFinalDayMovie,
      ),
      true,
    );

    for (const now of [
      Date.parse("2026-08-30T12:00:00+09:00"),
      BONUS_START,
      BONUS_END + 1,
      END,
    ]) {
      const { view, hero, text } = liveHomeCopy(now);
      assert.equal(
        view.nowItems.some(
          (item) =>
            MIXCH_LIVE.test(`${item.title}\n${item.note ?? ""}\n${item.cta?.url ?? ""}`),
        ),
        false,
      );
      assert.notEqual(hero?.id, MIXCH_FINAL_DAY_NEWS_ID);
      assert.doesNotMatch(
        [
          JSON.stringify(view.nowItems),
          JSON.stringify(view.voteActions),
          siteShareText({ now, radioPhase: "idle" }),
        ].join("\n"),
        MIXCH_LIVE,
      );
      assert.equal(text.includes(mixchFinalDayMovie.title), false);
    }

    assert.equal(
      supportEvents.some((event) => /mixch|最終日/.test(`${event.id}\n${event.title}`)),
      false,
    );
  });
});
