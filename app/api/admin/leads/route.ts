import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';

export async function GET() {
  try {
    const sql = getNeonSql();
    const rows = await sql`
      SELECT l.*, c.name, c.email, c.subject 
      FROM leads l
      LEFT JOIN contacts c ON l.contact_id = c.id
      ORDER BY l.updated_at DESC
    `;
    return NextResponse.json({ leads: rows });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = getNeonSql();
    const { contact_id, pipeline_stage, notes } = await req.json();
    const result = (await sql`
      INSERT INTO leads (contact_id, pipeline_stage, notes)
      VALUES (${contact_id || null}, ${pipeline_stage || 'New'}, ${notes || null})
      RETURNING *
    `) as any[];
    await logAudit({ userId: getUserIdFromHeaders(req), action: `CREATE lead`, targetTable: 'leads', ...getAuditContext(req) });
    return NextResponse.json({ lead: result[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const sql = getNeonSql();
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0', 10);
    const { pipeline_stage, notes } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const result = (await sql`
      UPDATE leads SET pipeline_stage=${pipeline_stage}, notes=${notes || null}, updated_at=NOW()
      WHERE id=${id} RETURNING *
    `) as any[];
    await logAudit({ userId: getUserIdFromHeaders(req), action: `UPDATE lead id:${id} → ${pipeline_stage}`, targetTable: 'leads', ...getAuditContext(req) });
    return NextResponse.json({ lead: result[0] });
  } catch {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
