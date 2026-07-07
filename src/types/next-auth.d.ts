import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      roleId: string | null;
      permissions: string[];
    };
  }

  interface User {
    id: string;
    roleId: string | null;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roleId: string | null;
    permissions: string[];
  }
}
