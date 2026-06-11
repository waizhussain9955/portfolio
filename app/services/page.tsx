"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import ScrollAnimation from "@/components/ScrollAnimation";

interface Service {
  id: number;
  title: string;
  description: string;
  price_range: string;
  delivery_time: string;
  features: string[];
  is_active: boolean;
  image_url?: string | null;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/services", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setServices(data.services || []))
      .catch(() => setServices([]))
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
              <span className="text-sm font-bold tracking-widest uppercase">Services</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">What I Can Build</h1>
            <p className="text-text-secondary max-w-2xl text-lg">
              Explore dynamic, high-performance services customized to elevate your brand, automate workflows, and design robust solutions.
            </p>
          </ScrollAnimation>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 glass rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center text-text-secondary">
              No active services available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <ScrollAnimation key={service.id} delay={idx * 80} className="h-full">
                  <div className="h-full glass rounded-3xl overflow-hidden hover:border-accent-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_var(--color-glow)] flex flex-col">
                    <div className="h-48 w-full overflow-hidden border-b border-border/20 flex-shrink-0 bg-accent-primary/5">
                      <img
                        src={service.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"}
                        alt={service.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="mb-6">
                        <p className="text-sm font-mono text-accent-primary mb-2">
                          ⏱️ {service.delivery_time || "Flexible timeline"}
                        </p>
                        <h2 className="text-2xl font-heading font-bold mb-3">{service.title}</h2>
                        <p className="text-text-secondary text-sm leading-relaxed">{service.description}</p>
                      </div>

                      <div className="text-3xl font-heading font-bold text-text-primary mb-6">
                        {service.price_range}
                      </div>

                      <div className="space-y-3 mt-auto">
                        {(service.features || []).map((feature) => (
                          <div key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-accent-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
