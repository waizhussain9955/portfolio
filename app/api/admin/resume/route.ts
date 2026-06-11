import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const RESUME_PATH = path.join(process.cwd(), "lib", "data", "resume.json");

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || !["super_admin", "admin", "editor"].includes(payload.role as string)) return null;
  return payload;
}

// GET /api/admin/resume
export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = await fs.readFile(RESUME_PATH, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (_) {
    return NextResponse.json({ error: "Failed to read resume" }, { status: 500 });
  }
}

// PUT /api/admin/resume
export async function PUT(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.title || !body.about) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Write back with pretty formatting
    await fs.writeFile(RESUME_PATH, JSON.stringify(body, null, 2), "utf-8");

    // Also update resume.txt for chatbot RAG
    const txt = generateResumeTxt(body);
    const txtPath = path.join(process.cwd(), "lib", "data", "resume.txt");
    await fs.writeFile(txtPath, txt, "utf-8");

    return NextResponse.json({ success: true, message: "Resume updated successfully" });
  } catch (error) {
    console.error("Resume update error:", error);
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }
}

function generateResumeTxt(data: any): string {
  const lines: string[] = [
    `NAME: ${data.name}`,
    `TITLE: ${data.title}`,
    ``,
    `ABOUT:`,
    data.about,
    ``,
    `CONTACT:`,
    `Email: ${data.contact?.email}`,
    `Phone: ${data.contact?.phone}`,
    `WhatsApp: ${data.contact?.WhatsApp}`,
    `GitHub: ${data.contact?.github}`,
    `LinkedIn: ${data.contact?.linkedin}`,
    `Location: ${data.contact?.location}`,
    ``,
    `SKILLS:`,
    (data.skills || []).join(", "),
    ``,
    `EXPERIENCE:`,
  ];

  (data.experience || []).forEach((exp: any) => {
    lines.push(`${exp.role} at ${exp.company} (${exp.duration})`);
    (exp.details || []).forEach((d: string) => lines.push(`  - ${d}`));
    lines.push("");
  });

  lines.push(`EDUCATION:`);
  (data.education || []).forEach((e: string) => lines.push(`  - ${e}`));
  lines.push("");

  lines.push(`CURRENT FOCUS:`);
  (data.current_focus || []).forEach((f: string) => lines.push(`  - ${f}`));
  lines.push("");

  lines.push(`STRENGTHS:`);
  (data.strengths || []).forEach((s: string) => lines.push(`  - ${s}`));
  lines.push("");

  lines.push(`FINAL STATEMENT:`);
  lines.push(data.final_statement || "");

  return lines.join("\n");
}
