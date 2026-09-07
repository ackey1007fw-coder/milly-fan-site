/**
 * ポーリングの共通部品（React 非依存 = そのままテストできる）。
 *
 * - 前回の取得が終わってから次を予約する（setInterval の無条件連打をしない）
 * - 同時に複数の取得を走らせない
 * - 画面が隠れている間は止め、visible / focus / online 復帰で即取得
 * - 購読者が0になったら止める
 */
import {
  ONAIR_STALE_MS,
  isOnAirObservationStale,
} from "../../shared/radio-program.js";

export { ONAIR_STALE_MS, isOnAirObservationStale };

export type PollStoreOptions<T> = {
  fetcher: (signal: AbortSignal) => Promise<T>;
  intervalMs: number;
  /** 取得失敗時に前回値を捨てるか（ライブ状態は捨てたい） */
  clearOnError?: boolean;
  /**
   * 値が「事実として古すぎる」ようになる時刻(ms)。null なら失効しない。
   * fetch の成否と無関係に、この時刻で store 自身が値を畳んで通知する。
   */
  expiresAt?: (value: T, now: number) => number | null;
  /**
   * 失効時に値をどう畳むか。**新しい参照を返すこと**（useSyncExternalStore が
   * 変化を検知して再レンダーできるように）。省略時は null にする。
   */
  onExpire?: (value: T) => T | null;
};

export type PollStore<T> = {
  getSnapshot: () => T | null;
  subscribe: (listener: () => void) => () => void;
  /** 手動更新（テスト・即時取得用）。 */
  refresh: () => Promise<void>;
  /**
   * 現在時刻で失効判定だけを同期的に行う。失効していれば値を畳んで通知する。
   * @returns 失効させたら true
   */
  expireIfStale: () => boolean;
};

type Timers = {
  setTimeout: (handler: () => void, ms: number) => number;
  clearTimeout: (id: number) => void;
  now: () => number;
};

const defaultTimers: Timers = {
  setTimeout: (handler, ms) => globalThis.setTimeout(handler, ms) as unknown as number,
  clearTimeout: (id) => globalThis.clearTimeout(id),
  now: () => Date.now(),
};

export function createPollStore<T>(
  options: PollStoreOptions<T>,
  timers: Timers = defaultTimers,
): PollStore<T> {
  let value: T | null = null;
  let inFlight: Promise<void> | null = null;
  let controller: AbortController | null = null;
  let timerId: number | null = null;
  let expiryTimerId: number | null = null;
  const listeners = new Set<() => void>();

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const clearTimer = () => {
    if (timerId !== null) {
      timers.clearTimeout(timerId);
      timerId = null;
    }
  };

  const clearExpiryTimer = () => {
    if (expiryTimerId !== null) {
      timers.clearTimeout(expiryTimerId);
      expiryTimerId = null;
    }
  };

  const isHidden = () =>
    typeof document !== "undefined" && document.visibilityState === "hidden";

  /** 失効していれば値を畳んで通知する（fetch は起こさない）。 */
  const expireIfStale = (): boolean => {
    if (value === null || !options.expiresAt) return false;
    const now = timers.now();
    const at = options.expiresAt(value, now);
    if (at === null || now < at) return false;
    clearExpiryTimer();
    value = options.onExpire ? options.onExpire(value) : null;
    notify();
    return true;
  };

  /**
   * 次の失効時刻に合わせて timer を張る。
   * hidden 中でも張る（タブが隠れている間に事実が古くなるのを止めない）。
   */
  const scheduleExpiry = () => {
    clearExpiryTimer();
    if (value === null || !options.expiresAt) return;
    const now = timers.now();
    const at = options.expiresAt(value, now);
    if (at === null) return;
    const delay = Math.max(0, at - now);
    expiryTimerId = timers.setTimeout(() => {
      expiryTimerId = null;
      expireIfStale();
    }, delay);
  };

  const setValue = (next: T | null) => {
    const now = timers.now();
    if (next !== null && options.expiresAt) {
      const at = options.expiresAt(next, now);
      // Future / invalid / already-expired observations are collapsed before
      // they ever become the store snapshot. Keeping the raw value here would
      // let it become fresh later when wall-clock time catches up.
      value = at !== null && now >= at
        ? options.onExpire
          ? options.onExpire(next)
          : null
        : next;
    } else {
      value = next;
    }
    notify();
    scheduleExpiry();
  };

  const refresh = (): Promise<void> => {
    // 重複 fetch 禁止: 進行中があればそれを共有する
    if (inFlight) return inFlight;
    controller = new AbortController();
    inFlight = options
      .fetcher(controller.signal)
      .then((next) => {
        setValue(next);
      })
      .catch(() => {
        if (options.clearOnError) {
          clearExpiryTimer();
          setValue(null);
        }
      })
      .finally(() => {
        inFlight = null;
        controller = null;
        scheduleNext();
      });
    return inFlight;
  };

  const scheduleNext = () => {
    clearTimer();
    if (listeners.size === 0 || isHidden()) return;
    timerId = timers.setTimeout(() => {
      void refresh();
    }, options.intervalMs);
  };

  /**
   * 復帰時は **先に同期で失効判定**してから fetch する。
   * fetch の完了を待つ間、古い LIVE が DOM に残らないようにするため。
   */
  const onWake = () => {
    if (listeners.size === 0) return;
    expireIfStale();
    if (isHidden()) {
      clearTimer();
      return;
    }
    void refresh();
  };

  const bindWindowEvents = () => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("focus", onWake);
    window.addEventListener("online", onWake);
    document.addEventListener("visibilitychange", onWake);
    return () => {
      window.removeEventListener("focus", onWake);
      window.removeEventListener("online", onWake);
      document.removeEventListener("visibilitychange", onWake);
    };
  };

  let unbind: (() => void) | null = null;

  return {
    getSnapshot: () => value,
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) {
        unbind = bindWindowEvents();
        expireIfStale();
        // hidden 中に mount されたら取得しない。visible 復帰時に取りに行く。
        if (!isHidden()) void refresh();
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          clearTimer();
          clearExpiryTimer();
          // 最後の購読者が消えたら進行中の fetch も止める
          controller?.abort();
          controller = null;
          unbind?.();
          unbind = null;
        }
      };
    },
    refresh,
    expireIfStale,
  };
}

