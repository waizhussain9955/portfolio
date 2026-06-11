import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, getJwtSecret } from '@/lib/auth';

// Role hierarchy levels
const ROLE_LEVELS: Record<string, number> = {
  super_admin: 4,
  admin: 3,
  editor: 2,
  client: 1,
};

// Route protection map — minimum role required
const PROTECTED_ROUTES: { pattern: RegExp; minRole: string }[] = [
  // Admin routes — require at minimum 'admin'
  { pattern: /^\/admin(\/.*)?$/, minRole: 'admin' },
  // API admin routes — require at minimum 'admin'
  { pattern: /^\/api\/admin(\/.*)?$/, minRole: 'admin' },
  // Client portal — require at minimum 'client'
  { pattern: /^\/portal(\/.*)?$/, minRole: 'client' },
  { pattern: /^\/api\/portal(\/.*)?$/, minRole: 'client' },
];

// Public routes that MUST always be accessible — never blocked
const PUBLIC_ROUTES = [
  /^\/$/,
  /^\/projects(\/.*)?$/,
  /^\/blog(\/.*)?$/,
  /^\/services(\/.*)?$/,
  /^\/login/,
  /^\/signup/,
  /^\/api\/auth\/.+/,
  /^\/api\/chat/,
  /^\/api\/posts.*/,
  /^\/api\/services.*/,
  /^\/api\/analytics\/track/,
  /^\/_next\/.*/,
  /^\/favicon/,
  /^\/icon/,
  /^\/.*\.(png|jpg|jpeg|webp|svg|gif|ico|pdf)$/,
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((pattern) => pattern.test(pathname));
}

function getRequiredRole(pathname: string): string | null {
  for (const route of PROTECTED_ROUTES) {
    if (route.pattern.test(pathname)) {
      return route.minRole;
    }
  }
  return null;
}

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_LEVELS[userRole] ?? 0;
  const requiredLevel = ROLE_LEVELS[requiredRole] ?? 999;
  return userLevel >= requiredLevel;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const requiredRole = getRequiredRole(pathname);

  // No role required — allow
  if (!requiredRole) {
    return NextResponse.next();
  }

  // Extract access token from HttpOnly cookie
  const accessToken = req.cookies.get('access_token')?.value;

  if (!accessToken) {
    // Try to use refresh token to silently refresh before redirecting
    const refreshToken = req.cookies.get('refresh_token')?.value;
    if (refreshToken) {
      // Redirect to refresh endpoint then back
      const refreshUrl = new URL('/api/auth/refresh', req.url);
      const redirectAfter = new URL(pathname, req.url);
      // For API routes return 401, for pages redirect to login
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized — token expired' }, { status: 401 });
      }
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized — no token' }, { status: 401 });
    }
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the access token
  const secret = getJwtSecret();
  const payload = await verifyJWT(accessToken, secret);

  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized — invalid token' }, { status: 401 });
    }
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role authorization
  const userRole = payload.role || 'client';
  if (!hasRequiredRole(userRole, requiredRole)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden — insufficient permissions' }, { status: 403 });
    }
    // Redirect non-admin users to homepage with error
    const homeUrl = new URL('/', req.url);
    homeUrl.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(homeUrl);
  }

  // Inject user info into request headers for downstream use
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', String(payload.id));
  requestHeaders.set('x-user-role', userRole);
  requestHeaders.set('x-user-email', payload.email || '');
  requestHeaders.set('x-user-name', payload.name || '');

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files and Next.js internals.
     * This keeps the middleware lean — static assets bypass it entirely.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
