import assert from "node:assert/strict";
import { it } from "node:test";
import { createPublicScheduleReader } from "../src/lib/webmcp/schedule.ts";
import { radioProgram, schedulePhase } from "../src/data/radio.ts";
const now = Date.parse("2026-09-11T17:36:00+09:00");
const room = "https://www.showroom-live.com/r/circle2026_0734";
const manual = [{ date: "2026-09-11", time: "10:00", endTime: "10:30" }, { date: "2026-09-11", time: "18:00", endTime: "19:00" }];
const official = [{ date: "2026-09-11", time: "18:00" }, { date: "2026-09-12", time: "08:00" }];
const jsonResponse = data => new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
const live = (overrides = {}) => ({ ok: true, roomUrl: room, live: { state: "offline", observedAt: new Date(now).toISOString() }, next: { state: "scheduled", at: "2026-09-11T21:00:00+09:00" }, ...overrides });
const make = ({ schedule = { ok: true, slots: official, source: { roomUrl: room } }, observation = null, fetcher, clock = () => now, slots = manual } = {}) => createPublicScheduleReader({ now: clock, manualSlots: slots, fetcher: fetcher ?? (async url => jsonResponse(url === "/api/mily-schedule" ? schedule : observation)) });
const input = { kind: "all", limit: 5 };

