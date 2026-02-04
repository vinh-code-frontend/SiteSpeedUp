export interface ITenant {
  id?: string;
  title: string;
  tenantId: string;
  clientIdResource: string;
  userId: string;
  userDisplayName: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}
