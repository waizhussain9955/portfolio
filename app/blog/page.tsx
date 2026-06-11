"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import ScrollAnimation from "@/components/ScrollAnimation";

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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/blog", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen selection:bg-accent-primary selection:text-bg-primary">
      <ParticleBackground />
      <Navbar />

      <section className="pt-32 pb-24 relative">
        <div className="container mx-auto px-6">
          <ScrollAnimation className="mb-12">
            <div className="flex items-center space-x-2 text-accent-primary mb-4">
              <span className="w-8 h-[1px] bg-accent-primary"></span>
              <span className="text-sm font-bold tracking-widest uppercase">Blog</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Engineering Notes</h1>
            <p className="text-text-secondary max-w-2xl text-lg">
              Published articles from the CMS will appear here automatically.
            </p>
          </ScrollAnimation>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 glass rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center text-text-secondary">
              No published blog posts yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <ScrollAnimation key={post.id} delay={idx * 80} className="h-full">
                  <Link href={`/blog/${post.slug}`} className="group h-full flex flex-col glass rounded-3xl overflow-hidden hover:border-accent-primary/30 transition-all duration-500 hover:-translate-y-2">
                    <div className="h-48 bg-gradient-to-br from-gray-950 via-emerald-950 to-teal-900 overflow-hidden">
                      {post.banner_image ? (
                        <img src={post.banner_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : null}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs text-text-secondary font-mono mb-3">
                        {new Date(post.published_at || post.created_at).toLocaleDateString()}
                      </p>
                      <h2 className="text-xl font-heading font-bold mb-3 group-hover:text-accent-primary transition-colors">{post.title}</h2>
                      <p className="text-sm text-text-secondary line-clamp-3 mb-5">{post.summary}</p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {(post.tags || []).map((tag) => (
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
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
