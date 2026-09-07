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
import { galleryVideos } from "./fixtures/gallery-videos-before-b41.ts";
import {
  featuredPhoto,
  media,
  visibleMedia,
} from "../src/data/media.ts";
import {
  OHAYO_WHITE_POLO_X_URL,
  ohayoWhitePoloPeaceImage,
  ohayoWhitePoloPeacePhoto,
} from "../src/data/ohayoWhitePoloPeace.ts";
import {
  PANDA_PAST_PIC_X_URL,
  pandaPastPicImage,
  pandaPastPicPhoto,
} from "../src/data/pandaPastPic.ts";
import {
  EVENING_RADIO_SHOWROOM_X_URL,
  eveningRadioShowroomImage,
  eveningRadioShowroomPhoto,
} from "../src/data/eveningRadioShowroom.ts";
import { campusGirlsFinalStageFlyerImage } from "../src/data/campusGirlsFinalStageFlyer.ts";
import {
  SECOND_ROUND_TIMETABLE_X_URL,
  secondRoundTimetableImage,
} from "../src/data/secondRoundTimetable.ts";
import {
  gandaBeforeNightStreamImage,
  gandaBeforeNightStreamPhoto,
} from "../src/data/gandaBeforeNightStream.ts";
import { morningMakeupShowroomPhoto } from "../src/data/morningMakeupShowroomImage.ts";
import { autumnLeafNewsImage } from "../src/data/autumnLeafNewsImage.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b41.ts";
import { verifyMedia, verifyNews } from "./content-invariants.mjs";
import { findDriveIds } from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKIPPED_PUBLISHED = [
  ["b05 leaf 1600", "public/media/gallery/mily-b05-01-autumn-leaf-1600.jpg"],
  ["b06 wink NEWS", "public/media/news/mily-b06-01-recovery-morning.jpg"],
  ["b08 mirror 1600", "public/media/gallery/mily-b08-01-do-what-you-can-morning-1600.jpg"],
];

const OHAYO_NEWS_SHA =
  "0c4c65eaeba1b9557ab55899220847065a381f0c7ce2824f64b9e8076d934a95";
const PANDA_NEWS_SHA =
  "0152f1bef64795b054e9267d40335fa77df8f83776fa68a4f187abfd90f4127a";
const RADIO_NEWS_SHA =
  "734ae7ac7fe01b1f74828b8488767f60da6119f9c06141ea3f6f0c15bf456e7f";
const FLYER_NEWS_SHA =
  "93232254cd165349814262aceb7a98c1961480140aea140dcf2a58d46feac6a3";
const TIMETABLE_NEWS_SHA =
  "7835466343a655224b4aeff52e3074db8eb5e2ec92343795df1f86433d59c692";
const GANDA_NEWS_SHA =
  "3d821f2bdee3b1c0d46ed834d31a168c03199285012d87bb53f308ff0cbcb5dc";
const MAKEUP_NEWS_SHA =
  "f6b9841b1194ccca157f78139ef49c3b0fda1e12501f06dd679231a8f07b27ca";
const OHAYO_MESSAGE = [
  "おはよ\u{1F505}",
  "今日AM 10:00〜",
  "よろしくお願いします😽🙌🏻\u{2764}\u{FE0F}\u{200D}\u{1F525}",
].join("\n");
const PANDA_MESSAGE = [
  "今日は",
  "12:30〜13:30",
  "14:30〜15:30",
  "1時間ずつ配信よろしくね🫣\u{2764}\u{FE0F}\u{200D}\u{1F525}",
].join("\n");
const TIMETABLE_MESSAGE = [
  "私は皆と絶景見に行くよ\u{1F642}\u{200D}\u{2195}\u{FE0F}\u{1FA77}",
  "#ミスサークルコンテスト2026 #ミスサー2026 #ミスサー #ミスコン #SHOWROOM",
].join("\n");
const RADIO_MESSAGE = [
  "大元は元気なのに、体だけが追いつかない状況下のラジオ配信ありがとうございました🥲🙌🏻🩵",
  "",
  "体調管理はね？自分でしていかないと。",
  "",
  "明日の配信時間はまた明日伝えるよ〜！",
  "ちなみに夜になると思う🥺",
  "元気なみりぃに会いにきてね~‼︎",
  "",
  "#ミスサー #ミスサークルコンテスト2026 #ミスサークル2026",
].join("\n");

