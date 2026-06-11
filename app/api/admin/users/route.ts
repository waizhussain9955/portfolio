import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { sql } from "@/lib/neon";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || !["super_admin", "admin"].includes(payload.role as string)) return null;
  return payload;
}

// GET /api/admin/users — list all users
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await sql`
      SELECT
        id, name, email, role,
        COALESCE(status, 'active') as status,
        last_login, created_at
      FROM users
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
