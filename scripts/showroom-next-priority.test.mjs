import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { showroomNextSlot, withShowroomNext } from '../src/lib/showroomSchedule.ts';
import { expireLivePayload, liveExpiresAt, toLiveView, LIVE_STALE_MS } from '../src/lib/realtimeStore.ts';
import { selectLiveActivityStatus } from '../src/lib/activityStatus.ts';

const now = Date.parse('2026-09-06T08:45:00+09:00');
const roomUrl = 'https://www.showroom-live.com/r/circle2026_0734';
const live = {
  state: 'offline', startedAt: null, observedAt: new Date(now).toISOString(), roomUrl,
  next: { state: 'scheduled', at: '2026-09-06T14:00:00.000Z' },
};
const official = [
  { date: '2026-09-06', time: '21:30', endTime: '22:00' },
  { date: '2026-09-06', time: '23:30' },
  { date: '2026-09-07', time: '06:30' },
  { date: '2026-09-07', time: '22:00' },
];
const view = { slots: official, manualSlots: official, roomUrl, availability: 'ok' };

describe('SHOWROOM next priority across shared schedule consumers', () => {
  it('replaces the conflicting day, preserves later official dates, and never inherits an end time', () => {
    const result = withShowroomNext(view, live, now);
    assert.deepEqual(result.slots.map(({date,time}) => ({date,time})), [
      {date:'2026-09-06',time:'23:00'},
      {date:'2026-09-07',time:'06:30'},
      {date:'2026-09-07',time:'22:00'},
    ]);
    assert.equal(result.slots[0].endTime, undefined);
    assert.match(result.slots[0].note, /SHOWROOM登録予定.*9\/6.*08:45.*確認/);
    assert.match(result.slots[1].note, /ミスサークル公式/);
    assert.equal(selectLiveActivityStatus(live,result.slots,roomUrl,now).slot.time,'23:00');
    assert.equal(selectLiveActivityStatus({...live,state:'live'},result.slots,roomUrl,now).state,'live');
    assert.deepEqual(view.slots, official, 'does not mutate its input');
  });
  it('removes an old later slot when the next stream moves earlier', () => {
    const result = withShowroomNext(view,{...live,next:{state:'scheduled',at:'2026-09-06T11:00:00Z'}},now);
    assert.deepEqual(result.slots.filter(s=>s.date==='2026-09-06').map(s=>s.time),['20:00']);
  });
  it('converts a midnight next stream to the following JST day and drops earlier dates', () => {
    const result = withShowroomNext(view,{...live,next:{state:'scheduled',at:'2026-09-06T15:00:00Z'}},now);
    assert.equal(result.slots.length,1);
    assert.equal(result.slots[0].date,'2026-09-07');
    assert.equal(result.slots[0].time,'00:00');
  });
  it('keeps the SHOWROOM next slot when AGE is empty, loading, or unavailable', () => {
    for (const availability of ['ok','loading','unavailable']) {
      const result = withShowroomNext({...view,slots:[],availability},live,now);
      assert.equal(result.slots[0].time,'23:00');
      assert.equal(result.availability,'ok');
    }
    assert.equal(withShowroomNext({...view,availability:'unavailable'},live,now).slots.length,1);
  });
  it('falls back with a source label when next is missing, malformed, past, or stale', () => {
    for (const change of [
      {next:{state:'none',at:null}}, {next:{state:'unknown',at:null}},
      {next:{state:'scheduled',at:'bad'}},
      {next:{state:'scheduled',at:new Date(now).toISOString()}},
      {next:{state:'scheduled',at:new Date(now-1).toISOString()}},
      {observedAt:null}, {observedAt:new Date(now+1).toISOString()},
      {observedAt:new Date(now-LIVE_STALE_MS).toISOString()},
      {roomUrl:'https://www.showroom-live.com.evil.example/r/wrong'},
    ]) {
      const result=withShowroomNext(view,{...live,...change},now);
      assert.equal(result.slots[0].time,'21:30');
      assert.match(result.slots[0].note,/ミスサークル公式/);
    }
    const failed=withShowroomNext({...view,availability:'unavailable'},{...live,next:{state:'unknown',at:null}},now);
    assert.match(failed.slots[0].note,/自動取得できていません/);
  });
  it('retains successful empty schedules when SHOWROOM has no registered next stream', () => {
    assert.deepEqual(withShowroomNext({...view,slots:[]},{...live,next:{state:'none',at:null}},now).slots,[]);
  });
  it('expires a next-only observation even when the live-state request failed', () => {
    const payload={ok:true,roomUrl,live:{state:'unknown',observedAt:live.observedAt},next:live.next};
    assert.equal(liveExpiresAt(payload,now),now+LIVE_STALE_MS);
    assert.equal(showroomNextSlot(toLiveView(payload,now),now).time,'23:00');
    assert.equal(toLiveView(payload,now+LIVE_STALE_MS).next.state,'unknown');
    const expired=expireLivePayload(payload);
    assert.deepEqual(expired.next,{state:'unknown',at:null});
    assert.equal(liveExpiresAt(expired,now+LIVE_STALE_MS),null);
  });
});
