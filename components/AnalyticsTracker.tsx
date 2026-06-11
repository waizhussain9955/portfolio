"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Generate/retrieve simple session ID
    let sessionId = sessionStorage.getItem("visitor_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("visitor_session_id", sessionId);
    }

    // Ignore admin and api paths to avoid tracking internal dev activity
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/")) {
      return;
    }

    // Prevent double-tracking same path on rapid renders
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    const trackPageView = async () => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: "pageview",
            page_url: pathname,
            session_id: sessionId,
            referrer: typeof document !== "undefined" ? document.referrer : "",
            metadata: {
              userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
              screenSize: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "",
            },
          }),
        });
      } catch (err) {
        console.warn("[Analytics] Tracking failed:", err);
      }
    };

    // Delay slightly to ensure document title and referrer are loaded
    const timer = setTimeout(trackPageView, 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
