import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getNeonSql();
    const id = parseInt(params.id, 10);

    const result = (await sql`
      SELECT * FROM media_library WHERE id = ${id}
    `) as any[];

    if (result.length === 0) {
      return NextResponse.json({ error: 'File not found in media library' }, { status: 404 });
    }

    const item = result[0];

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'public', item.url);
    try {
      await unlink(filePath);
    } catch (err) {
      console.warn(`[Media Library] Could not delete physical file at ${filePath}:`, err);
    }

    // Delete record from database
    await sql`
      DELETE FROM media_library WHERE id = ${id}
    `;

    await logAudit({
      userId: getUserIdFromHeaders(req),
      action: `DELETE file: ${item.filename}`,
      targetTable: 'media_library',
      ...getAuditContext(req),
    });

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
