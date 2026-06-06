import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access");

  const protectedRoutes = [
    "/student",
    "/lecturer",
    "/courses",
    "/dashboard",
    "/upload"
  ];

  // Prevent authenticated users from visiting the login page
  // if (token && request.nextUrl.pathname.startsWith("/login")) {
  //   return NextResponse.redirect(new URL("/courses", request.url));
  // }

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/student/:path*",
    "/lecturer/:path*",
    "/courses/:path*",
    "/upload/:path*",
    "/login",
  ],
};
