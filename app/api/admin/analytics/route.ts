import { NextResponse } from "next/server";
import { getNeonSql } from "@/lib/neon";

export const dynamic = "force-dynamic";

const PERIOD_MAP: Record<string, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
};

// GET /api/admin/analytics?period=7d
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "7d";
  const interval = PERIOD_MAP[period] || "7 days";

  try {
    const sql = getNeonSql();

    const [
      totalPageviewsRes,
      uniqueSessionsRes,
      chatQueriesRes,
      topPagesRes,
      dailyTrafficRes,
      eventBreakdownRes,
      recentEventsRes,
    ] = await Promise.all([
      // Total page views for period
      sql`
        SELECT COUNT(*) as count FROM analytics_events
        WHERE event_type = 'pageview'
          AND created_at >= NOW() - INTERVAL ${interval}
      `,
      // Unique sessions
      sql`
        SELECT COUNT(DISTINCT session_id) as count FROM analytics_events
        WHERE created_at >= NOW() - INTERVAL ${interval}
      `,
      // Chat queries
      sql`
        SELECT COUNT(*) as count FROM analytics_events
        WHERE event_type = 'chat_query'
          AND created_at >= NOW() - INTERVAL ${interval}
      `,
      // Top pages
      sql`
        SELECT page_url, COUNT(*) as count
        FROM analytics_events
        WHERE event_type = 'pageview'
          AND created_at >= NOW() - INTERVAL ${interval}
        GROUP BY page_url
        ORDER BY count DESC
        LIMIT 10
      `,
      // Daily traffic
      sql`
        SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as day, COUNT(*) as count
        FROM analytics_events
        WHERE event_type = 'pageview'
          AND created_at >= NOW() - INTERVAL ${interval}
        GROUP BY day
        ORDER BY day ASC
      `,
      // Event type breakdown
      sql`
        SELECT event_type, COUNT(*) as count
        FROM analytics_events
        WHERE created_at >= NOW() - INTERVAL ${interval}
        GROUP BY event_type
        ORDER BY count DESC
      `,
      // Recent events
      sql`
        SELECT id, event_type, page_url, session_id, created_at
        FROM analytics_events
        ORDER BY created_at DESC
        LIMIT 50
      `,
    ]);

    return NextResponse.json({
      totalPageviews: Number((totalPageviewsRes as any[])[0]?.count ?? 0),
      uniqueSessions: Number((uniqueSessionsRes as any[])[0]?.count ?? 0),
      chatQueries: Number((chatQueriesRes as any[])[0]?.count ?? 0),
      topPages: (topPagesRes as any[]).map((r) => ({
        page_url: r.page_url,
        count: Number(r.count),
      })),
      dailyTraffic: (dailyTrafficRes as any[]).map((r) => ({
        day: r.day,
        count: Number(r.count),
      })),
      eventBreakdown: (eventBreakdownRes as any[]).map((r) => ({
        event_type: r.event_type,
        count: Number(r.count),
      })),
      recentEvents: recentEventsRes as any[],
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

// DELETE /api/admin/analytics?older_than=90d — purge old events
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const olderThan = searchParams.get("older_than") || "90d";
  const interval = PERIOD_MAP[olderThan] || "90 days";

  try {
    const sql = getNeonSql();
    const result = await sql`
      DELETE FROM analytics_events
      WHERE created_at < NOW() - INTERVAL ${interval}
      RETURNING id
    `;
    return NextResponse.json({
      success: true,
      deleted: (result as any[]).length,
    });
  } catch (error) {
    console.error("Analytics delete error:", error);
    return NextResponse.json({ error: "Failed to purge events" }, { status: 500 });
  }
}
