// LIVE STREAM の配信メモを、どのエージェントが書いても同じ形になるよう検査する。
// ルール本文は docs/LIVE-STREAM-RECAP.md。数値を変えるときは両方を同じPRで直す。
import assert from "node:assert/strict";
import { withoutApprovedSongLinks } from "./approved-song-links.mjs";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  RANKING_NOTE,
  RANKING_NOTE_WITHOUT_RANGE,
  buildRankingNote,
  RECAP_FIGURES_NOTE,
  RECAP_WITHHOLD_NOTE,
  buildTranscriptionNote,
  streamRecaps,
} from "../src/data/streamRecaps.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RULES_DOC = "docs/LIVE-STREAM-RECAP.md";

// 上限だけを決める。下限を作ると、検査を通すために本文を水増しさせてしまう。
const MAX = {
  theme: 16,
  summary: 140,
  highlights: 8,
  highlightTitle: 20,
  highlightBody: 100,
  highlightQuote: 40,
  goals: 6,
  goalItem: 8,
  goalTarget: 10,
  goalStatusThen: 12,
  timeline: 16,
  timelineLabel: 32,
  nextNote: 120,
  gallery: 12,
};

const RANKING_PLACE = "[1-9]\\d{0,2}";
const RANKING_NOTE_SHAPE = new RegExp(
  `^配信終了時に(?:、${RANKING_PLACE}位から${RANKING_PLACE}位まで)?ランキングを読み上げました。個人名は掲載していません。$`,
);
const THEME_PREFIXES = ["朝", "昼", "夕", "夜", "深夜"];
const PLATFORMS = new Set(["SHOWROOM", "MixChannel"]);
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const size = (value) => Array.from(value).length;

function atMost(value, max, label) {
  const length = size(value);
  assert.ok(length > 0, `${label}: 空にしない`);
  assert.ok(length <= max, `${label}: ${length}字は長すぎ（上限${max}）: ${value}`);
}

/** 実在する暦日か。new Date は 2026-02-31 を黙って繰り上げるので往復で確かめる。 */
function assertRealDate(value, label) {
  const parsed = new Date(`${value}T12:00:00Z`);
  assert.equal(parsed.toISOString().slice(0, 10), value, `${label}: 実在しない日付 ${value}`);
  return parsed;
}

function seconds(timestamp) {
  assert.match(timestamp, /^\d:[0-5]\d:[0-5]\d$/, `timestamp形式: ${timestamp}`);
  const [hour, minute, second] = timestamp.split(":").map(Number);
  return hour * 3600 + minute * 60 + second;
}

