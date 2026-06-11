import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const homepage = searchParams.get('homepage') === 'true';

    const sql = getNeonSql();
    let posts;

    if (homepage) {
      posts = await sql`
        SELECT id, slug, title, summary, tags, banner_image, published_at, created_at, show_on_homepage
        FROM posts
        WHERE is_published = true AND show_on_homepage = true
        ORDER BY COALESCE(published_at, created_at) DESC, id DESC
      `;
    } else {
      posts = await sql`
        SELECT id, slug, title, summary, tags, banner_image, published_at, created_at, show_on_homepage
        FROM posts
        WHERE is_published = true
        ORDER BY COALESCE(published_at, created_at) DESC, id DESC
      `;
    }

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ posts: [] });
  }
}
