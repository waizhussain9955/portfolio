import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { projects as fallbackProjects } from '@/lib/data/projects';

export const dynamic = 'force-dynamic';

const mapProject = (project: any) => ({
  title: project.title,
  desc: project.description,
  tags: project.tags || [],
  gradient: project.gradient || 'from-emerald-950 via-teal-900 to-emerald-900',
  image: project.image || '',
  liveLink: project.live_link || '',
  githubLink: project.github_link || '',
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const homepage = searchParams.get('homepage') === 'true';

    const sql = getNeonSql();
    let rows;

    if (homepage) {
      rows = (await sql`
        SELECT title, description, tags, gradient, image, live_link, github_link, show_on_homepage
        FROM projects
        WHERE show_on_homepage = true
        ORDER BY id DESC
      `) as any[];
    } else {
      rows = (await sql`
        SELECT title, description, tags, gradient, image, live_link, github_link, show_on_homepage
        FROM projects
        ORDER BY id DESC
      `) as any[];
    }

    const projects = rows.map(mapProject);
    return NextResponse.json({ projects: projects.length ? projects : fallbackProjects });
  } catch (error) {
    return NextResponse.json({ projects: fallbackProjects });
  }
}
