import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { radioProgram } from "../shared/radio-program.js";
import { activities } from "../src/data/activities.ts";
import { contest } from "../src/data/contest.ts";
import { socials } from "../src/data/socials.ts";
import { supportEvents } from "../src/data/supportEvents.ts";
import { deriveBannerState } from "../src/lib/bannerState.ts";
import {
  confirmedShowroomAction,
  fallbackShowroomActions,
  HOME_NOW_LIMIT,
  rankHomeNowItems,
  retainedTodayActions,
  selectHomeToday,
} from "../src/lib/homeToday.ts";
import {
  hubNavigation,
  SECTION_ANCHOR_OFFSET,
  sectionNavigation,
  visibleNavItems,
} from "../src/lib/navigation.ts";
import { selectSupportNow, SUPPORT_HUB_ROUTE } from "../src/lib/supportHub.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

/**
 * コメントを外したソース。ルールを説明する日本語コメント自身が
 * 「その語を含まないこと」のassertionに引っかからないようにする。
 */
const code = (relative) =>
  source(relative)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

const ACTIVITIES_HUB_ROUTE = "/activities/";

const NONE_BANNER = { kind: "NONE", stateLabel: "", title: "" };

const unknownLive = {
  state: "unknown",
  startedAt: null,
  observedAt: null,
  roomUrl: null,
  next: { state: "unknown", at: null },
};

/** 確認済み期間のSupportEvent（`/support/` のfixtureと同じshape）。 */
function periodSupportEvent(id, start, end) {
  return {
    id,
    activityId: "miss-circle",
    kind: "support-campaign",
    title: `support ${id}`,
    schedule: {
      state: "confirmed-period",
      start,
      end,
      allDay: false,
      timezone: "Asia/Tokyo",
    },
    source: `https://example.com/${id}`,
    verifiedAt: "2026-08-22",
  };
}

function homeToday(overrides = {}) {
  const input = {
    contest,
    supportEvents: [],
    streamSlots: [],
    streamRoomUrl: null,
    live: unknownLive,
    radio: null,
    radioPhase: "idle",
    now: Date.parse("2026-08-22T12:00:00+09:00"),
    ...overrides,
  };
  return selectHomeToday({
    ...input,
    banner:
      overrides.banner ??
      deriveBannerState(
        { live: input.live, radio: input.radio, slots: input.streamSlots },
        input.now,
      ),
  });
}

describe("P6 home information architecture", () => {
  it("orders the home as Hero → TodayDashboard → Support → Activities gateway", () => {
    const app = source("src/App.tsx");
    const hero = source("src/components/Hero.tsx");
    const at = (tag) => app.indexOf(tag);
    for (const tag of [
      "<Hero />",
      "<TodayDashboard />",
      "<Support />",
      "<ActivitiesGateway />",
      "<Latest",
    ]) {
      assert.ok(at(tag) >= 0, `${tag} must render on the home page`);
    }
    assert.match(hero, /<Socials \/>/);
    assert.ok(at("<Hero />") < at("<TodayDashboard />"));
    assert.ok(at("<TodayDashboard />") < at("<Support />"));
    assert.ok(at("<Support />") < at("<ActivitiesGateway />"));
    assert.ok(at("<ActivitiesGateway />") < at("<Latest"));
    assert.doesNotMatch(app, /<StreamSchedule/);
  });

  it("puts a /support/ CTA on the home page", () => {
    const support = source("src/components/Support.tsx");
    assert.equal(SUPPORT_HUB_ROUTE, "/support/");
    assert.match(support, /SUPPORT_HUB_ROUTE/);
    assert.match(support, /応援・予定を見る/);
    // ルート文字列はSupport domainの正本から読む（ホームで再保存しない）
    assert.doesNotMatch(support, /href="\/support\/"/);
  });

  it("puts an /activities/ CTA on the home page", () => {
    const gateway = source("src/components/ActivitiesGateway.tsx");
    assert.match(gateway, /ACTIVITIES_HUB_ROUTE/);
    assert.match(gateway, /Activities Hubを見る/);
    assert.doesNotMatch(gateway, /href="\/activities\/"/);
  });
});

