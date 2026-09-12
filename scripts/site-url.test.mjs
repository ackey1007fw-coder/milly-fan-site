import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  activitiesUrl,
  activityUrl,
  canonicalUrl,
  ogImageUrl,
  profileUrl,
  robotsTxt,
  site,
  siteOrigin,
  sitemapXml,
  storyUrl,
  supportUrl,
  newsUrl,
  storiesIndexUrl,
  galleryUrl,
  songClipsUrl,
} from "../src/data/site.ts";
import { activities } from "../src/data/activities.ts";
import { verifySiteUrlConsistency } from "./check-site-url.mjs";

describe("site.siteUrl metadata source of truth", () => {
  it("derives canonical, OG, robots, and sitemap URLs from site.siteUrl", () => {
    const origin = siteOrigin();
    assert.equal(origin, "https://mily-fan-site.vercel.app");
    assert.equal(canonicalUrl(), `${origin}/`);
    assert.equal(profileUrl(), `${origin}/profile/`);
    assert.equal(activitiesUrl(), `${origin}/activities/`);
    assert.equal(supportUrl(), `${origin}/support/`);
    assert.equal(newsUrl(), `${origin}/news/`);
    assert.equal(storiesIndexUrl(), `${origin}/stories/`);
    assert.equal(galleryUrl(), `${origin}/gallery/`);
    assert.equal(songClipsUrl(), `${origin}/activities/live/clips/`);
    for (const activity of activities) {
      assert.equal(activityUrl(activity.route), `${origin}${activity.route}`);
    }
    assert.equal(
      storyUrl("second-round-2026"),
      `${origin}/stories/second-round-2026/`,
    );
    assert.equal(ogImageUrl(), `${origin}${site.ogImagePath}`);
    assert.match(robotsTxt(), new RegExp(`Sitemap: ${origin}/sitemap.xml`));
    assert.match(sitemapXml(), new RegExp(`<loc>${canonicalUrl()}</loc>`));
    assert.match(sitemapXml(), new RegExp(`<loc>${profileUrl()}</loc>`));
    assert.match(sitemapXml(), new RegExp(`<loc>${activitiesUrl()}</loc>`));
    assert.match(sitemapXml(), new RegExp(`<loc>${supportUrl()}</loc>`));
    assert.match(sitemapXml(), new RegExp(`<loc>${newsUrl()}</loc>`));
    assert.match(sitemapXml(), new RegExp(`<loc>${storiesIndexUrl()}</loc>`));
    assert.match(sitemapXml(), new RegExp(`<loc>${galleryUrl()}</loc>`));
    assert.match(sitemapXml(), new RegExp(`<loc>${songClipsUrl()}</loc>`));
    for (const activity of activities) {
      assert.match(
        sitemapXml(),
        new RegExp(`<loc>${activityUrl(activity.route)}</loc>`),
      );
    }
    assert.match(
      sitemapXml(),
      new RegExp(`<loc>${storyUrl("second-round-2026")}</loc>`),
    );
    assert.match(
      sitemapXml(),
      new RegExp(`<loc>${storyUrl("2026-08-18-radio")}</loc>`),
    );
    assert.match(
      sitemapXml(),
      new RegExp(`<loc>${storyUrl("2026-08-23-musical-special")}</loc>`),
    );
    assert.match(
      sitemapXml(),
      new RegExp(`<loc>${storyUrl("2026-08-25-motivation")}</loc>`),
    );
    assert.match(
      sitemapXml(),
      new RegExp(
        `<loc>${storyUrl("campus-girls-2027-second-stage-jury-award")}</loc>`,
      ),
    );
  });

  it("fails when public metadata drifts from site.siteUrl", () => {
    assert.deepEqual(verifySiteUrlConsistency(), []);
  });
});
