import { activities, type ActivityRoute } from "./activities.ts";

export const site = {
  repoName: "mily-fan-site",
  repoFullName: "ackey1007fw-coder/mily-fan-site",
  displayTitle: "みりぃ ファンサイト",
  shortTitle: "みりぃ",
  description:
    "みりぃ（三橋莉子 / Mily）さんを応援する、ファン運営の非公式サイトです。本人運営ではありません。",
  locale: "ja_JP",
  language: "ja",
  /**
   * Public origin of the current Vercel deployment.
   */
  siteUrl: "https://mily-fan-site.vercel.app",
  ogImagePath: "/og-mily-20260818.jpg",
  themeColor: "#f6f3ee",
} as const;

export type Site = typeof site;

export function siteOrigin(): string {
  return site.siteUrl.replace(/\/+$/, "");
}

export function canonicalUrl(): string {
  return `${siteOrigin()}/`;
}

export function profileUrl(): string {
  return `${siteOrigin()}/profile/`;
}

export function activitiesUrl(): string {
  return `${siteOrigin()}/activities/`;
}

export function supportUrl(): string {
  return `${siteOrigin()}/support/`;
}

export function activityUrl(route: ActivityRoute): string {
  return `${siteOrigin()}${route}`;
}

export function storyUrl(slug: string): string {
  return `${siteOrigin()}/stories/${slug}/`;
}

export function newsUrl(): string {
  return `${siteOrigin()}/news/`;
}

export function storiesIndexUrl(): string {
  return `${siteOrigin()}/stories/`;
}

export function galleryUrl(): string {
  return `${siteOrigin()}/gallery/`;
}

export function songClipsUrl(): string {
  return `${siteOrigin()}/activities/live/clips/`;
}

export function ogImageUrl(): string {
  const imagePath = site.ogImagePath.startsWith("/")
    ? site.ogImagePath
    : `/${site.ogImagePath}`;
  return `${siteOrigin()}${imagePath}`;
}

export function robotsTxt(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin()}/sitemap.xml\n`;
}

export function sitemapXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${canonicalUrl()}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${profileUrl()}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${activitiesUrl()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${supportUrl()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${newsUrl()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${storiesIndexUrl()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${galleryUrl()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${activities
  .map(
    (activity) => `  <url>
    <loc>${activityUrl(activity.route)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`,
  )
  .join("")}  <url>
    <loc>${songClipsUrl()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${storyUrl("2026-08-25-motivation")}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${storyUrl("2026-08-23-musical-special")}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${storyUrl("2026-08-18-radio")}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${storyUrl("second-round-2026")}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${storyUrl("second-round-result-2026")}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${storyUrl("campus-girls-2027-second-stage-jury-award")}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;
}