describe("P6 navigation", () => {
  it("makes Activities and Support first-class navigation", () => {
    const hubs = hubNavigation();
    assert.deepEqual(
      hubs.map(({ href }) => href),
      [
        ACTIVITIES_HUB_ROUTE,
        SUPPORT_HUB_ROUTE,
        "/news/",
        "/stories/",
        "/gallery/",
        "/profile/",
      ],
    );
    for (const item of hubs) assert.equal(item.kind, "route");

    const items = visibleNavItems(0);
    assert.equal(items[0].href, "/");
    assert.equal(
      items.findIndex(({ href }) => href === ACTIVITIES_HUB_ROUTE),
      1,
    );
  });

  it("uses archive routes instead of a wrapping home-anchor pill list", () => {
    assert.deepEqual(sectionNavigation(0), []);
    assert.deepEqual(sectionNavigation(1), []);
    const hrefs = visibleNavItems(0).map(({ href }) => href);
    assert.deepEqual(hrefs, [
      "/",
      "/activities/",
      "/support/",
      "/news/",
      "/stories/",
      "/gallery/",
      "/profile/",
    ]);
    assert.ok(visibleNavItems(0).length <= 7);
    assert.ok(visibleNavItems(1).length <= 7);
  });

  it("renders a compact disclosure menu with labelled navs and 44px touch targets", () => {
    const header = source("src/components/Header.tsx");
    assert.match(header, /visibleNavItems\(\)/);
    assert.match(header, /aria-label="サイトナビ"/);
    assert.match(header, /aria-label="サイトメニュー"/);
    assert.match(header, /aria-expanded=\{open\}/);
    assert.match(header, /min-h-11/);
    assert.doesNotMatch(header, /overflow-x-auto/);
    assert.doesNotMatch(header, /min-h-10\b/);
    assert.match(header, /hidden [^"]*md:flex/);
    assert.match(header, /md:hidden/);
  });

  it("uses the same site navigation on Activities and Support routes", () => {
    for (const file of ["src/ActivitiesPage.tsx", "src/SupportPage.tsx"]) {
      const page = source(file);
      assert.match(page, /import \{ Header \} from "\.\/components\/Header"/);
      assert.match(page, /<Header \/>/);
      assert.doesNotMatch(page, /function (?:Activities|Support)Header/);
      assert.doesNotMatch(page, /ホームへ戻る/);
    }
  });
});

describe("P6 mobile action dock", () => {
  it("reaches the Support route and stays a single row", () => {
    const dock = source("src/components/MobileActionDock.tsx");
    assert.match(dock, /SUPPORT_HUB_ROUTE/);
    assert.match(dock, /応援・予定/);
    assert.match(dock, /fixed inset-x-0 bottom-0 z-30/);
    assert.match(dock, /safe-area-inset-bottom/);
    assert.match(dock, /sm:hidden/);
    assert.match(dock, /min-h-11/);
    // Paton・MISS CIRCLE・Supportを両立しても1段に収める
    assert.equal((dock.match(/<a\b/g) ?? []).length, 3);
    assert.match(dock, /min-w-0 flex-1/);
    assert.doesNotMatch(dock, /flex-wrap/);
    // 固定ドックの分だけ本文の下に余白を残す
    assert.match(source("src/App.tsx"), /pb-20/);
  });

  it("takes the time-aware primary vote action from the shared selector", () => {
    const dock = source("src/components/MobileActionDock.tsx");
    assert.match(dock, /selectHomeVoteActions/);
    assert.match(dock, /voteAction\.url/);
    assert.match(dock, /voteAction\.label/);
    assert.doesNotMatch(dock, /paton\.jp|2026\.misscircle\.jp/);
  });
});

describe("P6 SSOT reuse and duplication", () => {
  it("uses the shared time-aware vote action in the Support component", () => {
    const support = source("src/components/Support.tsx");
    assert.doesNotMatch(support, /VOTE_URL/);
    assert.doesNotMatch(support, /paton\.jp|2026\.misscircle\.jp/);
    assert.match(support, /selectHomeVoteActions/);
    assert.match(support, /voteAction\.url/);
  });

  it("builds TodayDashboard from the Support domain selectors", () => {
    const dashboard = source("src/components/TodayDashboard.tsx");
    const home = source("src/lib/homeToday.ts");
    assert.match(dashboard, /selectHomeToday/);
    assert.match(home, /selectSupportToday\(\{/);
    assert.match(home, /selectSupportNow\(\{/);
    // ホーム側で今日/今の意味を作り直さない（selectorはhomeToday経由だけ）
    assert.doesNotMatch(code("src/components/TodayDashboard.tsx"), /supportHub/);
    assert.doesNotMatch(dashboard, /fetch\(|setInterval\(|createPollStore/);
    assert.match(dashboard, /useStreamSchedule/);
    assert.match(dashboard, /useMilyRealtimeStatus/);
  });

  it("uses activities.ts only for identity and navigation", () => {
    const gateway = source("src/components/ActivitiesGateway.tsx");
    assert.match(gateway, /activities\.map/);
    assert.match(gateway, /activity\.label/);
    assert.match(gateway, /activity\.route/);
    for (const label of activities.map(({ label }) => label)) {
      assert.doesNotMatch(
        gateway,
        new RegExp(`"${label}"`),
        `${label} must come from activities.ts, not a copy`,
      );
    }
    // 状態（rank / phase / 期間）をActivity導線へコピーしない
    const gatewayCode = code("src/components/ActivitiesGateway.tsx");
    assert.doesNotMatch(gatewayCode, /currentPhase|rank|順位|審査|期間|開催中/);
    assert.doesNotMatch(
      gatewayCode,
      /contest|useStreamSchedule|useMilyRealtimeStatus|activityStatus/,
    );
    assert.doesNotMatch(gatewayCode, /activity\.(sourceIds|related[A-Za-z]+)/);
  });

  it("does not copy the Support Calendar onto the home page", () => {
    const homeSources = [
      "src/App.tsx",
      "src/components/Support.tsx",
      "src/components/ActivitiesGateway.tsx",
      "src/components/TodayDashboard.tsx",
      "src/lib/homeToday.ts",
    ].map(code).join("\n");
    assert.doesNotMatch(homeSources, /buildSupportCalendar|SupportCalendarResult/);
    assert.doesNotMatch(homeSources, /Support Calendar/);
    // 日程発表待ちの一覧そのものは /support/ に残す（ホームは案内文だけ）
    assert.doesNotMatch(
      homeSources,
      /selectSupportPending|pendingItems|calendar\.days|CalendarItemCard/,
    );
    assert.doesNotMatch(homeSources, /SupportPage/);
  });

  it("keeps the Support Hub and Activities routes intact", () => {
    assert.match(source("src/SupportPage.tsx"), /buildSupportCalendar\(/);
    assert.match(source("src/SupportPage.tsx"), /みりぃスケジュール/);
    assert.match(source("src/SupportPage.tsx"), /MonthlyScheduleCalendar/);
    assert.match(source("src/ActivitiesPage.tsx"), /isActivitiesHubRoute/);
    for (const activity of activities) {
      assert.match(source("src/data/activities.ts"), new RegExp(activity.route));
    }
    const vite = source("vite.config.ts");
    assert.match(vite, /support:\s*"support\/index\.html"/);
    assert.match(vite, /activities:\s*"activities\/index\.html"/);
  });
});

describe("P6 home Today semantics", () => {
  it("never turns an unavailable API into 予定なし", () => {
    const { todayItems, nowItems } = homeToday();
    assert.deepEqual(todayItems.map(({ key }) => key), ["today:contest"]);
    assert.deepEqual(nowItems, []);
    const homeSources = [
      "src/components/TodayDashboard.tsx",
      "src/lib/homeToday.ts",
    ].map(code).join("\n");
    assert.doesNotMatch(homeSources, /予定なし|配信なし|本日はありません|応援なし/);
  });

  it("shows a confirmed slot without guessing its end time", () => {
    const { todayItems } = homeToday({
      streamSlots: [{ date: "2026-08-22", time: "20:00" }],
      streamRoomUrl: "https://www.showroom-live.com/r/example",
      banner: NONE_BANNER,
    });
    const slot = todayItems.find(({ activityId }) => activityId === "live-stream");
    assert.ok(slot);
    assert.match(slot.value, /2026\.08\.22 20:00〜/);
    assert.match(slot.note, /終了時刻は確認できていません。/);
    assert.doesNotMatch(slot.value, /〜\s*\d{1,2}:\d{2}\s*$/);
    assert.equal(slot.cta.url, "https://www.showroom-live.com/r/example");
  });

  it("keeps the radio disclaimer and never asserts a personal appearance", () => {
    const { todayItems } = homeToday({
      radioPhase: "window",
      now: Date.parse("2026-08-23T10:30:00+09:00"),
      banner: NONE_BANNER,
    });
    const radio = todayItems.find(({ activityId }) => activityId === "radio");
    assert.ok(radio);
    assert.match(radio.value, new RegExp(radioProgram.programName));
    assert.match(radio.note, /みりぃ本人の出演時間を示すものではありません/);
    assert.doesNotMatch(
      JSON.stringify(todayItems),
      /みりぃ出演中|みりぃが出演|みりぃの出演時間/,
    );
  });

  it("suppresses what the ActivityBanner already shows", () => {
    const now = Date.parse("2026-08-22T12:00:00+09:00");
    const live = {
      ...unknownLive,
      state: "live",
      roomUrl: "https://www.showroom-live.com/r/example",
    };
    const streamSlots = [{ date: "2026-08-22", time: "20:00" }];

    // SHOWROOM 実ライブ: バナーが「配信中」と CTA を出しているので繰り返さない
    const duringLive = homeToday({ live, streamSlots, now });
    assert.equal(
      duringLive.nowItems.some(({ origin }) => origin === "showroom-live"),
      false,
    );
    assert.equal(
      duringLive.todayItems.some(({ activityId }) => activityId === "live-stream"),
      false,
    );

    // 今日の予定枠をバナーが出しているときも同じ枠を繰り返さない
    const beforeSlot = homeToday({
      streamSlots,
      now: Date.parse("2026-08-22T09:00:00+09:00"),
    });
    assert.equal(
      beforeSlot.todayItems.some(({ activityId }) => activityId === "live-stream"),
      false,
    );

    // バナーが出していない枠は残す（抑制しすぎない）
    const withoutBanner = homeToday({
      streamSlots,
      now,
      banner: { kind: "NONE", stateLabel: "", title: "" },
    });
    assert.equal(
      withoutBanner.todayItems.some(({ activityId }) => activityId === "live-stream"),
      true,
    );
    // コンテストの審査段階はバナーの担当ではないので常に残る
    assert.equal(
      duringLive.todayItems.some(({ key }) => key === "today:contest"),
      true,
    );
  });

  it("keeps the confirmed vote schedule in SupportEvents instead of home UI", () => {
    assert.equal(supportEvents.length, 10);
    assert.equal(supportEvents[0].activityId, "campus-girls");
    assert.equal(supportEvents[0].kind, "vote");
    const homeSources = [
      "src/components/TodayDashboard.tsx",
      "src/components/Support.tsx",
      "src/components/ActivitiesGateway.tsx",
      "src/lib/homeToday.ts",
      "src/lib/navigation.ts",
    ].map(code).join("\n");
    assert.doesNotMatch(homeSources, /\d{4}-\d{2}-\d{2}/);
    assert.doesNotMatch(homeSources, /\b\d{1,2}:\d{2}\b/);
    assert.doesNotMatch(homeSources, /showroom-live\.com|misscircle\.jp|fm-smw\.jp|paton\.jp/);
    assert.doesNotMatch(homeSources, /\d{6}/);
  });
});

describe("P6 home NOW stays compact", () => {
  // design 9.5「トップに巨大なCalendarを置かず、NOW最大2件と /support/ 導線に留める」
  const now = Date.parse("2026-08-23T10:30:00+09:00"); // 日曜・放送枠の中
  const liveRoomUrl = "https://www.showroom-live.com/r/example";
  const live = { ...unknownLive, state: "live", roomUrl: liveRoomUrl };

  function radioOnAir() {
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

  const events = [
    periodSupportEvent("alpha", "2026-08-23T09:00:00+09:00", "2026-08-23T12:00:00+09:00"),
    periodSupportEvent("bravo", "2026-08-23T10:00:00+09:00", "2026-08-23T11:00:00+09:00"),
  ];

  const crowded = {
    supportEvents: events,
    live,
    radio: radioOnAir(),
    now,
    banner: NONE_BANNER,
  };

  it("caps the home NOW projection at two items", () => {
    // 素の selector は4件返す（期間2件 + SHOWROOM live + radio）
    const all = selectSupportNow({
      supportEvents: events,
      live,
      radio: radioOnAir(),
      now,
    });
    assert.equal(all.length, 4);

    const { nowItems } = homeToday(crowded);
    assert.equal(HOME_NOW_LIMIT, 2);
    assert.equal(nowItems.length, HOME_NOW_LIMIT);
  });

  it("picks the two by a deterministic priority", () => {
    const { nowItems } = homeToday(crowded);
    assert.deepEqual(
      nowItems.map(({ origin }) => origin),
      ["showroom-live", "radio-program"],
    );
    // 同じ入力からは常に同じ2件（順序も含めて）
    assert.deepEqual(nowItems, homeToday(crowded).nowItems);
  });

  it("keeps the selector order inside one origin", () => {
    const { nowItems } = homeToday({
      supportEvents: events,
      live: unknownLive,
      radio: null,
      now,
      banner: NONE_BANNER,
    });
    assert.deepEqual(
      nowItems.map(({ key }) => key),
      ["now:support-event:alpha", "now:support-event:bravo"],
    );
  });

  it("applies the cap after banner suppression, not before", () => {
    // バナーがSHOWROOM LIVEを出しているので live項目は落ち、
    // 空いた枠を radio と最初の応援期間が使う
    const { nowItems } = homeToday({
      ...crowded,
      banner: { kind: "SHOWROOM_LIVE", stateLabel: "配信中", title: "ただいまSHOWROOMで配信中！" },
    });
    assert.deepEqual(
      nowItems.map(({ origin }) => origin),
      ["radio-program", "support-event"],
    );
    assert.equal(nowItems.some(({ origin }) => origin === "showroom-live"), false);
  });

  it("never invents or reorders items beyond the cap", () => {
    const source = selectSupportNow({
      supportEvents: events,
      live,
      radio: radioOnAir(),
      now,
    });
    const ranked = rankHomeNowItems(source);
    // 並べ替えるだけ。項目の中身も件数も変えない。
    assert.equal(ranked.length, source.length);
    assert.deepEqual(
      [...ranked].map(({ key }) => key).sort(),
      [...source].map(({ key }) => key).sort(),
    );
    // 入力配列を破壊しない
    assert.deepEqual(source, selectSupportNow({
      supportEvents: events,
      live,
      radio: radioOnAir(),
      now,
    }));
  });

  it("leaves /support/ showing every NOW item", () => {
    const page = source("src/SupportPage.tsx");
    // Support Hub は selector を直接使う。ホームの上限を持ち込まない。
    assert.match(page, /selectSupportNow\(\{/);
    assert.doesNotMatch(page, /HOME_NOW_LIMIT|rankHomeNowItems|homeToday/);
    assert.doesNotMatch(page, /nowItems\.slice\(/);
    // 4件入力でも Support 側は4件のまま
    assert.equal(
      selectSupportNow({
        supportEvents: events,
        live,
        radio: radioOnAir(),
        now,
      }).length,
      4,
    );
  });
});

describe("P6 anchor targets clear the compact header", () => {
  const CSS_FALLBACK_PX = 5 * 16; // index.css の `--header-offset: 5rem`

  it("derives the offset from the measured header instead of fixed breakpoints", () => {
    assert.equal(SECTION_ANCHOR_OFFSET, "[scroll-margin-top:var(--header-offset)]");
    assert.doesNotMatch(SECTION_ANCHOR_OFFSET, /scroll-mt-/);
  });

  it("keeps a CSS fallback that clears the compact closed header", () => {
    const css = source("src/index.css");
    assert.match(css, /--header-offset:\s*5rem;/);
    assert.ok(CSS_FALLBACK_PX >= 57);
  });

  it("publishes the measured height from the Header, with cleanup", () => {
    const header = source("src/components/Header.tsx");
    assert.match(header, /const HEADER_OFFSET_GAP_PX = 8;/);
    assert.match(header, /ResizeObserver/);
    assert.match(header, /setProperty\(\s*"--header-offset",/);
    assert.match(header, /\$\{height \+ HEADER_OFFSET_GAP_PX\}px/);
    assert.match(header, /getBoundingClientRect\(\)\.height/);
    assert.match(header, /Math\.ceil/);
    // unmount と非対応環境の後始末
    assert.match(header, /observer\.disconnect\(\)/);
    assert.match(header, /removeProperty\("--header-offset"\)/);
    assert.match(header, /typeof ResizeObserver === "undefined"/);
    assert.match(header, /ref=\{headerRef\}/);
  });

  it("does not grow the header when events appear", () => {
    assert.deepEqual(sectionNavigation(0), sectionNavigation(1));
    assert.equal(visibleNavItems(0).length, visibleNavItems(1).length);
    assert.equal(SECTION_ANCHOR_OFFSET.split(" ").length, 1);
  });

  it("uses the shared offset on every remaining home section", () => {
    const sections = [
      ["src/components/TodayDashboard.tsx", "today"],
      ["src/components/Support.tsx", "support"],
      ["src/components/ActivitiesGateway.tsx", "activities"],
      ["src/components/Socials.tsx", "links"],
      ["src/components/Latest.tsx", "latest"],
      ["src/components/Stories.tsx", "stories"],
      ["src/components/Gallery.tsx", "gallery"],
    ];
    for (const [file, id] of sections) {
      const text = source(file);
      assert.match(text, new RegExp(`id="${id}"`), `${file} keeps id="${id}"`);
      assert.match(
        text,
        /\$\{SECTION_ANCHOR_OFFSET\}/,
        `${file} must use the shared anchor offset`,
      );
      assert.doesNotMatch(
        text,
        /scroll-mt-\d/,
        `${file} must not keep a fixed breakpoint offset`,
      );
    }
  });

  it("keeps the compact header nav tappable and overflow-free", () => {
    const header = source("src/components/Header.tsx");
    assert.doesNotMatch(header, /overflow-x-auto|whitespace-nowrap/);
    assert.match(header, /min-h-11/);
    assert.doesNotMatch(header, /min-h-10\b/);
    assert.match(header, /aria-expanded=\{open\}/);
  });
});

describe("P6 keeps a SHOWROOM CTA the banner does not offer", () => {
  const now = Date.parse("2026-08-22T12:00:00+09:00");
  const slots = [{ date: "2026-08-22", time: "20:00" }];
  const roomUrl = "https://www.showroom-live.com/r/circle2026_0734";

  function view(live, streamRoomUrl) {
    const banner = deriveBannerState({ live, radio: null, slots }, now);
    return {
      banner,
      ...selectHomeToday({
        contest,
        supportEvents: [],
        streamSlots: slots,
        streamRoomUrl,
        live,
        radio: null,
        radioPhase: "idle",
        banner,
        now,
      }),
    };
  }

  it("retains the direct SHOWROOM CTA while the banner falls back to /support/", () => {
    const { banner, todayItems, retainedActions } = view(unknownLive, roomUrl);
    assert.equal(banner.kind, "SHOWROOM_TODAY");
    assert.equal(banner.href, "/support/"); // バナーはSupport Hubへ退避する
    // 行そのものの重複抑制は維持する
    assert.equal(
      todayItems.some(({ activityId }) => activityId === "live-stream"),
      false,
    );
    // 行き先の違うCTAは残す
    assert.deepEqual(retainedActions, [
      { label: "SHOWROOMで見る", url: roomUrl },
    ]);
  });

  it("suppresses the CTA when the banner already links to the same URL", () => {
    const live = { ...unknownLive, roomUrl };
    const { banner, retainedActions } = view(live, roomUrl);
    assert.equal(banner.href, roomUrl);
    assert.deepEqual(retainedActions, []);
  });

  it("retains nothing when the item has no CTA at all", () => {
    const { retainedActions } = view(unknownLive, null);
    assert.deepEqual(retainedActions, []);
  });

  it("does not duplicate a SHOWROOM live CTA the banner already shows", () => {
    const live = { ...unknownLive, state: "live", roomUrl };
    const { banner, todayItems, retainedActions } = view(live, roomUrl);
    assert.equal(banner.kind, "SHOWROOM_LIVE");
    assert.equal(banner.href, roomUrl);
    assert.equal(
      todayItems.some(({ activityId }) => activityId === "live-stream"),
      false,
    );
    assert.deepEqual(retainedActions, []);
  });

  it("only picks up SHOWROOM actions and never repeats a destination", () => {
    const banner = { kind: "SHOWROOM_TODAY", stateLabel: "予定", title: "今日の配信", href: "/support/" };
    const showroom = {
      key: "today:showroom:2026-08-22T20:00",
      activityId: "live-stream",
      label: "確認済みの配信枠",
      value: "2026.08.22 20:00〜",
      cta: { label: "SHOWROOMで見る", url: roomUrl },
    };
    const radio = {
      key: "today:radio-program",
      activityId: "radio",
      label: "本日の番組枠",
      value: "番組",
      cta: { label: "ラジオを聴く", url: radioProgram.listenUrl },
    };
    // 同じ行き先が2件来ても1件に畳む
    assert.deepEqual(
      retainedTodayActions(banner, [showroom, { ...showroom, key: "dup" }, radio]),
      [{ label: "SHOWROOMで見る", url: roomUrl }],
    );
    // ラジオはバナー側が聴取導線を担当するので拾わない
    assert.deepEqual(retainedTodayActions(banner, [radio]), []);
  });

  it("renders the retained actions in the dashboard CTA row", () => {
    const dashboard = source("src/components/TodayDashboard.tsx");
    assert.match(dashboard, /retainedActions/);
    assert.match(dashboard, /secondaryActions\.map\(\(action\) =>/);
    assert.match(dashboard, /href=\{action\.url\}/);
    assert.match(dashboard, /\{action\.label\}/);
    assert.match(dashboard, /key=\{action\.url\}/);
  });
});

describe("P6 keeps the confirmed SHOWROOM fallback CTA", () => {
  const now = Date.parse("2026-08-22T12:00:00+09:00"); // 土曜・放送枠の外
  const confirmed = socials.find(({ platform }) => platform === "showroom");
  const NONE = { kind: "NONE", stateLabel: "", title: "" };

  function view({ live = unknownLive, streamRoomUrl = null, streamSlots = [] } = {}) {
    const banner = deriveBannerState({ live, radio: null, slots: streamSlots }, now);
    return {
      banner,
      ...selectHomeToday({
        contest,
        supportEvents: [],
        streamSlots,
        streamRoomUrl,
        live,
        radio: null,
        radioPhase: "idle",
        banner,
        now,
      }),
    };
  }

  it("takes the fallback URL from socials.ts and hardcodes nothing", () => {
    assert.ok(confirmed, "socials.ts must hold a confirmed SHOWROOM entry");
    assert.equal(confirmedShowroomAction().url, confirmed.url);
    assert.equal(confirmed.confirmed, true);
    // URLの正本は socials.ts だけ。projection側に文字列で持たない。
    assert.doesNotMatch(code("src/lib/homeToday.ts"), /showroom-live\.com/);
    assert.match(code("src/lib/homeToday.ts"), /socials\.find/);
  });

  it("keeps the SHOWROOM CTA when both endpoints give nothing", () => {
    // schedule も live も unavailable。枠が無いことと取得できないことを混ぜない。
    const { banner, todayItems, retainedActions, fallbackActions } = view();
    assert.equal(banner.kind, "NONE");
    assert.deepEqual(retainedActions, []);
    assert.deepEqual(fallbackActions, [
      { label: "SHOWROOMで見る", url: confirmed.url },
    ]);
    // 取得できないことを「予定なし」と書かない
    assert.equal(todayItems.some(({ activityId }) => activityId === "live-stream"), false);
    assert.doesNotMatch(
      [code("src/components/TodayDashboard.tsx"), code("src/lib/homeToday.ts")].join("\n"),
      /予定なし|配信なし/,
    );
  });

  it("still offers it when a slot exists but no room URL was resolved", () => {
    const { banner, fallbackActions } = view({
      streamSlots: [{ date: "2026-08-22", time: "20:00" }],
    });
    // `/support/` はSHOWROOM導線ではないので fallback を残す
    assert.equal(banner.href, "/support/");
    assert.deepEqual(fallbackActions.map(({ url }) => url), [confirmed.url]);
  });

  it("never doubles up when something already points at SHOWROOM", () => {
    const slots = [{ date: "2026-08-22", time: "20:00" }];
    // バナーが直接のSHOWROOM URLを出している
    const withLiveUrl = view({
      live: { ...unknownLive, roomUrl: confirmed.url },
      streamRoomUrl: confirmed.url,
      streamSlots: slots,
    });
    assert.deepEqual(withLiveUrl.fallbackActions, []);

    // retainedActions が既にSHOWROOMへ送っている
    const retained = view({ streamRoomUrl: confirmed.url, streamSlots: slots });
    assert.equal(retained.retainedActions.length, 1);
    assert.deepEqual(retained.fallbackActions, []);

    // 実ライブ中
    const live = view({
      live: { ...unknownLive, state: "live", roomUrl: confirmed.url },
      streamRoomUrl: confirmed.url,
    });
    assert.deepEqual(live.fallbackActions, []);

    // どのケースでもSHOWROOM導線は多くても1本
    for (const v of [withLiveUrl, retained, live, view()]) {
      const showroomCtas = [
        ...v.todayItems.map(({ cta }) => cta?.url),
        ...v.retainedActions.map(({ url }) => url),
        ...v.fallbackActions.map(({ url }) => url),
      ].filter((url) => typeof url === "string" && url.includes("showroom-live.com"));
      assert.ok(showroomCtas.length <= 1, JSON.stringify(showroomCtas));
    }
  });

  it("compares by origin so another room path does not add a second button", () => {
    const otherRoom = "https://www.showroom-live.com/r/another_room";
    const todayItem = {
      key: "today:showroom:2026-08-22T20:00",
      activityId: "live-stream",
      label: "確認済みの配信枠",
      value: "2026.08.22 20:00〜",
      cta: { label: "SHOWROOMで見る", url: otherRoom },
    };
    assert.deepEqual(
      fallbackShowroomActions({
        banner: NONE,
        todayItems: [todayItem],
        nowItems: [],
        retainedActions: [],
      }),
      [],
    );
    // NOW側の導線でも同じ判定になる
    assert.deepEqual(
      fallbackShowroomActions({
        banner: NONE,
        todayItems: [],
        nowItems: [
          {
            key: "now:showroom-live",
            origin: "showroom-live",
            activityId: "live-stream",
            title: "SHOWROOMで配信中",
            cta: { label: "いますぐ見る", url: otherRoom },
          },
        ],
        retainedActions: [],
      }),
      [],
    );
    // 別ドメインの導線は関係ない
    assert.deepEqual(
      fallbackShowroomActions({
        banner: { ...NONE, href: radioProgram.listenUrl },
        todayItems: [],
        nowItems: [],
        retainedActions: [],
      }).map(({ url }) => url),
      [confirmed.url],
    );
  });

  it("renders retained and fallback actions in one CTA row", () => {
    const dashboard = source("src/components/TodayDashboard.tsx");
    assert.match(dashboard, /fallbackActions/);
    assert.match(dashboard, /retainedActions, \.\.\.fallbackActions/);
    assert.match(dashboard, /secondaryActions\.map\(\(action\) =>/);
    assert.match(dashboard, /offeredUrls/);
    // SNS chip の構成は変えない（showroom は従来どおり chip に入れない）
    assert.match(dashboard, /const SNS_PLATFORMS = \["x", "instagram", "tiktok"\] as const;/);
  });

  it("leaves /support/ untouched by the home fallback", () => {
    const page = source("src/SupportPage.tsx");
    assert.doesNotMatch(page, /fallbackShowroomActions|confirmedShowroomAction|homeToday/);
    assert.match(page, /buildSupportCalendar\(/);
  });
});
