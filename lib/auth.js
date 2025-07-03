
import GoogleProvider from 'next-auth/providers/google';
// Import any other providers you are using

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ... add more providers as needed
  ],
  // Add any other NextAuth.js configurations here (e.g., callbacks, pages, secret)
  secret: process.env.NEXTAUTH_SECRET, // Make sure you have this in your .env
  pages: {
    signIn: '/auth/signin', // Optional: Custom sign-in page
    // ... other custom pages
  },
  callbacks: {
    // Example: Add user ID to session and JWT
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};