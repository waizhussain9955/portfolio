import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/portal/",
          "/_next/",
          // "/blog/", // Commented out to allow blog
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/portal/"],
      },
    ],
    sitemap: "https://waiz.dev/sitemap.xml",
    host: "https://waiz.dev",
  };
}
