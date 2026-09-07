import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { events } from "../src/data/events.ts";
import { highlights } from "../src/data/highlights.ts";
import { links } from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news } from "./fixtures/news-before-b41.ts";
import { profile } from "../src/data/profile.ts";
import { socials } from "../src/data/socials.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("daily content-ops guide", () => {
  it("covers the update paths an agent needs without dummy production data", async () => {
    const ops = await read("docs/CONTENT-OPS.md");
    const mediaGuide = await read("docs/MEDIA.md");
    const gitignore = await read(".gitignore");
    const agents = await read("AGENTS.md");

    assert.match(ops, /48件/);
    assert.match(ops, /Mixch outbound player/);
    assert.match(ops, /sameDayOrder/);
    assert.match(ops, /id 昇順にはしない/);
    assert.match(ops, /SNS投稿を news/);
    assert.match(ops, /イベントを events/);
    assert.match(ops, /写真を追加/);
    assert.match(ops, /SNSリンクを変える/);
    assert.match(ops, /FM情報を更新/);
    assert.match(ops, /配信予定/);
    assert.match(ops, /オーナー確認が必須/);
    assert.match(ops, /Google Drive/);
    assert.match(ops, /pnpm media:build/);
    assert.match(ops, /ENTRY 734/);
    assert.match(ops, /SHOWROOM/);
    assert.match(ops, /FM湘南マジックウェイブ/);
    assert.match(ops, /非公式/);
    assert.match(ops, /公開permalinkがない一時的なInstagram Story/);
    assert.match(ops, /Fan Room公開時の原則/);
    assert.match(ops, /原則としてみりぃ本人の発言だけ/);
    assert.match(ops, /sourceLabel: "Instagram Story"/);
    assert.match(ops, /LatestとGallery/);
    assert.match(ops, /listedAt/);
    assert.match(mediaGuide, /一時的なInstagram Story動画/);
    assert.match(mediaGuide, /MP4 1本とposter 1枚/);

    assert.match(ops, /id: "2026-08-20-showroom-thanks"/);
    assert.match(ops, /id: "2026-09-01-ssc-public"/);
    assert.match(ops, /id: "mily-b02-01"/);
    assert.match(ops, /このままコミットしない|ドキュメント用/);

    assert.match(mediaGuide, /Google Drive 原本/);
    assert.match(mediaGuide, /media\/original\//);
    assert.match(mediaGuide, /pnpm media:build/);
    assert.match(mediaGuide, /public\/media\/gallery/);
    assert.match(mediaGuide, /src\/data\/media\.ts/);
    assert.match(mediaGuide, /SNSから自動取得しない|自動取得しない/);
    assert.match(mediaGuide, /AI 生成/);

    assert.match(gitignore, /media\/original\/\*/);
    assert.match(gitignore, /!media\/original\/README\.md/);
    assert.equal(existsSync(path.join(root, "media/original/README.md")), true);

    assert.match(agents, /docs\/CONTENT-OPS\.md/);
  });

  it("keeps example template ids out of live data files", () => {
    const liveIds = [
      ...news.map((item) => item.id),
      ...events.map((item) => item.id),
      ...media.map((item) => item.id),
      ...socials.map((item) => item.id),
      ...links.map((item) => item.id),
      ...highlights.map((item) => item.id),
    ];

    for (const exampleId of [
      "2026-08-20-showroom-thanks",
      "2026-09-01-ssc-public",
      "mily-b02-01",
    ]) {
      assert.equal(liveIds.includes(exampleId), false, exampleId);
    }

    assert.equal(
      news.some((item) => /REPLACE_WITH_REAL/.test(JSON.stringify(item))),
      false,
    );
    assert.equal(
      media.some((item) => /REPLACE_WITH_REAL/.test(JSON.stringify(item))),
      false,
    );
  });

  it("does not invent facts while documenting the current inventory", () => {
    assert.equal(profile.displayName, "みりぃ");
    assert.equal(profile.publicName, "三橋莉子");
    assert.ok(news.some((item) => item.id === "2026-08-02-21st-birthday"));
    assert.ok(socials.some((item) => item.platform === "x"));
    assert.ok(socials.some((item) => item.platform === "instagram"));
    assert.ok(socials.some((item) => item.platform === "tiktok"));
    assert.ok(socials.some((item) => item.platform === "showroom"));
    assert.ok(socials.some((item) => item.platform === "mixchannel"));
    assert.ok(links.some((item) => item.url.includes("fm-smw.jp")));
    assert.ok(media.filter((item) => item.published).length >= 6);
    assert.ok(
      profile.activities.some((activity) =>
        /ENTRY 734/.test(`${activity.title} ${activity.body} ${activity.points.join(" ")}`),
      ),
    );
  });
});
