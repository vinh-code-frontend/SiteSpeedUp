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
