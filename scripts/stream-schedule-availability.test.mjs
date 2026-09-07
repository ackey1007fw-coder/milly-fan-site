import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  createStreamScheduleLoader,
  INITIAL_STREAM_SCHEDULE_STATE,
  STREAM_SCHEDULE_TIMEOUT_MS,
  toStreamScheduleView,
} from "../src/lib/useStreamSchedule.ts";

function response(data, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    async json() {
      return data;
    },
  };
}

function fakeTimers() {
  let nextId = 1;
  const pending = new Map();
  const delays = [];
  const cleared = [];
  return {
    timers: {
      setTimeout(handler, ms) {
        const id = nextId++;
        pending.set(id, handler);
        delays.push(ms);
        return id;
      },
      clearTimeout(id) {
        cleared.push(id);
        pending.delete(id);
      },
    },
    pending,
    delays,
    cleared,
    run(id) {
      pending.get(id)?.();
    },
  };
}

describe("SHOWROOM schedule availability", () => {
  it("starts in loading while preserving the existing slots and roomUrl shape", () => {
    assert.deepEqual(INITIAL_STREAM_SCHEDULE_STATE, {
      slots: [],
      roomUrl: null,
      availability: "loading",
    });
  });

  it("returns ok with confirmed slots and a validated roomUrl", async () => {
    let signal;
    const clock = fakeTimers();
    const load = createStreamScheduleLoader({
      fetcher: async (_input, init) => {
        signal = init?.signal;
        return response({
          ok: true,
          slots: [{ date: "2026-08-23", time: "20:00" }],
          source: { roomUrl: "https://www.showroom-live.com/r/confirmed" },
        });
      },
      timers: clock.timers,
    });

    assert.deepEqual(await load(), {
      slots: [{ date: "2026-08-23", time: "20:00" }],
      roomUrl: "https://www.showroom-live.com/r/confirmed",
      availability: "ok",
    });
    assert.ok(signal instanceof AbortSignal);
    assert.equal(signal.aborted, false);
    assert.deepEqual(clock.delays, [STREAM_SCHEDULE_TIMEOUT_MS]);
    assert.deepEqual(clock.cleared, [1]);
    assert.equal(clock.pending.size, 0);
  });

  it("keeps a successful zero-slot response distinct from unavailable", async () => {
    const load = createStreamScheduleLoader({
      fetcher: async () =>
        response({ ok: true, slots: [], source: { roomUrl: null } }),
    });

    assert.deepEqual(await load(), {
      slots: [],
      roomUrl: null,
      availability: "ok",
    });
  });

  it("maps HTTP, network, and response-processing failures to unavailable", async () => {
    const failures = [
      async () => response({ ok: true, slots: [] }, { ok: false, status: 503 }),
      async () => {
        throw new Error("network failure");
      },
      async () => response(null),
      async () => response({ ok: true }),
      async () => {
        return {
          ok: true,
          status: 200,
          async json() {
            throw new Error("Unexpected token in JSON");
          },
        };
      },
    ];

    for (const fetcher of failures) {
      const load = createStreamScheduleLoader({ fetcher });
      assert.deepEqual(await load(), {
        slots: [],
        roomUrl: null,
        availability: "unavailable",
      });
    }
  });

  it("rejects every malformed remote slot before success caching", async () => {
    const invalidSlots = [
      [{ date: "2026-02-31", time: "20:00" }],
      [{ date: "2026-08-23", time: "24:00" }],
      [{ date: "2026-08-23" }],
      [
        { date: "2026-08-23", time: "20:00" },
        { date: "not-a-date", time: "21:00" },
      ],
    ];

    for (const slots of invalidSlots) {
      const load = createStreamScheduleLoader({
        fetcher: async () => response({ ok: true, slots }),
      });
      assert.deepEqual(await load(), {
        slots: [],
        roomUrl: null,
        availability: "unavailable",
      });
    }
  });

  it("does not cache an invalid slot response and retries successfully", async () => {
    let calls = 0;
    const load = createStreamScheduleLoader({
      fetcher: async () => {
        calls += 1;
        return calls === 1
          ? response({
              ok: true,
              slots: [{ date: "2026-02-31", time: "20:00" }],
            })
          : response({
              ok: true,
              slots: [{ date: "2026-08-24", time: "20:00" }],
            });
      },
    });

    assert.equal((await load()).availability, "unavailable");
    assert.deepEqual(await load(), {
      slots: [{ date: "2026-08-24", time: "20:00" }],
      roomUrl: null,
      availability: "ok",
    });
    assert.equal(calls, 2);
  });

  it("caches only success and retries after a failure", async () => {
    let calls = 0;
    const load = createStreamScheduleLoader({
      fetcher: async () => {
        calls += 1;
        if (calls === 1) throw new Error("temporary failure");
        return response({ ok: true, slots: [], source: { roomUrl: null } });
      },
      now: () => Date.parse("2026-08-22T12:00:00+09:00"),
    });

    assert.equal((await load()).availability, "unavailable");
    assert.equal((await load()).availability, "ok");
    assert.equal((await load()).availability, "ok");
    assert.equal(calls, 2);
  });

  it("treats an HTTP 200 payload with ok:false as unavailable", async () => {
    // /api/mily-schedule は room 解決や上流取得に失敗しても HTTP 200 のまま
    // { ok:false, slots: [] } を返す。これを成功と誤認しない。
    const load = createStreamScheduleLoader({
      fetcher: async () =>
        response({ ok: false, slots: [], reason: "room not resolved" }),
    });

    assert.deepEqual(await load(), {
      slots: [],
      roomUrl: null,
      availability: "unavailable",
    });
  });

  it("preserves only a verified SHOWROOM roomUrl from an unavailable payload", async () => {
    const verified = createStreamScheduleLoader({
      fetcher: async () =>
        response({
          ok: false,
          slots: [],
          source: { roomUrl: "https://www.showroom-live.com/r/verified" },
        }),
    });
    assert.deepEqual(await verified(), {
      slots: [],
      roomUrl: "https://www.showroom-live.com/r/verified",
      availability: "unavailable",
    });

    for (const roomUrl of [
      "/r/relative",
      "not a URL",
      "https://example.com/r/not-showroom",
      "https://www.showroom-live.com.evil.example/r/not-showroom",
      "https://www.showroom-live.com:444/r/not-showroom",
    ]) {
      const invalid = createStreamScheduleLoader({
        fetcher: async () =>
          response({ ok: false, slots: [], source: { roomUrl } }),
      });
      assert.equal((await invalid()).roomUrl, null);
    }
  });

  it("does not read a roomUrl from an HTTP error body", async () => {
    const load = createStreamScheduleLoader({
      fetcher: async () =>
        response(
          {
            ok: false,
            slots: [],
            source: { roomUrl: "https://www.showroom-live.com/r/ignored" },
          },
          { ok: false, status: 503 },
        ),
    });
    assert.deepEqual(await load(), {
      slots: [],
      roomUrl: null,
      availability: "unavailable",
    });
  });

  it("keeps manual fallback slots and a verified roomUrl during unavailability", () => {
    const now = Date.parse("2026-08-22T12:00:00+09:00");
    const view = toStreamScheduleView(
      {
        slots: [],
        roomUrl: "https://www.showroom-live.com/r/verified",
        availability: "unavailable",
      },
      [{ date: "2026-08-23", time: "20:00" }],
      now,
    );
    assert.deepEqual(view, {
      slots: [{ date: "2026-08-23", time: "20:00" }],
      manualSlots: [{ date: "2026-08-23", time: "20:00" }],
      roomUrl: "https://www.showroom-live.com/r/verified",
      availability: "unavailable",
    });
  });

  it("treats a missing payload ok flag as unavailable", async () => {
    const load = createStreamScheduleLoader({
      fetcher: async () =>
        response({ slots: [{ date: "2026-08-23", time: "20:00" }] }),
    });

    assert.deepEqual(await load(), {
      slots: [],
      roomUrl: null,
      availability: "unavailable",
    });
  });

  it("never caches an ok:false payload and retries on the next use", async () => {
    let calls = 0;
    const load = createStreamScheduleLoader({
      fetcher: async () => {
        calls += 1;
        if (calls <= 2) return response({ ok: false, slots: [] });
        return response({
          ok: true,
          slots: [{ date: "2026-08-24", time: "21:00" }],
          source: { roomUrl: null },
        });
      },
      now: () => Date.parse("2026-08-22T12:00:00+09:00"),
    });

    assert.equal((await load()).availability, "unavailable");
    assert.equal((await load()).availability, "unavailable");
    assert.equal(calls, 2);

    const recovered = await load();
    assert.equal(recovered.availability, "ok");
    assert.deepEqual(recovered.slots, [{ date: "2026-08-24", time: "21:00" }]);
    assert.equal(calls, 3);
  });

  it("caches a successful payload for five minutes and refetches after the TTL", async () => {
    let calls = 0;
    let now = Date.parse("2026-08-22T12:00:00+09:00");
    const load = createStreamScheduleLoader({
      fetcher: async () => {
        calls += 1;
        return response({ ok: true, slots: [], source: { roomUrl: null } });
      },
      now: () => now,
    });

    assert.equal((await load()).availability, "ok");
    now += 4 * 60 * 1000;
    assert.equal((await load()).availability, "ok");
    assert.equal(calls, 1);

    now += 2 * 60 * 1000;
    assert.equal((await load()).availability, "ok");
    assert.equal(calls, 2);
  });

  it("times out a stalled request, clears inFlight, and retries without caching", async () => {
    let calls = 0;
    const signals = [];
    const clock = fakeTimers();
    const load = createStreamScheduleLoader({
      fetcher: async (_input, init) => {
        calls += 1;
        const signal = init?.signal;
        signals.push(signal);
        if (calls > 1) {
          return response({ ok: true, slots: [], source: { roomUrl: null } });
        }
        return await new Promise((_resolve, reject) => {
          const abort = () => reject(new DOMException("aborted", "AbortError"));
          if (signal?.aborted) abort();
          else signal?.addEventListener("abort", abort, { once: true });
        });
      },
      timers: clock.timers,
    });

    const stalled = load();
    assert.equal(load(), stalled, "concurrent callers share the in-flight request");
    clock.run(1);
    assert.deepEqual(await stalled, {
      slots: [],
      roomUrl: null,
      availability: "unavailable",
    });
    assert.equal(signals[0].aborted, true);
    assert.deepEqual(clock.cleared, [1]);

    assert.equal((await load()).availability, "ok");
    assert.equal(calls, 2, "timeout is not cached and the next use retries");
    assert.deepEqual(clock.cleared, [1, 2]);
    assert.equal(clock.pending.size, 0);
  });

  it("uses only the official schedule after success, including moved and cancelled slots", () => {
    const now = Date.parse("2026-09-06T08:25:00+09:00");
    const manual = [
      { date: "2026-09-06", time: "14:40", endTime: "15:20" },
      { date: "2026-09-06", time: "22:30", endTime: "23:00" },
      { date: "2026-09-08", time: "07:00", endTime: "08:00" },
    ];
    const official = [
      { date: "2026-09-06", time: "21:30" },
      { date: "2026-09-08", time: "07:00" },
    ];
    const snapshot = { slots: official, roomUrl: null, availability: "ok" };
    assert.deepEqual(toStreamScheduleView(snapshot, manual, now).slots, official);
    assert.deepEqual(toStreamScheduleView({ ...snapshot, slots: [] }, manual, now).slots, []);
    // A fetch failure is distinct from a successful empty official schedule.
    assert.deepEqual(toStreamScheduleView({ ...snapshot, slots: [], availability: "unavailable" }, manual, now).slots, manual);
  });

  it("keeps the confirmed manual fallback separate from the fetched slots", async () => {
    // 手入力fallbackはAPIの成否と無関係に確認済みなので、hookは両方を返す。
    const hook = readFileSync(
      new URL("../src/lib/useStreamSchedule.ts", import.meta.url),
      "utf8",
    );
    assert.match(hook, /withShowroomNext\(toStreamScheduleView\(fetched, streamSchedule, now\), live, now\)/);

    assert.match(hook, /manualSlots: upcomingSlots\(manual, \[\], now\)/);
    assert.match(hook, /ok\?: boolean/);
    assert.match(hook, /response\.ok !== true/);
    assert.match(hook, /response\.slots\.every\(\(slot\) => isValidSlot\(slot\)\)/);
  });

  it("matches the endpoint contract that reports failure with HTTP 200", () => {
    // 契約の正本は api/mily-schedule.js。失敗時も status 200 + ok:false を返す。
    const api = readFileSync(
      new URL("../api/mily-schedule.js", import.meta.url),
      "utf8",
    );
    assert.match(api, /return \{ ok: false, slots: \[\], reason: err\.message \}/);
    assert.match(api, /reason: "room not resolved"/);
    assert.match(api, /res\.status\(200\)\.json\(payload\)/);
  });
});
