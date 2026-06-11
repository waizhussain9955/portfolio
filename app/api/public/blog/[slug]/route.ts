import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const sql = getNeonSql();
    const rows = (await sql`
      SELECT slug, title, summary, content, tags, banner_image, published_at, created_at
      FROM posts
      WHERE slug = ${params.slug} AND is_published = true
      LIMIT 1
    `) as any[];

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
