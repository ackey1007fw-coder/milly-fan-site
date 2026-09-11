import assert from "node:assert/strict";
import { it } from "node:test";
import { readFileSync } from "node:fs";
import { createReadOnlyTools } from "../src/lib/webmcp/tools.ts";
import { installReadOnlyTools, resolveModelContext } from "../src/lib/webmcp/registry.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";
const decode = result => JSON.parse(result.content[0].text);
const makeTools = (overrides = {}) => Object.fromEntries(createReadOnlyTools({ loadRecaps: async () => streamRecaps, loadSchedule: async () => ({ fixture: true }), ...overrides }).map(t => [t.name, t]));
const call = async (name, input, overrides) => decode(await makeTools(overrides)[name].execute(input));
const expectedNames = ["get_latest_schedule", "search_live_archives", "find_song", "get_live_recap"];

it("webmcp: four read-only tools have closed schemas and no write operations", () => {
  const tools = makeTools();
  assert.deepEqual(Object.keys(tools), expectedNames);
  for (const tool of Object.values(tools)) {
    assert.deepEqual(tool.annotations, { readOnlyHint: true, untrustedContentHint: true, consequentialHint: false });
    assert.equal(tool.inputSchema.additionalProperties, false);
  }
});
for (const [label, input] of Object.entries({ null: null, array: [], string: "x", extra: { url: "invalid" }, largeQuery: { query: "x".repeat(121) }, queryType: { query: 2 }, zeroLimit: { limit: 0 }, largeLimit: { limit: 6 }, nullLimit: { limit: null }, textLimit: { limit: "3" }, fraction: { limit: 1.2 }, negativeOffset: { offset: -1 }, nullOffset: { offset: null }, impossibleDate: { date: "2026-02-30" }, nonLeap: { date: "2026-02-29" }, dateTime: { date: "2026-09-10T00:00:00" }, blankDate: { date: "" }, platform: { platform: "other" } })) {
  it(`webmcp input: rejects ${label} before loading data`, async () => {
    let calls = 0;
    const value = await call("search_live_archives", input, { loadRecaps: async () => { calls++; return []; } });
    assert.equal(value.error, "INVALID_ARGUMENT"); assert.equal(calls, 0);
  });
}
it("webmcp: default and paginated search retain SSOT order without mutation", async () => {
  const before = JSON.stringify(streamRecaps);
  const first = await call("search_live_archives");
  assert.deepEqual(first.items.map(r => r.id), streamRecaps.slice(0, 3).map(r => r.id));
  assert.equal(first.total, streamRecaps.length); assert.equal(first.nextOffset, 3);
  const next = await call("search_live_archives", { offset: 3, limit: 2 });
  assert.deepEqual(next.items.map(r => r.id), streamRecaps.slice(3, 5).map(r => r.id));
  assert.equal((await call("search_live_archives", { offset: 10000 })).items.length, 0);
  assert.equal((await call("search_live_archives", { date: "2024-02-29" })).total, 0);
  assert.equal(JSON.stringify(streamRecaps), before);
});
it("webmcp: September 10 exact date yields the approved morning recap and two explicit songs", async () => {
  const records = await call("search_live_archives", { date: "2026-09-10" });
  assert.deepEqual(records.items.map(r => r.id), ["2026-09-10-asa-showroom"]);
  const songs = await call("find_song", { date: "2026-09-10", limit: 5 });
  assert.deepEqual(new Set(songs.items.map(s => s.title)), new Set(["ケセラセラ", "かわいいだけじゃだめですか？"]));
  for (const s of songs.items) {
    assert.equal(s.sourceUrl, "/activities/live/#recap-2026-09-10-asa-showroom");
    assert.ok(s.originalSongUrl.startsWith("https://www.youtube.com/"));
  }
  assert.match(songs.notice, /配信での使用音源は未確認/);
});
it("webmcp: song search normalizes width/case, distinguishes artists, and never infers songs", async () => {
  const songs = await call("find_song", { query: "ｍＥＬＡ　緑黄", limit: 5 });
  assert.ok(songs.items.length > 0); assert.ok(songs.items.every(s => s.title === "Mela!"));
  assert.equal((await call("find_song", { query: "Mela", artist: "unknown" })).total, 0);
  const noSinging = { ...streamRecaps[0], summary: "Mela!を紹介", songs: undefined };
  assert.equal((await call("find_song", {}, { loadRecaps: async () => [noSinging] })).total, 0);
});
it("webmcp: search filters platform and finds highlight text", async () => {
  const base = { ...streamRecaps[0], highlights: [{ timestamp: "0:00:00", title: "ＡＢＣ", body: "検索の話" }] };
  const deps = { loadRecaps: async () => [base, { ...base, id: "2026-09-11-example", platformLabel: "MixChannel" }] };
  assert.equal((await call("search_live_archives", { query: "ａｂｃ 検索", platform: "SHOWROOM" }, deps)).total, 1);
});
it("webmcp: exact IDs prevent ambiguity and historical next notes stay historical", async () => {
  assert.equal((await call("get_live_recap", {})).error, "INVALID_ARGUMENT");
  assert.equal((await call("get_live_recap", { id: "2026-09-10" })).error, "INVALID_ARGUMENT");
  assert.equal((await call("get_live_recap", { id: "2026-09-10-not-found" })).found, false);
  const r = streamRecaps.find(r => r.id === "2026-09-10-asa-showroom");
  const overview = await call("get_live_recap", { id: r.id });
  assert.equal(overview.historicalNextNote, r.nextNote);
  assert.match(overview.nextNoteNotice, /現在の予定にはget_latest_schedule/);
  for (const section of ["highlights", "songs", "timeline"]) {
    const out = await call("get_live_recap", { id: r.id, section, limit: 1 });
    assert.equal(out.items.length, 1); assert.equal(out.total, r[section].length);
  }
});
it("webmcp: projects only public fields and excludes images, raw records and unknown nested data", async () => {
  const marker = "DO_NOT_EXPOSE_FIXTURE";
  const r = { ...streamRecaps[0], internal: marker, image: { src: marker }, gallery: [{ src: marker }], galleryZip: { src: marker }, ranking: [marker], songs: [{ title: "Example", artist: "Example", timestamp: "0:00:00", youtubeUrl: "https://www.youtube.com/watch?v=aRDURmIYBZ4", secret: marker, karaoke: { youtubeUrl: "https://www.youtube.com/watch?v=W5ykal8c4rY", channel: "Example", secret: marker } }], highlights: [{ timestamp: "0:00:00", title: "Example", body: "Example", quote: marker, secret: marker }] };
  const deps = { loadRecaps: async () => [r] };
  for (const [name, args] of [["search_live_archives", {}], ["find_song", {}], ...["overview", "highlights", "songs", "timeline"].map(section => ["get_live_recap", { id: r.id, section }])]) {
    assert.ok(!JSON.stringify(await call(name, args, deps)).includes(marker));
  }
});
it("webmcp: unexpected errors and oversized results fail without leaking details", async () => {
  const bad = await call("search_live_archives", {}, { loadRecaps: async () => { throw new Error("DO_NOT_EXPOSE_FIXTURE"); } });
  assert.equal(bad.error, "UNAVAILABLE"); assert.ok(!JSON.stringify(bad).includes("DO_NOT_EXPOSE_FIXTURE"));
  const huge = await call("search_live_archives", {}, { loadRecaps: async () => [{ ...streamRecaps[0], summary: "x".repeat(13000) }] });
  assert.equal(huge.error, "OUTPUT_LIMIT");
});
it("webmcp: cancellations stop delivery before and during async reads", async () => {
  let calls = 0;
  const deps = { loadRecaps: async () => { calls++; return new Promise(() => {}); } };
  const tool = makeTools(deps).search_live_archives;
  const pre = new AbortController(); pre.abort();
  assert.equal(decode(await tool.execute({}, { signal: pre.signal })).error, "CANCELLED"); assert.equal(calls, 0);
  const mid = new AbortController();
  const pending = tool.execute({}, { signal: mid.signal });
  await Promise.resolve(); mid.abort();
  assert.equal(decode(await pending).error, "CANCELLED");
});
it("webmcp: schedule validates kind, passes cancellation, and has no write input", async () => {
  let args;
  const deps = { loadSchedule: async (input, signal) => { args = [input, signal]; return { ok: true }; } };
  assert.equal((await call("get_latest_schedule", { kind: "delete" }, deps)).error, "INVALID_ARGUMENT");
  const controller = new AbortController();
  await makeTools(deps).get_latest_schedule.execute({ kind: "radio", limit: 2 }, { signal: controller.signal });
  assert.deepEqual(args[0], { kind: "radio", limit: 2 }); assert.equal(args[1], controller.signal);
});
it("webmcp: source links correspond to existing recap anchors and no extra data master", () => {
  const page = readFileSync(new URL("../src/ActivitiesPage.tsx", import.meta.url), "utf8");
  assert.match(page, /id=\{`recap-\$\{recap\.id\}`\}/);
  const bootstrap = readFileSync(new URL("../src/lib/webmcp/bootstrap.ts", import.meta.url), "utf8");
  assert.match(bootstrap, /import\("\.\.\/\.\.\/data\/streamRecaps.ts"\)/);
  assert.match(bootstrap, /window\.isSecureContext/); assert.match(bootstrap, /window\.top === window/);
  assert.doesNotMatch(bootstrap, /setInterval\(|provideContext\(|clearContext\(/);
});

it("webmcp registry: document is preferred, legacy detected, unavailable getters contained", () => {
  const current = { registerTool() {} }; const legacy = { registerTool() {} };
  assert.equal(resolveModelContext({ modelContext: current }, { modelContext: legacy }), current);
  assert.equal(resolveModelContext({}, { modelContext: legacy }), legacy);
  assert.equal(resolveModelContext({ get modelContext() { throw new Error(); } }), null);
  assert.equal(resolveModelContext(undefined, undefined), null);
});
it("webmcp registry: async registration is idempotent, abort cleans owned tools only", async () => {
  const active = new Map([["foreign", {}]]);
  const context = { async registerTool(t, { signal }) { await Promise.resolve(); active.set(t.name, t); signal.addEventListener("abort", () => active.delete(t.name), { once: true }); } };
  const tools = Object.values(makeTools());
  const one = installReadOnlyTools(context, tools); assert.equal(installReadOnlyTools(context, tools), one);
  assert.deepEqual(await one.ready, expectedNames); one.dispose(); await one.ready; await Promise.resolve();
  assert.deepEqual([...active.keys()], ["foreign"]);
});
it("webmcp registry: rejected duplicates rollback owned tools but never unregister a foreign name", async () => {
  const active = new Map([["find_song", {}]]); const removed = [];
  const context = { async registerTool(t) { if (active.has(t.name)) throw new Error("duplicate"); active.set(t.name, t); }, unregisterTool(name) { removed.push(name); active.delete(name); } };
  assert.deepEqual(await installReadOnlyTools(context, Object.values(makeTools())).ready, []);
  assert.deepEqual([...active.keys()], ["find_song"]);
  assert.deepEqual(removed, ["get_latest_schedule", "search_live_archives"]);
});
it("webmcp registry: dispose during a legacy async registration leaves no tool behind", async () => {
  let release; const active = new Set();
  const context = { registerTool(t) { return new Promise(resolve => { release = () => { active.add(t.name); resolve(); }; }); }, unregisterTool(name) { active.delete(name); } };
  const installation = installReadOnlyTools(context, Object.values(makeTools()));
  await Promise.resolve(); installation.dispose(); release();
  assert.deepEqual(await installation.ready, []); assert.equal(active.size, 0);
});
