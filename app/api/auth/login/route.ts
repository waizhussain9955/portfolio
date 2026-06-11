import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import bcrypt from 'bcryptjs';
import { signJWT, getJwtSecret } from '@/lib/auth';

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
    const { password: _, refresh_token: __, token_expires: ___, ...userWithoutPassword } = user;
    
    const response = NextResponse.json({ 
      message: 'Login successful',
      user: userWithoutPassword
    });

    const secret = getJwtSecret();
    const accessToken = await signJWT(
      { id: user.id, email: user.email, name: user.name, role: user.role || 'client' },
      secret,
      900000 // 15 mins
    );

    const refreshToken = await signJWT(
      { id: user.id, type: 'refresh' },
      secret,
      604800000 // 7 days
    );

    // Save refresh token to database
    await sql`
      UPDATE users 
      SET refresh_token = ${refreshToken}, 
          token_expires = NOW() + INTERVAL '7 days' 
      WHERE id = ${user.id}
    `;

    response.cookies.set({
      name: 'access_token',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 900, // 15 mins (seconds)
      path: '/'
    });

    response.cookies.set({
      name: 'refresh_token',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days (seconds)
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Something went wrong during login' }, { status: 500 });
  }
}
