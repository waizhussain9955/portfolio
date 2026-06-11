import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { logAudit, getAuditContext, getUserIdFromHeaders } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM site_settings ORDER BY config_key ASC`;
    return NextResponse.json({ settings: rows });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const sql = getNeonSql();
    const { config_key, config_val } = await req.json();
    if (!config_key) return NextResponse.json({ error: 'config_key is required' }, { status: 400 });
    const result = (await sql`
      INSERT INTO site_settings (config_key, config_val)
      VALUES (${config_key}, ${JSON.stringify(config_val)}::jsonb)
      ON CONFLICT (config_key) DO UPDATE
        SET config_val = EXCLUDED.config_val, updated_at = NOW()
      RETURNING *
    `) as any[];
    await logAudit({ userId: getUserIdFromHeaders(req), action: `UPSERT setting: ${config_key}`, targetTable: 'site_settings', ...getAuditContext(req) });

    // Revalidate paths that depend on these settings
    if (config_key === 'chatbot_config' || config_key === 'site_info') {
      revalidatePath('/'); // Homepage might use site_info
      revalidatePath('/admin/settings'); // Admin settings page itself
      // If there's a dedicated chatbot page, revalidate that too
    }
    return NextResponse.json({ setting: result[0] });
  } catch {
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 });
  }
}
