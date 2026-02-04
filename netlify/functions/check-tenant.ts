import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const tenant = event.queryStringParameters?.tenant;

  if (!tenant) {
    return { statusCode: 400, body: 'Missing tenant' };
  }

  try {
    const res = await fetch(`https://${tenant}.sharepoint.com/_vti_bin/client.svc`, { headers: { Authorization: 'Bearer' } });
    const headers = Object.fromEntries(res.headers.entries());
    const authArr = headers['www-authenticate'].split(',');
    const config = {
      tenantId: authArr[0].split(`"`)[1],
      clientIdResource: authArr[1].split(`"`)[1]
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        exists: [200, 401, 403].includes(res.status),
        status: res.status,
        config
      })
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 200,
      body: error
    };
  }
};
