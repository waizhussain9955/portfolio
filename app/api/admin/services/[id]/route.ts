import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getNeonSql();
    const id = parseInt(params.id, 10);
    const { title, description, price_range, delivery_time, features, is_active, image_url, show_on_homepage } = await req.json();
    const result = (await sql`
      UPDATE services SET title=${title}, description=${description}, price_range=${price_range},
        delivery_time=${delivery_time || ''}, features=${features || []}, is_active=${is_active !== false},
        image_url=${image_url || null}, show_on_homepage=${show_on_homepage !== false}
      WHERE id=${id} RETURNING *
    `) as any[];
    if (!result.length) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    await logAudit({ userId: getUserIdFromHeaders(req), action: `UPDATE service id:${id}`, targetTable: 'services', ...getAuditContext(req) });
    return NextResponse.json({ service: result[0] });
  } catch {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getNeonSql();
    const id = parseInt(params.id, 10);
    const result = (await sql`DELETE FROM services WHERE id=${id} RETURNING id`) as any[];
    if (!result.length) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    await logAudit({ userId: getUserIdFromHeaders(req), action: `DELETE service id:${id}`, targetTable: 'services', ...getAuditContext(req) });
    return NextResponse.json({ message: 'Service deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
