import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { radioProgram } from "../src/data/radio.ts";
import { site } from "../src/data/site.ts";
import {
  siteSharePayload,
  siteShareText,
} from "../src/lib/siteShare.ts";

const at = (value) => Date.parse(value);
const X_MAX_WEIGHTED_LENGTH = 280;
const X_URL_WEIGHT_WITH_SEPARATOR = 24;
const xGraphemeSegmenter = new Intl.Segmenter("en", {
  granularity: "grapheme",
});

function isSingleWeightCodePoint(codePoint) {
  return (
    codePoint <= 0x10ff ||
    (codePoint >= 0x2000 && codePoint <= 0x200d) ||
    (codePoint >= 0x2010 && codePoint <= 0x201f) ||
    (codePoint >= 0x2032 && codePoint <= 0x2037)
  );
}

/** X/twitter-text v3 compatible weighting for this payload's URL-free text. */
function xWeightedTextLength(text) {
  let weightedLength = 0;
  for (const { segment } of xGraphemeSegmenter.segment(text)) {
    if (/\p{Extended_Pictographic}/u.test(segment)) {
      weightedLength += 2;
      continue;
    }
    for (const character of segment) {
      weightedLength += isSingleWeightCodePoint(character.codePointAt(0)) ? 1 : 2;
    }
  }
  return weightedLength;
}

function xPayloadWeightedLength(payload) {
  return xWeightedTextLength(payload.text) + X_URL_WEIGHT_WITH_SEPARATOR;
}

