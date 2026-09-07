// 「実際に動かす」テスト。
// ソース文字列の照合ではなく、store / resolver / handler を呼び出して
// 状態遷移と HTTP 契約を確かめる。
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createPollStore,
  expireLivePayload,
  expireRadioOnAir,
  liveExpiresAt,
  radioExpiresAt,
  toLiveView,
  LIVE_STALE_MS,
  ONAIR_STALE_MS,
} from "../src/lib/realtimeStore.ts";
import { createSchedulePhaseStore } from "../src/lib/scheduleClock.ts";
import {
  dashboardDisplay,
  deriveBannerState,
  programState,
} from "../src/lib/bannerState.ts";
import {
  msUntilNextPhaseChange,
  radioProgram,
  schedulePhase,
} from "../shared/radio-program.js";
import {
  resetRoomCache,
  resolveMilyRoom,
  selectRoom,
} from "../server/mily-showroom.js";
import liveHandler from "../api/mily-live.js";
import radioHandler from "../api/mily-radio-status.js";

const ROOM_URL = "https://www.showroom-live.com/r/circle2026_0734";

/** now() を進めて期限の来た timer だけを実行する仮想時計。 */
function fakeClock(start = Date.parse("2026-08-16T03:00:00.000Z")) {
  let now = start;
  let seq = 0;
  const queue = new Map();
  const timers = {
    setTimeout: (handler, ms) => {
      const id = ++seq;
      queue.set(id, { handler, at: now + ms });
      return id;
    },
    clearTimeout: (id) => queue.delete(id),
    now: () => now,
  };
  return {
    timers,
    now: () => now,
    pending: () => queue.size,
    advance(ms) {
      const target = now + ms;
      for (;;) {
        const due = [...queue.entries()]
          .filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        const [id, timer] = due;
        queue.delete(id);
        now = timer.at;
        timer.handler();
      }
      now = target;
    },
  };
}

/** document.visibilityState / window イベントの最小スタブ。 */
function stubDom(initial = "visible") {
  const handlers = new Map();
  const add = (type, fn) => {
    if (!handlers.has(type)) handlers.set(type, new Set());
    handlers.get(type).add(fn);
  };
  const remove = (type, fn) => handlers.get(type)?.delete(fn);
  const original = {
    document: globalThis.document,
    window: globalThis.window,
  };
  globalThis.document = {
    visibilityState: initial,
    addEventListener: add,
    removeEventListener: remove,
  };
  globalThis.window = { addEventListener: add, removeEventListener: remove };
  return {
    setVisibility(value) {
      globalThis.document.visibilityState = value;
    },
    dispatch(type) {
      for (const fn of handlers.get(type) ?? []) fn();
    },
    restore() {
      globalThis.document = original.document;
      globalThis.window = original.window;
    },
  };
}

function livePayload(state, observedAt) {
  return {
    ok: true,
    roomUrl: ROOM_URL,
    live: { state, liveId: state === "live" ? 1 : null, startedAt: null, observedAt },
    next: { state: "none", at: null },
  };
}

