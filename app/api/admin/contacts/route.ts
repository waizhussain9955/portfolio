import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';

export async function GET() {
  try {
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM contacts ORDER BY created_at DESC`;
    return NextResponse.json({ contacts: rows });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// Mark a contact as processed via PATCH /api/admin/contacts?id=X
export async function PATCH(req: Request) {
  try {
    const sql = getNeonSql();
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0', 10);
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await sql`UPDATE contacts SET is_processed=true WHERE id=${id}`;
    await logAudit({ userId: getUserIdFromHeaders(req), action: `MARK contact processed id:${id}`, targetTable: 'contacts', ...getAuditContext(req) });
    return NextResponse.json({ message: 'Marked as processed' });
  } catch {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const sql = getNeonSql();
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0', 10);
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await sql`DELETE FROM contacts WHERE id=${id}`;
    await logAudit({ userId: getUserIdFromHeaders(req), action: `DELETE contact id:${id}`, targetTable: 'contacts', ...getAuditContext(req) });
    return NextResponse.json({ message: 'Contact deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
