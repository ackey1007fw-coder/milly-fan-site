import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { activities } from "../src/data/activities.ts";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import {
  CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL,
  campusGirlsFinalsExScheduleImage,
  campusGirlsFinalsExGuideImage,
} from "../src/data/campusGirlsFinalsExImages.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { contest } from "../src/data/contest.ts";
import {
  campusGirlsFinalsExSnsReview,
  isValidSupportEvent,
  supportEvents,
} from "../src/data/supportEvents.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { displayStatus } from "../src/lib/supportCalendar.ts";
import { siteShareText } from "../src/lib/siteShare.ts";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-09-07-campus-girls-finals-ex-vol1";
const NEXT_SLOTS_ID = "2026-09-06-stream-thanks-next-slots";
const RESULT_ID = "2026-09-06-campus-girls-prelim-final-result";
const SOURCE = CAMPUS_GIRLS_FINALS_EX_VOL1_X_URL;
const TWEET_ID = "2096754197362622971";
const GUIDE = "/media/news/mily-b64-01-campus-girls-finals-ex-vol1.jpg";
const SCHEDULE = "/media/news/mily-b64-02-campus-girls-finals-ex-schedule.jpg";
const GUIDE_FILE = path.join(root, "public", GUIDE.slice(1));
const SCHEDULE_FILE = path.join(root, "public", SCHEDULE.slice(1));
const GUIDE_SHA256 =
  "91c7020bad59effa9109f33be94df6c36eede56fdf9fea378a352657847251ad";
const SCHEDULE_SHA256 =
  "94eb650e396717064978e981efad60c6b8d7b5642cc6c94c8e2ff534ab283443";
const TITLE = "CAMPUS GIRLS 2027 本選EX期間のお知らせ";
const BODY =
  "9月7日、みりぃがCAMPUS GIRLS 2027 本選EX期間の案内をXに投稿しました。本選EX vol.1は9月7日から9月20日です。SNS審査は9月7日12:00〜9月20日12:00、Paton投票審査は9月16日18:00〜9月22日23:59です。みりぃはキャンガルでの配信は行わないと伝えています。";
const MESSAGE =
  "【キャンガル2027 本選EX期間】\n" +
  "本選まで長いので、是非目を通しておいてくださると嬉しいです😳🙏🏻🩵✨\n" +
  "個人的解釈ですが、この期間は、『私を知ってもらって、本選でも応援してくださる方々に出逢うための期間』。\n" +
  "キャンガルでの配信は行いませんが、私らしく授賞式登壇するぞ〜✊🏻❤️‍🔥";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

describe("2026-09-07 CAMPUS GIRLS 本選EX vol.1 案内 — Latest entry", () => {
  it("adds exactly one source-backed NEWS card ahead of the 9/6 stream thanks", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(
      news.filter((candidate) => (candidate.source ?? "").includes(TWEET_ID)).length,
      1,
    );
    assert.equal(news[0], entry);
    assert.equal(ordered[0], entry);
    assert.equal(ordered[1]?.id, NEXT_SLOTS_ID);
    assert.equal(ordered[2]?.id, RESULT_ID);
    assert.equal(entry.date, "2026-09-07");
    assert.equal(entry.sameDayOrder, 10);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "みりぃのX");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.equal(entry.media, campusGirlsFinalsExGuideImage);
    assert.deepEqual(entry.additionalMedia, [campusGirlsFinalsExScheduleImage]);
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the X text verbatim and a short fan NEWS body", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのX");
    assert.equal(entry.message?.text, MESSAGE);
    assert.match(entry.message.text, /^【キャンガル2027 本選EX期間】\n/);
    assert.match(entry.message.text, /キャンガルでの配信は行いません/);
    assert.match(entry.body, /本選EX vol\.1は9月7日から9月20日/);
    assert.match(entry.body, /SNS審査は9月7日12:00〜9月20日12:00/);
    assert.match(entry.body, /Paton投票審査は9月16日18:00〜9月22日23:59/);
    assert.match(entry.body, /キャンガルでの配信は行わない/);
  });

  it("does not add vote buttons, Mixch CTAs, or official-site wording", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

    assert.doesNotMatch(copy, /公式サイト|公認|本人運営/);
    assert.doesNotMatch(copy, /JST|\blive\b|作業メモ/i);
    assert.doesNotMatch(copy, /急いで|今すぐ投票|残り/);
    assert.doesNotMatch(copy, /CanCam|AGESTOCK|横浜アリーナ/);
    assert.doesNotMatch(copy, /paton\.jp|mixch\.tv|SHOWROOM/);
    assert.equal(copy.toLowerCase().includes("millie"), false);

    const now = Date.parse("2026-09-07T12:00:00+09:00");
    const resolved = resolveNewsLinks(entry, now);
    assert.equal(resolved.cta, undefined);
    assert.equal(resolved.additionalCtas, undefined);
    assert.equal(resolved.relatedUrl, undefined);
  });
});