describe("LIVE は fetch を待たずに90秒で失効する", () => {
  it("timer だけで LIVE → UNKNOWN を購読者へ通知する", async () => {
    const clock = fakeClock();
    const observedAt = new Date(clock.now()).toISOString();
    let fetches = 0;
    const store = createPollStore(
      {
        fetcher: async () => {
          fetches += 1;
          return livePayload("live", observedAt);
        },
        intervalMs: 600_000,
        clearOnError: true,
        expiresAt: (payload, now) => liveExpiresAt(payload, now),
        onExpire: expireLivePayload,
      },
      clock.timers,
    );

    let notifications = 0;
    store.subscribe(() => {
      notifications += 1;
    });
    await store.refresh();
    assert.equal(fetches, 1);
    assert.equal(store.getSnapshot().live.state, "live");
    const notifiedAfterFetch = notifications;

    // 89秒: まだ fresh
    clock.advance(LIVE_STALE_MS - 1000);
    assert.equal(store.getSnapshot().live.state, "live");
    assert.equal(fetches, 1, "失効判定のために fetch を起こさない");

    // 90秒: fetch を起こさずに UNKNOWN へ落ちる
    clock.advance(1000);
    assert.equal(fetches, 1, "失効は timer だけで起きる");
    assert.equal(store.getSnapshot().live.state, "unknown");
    assert.ok(
      notifications > notifiedAfterFetch,
      "UI 相当の購読者へ通知されること",
    );
    // 表示側でも unknown
    assert.equal(toLiveView(store.getSnapshot(), clock.now()).state, "unknown");
  });

  it("失効時はroomUrlを残し、次回予定を未確認へ戻す", () => {
    const expired = expireLivePayload(livePayload("live", "2026-08-16T03:00:00.000Z"));
    assert.equal(expired.live.state, "unknown");
    assert.equal(expired.roomUrl, ROOM_URL);
    assert.deepEqual(expired.next, { state: "unknown", at: null });
    // 二重失効ループを作らない
    assert.equal(liveExpiresAt(expired), null);
  });

  it("未来の observedAt を fresh と見なさない", () => {
    const now = Date.parse("2026-08-16T03:00:00.000Z");
    const future = new Date(now + 1000).toISOString();
    assert.equal(toLiveView(livePayload("live", future), now).state, "unknown");
  });

  it("未来の observedAt を保存前に UNKNOWN へ畳み、時刻が追いついても復活させない", async () => {
    const start = Date.parse("2026-08-16T09:22:00+09:00");
    const clock = fakeClock(start);
    const future = new Date(start + 1000).toISOString();
    const store = createPollStore(
      {
        fetcher: async () => livePayload("live", future),
        intervalMs: 600_000,
        clearOnError: true,
        expiresAt: (payload, now) => liveExpiresAt(payload, now),
        onExpire: expireLivePayload,
      },
      clock.timers,
    );

    const unsubscribe = store.subscribe(() => {});
    await store.refresh();
    const collapsed = store.getSnapshot();
    assert.equal(collapsed.live.state, "unknown", "raw LIVE を store に保持しない");

    // 現実時間が future timestamp を追い越しても、同じ snapshot は復活しない。
    clock.advance(2000);
    const unsubscribeSecond = store.subscribe(() => {});
    assert.equal(store.expireIfStale(), false, "UNKNOWN は再失効も再評価も不要");
    assert.equal(store.getSnapshot(), collapsed, "collapse 済みの参照を維持する");
    assert.equal(store.getSnapshot().live.state, "unknown");
    assert.equal(toLiveView(store.getSnapshot(), clock.now()).state, "unknown");

    unsubscribeSecond();
    unsubscribe();
  });

  it("invalid / TTL 超過の LIVE 観測も保存前に UNKNOWN へ畳む", async () => {
    const clock = fakeClock();
    for (const observedAt of [
      "not-a-date",
      new Date(clock.now() - LIVE_STALE_MS).toISOString(),
    ]) {
      const store = createPollStore(
        {
          fetcher: async () => livePayload("live", observedAt),
          intervalMs: 600_000,
          expiresAt: (payload, now) => liveExpiresAt(payload, now),
          onExpire: expireLivePayload,
        },
        clock.timers,
      );
      const unsubscribe = store.subscribe(() => {});
      await store.refresh();
      assert.equal(store.getSnapshot().live.state, "unknown");
      unsubscribe();
    }
  });

  it("hidden 中に失効し、visible 復帰時は fetch 完了前に UNKNOWN になる", async () => {
    const dom = stubDom("visible");
    try {
      const clock = fakeClock();
      const observedAt = new Date(clock.now()).toISOString();
      let release;
      const gate = new Promise((resolve) => {
        release = resolve;
      });
      let fetches = 0;
      const store = createPollStore(
        {
          fetcher: async () => {
            fetches += 1;
            if (fetches === 1) return livePayload("live", observedAt);
            await gate; // 2回目は完了させない
            return livePayload("offline", new Date(clock.now()).toISOString());
          },
          intervalMs: 600_000,
          clearOnError: true,
          expiresAt: (payload, now) => liveExpiresAt(payload, now),
          onExpire: expireLivePayload,
        },
        clock.timers,
      );
      store.subscribe(() => {});
      await store.refresh();
      assert.equal(store.getSnapshot().live.state, "live");

      dom.setVisibility("hidden");
      dom.dispatch("visibilitychange");
      clock.advance(LIVE_STALE_MS);
      assert.equal(
        store.getSnapshot().live.state,
        "unknown",
        "hidden 中でも内部的に失効していること",
      );

      dom.setVisibility("visible");
      dom.dispatch("visibilitychange");
      // fresh fetch は未完了のまま
      assert.equal(store.getSnapshot().live.state, "unknown");
      release();
    } finally {
      dom.restore();
    }
  });
});

