import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { verifyJWT, getJwtSecret } from '@/lib/auth';

export async function POST(req: Request) {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const refreshToken = cookieHeader
      .split('; ')
      .find((row) => row.startsWith('refresh_token='))
      ?.split('=')[1];

    if (refreshToken) {
      const secret = getJwtSecret();
      const payload = await verifyJWT(refreshToken, secret);
      if (payload && payload.id) {
        const sql = getNeonSql();
        await sql`
          UPDATE users 
          SET refresh_token = NULL, token_expires = NULL 
          WHERE id = ${payload.id}
        `;
      }
    }
  } catch (error) {
    console.error('Logout database clearing error:', error);
  }

  // Clear cookies
  response.cookies.set({
    name: 'access_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });

  response.cookies.set({
    name: 'refresh_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });

  return response;
}
