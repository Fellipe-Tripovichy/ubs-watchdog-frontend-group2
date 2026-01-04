import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const protectedRoutes = ['/transactions', '/compliance', '/compliance', '/reports'];
  const { pathname } = request.nextUrl;

  console.log("request", request);
  console.log("pathname", pathname);

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (pathname.startsWith('/authentication') || pathname === '/') {
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    const token = request.cookies.get('accessToken')?.value || null;

    console.log("token", token);
    if (!token) {
      return NextResponse.redirect(new URL('/authentication/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