describe("hidden 中は初回取得しない", () => {
  it("hidden で mount したら fetch 0回、visible 復帰で1回", async () => {
    const dom = stubDom("hidden");
    try {
      const clock = fakeClock();
      let fetches = 0;
      const store = createPollStore(
        {
          fetcher: async () => {
            fetches += 1;
            return livePayload("offline", new Date(clock.now()).toISOString());
          },
          intervalMs: 60_000,
        },
        clock.timers,
      );
      const unsubscribe = store.subscribe(() => {});
      assert.equal(fetches, 0, "hidden 中の mount では取得しない");

      dom.setVisibility("visible");
      dom.dispatch("visibilitychange");
      await Promise.resolve();
      assert.equal(fetches, 1, "visible 復帰で即取得する");
      unsubscribe();
    } finally {
      dom.restore();
    }
  });
});

describe("ラジオは境界時刻で必ず再評価される", () => {
  it("API が 09:59 で止まっても 10:00 で WINDOW になる", () => {
    const stale0959 = {
      ok: true,
      programName: radioProgram.programName,
      todayScheduled: true,
      scheduledStart: radioProgram.scheduledStart,
      scheduledEnd: radioProgram.scheduledEnd,
      inScheduledWindow: false,
      schedulePhase: "upcoming",
      nextStartAt: "2026-08-16T01:00:00.000Z",
      onAirConfirmed: null,
      milyAppearanceConfirmed: null,
      listenUrl: radioProgram.listenUrl,
      sourceUrl: radioProgram.nowOnAirSourceUrl,
      lastVerifiedAt: radioProgram.lastVerifiedAt,
      updatedAt: "2026-08-16T00:59:00.000Z",
    };
    assert.equal(
      programState(stale0959, Date.parse("2026-08-16T09:59:00+09:00")),
      "PROGRAM_TODAY",
    );
    // API 停止中でも 10:00 を過ぎれば WINDOW
    assert.equal(
      programState(stale0959, Date.parse("2026-08-16T10:00:00+09:00")),
      "PROGRAM_WINDOW",
    );
  });

  it("API が 12:59 で止まっても 13:00 で IDLE になる", () => {
    const stale1259 = {
      programName: radioProgram.programName,
      inScheduledWindow: true,
      schedulePhase: "window",
      todayScheduled: true,
      onAirConfirmed: true,
      listenUrl: radioProgram.listenUrl,
      updatedAt: "2026-08-16T03:59:00.000Z",
    };
    assert.equal(
      programState(stale1259, Date.parse("2026-08-16T12:59:00+09:00")),
      "PROGRAM_WINDOW",
    );
    assert.equal(
      programState(stale1259, Date.parse("2026-08-16T13:00:00+09:00")),
      "IDLE",
    );
    const after = deriveBannerState(
      {
        live: { state: "offline", roomUrl: null },
        radio: stale1259,
        slots: [],
      },
      Date.parse("2026-08-16T13:00:00+09:00"),
    );
    assert.equal(after.kind, "NONE", "13:00 以降に古い『放送中』を残さない");
  });

  it("schedule clock が境界ちょうどで通知する", () => {
    const start = Date.parse("2026-08-16T09:59:30+09:00");
    const clock = fakeClock(start);
    const store = createSchedulePhaseStore(clock.timers);
    let notifications = 0;
    store.subscribe(() => {
      notifications += 1;
    });
    assert.equal(store.getSnapshot(), "upcoming");

    clock.advance(29_000); // 09:59:59
    assert.equal(store.getSnapshot(), "upcoming");
    assert.equal(notifications, 0);

    clock.advance(1_000); // 10:00:00
    assert.equal(store.getSnapshot(), "window");
    assert.equal(notifications, 1);

    clock.advance(3 * 60 * 60 * 1000); // 13:00:00
    assert.equal(store.getSnapshot(), "ended");
    assert.equal(notifications, 2);
  });

  it("次の境界までの待ち時間を秒精度で出す", () => {
    const at = Date.parse("2026-08-16T09:59:30+09:00");
    assert.equal(msUntilNextPhaseChange(at), 30_000);
    assert.equal(
      msUntilNextPhaseChange(Date.parse("2026-08-16T12:59:00+09:00")),
      60_000,
    );
    // 放送終了後は次の日曜10:00まで
    const afterEnd = Date.parse("2026-08-16T13:00:00+09:00");
    assert.equal(
      schedulePhase(afterEnd + msUntilNextPhaseChange(afterEnd)),
      "window",
    );
    // 平日も次の放送日の開始で phase が変わる
    const monday = Date.parse("2026-08-17T12:00:00+09:00");
    assert.equal(
      schedulePhase(monday + msUntilNextPhaseChange(monday)),
      "window",
    );
  });

  it("古い onAirConfirmed は store 側でも畳まれる", async () => {
    const clock = fakeClock();
    const updatedAt = new Date(clock.now()).toISOString();
    const payload = {
      programName: radioProgram.programName,
      onAirConfirmed: true,
      listenUrl: radioProgram.listenUrl,
      updatedAt,
    };
    const store = createPollStore(
      {
        fetcher: async () => payload,
        intervalMs: 600_000,
        clearOnError: true,
        expiresAt: (value, now) => radioExpiresAt(value, now),
        onExpire: expireRadioOnAir,
      },
      clock.timers,
    );
    store.subscribe(() => {});
    await store.refresh();
    assert.equal(store.getSnapshot().onAirConfirmed, true);

    clock.advance(ONAIR_STALE_MS);
    assert.equal(
      store.getSnapshot().onAirConfirmed,
      null,
      "TTL を過ぎた NOW ON AIR 確認結果は未確認へ戻す",
    );
    assert.equal(radioExpiresAt(store.getSnapshot()), null);
  });

  it("未来の updatedAt を保存前に null へ畳み、時刻が追いついても復活させない", async () => {
    const start = Date.parse("2026-08-16T09:22:00+09:00");
    const clock = fakeClock(start);
    const future = new Date(start + 1000).toISOString();
    const payload = {
      programName: radioProgram.programName,
      onAirConfirmed: true,
      listenUrl: radioProgram.listenUrl,
      updatedAt: future,
    };
    const store = createPollStore(
      {
        fetcher: async () => payload,
        intervalMs: 600_000,
        clearOnError: true,
        expiresAt: (value, now) => radioExpiresAt(value, now),
        onExpire: expireRadioOnAir,
      },
      clock.timers,
    );

    const unsubscribe = store.subscribe(() => {});
    await store.refresh();
    const collapsed = store.getSnapshot();
    assert.equal(collapsed.onAirConfirmed, null, "raw true を store に保持しない");

    clock.advance(2000);
    const unsubscribeSecond = store.subscribe(() => {});
    assert.equal(store.expireIfStale(), false);
    assert.equal(store.getSnapshot(), collapsed);
    assert.equal(store.getSnapshot().onAirConfirmed, null);

    unsubscribeSecond();
    unsubscribe();
  });
});

