import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://david-edmonds-analytics.davidedmonds1.chatgpt.site";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work/washington-ev-market`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
