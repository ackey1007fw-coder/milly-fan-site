import { useSyncExternalStore } from "react";
import type { SchedulePhase } from "../../shared/radio-program.js";
import type { RadioStatus } from "../data/radio";
import { schedulePhaseStore } from "./scheduleClock.ts";
import {
  createPollStore,
  expireLivePayload,
  expireRadioOnAir,
  liveExpiresAt,
  radioExpiresAt,
  toLiveView,
  type LivePayload,
  type LiveView,
} from "./realtimeStore.ts";

export type { LivePayload, LiveView };
export { toLiveView };

/**
 * リアルタイム状態の取得を1系統に集約するフック。
 * ActivityBanner と TodayDashboard が別々に poll しないよう、
 * モジュールスコープの store を共有する。
 */
const LIVE_POLL_MS = 60_000;
const RADIO_POLL_MS = 180_000;

const CLIENT_TIMEOUT_MS = 8000;

/** 8秒のクライアント timeout。unmount 時の abort signal とも連動させる。 */
async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const timeout = new AbortController();
  const timer = window.setTimeout(() => timeout.abort(), CLIENT_TIMEOUT_MS);
  const onAbort = () => timeout.abort();
  signal.addEventListener("abort", onAbort);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: timeout.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // body 読了までを timeout の対象にする
    return (await res.json()) as T;
  } finally {
    window.clearTimeout(timer);
    signal.removeEventListener("abort", onAbort);
  }
}

// 取得失敗時はライブ状態を捨てる（古い「配信中」を残さない）。
// さらに observedAt + 90秒で store 自身が UNKNOWN へ畳んで通知するので、
// 次の fetch を待たずに表示が「配信中」から降りる。
const liveStore = createPollStore<LivePayload>({
  fetcher: (signal) => fetchJson<LivePayload>("/api/mily-live", signal),
  intervalMs: LIVE_POLL_MS,
  clearOnError: true,
  expiresAt: (payload, now) => liveExpiresAt(payload, now),
  onExpire: expireLivePayload,
});

// ラジオも同様に、NOW ON AIR の確認結果だけを TTL で畳む。
// 放送枠（日曜10:00-13:00）は shared/radio-program.js から時刻で再導出するので、
// API が落ちても「放送時間です」までは安全に出せる。
const radioStore = createPollStore<RadioStatus>({
  fetcher: (signal) => fetchJson<RadioStatus>("/api/mily-radio-status", signal),
  intervalMs: RADIO_POLL_MS,
  clearOnError: true,
  expiresAt: (payload, now) => radioExpiresAt(payload, now),
  onExpire: expireRadioOnAir,
});

export function useMilyRealtimeStatus(): {
  live: LiveView;
  radio: RadioStatus | null;
  schedulePhase: SchedulePhase;
} {
  const live = useShowroomLive();
  const radio = useSyncExternalStore(
    radioStore.subscribe,
    radioStore.getSnapshot,
    () => null,
  );
  // 購読するだけで境界時刻に再評価が走る（値そのものは表示側で使わなくてよい）
  const schedulePhase = useSyncExternalStore(
    schedulePhaseStore.subscribe,
    schedulePhaseStore.getSnapshot,
    () => "idle" as SchedulePhase,
  );

  return { live, radio, schedulePhase };
}

/** 次回予定も同じstoreを購読し、ページ内の追加取得を発生させない。 */
export function useShowroomLive(): LiveView {
  const payload = useSyncExternalStore(
    liveStore.subscribe,
    liveStore.getSnapshot,
    () => null,
  );
  return toLiveView(payload);
}
