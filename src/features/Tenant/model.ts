export interface ITenant {
  id?: string;
  title: string;
  tenantId: string;
  clientId: string;
  userId: string;
  userDisplayName: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}
