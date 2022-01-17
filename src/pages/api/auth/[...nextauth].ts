import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore/lite';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { db } from '../../../services/firebaseConnection';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        const docRef = doc(db, 'users', token.sub);
        const lastDonate = await getDoc(docRef).then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.data().lastDonate.toDate();
          } else {
            return null;
          }
        });

        return {
          id: token.sub,
          vip: lastDonate ? true : false,
          lastDonate: lastDonate,
          ...session,
        };
      } catch (error) {
        return { id: null, vip: false, lastDonate: null, ...session };
      }
    },
    async signIn() {
      try {
        return true;
      } catch (error) {
        return false;
      }
    },
  },
});
