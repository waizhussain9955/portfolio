import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM media_library ORDER BY id DESC`;
    return NextResponse.json({ media: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = getNeonSql();
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalFilename = file.name;
    const extension = path.extname(originalFilename);
    const basename = path.basename(originalFilename, extension);
    const cleanBasename = basename.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Generate a unique filename using timestamp
    const uniqueFilename = `${cleanBasename}_${Date.now()}${extension}`;
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (_) {}

    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${uniqueFilename}`;

    const result = (await sql`
      INSERT INTO media_library (filename, mime_type, url, size_bytes)
      VALUES (${uniqueFilename}, ${file.type}, ${relativeUrl}, ${file.size})
      RETURNING *
    `) as any[];

    await logAudit({
      userId: getUserIdFromHeaders(req),
      action: `UPLOAD file: ${uniqueFilename}`,
      targetTable: 'media_library',
      ...getAuditContext(req),
    });

    return NextResponse.json({ item: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Failed to upload media file' }, { status: 500 });
  }
}
