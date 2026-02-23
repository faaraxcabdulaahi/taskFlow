import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Auth } from './src/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = path === '/signin' || path === '/signup';
  const isHomePage = path === '/';

  const token = request.cookies.get('token')?.value;
  const user = token ? await Auth.getUserFromToken(token) : null;

  // 🔥 FIXED: Handle homepage separately
  if (isHomePage) {
    // Always allow access to homepage, don't redirect
    return NextResponse.next();
  }

  // If user is logged in and tries to access signin/signup, redirect to dashboard
  if (isPublicPath && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not logged in and tries to access protected paths, redirect to signin
  if (!isPublicPath && !user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/signin',
    '/signup',
    '/api/tasks/:path*',
  ],
};