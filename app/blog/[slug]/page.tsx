"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";

interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  banner_image?: string | null;
  published_at?: string | null;
  created_at: string;
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/blog/${params.slug}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setPost(data.post || null))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const paragraphs = useMemo(() => post?.content.split(/\n{2,}/) || [], [post]);

  return (
    <main className="relative min-h-screen selection:bg-accent-primary selection:text-bg-primary">
      <ParticleBackground />
      <Navbar />

      <article className="pt-32 pb-24 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-accent-primary font-bold mb-10 hover:-translate-x-1 transition-transform">
            Back to Blog
          </Link>

          {loading ? (
            <div className="h-96 glass rounded-3xl animate-pulse" />
          ) : !post ? (
            <div className="glass rounded-3xl p-10 text-center text-text-secondary">
              Blog post not found.
            </div>
          ) : (
            <>
              <p className="text-sm text-text-secondary font-mono mb-4">
                {new Date(post.published_at || post.created_at).toLocaleDateString()}
              </p>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">{post.title}</h1>
              <p className="text-lg text-text-secondary mb-8">{post.summary}</p>

              {post.banner_image ? (
                <img src={post.banner_image} alt={post.title} className="w-full max-h-[460px] object-cover rounded-3xl border border-border/30 mb-10" />
              ) : null}

              <div className="glass rounded-3xl p-4 sm:p-6 md:p-10 space-y-5 text-text-secondary leading-relaxed">
                {paragraphs.map((block, index) => {
                  if (block.startsWith("# ")) return <h2 key={index} className="text-3xl font-heading font-bold text-text-primary">{block.replace("# ", "")}</h2>;
                  if (block.startsWith("## ")) return <h2 key={index} className="text-2xl font-heading font-bold text-text-primary pt-4">{block.replace("## ", "")}</h2>;
                  if (block.startsWith("### ")) return <h3 key={index} className="text-xl font-heading font-bold text-text-primary pt-3">{block.replace("### ", "")}</h3>;
                  if (block.startsWith("- ") || block.startsWith("* ")) {
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2">
                        {block.split("\n").map((item, itemIndex) => (
                          <li key={itemIndex}>{item.replace(/^[-*]\s+/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.startsWith("```")) {
                    return (
                      <pre key={index} className="bg-bg-primary border border-border/30 rounded-2xl p-4 overflow-x-auto text-xs">
                        <code>{block.replace(/```[a-zA-Z]*\n?|```/g, "")}</code>
                      </pre>
                    );
                  }
                  return <p key={index} className="whitespace-pre-wrap">{block}</p>;
                })}
              </div>
            </>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
