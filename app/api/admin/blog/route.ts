import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const sql = getNeonSql();
    const posts = await sql`SELECT id, slug, title, summary, tags, banner_image, is_published, published_at, created_at FROM posts ORDER BY id DESC`;
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = getNeonSql();
    const { title, slug, summary, content, tags, banner_image, is_published, show_on_homepage } = await req.json();
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }
    const result = (await sql`
      INSERT INTO posts (title, slug, summary, content, tags, banner_image, is_published, published_at, show_on_homepage)
      VALUES (
        ${title}, ${slug}, ${summary || ''}, ${content},
        ${tags || []}, ${banner_image || null},
        ${is_published || false},
        ${is_published ? new Date().toISOString() : null},
        ${show_on_homepage !== false}
      )
      RETURNING *
    `) as any[];
    await logAudit({ userId: getUserIdFromHeaders(req), action: `CREATE post: ${title}`, targetTable: 'posts', ...getAuditContext(req) });
    revalidatePath('/admin/blog'); // Revalidate admin blog page
    revalidatePath('/blog');
    revalidatePath('/');
    return NextResponse.json({ post: result[0] }, { status: 201 });
  } catch (error: any) {
    if (error?.message?.includes('unique')) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const sql = getNeonSql();
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0', 10);
    const { title, slug, summary, content, tags, banner_image, is_published, show_on_homepage } = await req.json();
    if (!id || !title || !slug || !content) {
      return NextResponse.json({ error: 'ID, title, slug, and content are required' }, { status: 400 });
    }
    const result = (await sql`
      UPDATE posts SET
        title = ${title},
        slug = ${slug},
        summary = ${summary || ''},
        content = ${content},
        tags = ${tags || []},
        banner_image = ${banner_image || null},
        is_published = ${is_published || false},
        published_at = ${is_published ? new Date().toISOString() : null},
        show_on_homepage = ${show_on_homepage !== false}
      WHERE id = ${id}
      RETURNING *
    `) as any[];
    await logAudit({ userId: getUserIdFromHeaders(req), action: `UPDATE post id:${id}`, targetTable: 'posts', ...getAuditContext(req) });
    revalidatePath('/admin/blog'); // Revalidate admin blog page
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/');
    return NextResponse.json({ post: result[0] });
  } catch (error: any) {
    if (error?.message?.includes('unique')) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const sql = getNeonSql();
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0', 10);
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    await sql`DELETE FROM posts WHERE id=${id}`;
    await logAudit({ userId: getUserIdFromHeaders(req), action: `DELETE post id:${id}`, targetTable: 'posts', ...getAuditContext(req) });
    revalidatePath('/admin/blog'); // Revalidate admin blog page
    revalidatePath('/blog');
    revalidatePath('/');
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
