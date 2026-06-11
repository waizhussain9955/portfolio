import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const userEmail = req.headers.get('x-user-email');
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized — missing user context' }, { status: 401 });
    }

    const sql = getNeonSql();
    
    // Fetch client projects list from site_settings table
    const rows = (await sql`
      SELECT config_val FROM site_settings WHERE config_key = 'client_projects'
    `) as any[];

    let projects: any[] = [];
    if (rows.length > 0 && rows[0].config_val) {
      const allProjects = Array.isArray(rows[0].config_val) ? rows[0].config_val : [];
      // Filter by the logged-in client's email
      projects = allProjects.filter((p: any) => p.client_email?.toLowerCase() === userEmail.toLowerCase());
    }

    // If no projects found, let's return some mock projects for validation if they are logged in as a test client
    if (projects.length === 0 && userEmail.includes('client')) {
      projects = [
        {
          id: 101,
          client_email: userEmail,
          title: "SaaS Platform Transformation",
          status: "In Progress",
          contract_status: "Signed",
          milestones: [
            { id: 1, title: "Architecture Blueprint", status: "Completed", date: "May 12, 2026" },
            { id: 2, title: "Database Migration & CMS Sync", status: "Completed", date: "June 2, 2026" },
            { id: 3, title: "Frontend Dashboard Integration", status: "In Progress", date: "June 20, 2026" },
            { id: 4, title: "Beta UAT & Deployment", status: "Pending", date: "July 15, 2026" }
          ],
          files: [
            { id: 1, name: "Project_Proposal.pdf", url: "/resume/Waiz_Resume_Full_Stack_Dev.pdf" },
            { id: 2, name: "System_Architecture_Diagram.png", url: "/icon.svg" }
          ]
        }
      ];
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Portal projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch portal details' }, { status: 500 });
  }
}
