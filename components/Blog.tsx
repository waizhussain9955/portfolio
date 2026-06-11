"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ScrollAnimation from "./ScrollAnimation";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  banner_image?: string | null;
  published_at?: string | null;
  created_at: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/public/blog?homepage=true", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setPosts(data.posts || []);
      })
      .catch(() => {
        if (mounted) setPosts([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 relative">
      <div className="container mx-auto px-6">
        <ScrollAnimation className="mb-16">
          <div className="flex items-center space-x-2 text-accent-primary mb-4">
            <span className="w-8 h-[1px] bg-accent-primary"></span>
            <span className="text-sm font-bold tracking-widest uppercase">Blog</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">Latest Writing</h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, idx) => (
            <ScrollAnimation key={post.id} delay={idx * 100} className="h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="group h-full flex flex-col glass rounded-3xl overflow-hidden hover:border-accent-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_var(--color-glow)]"
              >
                <div className="h-44 bg-gradient-to-br from-gray-950 via-emerald-950 to-teal-900 overflow-hidden">
                  {post.banner_image ? (
                    <img
                      src={post.banner_image}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : null}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-text-secondary font-mono mb-3">
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </p>
                  <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-accent-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-3 mb-5">{post.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 bg-accent-primary/10 border-l-2 border-accent-primary text-accent-primary rounded-r-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation className="flex justify-center mt-12">
          <Link
            href="/blog"
            className="px-8 py-4 border border-accent-primary/50 text-accent-primary font-bold rounded-full hover:border-accent-primary hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            See More Blogs
          </Link>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default Blog;
