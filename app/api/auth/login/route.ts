import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const sql = getNeonSql();

    // Find user
    const users = (await sql`SELECT * FROM users WHERE email = ${email}`) as any[];
    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return user info (omit password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Something went wrong during login' }, { status: 500 });
  }
}
