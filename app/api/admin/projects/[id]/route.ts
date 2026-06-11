import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

// PUT — update a project
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getNeonSql();
    const id = parseInt(params.id, 10);
    const body = await req.json();
    const { title, description, tags, gradient, image, live_link, github_link, show_on_homepage } = body;

    const result = (await sql`
      UPDATE projects SET
        title = ${title},
        description = ${description},
        tags = ${tags || []},
        gradient = ${gradient || 'from-emerald-950 via-teal-900 to-emerald-900'},
        image = ${image || ''},
        live_link = ${live_link || ''},
        github_link = ${github_link || ''},
        show_on_homepage = ${show_on_homepage !== false}
      WHERE id = ${id}
      RETURNING *
    `) as any[];

    if (result.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { ipAddress, userAgent } = getAuditContext(req);
    await logAudit({
      userId: getUserIdFromHeaders(req),
      action: `UPDATE project id:${id} — ${title}`,
      targetTable: 'projects',
      ipAddress,
      userAgent,
    });

    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    return NextResponse.json({ project: result[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE — remove a project
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getNeonSql();
    const id = parseInt(params.id, 10);

    const result = (await sql`
      DELETE FROM projects WHERE id = ${id} RETURNING id, title
    `) as any[];

    if (result.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { ipAddress, userAgent } = getAuditContext(req);
    await logAudit({
      userId: getUserIdFromHeaders(req),
      action: `DELETE project id:${id} — ${result[0].title}`,
      targetTable: 'projects',
      ipAddress,
      userAgent,
    });

    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
