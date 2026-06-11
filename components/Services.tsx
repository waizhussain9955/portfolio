"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScrollAnimation from "./ScrollAnimation";
import { useLanguage } from "./LanguageContext";

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

const serviceTranslations: Record<string, Record<string, any>> = {
  ur: {
    "Full-Stack Web App Development": {
      title: "فل اسٹیک ویب ایپ ڈویلپمنٹ",
      description: "حالیہ ویب ایپلی کیشنز بشمول ریسپونسیو UI، محفوظ APIs، ڈیٹا بیس انٹیگریشن، اور ڈپلائمنٹ سپورٹ کے ساتھ۔",
      delivery_time: "2-6 ہفتے",
      features: ["Next.js فرنٹ اینڈ", "API انٹیگریشن", "ڈیٹا بیس سیٹ اپ", "ڈپلائمنٹ"]
    },
    "Portfolio & Business Website": {
      title: "پورٹ فولیو اور کاروباری ویب سائٹ",
      description: "ذاتی برانڈز، ایجنسیوں، اور چھوٹے کاروباروں کے لیے تیز اور جدید ویب سائٹس بشمول CMS کے تیار کردہ سیکشنز کے ساتھ۔",
      delivery_time: "1-3 ہفتے",
      features: ["ریسپونسیو ڈیزائن", "بنیادی SEO", "رابطہ فارم", "ایڈمن مواد اپ ڈیٹس"]
    },
    "Admin Panel & CMS Setup": {
      title: "ایڈمن پینل اور CMS سیٹ اپ",
      description: "پروجیکٹس، بلاگ پوسٹس، سروسز، لیڈز، میڈیا، اور سائٹ کی ترتیبات کو منظم کرنے کے لیے حسب ضرورت ڈیش بورڈز۔",
      delivery_time: "2-4 ہفتے",
      features: ["CRUD ماڈیولز", "میڈیا اپ لوڈ", "کردار پر مبنی رسائی", "اینالیٹکس"]
    }
  },
  de: {
    "Full-Stack Web App Development": {
      title: "Full-Stack-Web-App-Entwicklung",
      description: "Produktionsbereite Webanwendungen mit responsivem UI, sicheren APIs, Datenbankintegration und Bereitstellungsunterstützung.",
      delivery_time: "2-6 Wochen",
      features: ["Next.js Frontend", "API-Integration", "Datenbank-Setup", "Bereitstellung"]
    },
    "Portfolio & Business Website": {
      title: "Portfolio- & Business-Website",
      description: "Schnelle, moderne Websites für persönliche Marken, Agenturen und kleine Unternehmen mit CMS-bereiten Abschnitten.",
      delivery_time: "1-3 Wochen",
      features: ["Responsives Design", "SEO-Grundlagen", "Kontaktformular", "Admin-Inhaltsaktualisierungen"]
    },
    "Admin Panel & CMS Setup": {
      title: "Admin-Panel- & CMS-Setup",
      description: "Benutzerdefinierte Dashboards zur Verwaltung von Projekten, Blogbeiträgen, Dienstleistungen, Leads, Medien und Site-Einstellungen.",
      delivery_time: "2-4 Wochen",
      features: ["CRUD-Module", "Medien-Upload", "Rollenbasierter Zugriff", "Analysen"]
    }
  }
};

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/public/services?homepage=true", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setServices(data.services || []);
      })
      .catch(() => {
        if (mounted) setServices([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const translateService = (service: Service) => {
    const langData = serviceTranslations[language]?.[service.title];
    if (langData) {
      return {
        ...service,
        title: langData.title,
        description: langData.description,
        delivery_time: langData.delivery_time,
        features: langData.features
      };
    }
    return service;
  };

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6">
        <ScrollAnimation className="mb-16">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-accent-primary mb-4">
            <span className="w-8 h-[1px] bg-accent-primary"></span>
            <span className="text-sm font-bold tracking-widest uppercase">{t.navServices}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold">{t.servicesSubtitle}</h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((s, idx) => {
            const service = translateService(s);
            return (
              <ScrollAnimation key={service.id} delay={idx * 100} className="h-full">
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
                      <p className="text-sm font-mono text-accent-primary mb-2">{service.delivery_time || "Flexible timeline"}</p>
                      <h3 className="text-2xl font-heading font-bold mb-3">{service.title}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{service.description}</p>
                    </div>

                    <div className="text-3xl font-heading font-bold text-text-primary mb-6">
                      {service.price_range}
                    </div>

                    <div className="space-y-3 mt-auto">
                      {(service.features || []).slice(0, 5).map((feature: string) => (
                        <div key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-accent-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>

        <ScrollAnimation className="flex justify-center mt-12">
          <Link
            href="/services"
            className="px-8 py-4 border border-accent-primary/50 text-accent-primary font-bold rounded-full hover:border-accent-primary hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            {t.seeMoreServices}
          </Link>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default Services;
