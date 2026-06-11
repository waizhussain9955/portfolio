import { MetadataRoute } from "next";
import { getNeonSql } from "@/lib/neon";

const BASE_URL = "https://waiz.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/#about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/#skills`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/#contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  try {
    const sql = getNeonSql();
    // Fetch dynamic blog posts
    const posts = (await sql`
      SELECT slug, created_at, published_at 
      FROM posts 
      WHERE is_published = true
    `) as { slug: string; created_at: string; published_at?: string }[];

    for (const post of posts) {
      routes.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.published_at || post.created_at),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("[Sitemap Generation Error]:", error);
  }

  return routes;
}
