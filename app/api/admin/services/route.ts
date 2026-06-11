import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';

export async function GET() {
  try {
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM services ORDER BY id ASC`;
    return NextResponse.json({ services: rows });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = getNeonSql();
    const { title, description, price_range, delivery_time, features, is_active, image_url, show_on_homepage } = await req.json();
    if (!title || !description || !price_range) {
      return NextResponse.json({ error: 'Title, description, and price_range are required' }, { status: 400 });
    }
    const result = (await sql`
      INSERT INTO services (title, description, price_range, delivery_time, features, is_active, image_url, show_on_homepage)
      VALUES (${title}, ${description}, ${price_range}, ${delivery_time || ''}, ${features || []}, ${is_active !== false}, ${image_url || null}, ${show_on_homepage !== false})
      RETURNING *
    `) as any[];
    await logAudit({ userId: getUserIdFromHeaders(req), action: `CREATE service: ${title}`, targetTable: 'services', ...getAuditContext(req) });
    return NextResponse.json({ service: result[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
