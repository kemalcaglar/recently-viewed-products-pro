import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // HMAC doğrulaması
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  if (!hmacHeader || !shopHeader || !topicHeader) {
    console.error('Missing required webhook headers');
    return res.status(400).json({ error: 'Missing headers' });
  }

  // HMAC doğrulaması
  const secret = process.env.SHOPIFY_API_SECRET || 'your_secret_here';
  const body = req.body;
  const rawBody = typeof body === 'string' ? body : JSON.stringify(body);

  const calculatedHmac = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');

  if (calculatedHmac !== hmacHeader) {
    console.error('Invalid HMAC signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try {
    console.log(`Customer data request from shop: ${shopHeader}`);

    // GDPR compliance - Müşteri verisi talep edildiğinde
    // - Müşteri verilerini hazırla
    // - Export formatında gönder

    res.status(200).json({ success: true, message: 'Customer data request processed' });
  } catch (error) {
    console.error('Customer data request webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
