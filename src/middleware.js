import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: ["/dashboard", "/editor", "/reviewer", "/review/:path*", "/admin"],
};