/** observedAt がこの時間より古い LIVE 情報は unknown に失効させる。 */
export const LIVE_STALE_MS = 90_000;

/**
 * 観測時刻が使えるか。
 *
 * **未来の timestamp は clock skew を許容せず即 stale** とする。
 * 許容してしまうと、壊れた・細工された observedAt で LIVE を無期限に
 * 保持できてしまう。安全側に倒して UNKNOWN にする。
 */
export function isObservationStale(
  observedAt: string | null | undefined,
  now: number = Date.now(),
  staleMs: number = LIVE_STALE_MS,
): boolean {
  if (typeof observedAt !== "string") return true;
  const parsed = Date.parse(observedAt);
  if (Number.isNaN(parsed)) return true;
  if (parsed > now) return true;
  return now - parsed >= staleMs;
}

/**
 * LIVE 情報の失効時刻(ms)。失効させる必要が無ければ null。
 * すでに unknown な観測はこれ以上畳めないので null（再失効ループを作らない）。
 */
export function liveExpiresAt(
  payload: LivePayload | null,
  now: number = Date.now(),
  staleMs: number = LIVE_STALE_MS,
): number | null {
  const state = payload?.live?.state;
  if (state !== "live" && state !== "offline" && payload?.next?.state !== "scheduled") return null;
  const observedAt = payload?.live?.observedAt;
  if (typeof observedAt !== "string") return now;
  const parsed = Date.parse(observedAt);
  if (Number.isNaN(parsed) || parsed > now) return now;
  return parsed + staleMs;
}

/**
 * 失効した LIVE 情報を UNKNOWN へ畳む。
 * roomUrlは保持し、次回予定も古い時刻を優先させないようUNKNOWNへ戻す。
 * **新しい参照を返す**ので、購読側は変化を検知できる。
 */
export function expireLivePayload(payload: LivePayload): LivePayload {
  return {
    ...payload,
    live: { ...payload.live, state: "unknown", liveId: null, startedAt: null },
    next: { state: "unknown", at: null },
  };
}

/** /api/mily-live のレスポンス。 */
export type LivePayload = {
  ok?: boolean;
  roomUrl?: string | null;
  live?: {
    state?: "live" | "offline" | "unknown";
    liveId?: number | null;
    startedAt?: string | null;
    observedAt?: string | null;
  };
  next?: { state?: "scheduled" | "none" | "unknown"; at?: string | null };
};

export type LiveView = {
  state: "live" | "offline" | "unknown";
  startedAt: string | null;
  observedAt: string | null;
  roomUrl: string | null;
  next: { state: "scheduled" | "none" | "unknown"; at: string | null };
};

/**
 * NOW ON AIR 確認結果の鮮度。判定本体は shared/radio-program.js が持つ
 * （表示側 bannerState.ts と store 側の両方から同じ規則を使うため）。
 */
export const RADIO_ONAIR_STALE_MS = ONAIR_STALE_MS;

/** /api/mily-radio-status のうち freshness 判定に使う部分だけ。 */
export type RadioFreshness = {
  onAirConfirmed?: boolean | null;
  updatedAt?: string | null;
};

/**
 * NOW ON AIR 確認結果の失効時刻(ms)。
 * `onAirConfirmed` が確定値でなければ畳むものが無いので null。
 */
export function radioExpiresAt<T extends RadioFreshness>(
  payload: T | null,
  now: number = Date.now(),
  staleMs: number = RADIO_ONAIR_STALE_MS,
): number | null {
  if (payload?.onAirConfirmed !== true && payload?.onAirConfirmed !== false) {
    return null;
  }
  const updatedAt = payload?.updatedAt;
  if (typeof updatedAt !== "string") return now;
  const parsed = Date.parse(updatedAt);
  if (Number.isNaN(parsed) || parsed > now) return now;
  return parsed + staleMs;
}

/**
 * 古い NOW ON AIR 確認結果を「未確認(null)」へ畳む。
 * 番組の放送枠自体は shared/radio-program.js から再導出できるので、
 * ここで捨てるのは「いま何が流れているか」の確認結果だけでよい。
 */
export function expireRadioOnAir<T extends RadioFreshness>(payload: T): T {
  return { ...payload, onAirConfirmed: null };
}

/** payload を、失効を考慮した表示用の形にする。 */
export function toLiveView(
  payload: LivePayload | null,
  now: number = Date.now(),
): LiveView {
  const observedAt = payload?.live?.observedAt ?? null;
  const stale = isObservationStale(observedAt, now);
  const rawState = payload?.live?.state ?? "unknown";
  return {
    // 観測が古ければ live / offline を名乗らせない
    state: stale ? "unknown" : rawState,
    startedAt: payload?.live?.startedAt ?? null,
    observedAt,
    roomUrl: payload?.roomUrl ?? null,
    next: {
      state: stale ? "unknown" : payload?.next?.state ?? "unknown",
      at: stale ? null : payload?.next?.at ?? null,
    },
  };
}
