import { getNeonSql } from '@/lib/neon';

interface AuditLogEntry {
  userId?: number | null;
  action: string;
  targetTable?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Write an audit log entry to the audit_logs table.
 * This function is fire-and-forget — it never throws.
 * Call it after any significant admin action.
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    const sql = getNeonSql();
    await sql`
      INSERT INTO audit_logs (user_id, action, target_table, ip_address, user_agent)
      VALUES (
        ${entry.userId ?? null},
        ${entry.action},
        ${entry.targetTable ?? null},
        ${entry.ipAddress ?? null},
        ${entry.userAgent ?? null}
      )
    `;
  } catch (err) {
    // Audit failures must never crash the main request
    console.error('[AuditLog] Failed to write audit entry:', err);
  }
}

/**
 * Helper to extract audit context from a Next.js Request object.
 */
export function getAuditContext(req: Request): { ipAddress: string; userAgent: string } {
  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return { ipAddress, userAgent };
}

/**
 * Helper to extract user ID injected by middleware into request headers.
 */
export function getUserIdFromHeaders(req: Request): number | null {
  const raw = req.headers.get('x-user-id');
  return raw ? parseInt(raw, 10) : null;
}
