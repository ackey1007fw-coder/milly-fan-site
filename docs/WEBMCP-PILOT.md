# WebMCP read-only pilot

Status: experimental implementation for the home page and `/activities/live/` only.
This document does not claim that the change is merged, deployed, or verified in a ChatGPT client.
Repository policy remains in `AGENTS.md`; no Project Memory files are introduced.

## Scope and source of truth

The four tools read the same public data as the existing site. They never publish, edit,
delete, vote, download recordings, access local files, or read account credentials.
The ordinary React UI is unchanged. Unsupported browsers simply do not register tools.
Registration itself does not fetch schedules or import the recap dataset on the home page;
the two providers load on demand. No runtime dependency, API key, MCP server, origin-trial
token, browser extension, or background job is introduced.

| Tool | Inputs | Result |
| --- | --- | --- |
| `get_latest_schedule` | `kind`: all/showroom/radio; `limit` | Current/future SHOWROOM slots with source/fallback status, and the radio program's recurring timetable |
| `search_live_archives` | `query`, JST `date`, `platform`, `limit`, `offset` | Public recap summaries and links, not recording files |
| `find_song` | `query`, exact `artist`, JST `date`, `limit`, `offset` | Explicit song performances and approved original/reference links |
| `get_live_recap` | exact `id`, `section`: overview/highlights/songs/timeline; pagination | Selected public recap fields with provenance and historical caveats |

The returned `content[0].text` is JSON. Paginated results contain `total`, `offset`, and
`nextOffset`. Default limit is 3; maximum is 5. Query/artist are limited to 120 characters,
IDs to 80, offsets to 10,000. Unknown arguments, wrong types and impossible dates are
rejected before any provider call. Result JSON is capped at 12,000 characters; exceeding
that limit returns a small `OUTPUT_LIMIT` error rather than damaged/truncated JSON.
`INVALID_ARGUMENT`, `UNAVAILABLE` and `CANCELLED` errors contain no internal exception text.

### Example calls

```js
search_live_archives({ date: "2026-09-10" })
find_song({ date: "2026-09-10", limit: 5 })
get_live_recap({ id: "2026-09-10-asa-showroom", section: "highlights", limit: 3 })
get_latest_schedule({ kind: "all", limit: 3 })
```

These illustrate tool names and arguments, not global JavaScript functions. On a compatible
browser, discover the registered tool using the browser API or its inspector first.
Returned source links are relative to the current site. Recap links reuse existing
`#recap-<id>` anchors and their open-on-navigation behavior.

## Data and freshness boundaries

- Recaps: `src/data/streamRecaps.ts`, already-published per-stream records only. Fields are
  explicitly projected. Images, galleries, ZIPs, ranking arrays, quotes and unknown nested
  properties are not returned. No raw recording or full transcript is indexed.
- Songs: existing `buildStreamSongCatalog` / `selectCatalogSongs` and explicit `songs` only.
  Talk about a song is not proof of singing. Original YouTube links are not recordings of
  Mily's singing; karaoke links are reference accompaniment, not confirmed stream audio.
- Historical `nextNote` is returned as `historicalNextNote`, with a warning. It is never
  copied to the current schedule.
- Schedules: reuse `createStreamScheduleLoader`, `toStreamScheduleView`, `toLiveView`,
  `showroomNextSlot`, and `withShowroomNext`. A fresh verified SHOWROOM registered next
  slot takes precedence; only later official contest dates complement it. A successful
  empty response remains empty. Manual fallback is explicitly marked and used only when
  appropriate under the existing rules. Expired slots are removed at execution time.
- The on-demand schedule reader has its own success-only five-minute loader cache, separate
  from the UI hook's singleton. It has no timer-driven polling. `generatedAt` is response
  generation time, not proof of an upstream re-check. The next-slot observation time is
  returned only for a valid fresh observation.
- Network access is restricted in code to GET `/api/mily-schedule` and `/api/mily-live`,
  omits credentials and rejects redirects. JSON responses are bounded at 64 KiB; existing
  schedule timeout and the live timeout are 8 seconds. Cancelling a tool stops delivery;
  a shared in-flight schedule read may settle separately within its existing timeout.
- Radio: reuse `shared/radio-program.js` via `radio.ts`. This pilot returns the recurring
  program timetable, not actual NOW ON AIR status. `milyAppearanceConfirmed` is always null.
  A program window is not evidence that Mily is currently appearing.

## Registration and compatibility

The adapter prefers `document.modelContext.registerTool`, following Chrome's imperative
API documentation updated 2026-09-11. It awaits registration and uses AbortSignal cleanup.
A feature-detected `navigator.modelContext` fallback supports older imperative interfaces
on a best-effort basis; this is not a claim about every older client. Registration failures
roll back only tools registered by this adapter. It never clears a context or unregisters
a name whose registration failed. Repeat installation is idempotent; HMR disposes owned tools.

Registration requires a secure, top-level document on one of the two pilot routes. No
cross-origin exposure or permissive security headers are added. Read-only/untrusted-content
annotations describe the tools; they are not used as an authorization mechanism. Public
text returned by tools remains data, not instructions for an agent to execute.

Chrome currently documents a local development flag at
`chrome://flags/#enable-webmcp-testing` and an origin trial. Neither a user's browser settings
nor site trial enrollment is changed by this PR. A browser/client must actually visit a
compatible page to discover its tools; this is not an automatically installed ChatGPT app
or a remotely callable MCP endpoint. A native browser test and a ChatGPT-client test must
be recorded separately from unit tests or mocked API tests.

Primary references, checked 2026-09-11:
- https://developer.chrome.com/docs/ai/webmcp
- https://developer.chrome.com/docs/ai/webmcp/imperative-api
- https://developer.chrome.com/docs/ai/webmcp/secure-tools
- https://webmachinelearning.github.io/webmcp/

## Verification and rollback

```sh
pnpm typecheck
node --disable-warning=ExperimentalWarning --experimental-strip-types --test scripts/webmcp.test.mjs scripts/webmcp-schedule.test.mjs
pnpm test
pnpm build
pnpm guard
# Use the isolated Playwright 1.61.1 installation already used by CI:
PLAYWRIGHT_MODULE_ROOT=/path/to/isolated/node_modules node --disable-warning=ExperimentalWarning --experimental-strip-types scripts/webmcp.browser.mjs
```

Unit tests cover input/size limits, cancellation, field projection, real September 10 song
records, historical notes, duplicate registration rollback, API errors, cache expiry,
SHOWROOM precedence, and the radio non-confirmation rule. Browser tests use an isolated
production build, block outside-network requests, and cover Chromium desktop/mobile,
WebKit mobile without WebMCP, document/navigator API mocks, unchanged DOM, working recap
links, and absence of registration on non-pilot pages. They are not native/client certification.

Reverting the two bootstrap imports disables registration without changing data or the UI.
The supporting new directory/tests can be removed in the same revert. No database migration,
secret, domain, account setting or public material needs to be rolled back.
