import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

// GET — list all projects
export async function GET() {
  try {
    const sql = getNeonSql();
    const projects = await sql`SELECT * FROM projects ORDER BY id DESC`;
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST — create a new project
export async function POST(req: Request) {
  try {
    const sql = getNeonSql();
    const body = await req.json();
    const { title, description, tags, gradient, image, live_link, github_link, show_on_homepage } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const result = (await sql`
      INSERT INTO projects (title, description, tags, gradient, image, live_link, github_link, show_on_homepage)
      VALUES (
        ${title},
        ${description},
        ${tags || []},
        ${gradient || 'from-emerald-950 via-teal-900 to-emerald-900'},
        ${image || ''},
        ${live_link || ''},
        ${github_link || ''},
        ${show_on_homepage !== false}
      )
      RETURNING *
    `) as any[];

    const { ipAddress, userAgent } = getAuditContext(req);
    await logAudit({
      userId: getUserIdFromHeaders(req),
      action: `CREATE project: ${title}`,
      targetTable: 'projects',
      ipAddress,
      userAgent,
    });

    revalidatePath('/admin/projects'); // Revalidate admin projects page
    revalidatePath('/projects'); // Revalidate public projects page
    revalidatePath('/'); // Revalidate homepage if projects are featured there
    return NextResponse.json({ project: result[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
