import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, we'll rely on client-side authentication checks
  // Firebase Auth handles session management on the client side
  // The dashboard layouts will redirect unauthenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/songs/:path*',
    '/categories/:path*',
    '/login',
  ],
};
