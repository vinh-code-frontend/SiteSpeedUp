import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/firebase';

let currentUser: User | null = null;

export const getCurrentUser = () =>
  new Promise<User | null>((resolve) => {
    if (currentUser) {
      resolve(currentUser);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      currentUser = user;
      unsubscribe();
      resolve(user);
    });
  });

export const logOut = async () => {
  await signOut(auth);
  currentUser = null;
};