describe("room resolver は ambiguous と none を区別する", () => {
  const mily = {
    roomId: 573253,
    roomName: "🔥2次最終日🩵三橋莉子✨",
    roomUrlKey: "circle2026_0734",
  };
  const otherMily = { roomId: 999, roomName: "みりぃ 別room", roomUrlKey: "x" };
  const stranger = { roomId: 42, roomName: "別人のルーム", roomUrlKey: "y" };

  it("候補数で state を返す", () => {
    assert.equal(selectRoom([mily]).state, "unique");
    assert.equal(selectRoom([]).state, "none");
    assert.equal(selectRoom([stranger]).state, "none");
    assert.equal(selectRoom([mily, otherMily]).state, "ambiguous");
    assert.equal(selectRoom([mily, { ...mily }]).state, "unique");
  });

  /** ENTRY ページと SHOWROOM API を差し替えた状態で resolveMilyRoom を実行する。 */
  async function resolveWith({ html, rooms, env }) {
    const original = globalThis.fetch;
    resetRoomCache();
    globalThis.fetch = async (url) => {
      const target = String(url);
      if (target.includes("2026.misscircle.jp")) {
        return { ok: true, text: async () => html, json: async () => ({}) };
      }
      const key = /room_url_key=([^&]+)/.exec(target)?.[1];
      const id = /room_id=(\d+)/.exec(target)?.[1];
      const room = rooms.find(
        (candidate) =>
          (key && candidate.roomUrlKey === key) ||
          (id && String(candidate.roomId) === id),
      );
      if (!room) return { ok: false, status: 404, json: async () => ({}) };
      return {
        ok: true,
        json: async () => ({
          room_id: room.roomId,
          room_name: room.roomName,
          room_url_key: room.roomUrlKey,
        }),
      };
    };
    try {
      return await resolveMilyRoom(env);
    } finally {
      globalThis.fetch = original;
      resetRoomCache();
    }
  }

  const entryHtml = (keys) =>
    `<html><body>ENTRY 734 みりぃ（三橋莉子）${keys
      .map((key) => `<a href="https://www.showroom-live.com/r/${key}">SHOWROOM</a>`)
      .join("")}</body></html>`;

  it("候補0件なら env fallback を検証して使える", async () => {
    const resolved = await resolveWith({
      html: entryHtml([]),
      rooms: [mily],
      env: { MILY_SHOWROOM_ROOM_ID: String(mily.roomId) },
    });
    assert.equal(resolved?.roomId, mily.roomId);
    assert.equal(resolved?.source, "env-fallback");
  });

  it("候補が複数なら env fallback を使わない（曖昧を上書きしない）", async () => {
    const resolved = await resolveWith({
      html: entryHtml([mily.roomUrlKey, otherMily.roomUrlKey]),
      rooms: [mily, otherMily],
      env: { MILY_SHOWROOM_ROOM_ID: String(mily.roomId) },
    });
    assert.equal(resolved, null, "曖昧なときは未解決のままにする");
  });

  it("候補1件なら ENTRY 由来の解決を採用する", async () => {
    const resolved = await resolveWith({
      html: entryHtml([mily.roomUrlKey]),
      rooms: [mily, stranger],
      env: { MILY_SHOWROOM_ROOM_ID: String(stranger.roomId) },
    });
    assert.equal(resolved?.roomId, mily.roomId);
    assert.equal(resolved?.source, "entry-page");
  });
});

