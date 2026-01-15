import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const protectedRoutes = ['/transactions', '/compliance', '/compliance', '/reports'];
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (pathname === '/') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/authentication')) {
    const token = request.cookies.get('accessToken')?.value || null;
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    const token = request.cookies.get('accessToken')?.value || null;

    if (!token) {
      return NextResponse.redirect(new URL('/authentication/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
