import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://david-edmonds-analytics.davidedmonds1.chatgpt.site/sitemap.xml",
  };
}
