import type { serverTimestamp } from 'firebase/firestore';

export interface ITenant {
  id?: string;
  title: string;
  userId: string;
  userDisplayName: string;
  isPrivate: boolean;
  createdAt: ReturnType<typeof serverTimestamp>;
  updatedAt: ReturnType<typeof serverTimestamp>;
}
