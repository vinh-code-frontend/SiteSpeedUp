import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const body = JSON.parse(event.body || '{}');

  return {
    statusCode: 200,
    body: JSON.stringify({
      received: body
    })
  };
};
