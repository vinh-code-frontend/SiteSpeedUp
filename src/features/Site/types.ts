export type ISite = {
  id: string;
  tenantId: string;
  tenantTitle: string;
  site: string;
};

export type ISiteForm = Pick<ISite, 'tenantId' | 'site'>;
