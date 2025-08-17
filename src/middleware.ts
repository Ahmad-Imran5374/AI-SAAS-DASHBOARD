import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;
  const token = cookies.get('token')?.value;

  const publicRoutes = ['/', '/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(pathname)}`, nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};