describe("API の HTTP 契約（handler を実行する）", () => {
  function fakeRes() {
    const headers = {};
    const result = { status: null, body: null, ended: false, headers };
    const res = {
      setHeader: (name, value) => {
        headers[name.toLowerCase()] = value;
      },
      status(code) {
        result.status = code;
        return res;
      },
      json(body) {
        result.body = body;
        return res;
      },
      end() {
        result.ended = true;
        return res;
      },
    };
    return { res, result };
  }

  /** ネットワークへ出ないようにしたうえで handler を呼ぶ。 */
  async function call(handler, method) {
    const original = globalThis.fetch;
    resetRoomCache();
    globalThis.fetch = async () => {
      throw new Error("offline");
    };
    const { res, result } = fakeRes();
    try {
      await handler({ method }, res);
    } finally {
      globalThis.fetch = original;
      resetRoomCache();
    }
    return result;
  }

  for (const [name, handler] of [
    ["/api/mily-live", liveHandler],
    ["/api/mily-radio-status", radioHandler],
  ]) {
    it(`${name}: GET は 200 と短命キャッシュ`, async () => {
      const result = await call(handler, "GET");
      assert.equal(result.status, 200);
      assert.match(result.headers["cache-control"], /s-maxage=12/);
      assert.match(result.headers["cache-control"], /stale-while-revalidate=12/);
      assert.equal(result.headers.allow, "GET, OPTIONS");
      assert.ok(result.body, "取得に失敗しても安全な JSON を返す");
    });

    it(`${name}: OPTIONS は 200 で Allow を返す`, async () => {
      const result = await call(handler, "OPTIONS");
      assert.equal(result.status, 200);
      assert.equal(result.headers.allow, "GET, OPTIONS");
      assert.equal(result.ended, true);
    });

    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
      it(`${name}: ${method} は 405`, async () => {
        const result = await call(handler, method);
        assert.equal(result.status, 405);
        assert.equal(result.headers.allow, "GET, OPTIONS");
        assert.equal(result.body.ok, false);
      });
    }
  }
});

