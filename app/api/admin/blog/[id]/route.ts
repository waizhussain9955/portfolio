import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getNeonSql();
    const id = parseInt(params.id, 10);
    const result = (await sql`SELECT * FROM posts WHERE id = ${id}`) as any[];
    if (result.length === 0) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ post: result[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getNeonSql();
    const id = parseInt(params.id, 10);
    const { title, slug, summary, content, tags, banner_image, is_published, show_on_homepage } = await req.json();
    const result = (await sql`
      UPDATE posts SET
        title = ${title}, slug = ${slug}, summary = ${summary || ''},
        content = ${content}, tags = ${tags || []},
        banner_image = ${banner_image || null},
        is_published = ${is_published || false},
        published_at = ${is_published ? new Date().toISOString() : null},
        show_on_homepage = ${show_on_homepage !== false}
      WHERE id = ${id} RETURNING *
    `) as any[];
    if (result.length === 0) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    await logAudit({ userId: getUserIdFromHeaders(req), action: `UPDATE post id:${id}`, targetTable: 'posts', ...getAuditContext(req) });
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/');
    return NextResponse.json({ post: result[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getNeonSql();
    const id = parseInt(params.id, 10);
    const result = (await sql`DELETE FROM posts WHERE id = ${id} RETURNING id, title`) as any[];
    if (result.length === 0) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    await logAudit({ userId: getUserIdFromHeaders(req), action: `DELETE post id:${id}`, targetTable: 'posts', ...getAuditContext(req) });
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath('/');
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
