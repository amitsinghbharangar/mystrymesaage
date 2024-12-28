import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
  const token = await getToken({ req });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if ((pathname === "/sign-in" || pathname === "/") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/"],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// import { getToken } from "next-auth/jwt";

// export { default } from 'next-auth/middleware';

// async function middleware(request: NextRequest) {
//     const token = await getToken({ req: request });
//     const url = request.nextUrl;

//     // If user is authenticated, block access to auth pages (e.g., sign-in, sign-up)
//     if (token && ['/sign-in', '/sign-up', '/verify'].some(path => url.pathname.startsWith(path))) {
//         return NextResponse.redirect(new URL('/dashboard', request.url));
//     }

//     // If user is not authenticated, block access to protected routes (e.g., dashboard)
//     if (!token && url.pathname.startsWith('/dashboard')) {
//         return NextResponse.redirect(new URL('/sign-in', request.url));
//     }

//     // Allow all other requests
//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/sign-in',
//         '/sign-up',
//         '/',
//         '/dashboard/:path*',
//         '/verify/:path*',
//     ],
// };
