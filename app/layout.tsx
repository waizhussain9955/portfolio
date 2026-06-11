import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { LanguageProvider } from "@/components/LanguageContext";

const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["700", "800"],
  display: "swap",
  preload: true,
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const BASE_URL = "https://waiz.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Waiz Hussain | Full Stack & AI Developer",
    template: "%s | Waiz Hussain",
  },
  description:
    "Waiz Hussain is a Full Stack Developer, AI Builder & Autonomous Systems Developer based in Pakistan. Expert in Next.js, Flutter, Node.js, and AI-powered SaaS products.",
  keywords: [
    "Waiz Hussain",
    "Full Stack Developer",
    "AI Developer",
    "Next.js Developer Pakistan",
    "Flutter Developer",
    "SaaS Developer",
    "Portfolio",
    "AI Builder",
    "Autonomous Systems",
    "Node.js",
    "React Developer",
  ],
  authors: [{ name: "Waiz Hussain", url: BASE_URL }],
  creator: "Waiz Hussain",
  publisher: "Waiz Hussain",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Waiz Hussain Portfolio",
    title: "Waiz Hussain | Full Stack & AI Developer",
    description:
      "Full Stack Developer & AI Builder creating autonomous systems, SaaS products, and scalable web/mobile applications using Next.js, Flutter & Node.js.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Waiz Hussain - Full Stack & AI Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Waiz Hussain | Full Stack & AI Developer",
    description:
      "Full Stack Developer & AI Builder creating autonomous systems, SaaS products, and scalable web/mobile applications.",
    images: ["/og-image.png"],
    creator: "@waizhussain",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "google-site-verification-placeholder",
  },
  category: "technology",
};

// JSON-LD Structured Data
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Waiz Hussain",
  url: BASE_URL,
  image: `${BASE_URL}/og-image.png`,
  sameAs: [
    "https://github.com/waizhussain9955",
    "https://www.linkedin.com/in/waiz-hussain-6750392ba",
  ],
  jobTitle: "Full Stack Developer & AI Builder",
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "PK",
  },
  knowsAbout: [
    "JavaScript",
    "Next.js",
    "React.js",
    "Flutter",
    "Node.js",
    "AI Development",
    "SaaS",
    "Autonomous Systems",
  ],
  email: "waizhussain9955@gmail.com",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Waiz Hussain Portfolio",
  url: BASE_URL,
  description: "Portfolio of Waiz Hussain — Full Stack Developer & AI Builder",
  author: {
    "@type": "Person",
    name: "Waiz Hussain",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/projects?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme sync — runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var match = document.cookie.match(new RegExp('(^| )theme=([^;]+)'));
                  var theme = match ? match[2] : 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })()
            `,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon variants */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#10b981" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} font-body antialiased`}
      >
        {/* Skip to main content — Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent-primary focus:text-bg-primary focus:rounded-lg focus:font-bold focus:text-sm"
        >
          Skip to main content
        </a>
        <LanguageProvider>
          {children}
          <Chatbot />
          <AnalyticsTracker />
        </LanguageProvider>
      </body>
    </html>
  );
}