function startMinutes(broadcastLabel) {
  const match = broadcastLabel.match(/^([01]?\d|2[0-3]):([0-5]\d)頃〜 約\d+分$/);
  assert.ok(match, `broadcastLabel形式: ${broadcastLabel}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

describe("配信メモの統一ルール", () => {
  it("keeps the archive newest-first, with the later slot first on the same day", () => {
    assert.ok(streamRecaps.length > 0);
    const ids = streamRecaps.map((recap) => recap.id);
    assert.equal(new Set(ids).size, ids.length);

    for (let index = 1; index < streamRecaps.length; index += 1) {
      const previous = streamRecaps[index - 1];
      const current = streamRecaps[index];
      assert.ok(
        previous.date >= current.date,
        `新しい回を先頭へ: ${previous.id} が ${current.id} より後ろ`,
      );
      if (previous.date === current.date) {
        assert.ok(
          startMinutes(previous.broadcastLabel) > startMinutes(current.broadcastLabel),
          `同じ日は遅い枠を先に: ${previous.id} / ${current.id}`,
        );
      }
    }
  });

  for (const recap of streamRecaps) {
    describe(recap.id, () => {
      it("uses the agreed identifiers, labels, and lengths", () => {
        assert.match(recap.id, /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/);
        assert.match(recap.date, /^\d{4}-\d{2}-\d{2}$/);
        assert.ok(recap.id.startsWith(`${recap.date}-`));

        const [year, month, day] = recap.date.split("-");
        const parsed = assertRealDate(recap.date, `${recap.id} date`);
        const weekday = WEEKDAYS[parsed.getUTCDay()];
        assert.equal(recap.dateLabel, `${year}.${month}.${day}（${weekday}）`);

        assert.ok(
          THEME_PREFIXES.some((prefix) => recap.theme.startsWith(prefix)),
          `themeは時間帯で始める: ${recap.theme}`,
        );
        assert.doesNotMatch(recap.theme, /SHOWROOM|MixChannel/);
        atMost(recap.theme, MAX.theme, `${recap.id} theme`);

        assert.ok(PLATFORMS.has(recap.platformLabel));
        startMinutes(recap.broadcastLabel);
        atMost(recap.summary, MAX.summary, `${recap.id} summary`);
        // 次枠を確認できない回は空にする。UIは空なら文を出さない。
        if (recap.nextNote !== "") {
          atMost(recap.nextNote, MAX.nextNote, `${recap.id} nextNote`);
        }

        // 日付と素材の説明は必須。入手経路（オーナー提供など）は実際に応じて書く。
        const labelDate = recap.sourceLabel.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日 .+（.+）$/);
        assert.ok(labelDate, `sourceLabel形式: ${recap.sourceLabel}`);
        const [, labelYear, labelMonth, labelDay] = labelDate;
        const labelIso = `${labelYear}-${labelMonth.padStart(2, "0")}-${labelDay.padStart(2, "0")}`;
        assertRealDate(labelIso, `${recap.id} sourceLabel`);
        assert.equal(labelIso, recap.date, "sourceLabel の日付は配信日と同じ");
        assert.doesNotMatch(recap.sourceLabel, /https?:\/\//);
        assert.match(recap.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
        assertRealDate(recap.verifiedAt, `${recap.id} verifiedAt`);
        assert.ok(recap.verifiedAt >= recap.date, "verifiedAt は配信日以降");
      });

      it("keeps highlights readable and in order", () => {
        const { highlights } = recap;
        // 素材が薄い回は少ないままでよい。上限だけを見て、水増しを求めない。
        assert.ok(
          highlights.length <= MAX.highlights,
          `見どころ ${highlights.length}件は多すぎ（上限${MAX.highlights}）`,
        );

        const stamps = highlights.map(({ timestamp }) => seconds(timestamp));
        assert.deepEqual(stamps, [...stamps].sort((left, right) => left - right));

        for (const highlight of highlights) {
          atMost(highlight.title, MAX.highlightTitle, `${recap.id} title`);
          atMost(highlight.body, MAX.highlightBody, `${recap.id} body`);
          if (highlight.quote !== undefined) {
            atMost(highlight.quote, MAX.highlightQuote, `${recap.id} quote`);
            assert.doesNotMatch(highlight.quote, /^[「『]|[」』]$/);
          }
        }
      });

      it("keeps goals labelled without repeating the UI wording", () => {
        const { goals } = recap;
        // 目標を確認できなかった回は空配列。UIはセクションごと出さない。
        assert.ok(
          goals.length <= MAX.goals,
          `目標 ${goals.length}件は多すぎ（上限${MAX.goals}）`,
        );
        assert.equal(new Set(goals.map(({ item }) => item)).size, goals.length);

        for (const goal of goals) {
          atMost(goal.item, MAX.goalItem, `${recap.id} goal.item`);
          atMost(goal.target, MAX.goalTarget, `${recap.id} goal.target`);
          atMost(goal.statusThen, MAX.goalStatusThen, `${recap.id} goal.statusThen`);
          assert.doesNotMatch(goal.statusThen, /配信時点/);
          assert.doesNotMatch(goal.item, /アバ権/);
        }
      });

      it("withholds ranking names and keeps the timeline as an index", () => {
        // 読み上げがなかった回は空。あった回は順位の範囲だけを定型文で書く。
        assert.ok(recap.ranking.length <= 1, "ランキングは0件か1件");
        for (const entry of recap.ranking) {
          assert.match(entry, RANKING_NOTE_SHAPE, `ランキングは定型文だけ: ${entry}`);
        }

        const { timeline } = recap;
        assert.ok(
          timeline.length <= MAX.timeline,
          `タイムライン ${timeline.length}件は多すぎ（上限${MAX.timeline}）`,
        );
        // 録画が途中から始まる回もあるため、先頭を 0:00:00 に強制しない。昇順だけ見る。
        const stamps = timeline.map(({ timestamp }) => seconds(timestamp));
        assert.deepEqual(stamps, [...stamps].sort((left, right) => left - right));
        for (const item of timeline) {
          atMost(item.label, MAX.timelineLabel, `${recap.id} timeline.label`);
        }
      });

      it("builds the note from the shared sentences", () => {
        const note = recap.transcriptionNote;
        assert.ok(note.includes(RECAP_WITHHOLD_NOTE), "共通の非掲載範囲の文がない");
        assert.ok(note.endsWith(RECAP_FIGURES_NOTE), "数字の注記で終わっていない");
        assert.ok(
          note.indexOf(RECAP_WITHHOLD_NOTE) > 0,
          "素材の説明が非掲載範囲より前にない",
        );
        assert.match(note, /静止画は/);
      });

      it("publishes only complete, non-duplicated stills", async () => {
        const stills = recap.gallery ?? [];
        if (stills.length > 0) {
          assert.ok(
            stills.length <= MAX.gallery,
            `スクショ ${stills.length}枚は多すぎ（上限${MAX.gallery}）`,
          );
          // 代表は「そのカードの顔」。時系列の先頭とは限らないので、
          // ギャラリー内の同じオブジェクトであることだけを見る。
          assert.ok(
            stills.includes(recap.image),
            "代表画像は gallery のいずれかと同じオブジェクト",
          );
          assert.equal(new Set(stills.map(({ src }) => src)).size, stills.length);
        }

        for (const image of [recap.image, ...stills].filter(Boolean)) {
          assert.match(image.src, /^\/media\/live\/mily-b\d{2}-\d{2}-[a-z0-9-]+\.(jpg|png)$/);
          const file = path.join(root, "public", image.src.slice(1));
          assert.equal(existsSync(file), true);
          // 宣言した寸法は実ファイルと一致させる。ずれるとレイアウトが跳ねる。
          const size = await sharp(file).metadata();
          assert.equal(image.width, size.width, `${image.src} の width が実ファイルと違う`);
          assert.equal(image.height, size.height, `${image.src} の height が実ファイルと違う`);
          assert.match(image.alt, /みりぃ/);
          assert.doesNotMatch(image.alt, /コメント|視聴者|アイコン|出場者/);
          // 一覧に並ぶ写真は説明と保存名が要る。代表1枚だけの回は説明を必須にしない。
          if (stills.length > 0) {
            assert.ok(image.caption, "caption は必須");
            assert.ok(image.downloadName, "downloadName は必須");
          }
        }

        if (recap.galleryZip) {
          assert.ok(stills.length > 0, "ZIPだけを置かない");
          assert.equal(existsSync(path.join(root, "public", recap.galleryZip.src.slice(1))), true);
        }
      });
    });
  }

  it("shares one object per still across recaps", () => {
    const bySrc = new Map();
    for (const recap of streamRecaps) {
      for (const image of [recap.image, ...(recap.gallery ?? [])].filter(Boolean)) {
        const known = bySrc.get(image.src);
        if (known) assert.equal(known, image, `同じ静止画は同じオブジェクトを共有する: ${image.src}`);
        else bySrc.set(image.src, image);
      }
    }
  });

  it("keeps the ranking note free of names for any read-out range", () => {
    assert.match(RANKING_NOTE, RANKING_NOTE_SHAPE);
    assert.match(RANKING_NOTE_WITHOUT_RANGE, RANKING_NOTE_SHAPE);
    assert.equal(
      buildRankingNote(),
      "配信終了時にランキングを読み上げました。個人名は掲載していません。",
    );
    assert.match(buildRankingNote(5, 1), RANKING_NOTE_SHAPE);
    assert.equal(
      buildRankingNote(5, 1),
      "配信終了時に、5位から1位までランキングを読み上げました。個人名は掲載していません。",
    );
  });

  it("keeps the note builder deterministic", () => {
    assert.equal(
      buildTranscriptionNote({ material: "素材。", stills: "静止画。", extra: "補足。" }),
      `素材。${RECAP_WITHHOLD_NOTE}静止画。補足。${RECAP_FIGURES_NOTE}`,
    );
    assert.equal(
      buildTranscriptionNote({ material: "素材。", stills: "静止画。" }),
      `素材。${RECAP_WITHHOLD_NOTE}静止画。${RECAP_FIGURES_NOTE}`,
    );
  });

  it("keeps private sources and misleading wording out of the data file", async () => {
    const recapDataFiles = (await readdir(path.join(root, "src/data")))
      .filter((file) => /^streamRecap.*\.ts$/.test(file))
      .sort();
    const data = (
      await Promise.all(
        recapDataFiles.map((file) =>
          readFile(path.join(root, "src/data", file), "utf8"),
        ),
      )
    ).join("\n");
    // 「公式」は、このサイトや配信メモを公式・公認と誤認させる使い方だけを禁じる。
    // 原曲そのものの出所（公式楽曲情報・原曲の公式動画）を指す言い回しは、
    // 誤認の恐れがないので許可語として先に外してから検査する。
    const OFFICIAL_ALLOWED = ["公式楽曲情報", "原曲の公式動画"];
    const withoutAllowedOfficial = OFFICIAL_ALLOWED.reduce(
      (text, phrase) => text.split(phrase).join("［許可語］"),
      data,
    );
    assert.doesNotMatch(withoutAllowedOfficial, /公式|公認|本人運営/);
    assert.doesNotMatch(data, /drive\.google\.com|docs\.google\.com/);
    assert.doesNotMatch(data, /stt_raw|ScreenRecording/);
    // 録画・音声のファイル名は公開文へ出さない。TSのimport拡張子を誤検出しないよう、
    // 掲載される文字列とメディアパスだけを見る。
    const publishedText = streamRecaps
      .flatMap((recap) => [
        recap.theme,
        recap.summary,
        recap.broadcastLabel,
        recap.platformLabel,
        recap.sourceLabel,
        recap.transcriptionNote,
        recap.nextNote,
        ...recap.ranking,
        ...recap.highlights.flatMap(({ title, body, quote }) => [title, body, quote ?? ""]),
        ...recap.goals.flatMap(({ item, target, statusThen }) => [item, target, statusThen]),
        ...recap.timeline.map(({ label }) => label),
        ...[recap.image, ...(recap.gallery ?? [])]
          .filter(Boolean)
          .flatMap((image) => [image.src, image.alt, image.caption ?? "", image.downloadName ?? ""]),
        recap.galleryZip?.src ?? "",
        recap.galleryZip?.filename ?? "",
      ])
      .join("\n");
    assert.doesNotMatch(publishedText, /\.(mp3|aac|mp4|mov|ts|wav|m4a)\b/i);
    // 原曲リンクはオーナー承認済みの公式動画だけ（scripts/approved-song-links.mjs）。
    // それ以外のURLは、素材の出所が漏れるので配信メモへ書かない。
    assert.doesNotMatch(withoutApprovedSongLinks(data), /https?:\/\//);
    assert.doesNotMatch(data, /transcriptionNote:\s*["`]/);
    assert.match(data, /buildTranscriptionNote/);
  });

  it("renders every card with the same sections in the same order", async () => {
    const source = await readFile(path.join(root, "src/ActivitiesPage.tsx"), "utf8");
    const page = source.slice(source.indexOf("function StreamRecapArticle"));
    assert.ok(page.length > 0, "StreamRecapArticle がない");
    const order = [
      "この回に歌った曲",
      "この回の見どころ",
      "この回のスクショ",
      "この回の目標",
      "読み上げたランキング",
      "タイムスタンプと次枠",
      "recap.transcriptionNote",
    ];
    const positions = order.map((needle) => {
      const index = page.indexOf(needle);
      assert.ok(index > 0, `${needle} が配信カードにない`);
      return index;
    });
    assert.deepEqual(positions, [...positions].sort((left, right) => left - right));
    assert.match(page, /目標 \{goal\.target\}/);
    assert.match(page, /この回 \{goal\.statusThen\}/);
    assert.match(page, /aspect-\[16\/9\]/);
  });

  it("keeps the written rules discoverable from AGENTS.md", async () => {
    const [rules, agents] = await Promise.all([
      readFile(path.join(root, RULES_DOC), "utf8"),
      readFile(path.join(root, "AGENTS.md"), "utf8"),
    ]);
    assert.ok(agents.includes(RULES_DOC), "AGENTS.md から辿れない");
    assert.match(rules, /buildTranscriptionNote/);
    assert.match(rules, /scripts\/stream-recaps\.test\.mjs/);
    assert.match(rules, /統一しない語/);
    assert.doesNotMatch(rules, /drive\.google\.com|docs\.google\.com/);
  });
});