describe("date-aware site share copy", () => {
  it("selects today's radio and active Paton vote by priority", () => {
    const text = siteShareText({
      now: at("2026-08-30T08:30:00+09:00"),
      radioPhase: "upcoming",
    });

    assert.match(text, /今日10:00〜は「湘南シーサイドサークル」📻/);
    assert.match(text, /CAMPUS GIRLS 2027のPaton投票をお願いします🗳️/);
    assert.match(text, /9\/1 23:59まで/);
    assert.ok(text.indexOf("湘南シーサイドサークル") < text.indexOf("Paton投票"));
    assert.doesNotMatch(text, /3次審査/);
    assert.deepEqual(radioProgram.shareHashtags, [
      "#湘南シーサイドサークル",
      "#ssc",
    ]);
    assert.match(text, /#三橋莉子 #湘南シーサイドサークル #ssc$/);
    assert.doesNotMatch(text, /#キャンガル2027|#ミスサークル2026/);
  });

  it("describes the radio slot without claiming Mily's live appearance", () => {
    const text = siteShareText({
      now: at("2026-08-30T11:00:00+09:00"),
      radioPhase: "window",
    });

    assert.match(text, /ただいま「湘南シーサイドサークル」の放送時間です📻/);
    assert.doesNotMatch(text, /みりぃ.*出演中|本人.*出演中|Mily.*出演中/);
    assert.match(text, /#三橋莉子 #湘南シーサイドサークル #ssc$/);
  });

  it("drops the radio after its Sunday window but keeps live campaigns", () => {
    const text = siteShareText({
      now: at("2026-08-30T13:00:00+09:00"),
      radioPhase: "ended",
    });

    assert.doesNotMatch(text, /湘南シーサイドサークル/);
    assert.match(text, /Paton投票/);
    assert.match(text, /3次審査/);
    assert.match(text, /#三橋莉子 #キャンガル2027$/);
    assert.doesNotMatch(text, /#ミスサークル2026/);
  });

  it("ends Paton automatically and switches to the third-round callout", () => {
    const before = siteShareText({
      now: at("2026-09-02T12:00:00+09:00"),
      radioPhase: "idle",
    });
    assert.doesNotMatch(before, /Paton投票/);
    assert.match(before, /9\/3からMISS CIRCLE CONTEST 2026の3次審査/);
    assert.match(before, /#三橋莉子 #ミスサークル2026$/);
    assert.doesNotMatch(before, /#キャンガル2027/);

    const beforeWebVote = siteShareText({
      now: at("2026-09-03T11:59:59+09:00"),
      radioPhase: "idle",
    });
    assert.match(
      beforeWebVote,
      /MISS CIRCLE CONTEST 2026の3次審査を応援してください🔥/,
    );
    assert.doesNotMatch(beforeWebVote, /WEB投票をお願いします/);

    const duringWebVote = siteShareText({
      now: at("2026-09-03T12:00:00+09:00"),
      radioPhase: "idle",
    });
    assert.match(
      duringWebVote,
      /MISS CIRCLE CONTEST 2026 3次審査のWEB投票をお願いします🗳️/,
    );
    assert.match(duringWebVote, /9\/13 23:59まで/);
    assert.doesNotMatch(duringWebVote, /3次審査を応援してください/);
    assert.doesNotMatch(duringWebVote, /Paton投票/);
    assert.match(duringWebVote, /#三橋莉子 #ミスサークル2026$/);
    assert.doesNotMatch(duringWebVote, /#キャンガル2027/);
  });

  it("keeps asking through the published 23:59 minute, then stops at midnight", () => {
    const duringMinute = at("2026-09-13T23:59:30+09:00");
    const during = siteShareText({ now: duringMinute, radioPhase: "idle" });
    const after = siteShareText({
      now: at("2026-09-14T00:00:00+09:00"),
      radioPhase: "idle",
    });

    assert.match(during, /WEB投票をお願いします/);
    assert.doesNotMatch(after, /WEB投票をお願いします/);
  });

  it("keeps concurrent support copy while the higher-priority WEB vote owns the hashtag", () => {
    const text = siteShareText({
      now: at("2026-09-07T18:00:00+09:00"),
      radioPhase: "idle",
    });

    assert.match(text, /WEB投票をお願いします/);
    assert.match(text, /本選EX vol\.1のSNS審査期間/);
    assert.match(text, /#三橋莉子 #ミスサークル2026$/);
    assert.doesNotMatch(text, /#キャンガル$/m);
  });

  it("returns the stable site description with the person tag when no timely topic is active", () => {
    assert.equal(
      siteShareText({
        now: at("2026-09-20T12:00:01+09:00"),
        radioPhase: "idle",
      }),
      `${site.description}\n#三橋莉子`,
    );
  });

  it("keeps CAMPUS GIRLS 本選EX SNS審査 in the share text after WEB投票 ends", () => {
    const afterWebVote = siteShareText({
      now: at("2026-09-14T12:00:00+09:00"),
      radioPhase: "idle",
    });
    assert.match(afterWebVote, /本選EX vol\.1のSNS審査期間/);
    assert.match(afterWebVote, /9\/20 12:00まで/);
    assert.match(afterWebVote, /#三橋莉子 #キャンガル$/);
    assert.doesNotMatch(afterWebVote, /WEB投票をお願いします/);
  });

  it("switches the campaign hashtag immediately after the Paton deadline", () => {
    const deadline = at("2026-09-01T23:59:00+09:00");
    const duringPaton = siteShareText({ now: deadline, radioPhase: "idle" });
    const afterPaton = siteShareText({ now: deadline + 1, radioPhase: "idle" });

    assert.match(duringPaton, /#三橋莉子 #キャンガル2027$/);
    assert.doesNotMatch(duringPaton, /#ミスサークル2026/);
    assert.match(afterPaton, /#三橋莉子 #ミスサークル2026$/);
    assert.doesNotMatch(afterPaton, /#キャンガル2027/);
  });

  it("keeps representative X payloads within the weighted 280-character limit", () => {
    const fixtures = [
      ["2026-08-30T08:30:00+09:00", "upcoming"],
      ["2026-08-30T11:00:00+09:00", "window"],
      ["2026-08-31T12:00:00+09:00", "idle"],
      ["2026-09-02T12:00:00+09:00", "idle"],
      ["2026-09-03T12:00:00+09:00", "idle"],
      ["2026-09-07T18:00:00+09:00", "idle"],
      ["2026-09-14T12:00:00+09:00", "idle"],
    ];

    for (const [now, radioPhase] of fixtures) {
      const payload = siteSharePayload({ now: at(now), radioPhase });
      assert.ok(
        xPayloadWeightedLength(payload) <= X_MAX_WEIGHTED_LENGTH,
        `${now}: ${xPayloadWeightedLength(payload)} weighted characters`,
      );
    }
  });

  it("mentions Paton 1.5x only during the confirmed 8/31 bonus window", () => {
    const during = siteShareText({
      now: at("2026-08-31T12:00:00+09:00"),
      radioPhase: "idle",
    });
    const after = siteShareText({
      now: at("2026-08-31T23:59:00+09:00") + 1,
      radioPhase: "idle",
    });

    assert.match(during, /Paton投票/);
    assert.match(during, /1\.5倍DAY/);
    assert.match(after, /Paton投票/);
    assert.doesNotMatch(after, /1\.5x|1\.5倍/);
    assert.ok(
      xWeightedTextLength(during) + X_URL_WEIGHT_WITH_SEPARATOR <=
        X_MAX_WEIGHTED_LENGTH,
    );
    assert.ok(
      xWeightedTextLength(after) + X_URL_WEIGHT_WITH_SEPARATOR <=
        X_MAX_WEIGHTED_LENGTH,
    );
  });
});
