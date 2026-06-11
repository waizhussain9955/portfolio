import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';

export async function GET() {
  try {
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM knowledge_base ORDER BY id DESC`;
    return NextResponse.json({ entries: rows });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch knowledge base' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = getNeonSql();
    const { title, content, category } = await req.json();
    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 });
    }
    const result = (await sql`
      INSERT INTO knowledge_base (title, content, category)
      VALUES (${title}, ${content}, ${category})
      RETURNING *
    `) as any[];
    await logAudit({ userId: getUserIdFromHeaders(req), action: `CREATE knowledge: ${title}`, targetTable: 'knowledge_base', ...getAuditContext(req) });
    return NextResponse.json({ entry: result[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
