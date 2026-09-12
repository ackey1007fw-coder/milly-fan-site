import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createPortalFeed } from "./src/data/portalFeed.ts";
import { canonicalUrl, ogImageUrl, profileUrl, storyUrl } from "./src/data/site";
import { songClipsPageMetadata, songClipsPageStructuredData } from "./src/lib/songClipsMetadata.ts";
import {
  activityPageMetadata,
  activityPageStructuredData,
} from "./src/lib/activityMetadata.ts";
import {
  archivePageMetadata,
  archivePageStructuredData,
} from "./src/lib/archiveMetadata.ts";
import {
  GALLERY_ARCHIVE_ROUTE,
  NEWS_ARCHIVE_ROUTE,
  STORIES_ARCHIVE_ROUTE,
} from "./src/lib/homePortal.ts";
import {
  supportPageMetadata,
  supportPageStructuredData,
} from "./src/lib/supportMetadata.ts";

function siteMetadataPlugin(): Plugin {
  return {
    name: "site-metadata",
    transformIndexHtml(html, context) {
      const activityMetadata = html.includes("__ACTIVITY_CANONICAL__")
        ? activityPageMetadata(context.path)
        : null;
      const newsMetadata = archivePageMetadata(NEWS_ARCHIVE_ROUTE);
      const storiesMetadata = archivePageMetadata(STORIES_ARCHIVE_ROUTE);
      const galleryMetadata = archivePageMetadata(GALLERY_ARCHIVE_ROUTE);

      return html
        .replaceAll("__SITE_CANONICAL__", canonicalUrl())
        .replaceAll("__PROFILE_CANONICAL__", profileUrl())
        .replaceAll(
          "__STORY_SECOND_ROUND_CANONICAL__",
          storyUrl("second-round-2026"),
        )
        .replaceAll(
          "__STORY_2026_08_18_RADIO_CANONICAL__",
          storyUrl("2026-08-18-radio"),
        )
        .replaceAll(
          "__STORY_SECOND_ROUND_RESULT_CANONICAL__",
          storyUrl("second-round-result-2026"),
        )
        .replaceAll(
          "__STORY_CAMPUS_GIRLS_SECOND_STAGE_JURY_AWARD_CANONICAL__",
          storyUrl("campus-girls-2027-second-stage-jury-award"),
        )
        .replaceAll(
          "__STORY_2026_08_23_MUSICAL_SPECIAL_CANONICAL__",
          storyUrl("2026-08-23-musical-special"),
        )
        .replaceAll(
          "__STORY_2026_08_25_MOTIVATION_CANONICAL__",
          storyUrl("2026-08-25-motivation"),
        )
        .replaceAll("__ACTIVITY_PAGE_TITLE__", activityMetadata?.title ?? "")
        .replaceAll(
          "__ACTIVITY_PAGE_DESCRIPTION__",
          activityMetadata?.description ?? "",
        )
        .replaceAll(
          "__ACTIVITY_CANONICAL__",
          activityMetadata?.canonical ?? "",
        )
        .replaceAll(
          "__ACTIVITY_JSON_LD__",
          activityMetadata
            ? JSON.stringify(activityPageStructuredData(context.path), null, 2)
            : "",
        )
        .replaceAll("__SUPPORT_PAGE_TITLE__", supportPageMetadata.title)
        .replaceAll(
          "__SUPPORT_PAGE_DESCRIPTION__",
          supportPageMetadata.description,
        )
        .replaceAll("__SUPPORT_CANONICAL__", supportPageMetadata.canonical)
        .replaceAll(
          "__SUPPORT_JSON_LD__",
          JSON.stringify(supportPageStructuredData(), null, 2),
        )
        .replaceAll("__NEWS_PAGE_TITLE__", newsMetadata?.title ?? "")
        .replaceAll(
          "__NEWS_PAGE_DESCRIPTION__",
          newsMetadata?.description ?? "",
        )
        .replaceAll("__NEWS_CANONICAL__", newsMetadata?.canonical ?? "")
        .replaceAll(
          "__NEWS_JSON_LD__",
          JSON.stringify(archivePageStructuredData(NEWS_ARCHIVE_ROUTE), null, 2),
        )
        .replaceAll("__STORIES_PAGE_TITLE__", storiesMetadata?.title ?? "")
        .replaceAll(
          "__STORIES_PAGE_DESCRIPTION__",
          storiesMetadata?.description ?? "",
        )
        .replaceAll("__STORIES_CANONICAL__", storiesMetadata?.canonical ?? "")
        .replaceAll(
          "__STORIES_JSON_LD__",
          JSON.stringify(
            archivePageStructuredData(STORIES_ARCHIVE_ROUTE),
            null,
            2,
          ),
        )
        .replaceAll("__GALLERY_PAGE_TITLE__", galleryMetadata?.title ?? "")
        .replaceAll(
          "__GALLERY_PAGE_DESCRIPTION__",
          galleryMetadata?.description ?? "",
        )
        .replaceAll("__GALLERY_CANONICAL__", galleryMetadata?.canonical ?? "")
        .replaceAll(
          "__GALLERY_JSON_LD__",
          JSON.stringify(
            archivePageStructuredData(GALLERY_ARCHIVE_ROUTE),
            null,
            2,
          ),
        )
        .replaceAll("__SONG_CLIPS_PAGE_TITLE__", songClipsPageMetadata.title)
        .replaceAll("__SONG_CLIPS_PAGE_DESCRIPTION__", songClipsPageMetadata.description)
        .replaceAll("__SONG_CLIPS_CANONICAL__", songClipsPageMetadata.canonical)
        .replaceAll(
          "__SONG_CLIPS_JSON_LD__",
          JSON.stringify(songClipsPageStructuredData(), null, 2),
        )
        .replaceAll("__SITE_OG_IMAGE__", ogImageUrl());
    },
  };
}

function portalFeedPlugin(): Plugin {
  return {
    name: "portal-feed",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "portal-feed.json",
        source: `${JSON.stringify(createPortalFeed(), null, 2)}\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), siteMetadataPlugin(), portalFeedPlugin()],
  build: {
    target: "es2020",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      input: {
        home: "index.html",
        profile: "profile/index.html",
        activities: "activities/index.html",
        support: "support/index.html",
        news: "news/index.html",
        storiesIndex: "stories/index.html",
        gallery: "gallery/index.html",
        activityMissCircle: "activities/miss-circle/index.html",
        activityRadio: "activities/radio/index.html",
        activityLive: "activities/live/index.html",
        activityLiveClips: "activities/live/clips/index.html",
        activityCampusGirls: "activities/campus-girls/index.html",
        storyRadio20260818: "stories/2026-08-18-radio/index.html",
        storySecondRound: "stories/second-round-2026/index.html",
        storySecondRoundResult: "stories/second-round-result-2026/index.html",
        storyCampusGirlsSecondStageJuryAward:
          "stories/campus-girls-2027-second-stage-jury-award/index.html",
        storySeasideMusical:
          "stories/2026-08-23-musical-special/index.html",
        storyMotivation20260825: "stories/2026-08-25-motivation/index.html",
      },
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
