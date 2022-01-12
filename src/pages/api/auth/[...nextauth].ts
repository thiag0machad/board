import NextAuth, { Account, Profile, User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn({ user, account, profile }) {
      const { email } = user;
      try {
        return true;
      } catch (error) {
        console.log('DEU ERRO:', error);
        return false;
      }
    }
  }
});
