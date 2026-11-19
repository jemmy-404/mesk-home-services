import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'mesk-jwt-secret-key-production-super-safe-random-token-2025';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'mesk_admin_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth');
  const isLoginPage = pathname === '/admin/login';

  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, secretKey);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Already authenticated user visiting login page -> redirect to dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Unauthenticated user accessing protected admin routes
  if ((isAdminPage || isAdminApi) && !isAuthenticated) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'يرجى تسجيل الدخول أولاً (Unauthorized)' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
