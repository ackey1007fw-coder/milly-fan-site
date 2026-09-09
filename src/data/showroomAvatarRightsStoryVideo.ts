import type { DriveGalleryVideo } from "./driveGallery";
import manifest from "./showroomAvatarRightsStoryVideo.json" with { type: "json" };

/** Owner-provided Instagram Story clip. Publication date remains unconfirmed. */
export type ShowroomAvatarRightsStoryVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceLabel: string;
  sourceDate: string | null;
  published: boolean;
};

export const showroomAvatarRightsStoryVideo =
  manifest as ShowroomAvatarRightsStoryVideo;
