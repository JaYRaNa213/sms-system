import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes middleware
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Protect all routes except /login and static files
  if (!token && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if logged in and trying to access /login
  if (token && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
