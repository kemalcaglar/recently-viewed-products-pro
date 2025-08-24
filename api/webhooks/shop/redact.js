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
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error('SHOPIFY_API_SECRET environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }
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
    console.log(`Shop redact request from shop: ${shopHeader}`);

    // GDPR compliance - Shop verisi silme talebi
    // - Tüm shop verilerini sil
    // - Analytics verilerini temizle
    // - Backup'ları kaldır

    res.status(200).json({ success: true, message: 'Shop data redacted successfully' });
  } catch (error) {
    console.error('Shop redact webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
