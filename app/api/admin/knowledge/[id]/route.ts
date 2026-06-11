import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getNeonSql();
    const id = parseInt(params.id, 10);
    const { title, content, category } = await req.json();
    const result = (await sql`
      UPDATE knowledge_base SET title=${title}, content=${content}, category=${category}, updated_at=NOW()
      WHERE id=${id} RETURNING *
    `) as any[];
    if (!result.length) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    await logAudit({ userId: getUserIdFromHeaders(req), action: `UPDATE knowledge id:${id}`, targetTable: 'knowledge_base', ...getAuditContext(req) });
    return NextResponse.json({ entry: result[0] });
  } catch {
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getNeonSql();
    const id = parseInt(params.id, 10);
    const result = (await sql`DELETE FROM knowledge_base WHERE id=${id} RETURNING id`) as any[];
    if (!result.length) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    await logAudit({ userId: getUserIdFromHeaders(req), action: `DELETE knowledge id:${id}`, targetTable: 'knowledge_base', ...getAuditContext(req) });
    return NextResponse.json({ message: 'Entry deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
