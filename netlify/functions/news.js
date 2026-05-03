exports.handler = async () => {
  const endpoint = 'https://【サービスID】.microcms.io/api/v1/news';

  try {
    const res = await fetch(endpoint, {
      headers: {
        'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY
      }
    });

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
