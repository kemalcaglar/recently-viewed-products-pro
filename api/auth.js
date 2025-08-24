export default function handler(req, res) {
  // CORS headers ekle
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // HTML response döndür
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shopify Auth Endpoint</title>
        </head>
        <body>
          <h1>Shopify Auth Endpoint Ready</h1>
          <p>This endpoint handles Shopify OAuth flow</p>
          <p>Status: ✅ Working</p>
        </body>
      </html>
    `);
  } else if (req.method === 'POST') {
    // JSON response döndür
    res.status(200).json({
      success: true,
      message: 'Auth endpoint ready for POST requests',
      status: 'working'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