it("webmcp schedule: fresh SHOWROOM next replaces same-day official slots and keeps later official days", async () => {
  const value = await make({ observation: live() })(input);
  assert.equal(value.showroom.sourceMode, "showroom-next");
  assert.deepEqual(value.showroom.slots.map(s => [s.date, s.time]), [["2026-09-11", "21:00"], ["2026-09-12", "08:00"]]);
  assert.equal(value.showroom.nextObservedAt, new Date(now).toISOString());
  assert.equal(value.timeZone, "Asia/Tokyo");
  assert.equal(value.radio.milyAppearanceConfirmed, null);
});
it("webmcp schedule: successful empty official schedule cannot resurrect manual entries", async () => {
  const value = await make({ schedule: { ok: true, slots: [] } })(input);
  assert.equal(value.showroom.availability, "ok"); assert.equal(value.showroom.sourceMode, "contest-official");
  assert.deepEqual(value.showroom.slots, []);
});
for (const [name, schedule] of Object.entries({ falseOk: { ok: false, slots: [] }, missingOk: { slots: [] }, invalidEntry: { ok: true, slots: [{ date: "2026-02-30", time: "10:00" }] }, nullPayload: null })) {
  it(`webmcp schedule: ${name} becomes manual fallback, not successful empty`, async () => {
    const value = await make({ schedule })(input);
    assert.equal(value.showroom.sourceMode, "manual-fallback");
    assert.equal(value.showroom.availability, "unavailable");
    assert.deepEqual(value.showroom.slots.map(s => s.time), ["18:00"]);
  });
}
for (const [name, response] of Object.entries({ html: () => new Response("<html>not json</html>", { headers: { "content-type": "text/html" } }), oversized: () => jsonResponse({ ok: true, slots: [], junk: "x".repeat(70000) }), httpError: () => new Response("unavailable", { status: 503 }), networkError: () => { throw new Error("DO_NOT_EXPOSE_FIXTURE"); } })) {
  it(`webmcp schedule: ${name} safely degrades without raw response leakage`, async () => {
    const value = await make({ fetcher: async () => response() })(input);
    assert.equal(value.showroom.sourceMode, "manual-fallback");
    assert.ok(!JSON.stringify(value).includes("DO_NOT_EXPOSE_FIXTURE"));
  });
}
for (const [name, observation] of Object.entries({ stale: live({ live: { state: "offline", observedAt: new Date(now - 90000).toISOString() } }), future: live({ live: { state: "offline", observedAt: new Date(now + 1).toISOString() } }), wrongRoom: live({ roomUrl: "https://example.com/" }), credentials: live({ roomUrl: "https://name:password@www.showroom-live.com/r/circle2026_0734" }), pastNext: live({ next: { state: "scheduled", at: new Date(now).toISOString() } }), falseOk: live({ ok: false }) })) {
  it(`webmcp schedule: ${name} is not trusted as a fresh registered next slot`, async () => {
    const value = await make({ observation })(input);
    assert.equal(value.showroom.sourceMode, "contest-official"); assert.equal(value.showroom.nextObservedAt, null);
    assert.equal(value.showroom.slots[0].time, "18:00");
  });
}
it("webmcp schedule: successful next slot does not mix manual fallback when contest is unavailable", async () => {
  const value = await make({ schedule: { ok: false }, observation: live() })(input);
  assert.equal(value.showroom.availability, "ok"); assert.equal(value.showroom.contestAvailability, "unavailable");
  assert.deepEqual(value.showroom.slots.map(s => s.time), ["21:00"]);
});
it("webmcp schedule: radio is recurring SSOT only and requires no network", async () => {
  let calls = 0;
  const value = await make({ fetcher: async () => { calls++; throw new Error(); } })({ kind: "radio", limit: 3 });
  assert.equal(calls, 0); assert.equal(value.showroom, undefined);
  assert.equal(value.radio.programName, radioProgram.programName);
  assert.equal(value.radio.schedulePhase, schedulePhase(now));
  assert.equal(value.radio.weekday, radioProgram.weekday);
  assert.equal(value.radio.milyAppearanceConfirmed, null);
  assert.equal(value.radio.onAirConfirmed, undefined);
});
it("webmcp schedule: uses only fixed read endpoints with omitted credentials and rejected redirects", async () => {
  const calls = [];
  const value = await make({ fetcher: async (url, init) => { calls.push([url, init]); return jsonResponse(url === "/api/mily-schedule" ? { ok: true, slots: official } : null); } })({ kind: "showroom", limit: 1 });
  assert.deepEqual(new Set(calls.map(c => c[0])), new Set(["/api/mily-schedule", "/api/mily-live"]));
  for (const [, init] of calls) { assert.equal(init.method, "GET"); assert.equal(init.credentials, "omit"); assert.equal(init.redirect, "error"); assert.ok(init.signal); }
  assert.equal(value.radio, undefined); assert.equal(value.showroom.slots.length, 1); assert.equal(value.showroom.total, 2);
});
it("webmcp schedule: cache obeys existing five-minute TTL and labels generation separately", async () => {
  let at = now; let scheduleCalls = 0;
  const reader = make({ clock: () => at, fetcher: async url => { if (url === "/api/mily-schedule") { scheduleCalls++; return jsonResponse({ ok: true, slots: official }); } return jsonResponse(null); } });
  await reader(input); at += 299999;
  const cached = await reader(input); assert.equal(scheduleCalls, 1);
  assert.equal(cached.generatedAt, new Date(at).toISOString()); assert.match(cached.showroom.notice, /再確認時刻ではありません/);
  at++; await reader(input); assert.equal(scheduleCalls, 2);
});
it("webmcp schedule: expiry is evaluated after fetch and at confirmed end boundary", async () => {
  const reader = make({ schedule: { ok: false }, clock: () => Date.parse("2026-09-11T19:00:00+09:00") });
  assert.deepEqual((await reader(input)).showroom.slots, []);
});
it("webmcp schedule: cancellation before reading performs no requests", async () => {
  let calls = 0; const controller = new AbortController(); controller.abort();
  await assert.rejects(make({ fetcher: async () => { calls++; return jsonResponse(null); } })(input, controller.signal), { name: "AbortError" });
  assert.equal(calls, 0);
});
it("webmcp schedule: unknown upstream fields are excluded from results", async () => {
  const value = await make({ schedule: { ok: true, slots: [{ ...official[0], secret: "DO_NOT_EXPOSE_FIXTURE" }], secret: "DO_NOT_EXPOSE_FIXTURE" }, observation: { ...live(), secret: "DO_NOT_EXPOSE_FIXTURE" } })(input);
  assert.ok(!JSON.stringify(value).includes("DO_NOT_EXPOSE_FIXTURE"));
});