describe("TodayDashboard は ActivityBanner と重複しない", () => {
  const slot = { date: "2026-08-16", time: "20:30" };
  const bannerLive = deriveBannerState(
    {
      live: { state: "live", roomUrl: ROOM_URL },
      radio: null,
      slots: [slot],
    },
    Date.parse("2026-08-16T18:00:00+09:00"),
  );

  it("実ライブ中は行も SHOWROOM CTA も出さない", () => {
    const view = dashboardDisplay({
      banner: bannerLive,
      hasNextSlot: true,
      bannerShowsSameSlot: false,
      nextSlotStatus: "today",
      showroomUrl: ROOM_URL,
    });
    assert.equal(bannerLive.kind, "SHOWROOM_LIVE");
    assert.equal(view.showNextStream, false);
    assert.equal(view.showShowroomCta, false, "同じ導線を二度出さない");
  });

  it("バナーが同じ枠を出しているなら行を繰り返さない", () => {
    const bannerToday = deriveBannerState(
      {
        live: { state: "offline", roomUrl: ROOM_URL },
        radio: null,
        slots: [slot],
      },
      Date.parse("2026-08-16T18:00:00+09:00"),
    );
    assert.equal(bannerToday.kind, "SHOWROOM_TODAY");
    const view = dashboardDisplay({
      banner: bannerToday,
      hasNextSlot: true,
      bannerShowsSameSlot: true,
      nextSlotStatus: "today",
      showroomUrl: ROOM_URL,
    });
    assert.equal(view.showNextStream, false);
    assert.equal(view.showShowroomCta, false);
  });

  it("導線が違えば SHOWROOM CTA は残す", () => {
    const view = dashboardDisplay({
      banner: bannerLive,
      hasNextSlot: false,
      bannerShowsSameSlot: false,
      nextSlotStatus: null,
      showroomUrl: "https://www.showroom-live.com/r/other_key",
    });
    assert.equal(view.showShowroomCta, true);
  });

  it("開始時刻を過ぎた枠を「次回配信」と呼ばない", () => {
    const view = dashboardDisplay({
      banner: { kind: "NONE", stateLabel: "", title: "" },
      hasNextSlot: true,
      bannerShowsSameSlot: false,
      nextSlotStatus: "past-start",
      showroomUrl: ROOM_URL,
    });
    assert.equal(view.showNextStream, true);
    assert.equal(view.nextStreamLabel, "配信予定時刻");
    assert.notEqual(view.nextStreamLabel, "次回配信");
  });

  it("これからの枠は「次回配信」のまま", () => {
    const view = dashboardDisplay({
      banner: { kind: "NONE", stateLabel: "", title: "" },
      hasNextSlot: true,
      bannerShowsSameSlot: false,
      nextSlotStatus: "today",
      showroomUrl: null,
    });
    assert.equal(view.nextStreamLabel, "次回配信");
    assert.equal(view.showShowroomCta, false, "URL が無ければ CTA も無い");
  });
});
