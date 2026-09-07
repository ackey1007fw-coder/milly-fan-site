import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { site } from "../src/data/site.ts";
import {
  siteSharePayload,
  siteShareText,
} from "../src/lib/siteShare.ts";

const at = (value) => Date.parse(value);

describe("date-aware site share copy", () => {
  it("combines today's radio, active Paton vote, and upcoming third round", () => {
    const text = siteShareText({
      now: at("2026-08-30T08:30:00+09:00"),
      radioPhase: "upcoming",
    });

    assert.match(text, /今日10:00〜は「湘南シーサイドサークル」📻/);
    assert.match(text, /CAMPUS GIRLS 2027のPaton投票をお願いします🗳️/);
    assert.match(text, /9\/1 23:59まで/);
    assert.match(text, /9\/3からMISS CIRCLE CONTEST 2026の3次審査が始まります🔥/);
    assert.ok(text.indexOf("湘南シーサイドサークル") < text.indexOf("Paton投票"));
    assert.ok(text.indexOf("Paton投票") < text.indexOf("3次審査"));
    assert.match(text, /#三橋莉子 #キャンガル2027$/);
    assert.doesNotMatch(text, /#ミスサークル2026/);
  });

  it("describes the radio slot without claiming Mily's live appearance", () => {
    const text = siteShareText({
      now: at("2026-08-30T11:00:00+09:00"),
      radioPhase: "window",
    });

    assert.match(text, /ただいま「湘南シーサイドサークル」の放送時間です📻/);
    assert.doesNotMatch(text, /みりぃ.*出演中|本人.*出演中|Mily.*出演中/);
  });

  it("drops the radio after its Sunday window but keeps live campaigns", () => {
    const text = siteShareText({
      now: at("2026-08-30T13:00:00+09:00"),
      radioPhase: "ended",
    });

    assert.doesNotMatch(text, /湘南シーサイドサークル/);
    assert.match(text, /Paton投票/);
    assert.match(text, /3次審査/);
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

  it("keeps the current X-ready payload comfortably below 280 characters", () => {
    const payload = siteSharePayload({
      now: at("2026-08-30T08:30:00+09:00"),
      radioPhase: "upcoming",
    });

    assert.ok(payload.text.length + 24 < 280);
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
    assert.ok(during.length + 24 < 280);
    assert.ok(after.length + 24 < 280);
  });
});
