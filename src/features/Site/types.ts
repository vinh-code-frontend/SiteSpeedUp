import type { serverTimestamp } from 'firebase/firestore';

export type ISite = {
  id: string;
  tenantFBId: string;

  userId: string;
  userDisplayName: string;

  tenantId: string;
  tenantTitle: string;
  clientIdResource: string;

  clientId: string;
  clientSecret: string;
  site: string;

  createdAt: string;
  updatedAt: string;
};

export type ISiteForm = Pick<ISite, 'tenantFBId' | 'site' | 'clientId' | 'clientSecret'>;

export type ISiteDTO = Omit<Partial<ISite>, 'updatedAt' | 'createdAt'> & {
  createdAt: ReturnType<typeof serverTimestamp>;
  updatedAt: ReturnType<typeof serverTimestamp>;
};
