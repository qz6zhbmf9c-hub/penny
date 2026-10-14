import type { MetadataRoute } from "next";

const BLOCKED = ["/api/", "/dashboard"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "GPTBot", "OAI-SearchBot", "ChatGPT-User",
          "PerplexityBot", "Perplexity-User",
          "ClaudeBot", "Claude-User", "Claude-SearchBot",
          "Google-Extended", "Applebot-Extended", "Bingbot", "Googlebot",
        ],
        allow: "/",
        disallow: BLOCKED,
      },
      { userAgent: "*", allow: "/", disallow: BLOCKED },
    ],
    sitemap: "https://mypenny.net/sitemap.xml",
    host: "https://mypenny.net",
  };
}