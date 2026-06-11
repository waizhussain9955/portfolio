import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const sql = getNeonSql();

    const [
      projectsRes,
      postsRes,
      servicesRes,
      contactsRes,
      leadsRes,
      knowledgeRes,
      recentContactsRes,
      pageViewsRes,
      chatQueriesRes,
      sessionsRes,
      dailyTrafficRes,
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM projects`,
      sql`SELECT COUNT(*) as count FROM posts`,
      sql`SELECT COUNT(*) as count FROM services`,
      sql`SELECT COUNT(*) as count FROM contacts`,
      sql`SELECT COUNT(*) as count FROM leads`,
      sql`SELECT COUNT(*) as count FROM knowledge_base`,
      sql`SELECT id, name, email, subject, is_processed, created_at FROM contacts ORDER BY created_at DESC LIMIT 5`,
      sql`SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'pageview'`,
      sql`SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'chat_query'`,
      sql`SELECT COUNT(DISTINCT session_id) as count FROM analytics_events`,
      sql`
        SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as day, COUNT(*) as count
        FROM analytics_events
        WHERE event_type = 'pageview' AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY day
        ORDER BY day ASC
      `,
    ]);

    return NextResponse.json({
      stats: {
        projects: Number((projectsRes as any[])[0]?.count ?? 0),
        posts: Number((postsRes as any[])[0]?.count ?? 0),
        services: Number((servicesRes as any[])[0]?.count ?? 0),
        contacts: Number((contactsRes as any[])[0]?.count ?? 0),
        leads: Number((leadsRes as any[])[0]?.count ?? 0),
        knowledge: Number((knowledgeRes as any[])[0]?.count ?? 0),
        pageviews: Number((pageViewsRes as any[])[0]?.count ?? 0),
        chatQueries: Number((chatQueriesRes as any[])[0]?.count ?? 0),
        sessions: Number((sessionsRes as any[])[0]?.count ?? 0),
      },
      recentContacts: recentContactsRes as any[],
      dailyTraffic: dailyTrafficRes as any[],
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