function publicFile(relative) {
  return path.join(root, "public", relative.replace(/^\//, ""));
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function assertNotDuplicateOfPublished(fileSha) {
  for (const [label, relative] of SKIPPED_PUBLISHED) {
    const other = await sha256(path.join(root, relative));
    assert.notEqual(other, fileSha, label);
  }
}

describe("X haul unused candidates — keep birthday and skip published dupes", () => {
  it("keeps b29-01 on the existing birthday NEWS and does not re-import b05/b06/b08", async () => {
    const birthday = news.find((entry) => entry.id === "2026-08-02-21st-birthday");
    assert.ok(birthday);
    assert.equal(birthday.media?.src, "/media/news/mily-b29-01-birthday-indoor-selfie.jpg");
    assert.equal(news.filter((entry) => entry.date === "2026-08-02").length, 1);
    assert.equal(media.filter((entry) => entry.id === "mily-b05-01").length, 1);
    assert.equal(media.filter((entry) => entry.id === "mily-b08-01").length, 1);
    assert.equal(
      news.some((entry) => entry.media?.src === "/media/news/mily-b06-01-recovery-morning.jpg"),
      true,
    );
    assert.equal(news.length, 49);
    assert.equal(media.filter((entry) => entry.kind === "photo").length, 33);
    assert.deepEqual(verifyNews(news), []);
    assert.deepEqual(verifyMedia(media), []);
    assert.equal(featuredPhoto(media)?.id, "mily-b01-03");
  });
});

describe("2026-08-06 OHAYO white polo — NEWS + Gallery", () => {
  it("adds one source-backed NEWS item with the live tweet text", () => {
    const entry = news.find((item) => item.id === "2026-08-06-ohayo-morning-stream");
    assert.ok(entry);
    assert.equal(entry.date, "2026-08-06");
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.source, OHAYO_WHITE_POLO_X_URL);
    assert.equal(entry.media, ohayoWhitePoloPeaceImage);
    assert.equal(entry.message?.text, OHAYO_MESSAGE);
    assert.match(entry.body, /AM 10:00〜/);
    assert.doesNotMatch(entry.body, /配信します$/);
    assert.ok(sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-movie-night")).some((item) => item.id === entry.id));
  });

  it("publishes Gallery + NEWS JPEG without hotlinks or published duplicates", async () => {
    const visible = visibleMedia(media);
    assert.equal(visible[8], ohayoWhitePoloPeacePhoto);
    const newsFile = publicFile(ohayoWhitePoloPeaceImage.src);
    assert.equal((await stat(newsFile)).size, 190_333);
    assert.equal(await sha256(newsFile), OHAYO_NEWS_SHA);
    assert.notEqual(await sha256(publicFile(`${ohayoWhitePoloPeacePhoto.basePath}-1600.jpg`)), OHAYO_NEWS_SHA);
    await assertNotDuplicateOfPublished(OHAYO_NEWS_SHA);
    const meta = await sharp(newsFile).metadata();
    assert.equal(meta.width, 1153);
    assert.equal(meta.height, 2048);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.icc, undefined);
    assert.equal(ohayoWhitePoloPeaceImage.src.includes("pbs.twimg"), false);
    const { stdout: tracked } = await run(
      "git",
      ["ls-files", "--", "media/original/mily-b30-01-ohayo-white-polo-peace.jpg"],
      { cwd: root },
    );
    assert.equal(tracked.trim(), "");
  });
});

describe("2026-08-05 panda past pic — NEWS + Gallery", () => {
  it("labels the attached photo as a past pic and archives the stream windows", () => {
    const entry = news.find((item) => item.id === "2026-08-05-panda-past-pic");
    assert.ok(entry);
    assert.equal(entry.date, "2026-08-05");
    assert.equal(entry.source, PANDA_PAST_PIC_X_URL);
    assert.equal(entry.media, pandaPastPicImage);
    assert.equal(entry.message?.text, PANDA_MESSAGE);
    assert.match(entry.title, /過去pic/);
    assert.match(entry.body, /※過去pic|過去の写真/);
    assert.match(entry.body, /12:30〜13:30/);
    assert.match(entry.body, /14:30〜15:30/);
    assert.match(pandaPastPicPhoto.alt, /過去pic/);
    assert.match(pandaPastPicPhoto.caption, /過去pic/);
  });

  it("publishes a new selfie, not b06 wink", async () => {
    const visible = visibleMedia(media);
    assert.equal(visible[7], pandaPastPicPhoto);
    const newsFile = publicFile(pandaPastPicImage.src);
    assert.equal(await sha256(newsFile), PANDA_NEWS_SHA);
    await assertNotDuplicateOfPublished(PANDA_NEWS_SHA);
    const meta = await sharp(newsFile).metadata();
    assert.equal(meta.width, 1153);
    assert.equal(meta.height, 2048);
  });
});

describe("2026-08-21 ganda cap+mask — keep NEWS file, add Gallery", () => {
  it("does not duplicate the existing NEWS JPEG and still adds Gallery", async () => {
    const entry = news.find((item) => item.id === "2026-08-21-after-afternoon-ganda");
    assert.equal(entry.media, gandaBeforeNightStreamImage);
    assert.equal(entry.media.src, "/media/news/mily-b14-01-ganda-before-night-stream.jpg");
    assert.equal(await sha256(publicFile(entry.media.src)), GANDA_NEWS_SHA);
    assert.equal((await stat(publicFile(entry.media.src))).size, 92_816);
    assert.equal(media.find((item) => item.id === "mily-b14-01"), gandaBeforeNightStreamPhoto);
    assert.match(gandaBeforeNightStreamImage.srcSet ?? "", /1162|1600/);
    const gallery1600 = publicFile(`${gandaBeforeNightStreamPhoto.basePath}-1600.jpg`);
    const galleryMeta = await sharp(gallery1600).metadata();
    assert.equal(galleryMeta.width, 1162);
    assert.equal(galleryMeta.height, 2048);
    assert.notEqual(await sha256(gallery1600), GANDA_NEWS_SHA);
  });
});

describe("2026-08-24 makeup SHOWROOM — keep NEWS file, add Gallery", () => {
  it("does not re-import the tweet orig and publishes the existing shot to Gallery", async () => {
    const entry = news.find((item) => item.id === "2026-08-24-makeup-stream");
    assert.equal(
      entry.media?.src,
      "/media/news/mily-b24-01-morning-makeup-showroom.jpg",
    );
    assert.equal(await sha256(publicFile(entry.media.src)), MAKEUP_NEWS_SHA);
    assert.equal(media.find((item) => item.id === "mily-b24-01"), morningMakeupShowroomPhoto);
    assert.equal(media.some((item) => item.id.includes("b24-02")), false);
    const gallery1600 = publicFile(`${morningMakeupShowroomPhoto.basePath}-1600.jpg`);
    const galleryMeta = await sharp(gallery1600).metadata();
    assert.equal(galleryMeta.width, 1500);
    assert.equal(galleryMeta.height, 691);
    assert.notEqual(await sha256(gallery1600), MAKEUP_NEWS_SHA);
  });
});

describe("2026-08-18 evening radio SHOWROOM — attach to existing NEWS + Gallery", () => {
  it("keeps the radio story CTA and attaches the Godiva screenshot", () => {
    const entry = news.find((item) => item.id === "2026-08-18-evening-radio");
    const morning = news.find((item) => item.id === "2026-08-18-morning-update");
    assert.equal(entry.source, EVENING_RADIO_SHOWROOM_X_URL);
    assert.equal(entry.url, "/stories/2026-08-18-radio/");
    assert.equal(entry.ctaLabel, "配信の記録を読む");
    assert.equal(entry.media, eveningRadioShowroomImage);
    assert.equal(entry.message?.text, RADIO_MESSAGE);
    assert.equal(entry.body.includes("体調不良"), false);
    assert.equal(entry.body.includes("病気"), false);
    assert.ok(morning);
    assert.equal(visibleMedia(media)[6], eveningRadioShowroomPhoto);
  });

  it("self-hosts a new screenshot, not a published duplicate", async () => {
    const newsFile = publicFile(eveningRadioShowroomImage.src);
    assert.equal(await sha256(newsFile), RADIO_NEWS_SHA);
    await assertNotDuplicateOfPublished(RADIO_NEWS_SHA);
    const meta = await sharp(newsFile).metadata();
    assert.equal(meta.width, 1216);
    assert.equal(meta.height, 2048);
    assert.equal(meta.icc, undefined);
    assert.notEqual(
      await sha256(publicFile(`${eveningRadioShowroomPhoto.basePath}-1600.jpg`)),
      RADIO_NEWS_SHA,
    );
  });
});

describe("2026-08-24 Final STAGE flyer — NEWS additionalMedia only", () => {
  it("appends the flyer without replacing Paton images or adding Gallery", async () => {
    const entry = news.find((item) => item.id === "2026-08-24-campus-girls-final-stage-guide");
    assert.equal(
      entry.media?.src,
      "/media/news/mily-b26-01-campus-girls-paton-portrait.jpg",
    );
    assert.equal(entry.additionalMedia?.at(-1), campusGirlsFinalStageFlyerImage);
    assert.equal(
      campusGirlsFinalStageFlyerImage.src,
      "/media/news/mily-b33-01-campus-girls-final-stage-flyer.jpg",
    );
    assert.equal(await sha256(publicFile(campusGirlsFinalStageFlyerImage.src)), FLYER_NEWS_SHA);
    await assertNotDuplicateOfPublished(FLYER_NEWS_SHA);
    assert.equal(media.some((item) => item.id.includes("b33")), false);
    assert.equal(galleryVideos.some((item) => String(item.id ?? "").includes("b33")), false);
    assert.equal(existsSync(path.join(root, "public/media/gallery/mily-b33-01-campus-girls-final-stage-flyer-480.jpg")), false);
  });
});

describe("2026-08-08 timetable graphic — new NEWS, not Gallery", () => {
  it("adds one miss-circle NEWS card with the live tweet and no Gallery tile", async () => {
    const entry = news.find((item) => item.id === "2026-08-08-second-round-timetable");
    assert.ok(entry);
    assert.equal(entry.date, "2026-08-08");
    assert.deepEqual(entry.activityIds, ["miss-circle"]);
    assert.equal(entry.source, SECOND_ROUND_TIMETABLE_X_URL);
    assert.equal(entry.media, secondRoundTimetableImage);
    assert.equal(entry.message?.text, TIMETABLE_MESSAGE);
    assert.match(entry.body, /配信スケジュール/);
    assert.match(entry.body, /転記していません/);
    assert.equal(await sha256(publicFile(secondRoundTimetableImage.src)), TIMETABLE_NEWS_SHA);
    await assertNotDuplicateOfPublished(TIMETABLE_NEWS_SHA);
    assert.equal(media.some((item) => item.id.includes("b34")), false);
    assert.equal(existsSync(path.join(root, "public/media/gallery/mily-b34-01-second-round-timetable-480.jpg")), false);

    const { events } = await import("../src/data/events.ts");
    const { streamSchedule } = await import("../src/data/streamSchedule.ts");
    assert.deepEqual(events, []);
    assert.equal(JSON.stringify(streamSchedule).includes("b34"), false);
    assert.equal(JSON.stringify(streamSchedule).includes("2026-08-08-second-round-timetable"), false);
  });
});

describe("optional b05 autumn-leaf wiring into 2次審査通過 NEWS", () => {
  it("reuses Gallery srcset and does not add a NEWS copy or extra derivative", async () => {
    const entry = news.find((item) => item.id === "2026-08-19-second-round-result");
    assert.equal(entry.media, autumnLeafNewsImage);
    assert.equal(autumnLeafNewsImage.src, "/media/gallery/mily-b05-01-autumn-leaf-1600.jpg");
    assert.match(autumnLeafNewsImage.srcSet ?? "", /mily-b05-01-autumn-leaf-480\.jpg/);
    assert.equal(media.filter((item) => item.id === "mily-b05-01").length, 1);
    assert.equal(existsSync(path.join(root, "public/media/news/mily-b05-01-autumn-leaf.jpg")), false);
    const galleryDir = await (await import("node:fs/promises")).readdir(
      path.join(root, "public/media/gallery"),
    );
    assert.deepEqual(
      galleryDir.filter((file) => file.includes("mily-b05-01")).sort(),
      [
        "mily-b05-01-autumn-leaf-1600.jpg",
        "mily-b05-01-autumn-leaf-1600.webp",
        "mily-b05-01-autumn-leaf-480.jpg",
        "mily-b05-01-autumn-leaf-480.webp",
        "mily-b05-01-autumn-leaf-960.jpg",
        "mily-b05-01-autumn-leaf-960.webp",
      ],
    );
  });
});

describe("X haul — no Drive ids, no Millie spelling, no pbs hotlinks", () => {
  it("keeps tracked haul files free of Drive ids and doubled-l English", async () => {
    const files = [
      "src/data/ohayoWhitePoloPeace.ts",
      "src/data/pandaPastPic.ts",
      "src/data/eveningRadioShowroom.ts",
      "src/data/morningStreamThanks.ts",
      "src/data/campusGirlsFinalStageFlyer.ts",
      "src/data/secondRoundTimetable.ts",
      "src/data/gandaBeforeNightStream.ts",
      "src/data/autumnLeafNewsImage.ts",
      "src/data/news.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ];
    for (const relative of files) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(findDriveIds(source).length, 0, relative);
      assert.doesNotMatch(source, /Millie|millie/);
      assert.doesNotMatch(source, /pbs\.twimg/);
    }
  });
});
