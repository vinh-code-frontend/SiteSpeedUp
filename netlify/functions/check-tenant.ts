import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const tenant = event.queryStringParameters?.tenant;

  if (!tenant) {
    return { statusCode: 400, body: 'Missing tenant' };
  }

  try {
    const res = await fetch(`https://${tenant}.sharepoint.com/_api/web`, { headers: { Accept: 'application/json' } });

    return {
      statusCode: 200,
      body: JSON.stringify({
        exists: [200, 401, 403].includes(res.status),
        status: res.status
      })
    };
  } catch {
    return {
      statusCode: 200,
      body: JSON.stringify({ exists: false })
    };
  }
};
