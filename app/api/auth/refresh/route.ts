import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/neon';
import { signJWT, verifyJWT, getJwtSecret } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const refreshToken = cookieHeader
      .split('; ')
      .find((row) => row.startsWith('refresh_token='))
      ?.split('=')[1];

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    const secret = getJwtSecret();
    const payload = await verifyJWT(refreshToken, secret);

    if (!payload || payload.type !== 'refresh') {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    const sql = getNeonSql();

    // Validate token matches what's stored in DB
    const users = (await sql`
      SELECT id, email, name, role, refresh_token, token_expires 
      FROM users 
      WHERE id = ${payload.id}
    `) as any[];

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const user = users[0];

    if (user.refresh_token !== refreshToken) {
      return NextResponse.json({ error: 'Refresh token mismatch' }, { status: 401 });
    }

    if (user.token_expires && new Date(user.token_expires) < new Date()) {
      return NextResponse.json({ error: 'Refresh token expired' }, { status: 401 });
    }

    // Issue new access token
    const newAccessToken = await signJWT(
      { id: user.id, email: user.email, name: user.name, role: user.role || 'client' },
      secret,
      900000 // 15 minutes
    );

    // Rotate refresh token (sliding window)
    const newRefreshToken = await signJWT(
      { id: user.id, type: 'refresh' },
      secret,
      604800000 // 7 days
    );

    await sql`
      UPDATE users 
      SET refresh_token = ${newRefreshToken},
          token_expires = NOW() + INTERVAL '7 days'
      WHERE id = ${user.id}
    `;

    const response = NextResponse.json({ message: 'Token refreshed successfully' });

    response.cookies.set({
      name: 'access_token',
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 900,
      path: '/'
    });

    response.cookies.set({
      name: 'refresh_token',
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
}
