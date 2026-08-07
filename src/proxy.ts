import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname;

      if (path.startsWith("/dashboard/admin") && token?.role !== "ADMIN") return false;
      if (path.startsWith("/dashboard/head") && token?.role !== "HEAD") return false;
      if (path.startsWith("/dashboard/developer") && token?.role !== "DEVELOPER") return false;
      if (path.startsWith("/dashboard/client") && token?.role !== "CLIENT") return false;

      return !!token;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