describe("2026-09-07 CAMPUS GIRLS 本選EX vol.1 案内 — media", () => {
  it("uses two local /media/news/ JPEGs and never hotlinks SNS media", async () => {
    const photo = item().media;
    const schedule = item().additionalMedia?.[0];

    assert.equal(photo, campusGirlsFinalsExGuideImage);
    assert.equal(schedule, campusGirlsFinalsExScheduleImage);
    assert.equal(photo?.kind, "image");
    assert.equal(photo?.src, GUIDE);
    assert.equal(schedule?.src, SCHEDULE);
    assert.match(photo.src, /^\/media\/news\//);
    assert.equal(photo.width, 1500);
    assert.equal(photo.height, 2250);
    assert.equal(schedule.width, 1500);
    assert.equal(schedule.height, 1700);
    assert.equal(photo.provenance, "sns-post");
    assert.equal(schedule.provenance, "sns-post");
    assert.equal(photo.sourceUrl, SOURCE);
    assert.equal(schedule.sourceUrl, SOURCE);
    assert.equal(photo.sourceDate, "2026-09-07");
    assert.match(photo.alt, /本選EX vol\.1/);
    assert.match(schedule.alt, /日程表/);
    assert.equal(existsSync(GUIDE_FILE), true);
    assert.equal(existsSync(SCHEDULE_FILE), true);
    assert.equal((await stat(GUIDE_FILE)).size, 1_097_825);
    assert.equal((await stat(SCHEDULE_FILE)).size, 420_322);
    assert.equal(await sha256(GUIDE_FILE), GUIDE_SHA256);
    assert.equal(await sha256(SCHEDULE_FILE), SCHEDULE_SHA256);

    for (const host of [
      "pbs.twimg.com",
      "twimg",
      "twitter.com",
      "cdninstagram",
      "instagram.com",
      "http://",
    ]) {
      assert.equal(photo.src.includes(host), false, host);
      assert.equal(schedule.src.includes(host), false, host);
    }

    for (const [file, width, height] of [
      [GUIDE_FILE, 1500, 2250],
      [SCHEDULE_FILE, 1500, 1700],
    ]) {
      const metadata = await sharp(file).metadata();
      assert.equal(metadata.format, "jpeg");
      assert.equal(metadata.width, width);
      assert.equal(metadata.height, height);
      assert.equal(metadata.exif, undefined);
      assert.equal(metadata.iptc, undefined);
      assert.equal(metadata.xmp, undefined);
      assert.equal(metadata.icc, undefined);
    }
  });

  it("does not publish the graphics in Gallery or scrape X hosts", async () => {
    assert.equal(
      media.some((entry) => String(entry.id ?? "").includes("b64")),
      false,
    );
    assert.equal(
      existsSync(
        path.join(root, "public/media/gallery/mily-b64-01-campus-girls-finals-ex-vol1-480.jpg"),
      ),
      false,
    );

    const { stdout } = await run("git", ["ls-files", "--", "media/original"], {
      cwd: root,
    });
    assert.equal(stdout.trim(), "media/original/README.md");

    for (const relative of [
      "src/data/news.ts",
      "src/data/campusGirlsFinalsExImages.ts",
      "src/data/supportEvents.ts",
      "docs/CONTENT-OPS.md",
      "docs/MEDIA.md",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("pbs.twimg.com"), false, relative);
      assert.equal(source.includes("video.twimg.com"), false, relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.equal(DRIVE_FOLDER_PATTERN.test(source), false, relative);
      assert.equal(source.toLowerCase().includes("millie"), false, relative);
    }
  });
});

describe("2026-09-07 CAMPUS GIRLS 本選EX vol.1 案内 — scope", () => {
  it("surfaces on the campus-girls Activity only", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    assert.equal(campusNews[0]?.id, NEWS_ID);
    for (const activityId of ["miss-circle", "live-stream", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
    }
  });

  it("adds the SNS審査 SupportEvent without a vote URL and keeps stories unchanged", () => {
    assert.equal(isValidSupportEvent(campusGirlsFinalsExSnsReview), true);
    assert.equal(campusGirlsFinalsExSnsReview.kind, "support-campaign");
    assert.equal(campusGirlsFinalsExSnsReview.ctaLinkId, undefined);
    assert.equal(campusGirlsFinalsExSnsReview.source, SOURCE);
    assert.deepEqual(campusGirlsFinalsExSnsReview.schedule, {
      state: "confirmed-period",
      start: "2026-09-07T12:00:00+09:00",
      end: "2026-09-20T12:00:00+09:00",
      allDay: false,
      timezone: "Asia/Tokyo",
    });
    assert.equal(
      supportEvents.filter((event) => event.id === campusGirlsFinalsExSnsReview.id)
        .length,
      1,
    );
    assert.equal(
      displayStatus(
        campusGirlsFinalsExSnsReview.schedule,
        Date.parse("2026-09-07T11:59:59+09:00"),
      ),
      "upcoming",
    );
    assert.equal(
      displayStatus(
        campusGirlsFinalsExSnsReview.schedule,
        Date.parse("2026-09-07T12:00:00+09:00"),
      ),
      "live",
    );
    assert.equal(
      displayStatus(
        campusGirlsFinalsExSnsReview.schedule,
        Date.parse("2026-09-20T12:00:01+09:00"),
      ),
      "ended",
    );

    assert.equal(
      highlights.some((entry) => String(entry.id).includes("finals-ex")),
      false,
    );
    assert.equal(
      activities
        .find((activity) => activity.id === "campus-girls")
        ?.relatedHighlightIds.includes("campus-girls-2027-prelim-final-result"),
      true,
    );
    assert.equal(
      stories.some((entry) => JSON.stringify(entry).includes(NEWS_ID)),
      false,
    );
    assert.deepEqual(events, []);
    assert.equal(contest.contestName, "MISS CIRCLE CONTEST 2026");
    assert.equal(
      galleryVideos.some((entry) => String(entry.id ?? "").includes("b64")),
      false,
    );
    assert.equal(
      streamSchedule.some((slot) => `${slot.note ?? ""}${slot.date}`.includes("本選EX")),
      false,
    );
  });

  it("does not take over the MISS CIRCLE WEB vote share hashtag during overlap", () => {
    const duringBoth = siteShareText({
      now: Date.parse("2026-09-07T12:00:00+09:00"),
      radioPhase: "idle",
    });
    assert.match(duringBoth, /本選EX vol\.1のSNS審査期間/);
    assert.match(duringBoth, /WEB投票をお願いします/);
    assert.match(duringBoth, /#三橋莉子 #ミスサークル2026$/);
    assert.doesNotMatch(duringBoth, /#キャンガル$/m);
  });
});

describe("2026-09-07 CAMPUS GIRLS 本選EX vol.1 案内 — Portal Feed", () => {
  it("flows through Portal Feed as image NEWS", () => {
    const feed = createPortalFeed({
      newsItems: news,
      now: new Date("2026-09-07T12:00:00+09:00"),
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-07T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.ok(entry.image?.includes("mily-b64-01"));
  });
});
