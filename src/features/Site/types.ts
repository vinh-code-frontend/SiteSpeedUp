export type ISite = {
  id: string;
  tenantFBId: string;
  tenantId: string;
  tenantTitle: string;
  site: string;
};

export type ISiteForm = Pick<ISite, 'tenantFBId' | 'site'>;
