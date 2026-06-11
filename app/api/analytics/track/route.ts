import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';

export async function POST(req: Request) {
  try {
    const sql = getNeonSql();
    const { event_type, page_url, session_id, referrer, metadata } = await req.json();

    if (!event_type || !page_url || !session_id) {
      return NextResponse.json({ error: 'event_type, page_url, and session_id are required' }, { status: 400 });
    }

    await sql`
      INSERT INTO analytics_events (event_type, page_url, session_id, referrer, metadata)
      VALUES (
        ${event_type},
        ${page_url},
        ${session_id},
        ${referrer || null},
        ${metadata ? JSON.stringify(metadata) : null}::jsonb
      )
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Failed to record analytics event' }, { status: 500 });
  }
}
