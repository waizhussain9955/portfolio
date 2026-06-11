import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields (name, email, subject, message) are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format.' },
        { status: 400 }
      );
    }

    const sql = getNeonSql();

    // 1. Insert into contacts
    const contactResult = (await sql`
      INSERT INTO contacts (name, email, subject, message, is_processed)
      VALUES (${name}, ${email}, ${subject}, ${message}, false)
      RETURNING id
    `) as any[];

    if (!contactResult || contactResult.length === 0) {
      throw new Error('Failed to insert contact submission.');
    }

    const contactId = contactResult[0].id;

    // 2. Auto-generate CRM lead linked to contact
    await sql`
      INSERT INTO leads (contact_id, pipeline_stage, notes)
      VALUES (${contactId}, 'New', 'Lead auto-generated from contact form submission.')
    `;

    return NextResponse.json(
      { message: 'Submission logged successfully.', contactId },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ContactAPI] Error saving contact to database:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving your message.' },
      { status: 500 }
    );
  }
}
