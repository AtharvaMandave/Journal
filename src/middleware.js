import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
  callbacks: {
    authorized: ({ req, token }) => {
      // Allow access if token exists; otherwise redirect to signIn
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/dashboard", "/editor", "/reviewer", "/review/:path*", "/admin"],
};


