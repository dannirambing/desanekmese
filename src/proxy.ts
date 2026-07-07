import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const permissions = (token?.permissions as string[]) || [];

    // Bypass for super admin (ALL_ACCESS)
    if (permissions.includes("ALL_ACCESS")) {
      return NextResponse.next();
    }

    // RBAC Permissions Mapping
    // Pages requiring ALL_ACCESS (Super Admin only)
    if (
      path.startsWith("/admin/pengguna") ||
      path.startsWith("/admin/roles") ||
      path.startsWith("/admin/chatbot-log")
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Other protected pages
    if (path.startsWith("/admin/hero") && !permissions.includes("MANAGE_HERO")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/profil") && !permissions.includes("MANAGE_PROFIL")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/titik-air") && !permissions.includes("MANAGE_AIR")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/wisata") && !permissions.includes("MANAGE_WISATA")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/budaya") && !permissions.includes("MANAGE_BUDAYA")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/umkm") && !permissions.includes("MANAGE_UMKM")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/berita") && !permissions.includes("MANAGE_BERITA")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/pengumuman") && !permissions.includes("MANAGE_PENGUMUMAN")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/anggaran") && !permissions.includes("MANAGE_BUDGET")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/galeri") && !permissions.includes("MANAGE_GALERI")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/peraturan") && !permissions.includes("MANAGE_PERATURAN")) {
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
