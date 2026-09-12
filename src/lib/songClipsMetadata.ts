import { canonicalUrl, site, songClipsUrl } from "../data/site.ts";

export const songClipsPageMetadata = {
  title: "みりぃの歌唱クリップ | みりぃ ファンサイト（非公式）",
  description:
    "みりぃ（三橋莉子 / Mily）さんのSHOWROOM配信から、確認済みの短い歌唱クリップをまとめたファン制作・非公式アーカイブ。",
  canonical: songClipsUrl(),
} as const;

export function songClipsPageStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "みりぃの歌唱クリップ",
    description: songClipsPageMetadata.description,
    url: songClipsPageMetadata.canonical,
    inLanguage: site.language,
    isPartOf: {
      "@type": "WebSite",
      name: `${site.displayTitle}（非公式）`,
      url: canonicalUrl(),
    },
  };
}
