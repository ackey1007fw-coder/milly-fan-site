import assert from 'node:assert/strict';
import { test } from 'node:test';
import { news } from '../src/data/news.ts';
import { resolveNewsLinks } from '../src/lib/newsLinks.ts';
import { missCircleWebVoteLink } from '../src/data/links.ts';
import { avatarAchievementStoryVideo } from '../src/data/avatarAchievementStoryVideo.ts';

test('avatar Story keeps its confirmed date and reuses the approved video', () => {
  const items = news.filter(x => x.id === '2026-09-12-avatar-achievement-story');
  assert.equal(items.length, 1);
  assert.equal(items[0].date, '2026-09-12');
  assert.equal(items[0].media, avatarAchievementStoryVideo);
  assert.equal(items[0].source, undefined);
  assert.equal(avatarAchievementStoryVideo.sourceDate, items[0].date);
  assert.equal(avatarAchievementStoryVideo.published, true);
});
test('avatar Story vote CTA disappears at the existing deadline, article remains', () => {
  const item = news.find(x => x.id === '2026-09-12-avatar-achievement-story');
  const active = resolveNewsLinks(item, Date.parse('2026-09-13T23:58:59+09:00'));
  const ended = resolveNewsLinks(item, Date.parse('2026-09-14T00:00:00+09:00'));
  assert.ok(active.additionalCtas?.some(x => x.url === missCircleWebVoteLink.url));
  assert.ok(!ended.additionalCtas?.some(x => x.url === missCircleWebVoteLink.url));
  assert.equal(ended.cta.url, 'https://www.instagram.com/mily_chan36');
});
