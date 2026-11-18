exports.main_handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
      }
    };
  }

  try {
    let bodyStr = event.body || '{}';
    if (event.isBase64Encoded) {
      bodyStr = Buffer.from(event.body, 'base64').toString('utf8');
    }

    let apiKey = process.env.GLM_API_KEY;

    const clientHeaders = event.headers || {};
    const authHeader = clientHeaders['authorization'] || clientHeaders['Authorization'];
    if (authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 30) {
      apiKey = authHeader.replace('Bearer ', '');
    }

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: { message: '服务器未配置 API Key，请在环境变量中设置 GLM_API_KEY' } })
      };
    }

    const requestBody = JSON.parse(bodyStr);
    requestBody.model = 'glm-4.7-flash';

    const baseUrl = (process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4').replace(/\/+$/, '');
    const fetchUrl = `${baseUrl}/chat/completions`;

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: { message: error.message || '云函数代理执行失败' } })
    };
  }
};
