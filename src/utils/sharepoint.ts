import axios, { AxiosError } from 'axios';

export const pingTenant = async (tenantName: string) => {
  try {
    await axios.get(`https://${tenantName}.sharepoint.com/_api/web`);
    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.status === 403) {
      return true;
    }
    return false;
  }
};

export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function normalizeSharePointSiteUrl(input: string): string {
  const url = new URL(input);

  const match = url.pathname.match(/^\/sites\/[^/]+/);

  return `${url.origin}${match?.[0] ?? ''}`;
}

export const pingSite = async (site: string) => {
  try {
    let url = normalizeSharePointSiteUrl(site);
    if (!url.startsWith('https://')) {
      url = `https://${url}`;
    }
    await axios.get(`${url}/_api/web`);
    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.status === 403) {
      return true;
    }
    return false;
  }
};

export class SPGuideUrls {
  private tenantName?: string;
  private siteName?: string;

  constructor(tenantName?: string, siteName?: string) {
    this.tenantName = tenantName;
    this.siteName = siteName;
  }

  appRegNew() {
    return `https://${this.tenantName}.sharepoint.com/sites/${this.siteName}/_layouts/15/appregnew.aspx`;
  }
  appInv() {
    return `https://${this.tenantName}.sharepoint.com/sites/${this.siteName}/_layouts/15/appinv.aspx`;
  }
  appPrincipal() {
    return `https://${this.tenantName}.sharepoint.com/sites/${this.siteName}/_layouts/15/appprincipals.aspx`;
  }
  accessTokenUrl(tenantId: string) {
    return `https://accounts.accesscontrol.windows.net/${tenantId}/tokens/OAuth/2`;
  }
  permissionXML() {
    return '<AppPermissionRequests AllowAppOnlyPolicy="true"><AppPermissionRequest Scope="http://sharepoint/content/sitecollection/web" Right="FullControl" /></AppPermissionRequests>';
  }
}
