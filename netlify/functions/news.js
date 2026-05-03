export const handler = async () => {
  const endpoint = 'https://YOUR-SERVICE-ID.microcms.io/api/v1/news';

  try {
    const res = await fetch(endpoint, {
      headers: {
        'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY
      }
    });

    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch',
        detail: error.message
      })
    };
  }
};
