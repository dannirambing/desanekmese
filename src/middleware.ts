import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    // RBAC Logic
    if (path.startsWith("/admin/pengguna") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (
      (path.startsWith("/admin/wisata") || 
       path.startsWith("/admin/budaya") || 
       path.startsWith("/admin/berita")) && 
      !(role === "SUPER_ADMIN" || role === "ADMIN_KONTEN")
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/umkm") && !(role === "SUPER_ADMIN" || role === "ADMIN_UMKM")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/admin/login",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
