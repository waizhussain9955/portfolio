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

// PATCH /api/admin/users/[id] — update role & status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { role, status } = body;

    const VALID_ROLES = ["super_admin", "admin", "editor", "client", "user"];
    const VALID_STATUSES = ["active", "inactive", "suspended"];

    if (role && !VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Prevent self-demotion
    if (admin.userId === userId && role && role !== "super_admin" && role !== "admin") {
      return NextResponse.json(
        { error: "Cannot demote your own account" },
        { status: 403 }
      );
    }

    const updated = (await sql`
      UPDATE users
      SET
        role = COALESCE(${role || null}, role),
        status = COALESCE(${status || null}, COALESCE(status, 'active'))
      WHERE id = ${userId}
      RETURNING id, name, email, role, status
    `) as any[];


    if (updated.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated[0] });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — remove user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  // Prevent self-deletion
  if (admin.userId === userId) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 403 });
  }

  try {
    await sql`DELETE FROM users WHERE id = ${userId}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
