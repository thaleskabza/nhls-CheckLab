import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Email only",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(creds) {
        // Dev: trust any @nhls.ac.za / officer@example.org
        if (!creds?.email) return null;
        return { id: "00000000-0000-0000-0000-000000000001", email: creds.email, role: "OFFICER" };
      }
    })
  ],
  session: { strategy: "jwt" }
});
export { handler as GET, handler as POST };
