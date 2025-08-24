const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Shopify-Hmac-Sha256, X-Shopify-Shop-Domain, X-Shopify-Topic');
  next();
});

// HMAC doğrulama fonksiyonu
function verifyWebhook(body, hmacHeader, secret) {
  if (!body || !hmacHeader || !secret) {
    console.error('Missing required parameters');
    return false;
  }

  try {
    const calculatedHmac = crypto
      .createHmac('sha256', secret)
      .update(body, 'utf8')
      .digest('base64');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(calculatedHmac),
      Buffer.from(hmacHeader)
    );

    console.log('HMAC verification:', isValid ? 'SUCCESS' : 'FAILED');
    return isValid;
  } catch (error) {
    console.error('HMAC verification error:', error);
    return false;
  }
}

// Ana sayfa
app.get('/', (req, res) => {
  res.json({
    message: 'Recently Viewed Products Pro - Webhook Server',
    status: 'running',
    endpoints: {
      '/webhooks/app/uninstalled': 'APP_UNINSTALLED webhook',
      '/webhooks/shop/update': 'SHOP_UPDATE webhook',
      '/webhooks/customers/data_request': 'CUSTOMERS_DATA_REQUEST webhook',
      '/webhooks/customers/redact': 'CUSTOMERS_REDACT webhook',
      '/webhooks/shop/redact': 'SHOP_REDACT webhook'
    }
  });
});

// APP_UNINSTALLED webhook
app.post('/webhooks/app/uninstalled', (req, res) => {
  console.log('🔔 APP_UNINSTALLED webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('Headers:', { hmacHeader, shopHeader, topicHeader });
  console.log('Body:', req.body);

  // HMAC doğrulaması
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error('SHOPIFY_API_SECRET environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  if (verifyWebhook(body, hmacHeader, secret)) {
    console.log(`✅ App uninstalled from shop: ${shopHeader}`);
    res.status(200).json({ success: true, message: 'App uninstalled successfully' });
  } else {
    console.log('❌ Invalid HMAC signature');
    res.status(401).json({ error: 'Invalid signature' });
  }
});

// SHOP_UPDATE webhook
app.post('/webhooks/shop/update', (req, res) => {
  console.log('🔔 SHOP_UPDATE webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error('SHOPIFY_API_SECRET environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  if (verifyWebhook(body, hmacHeader, secret)) {
    console.log(`✅ Shop updated: ${shopHeader}`);
    res.status(200).json({ success: true, message: 'Shop updated successfully' });
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
});

// CUSTOMERS_DATA_REQUEST webhook
app.post('/webhooks/customers/data_request', (req, res) => {
  console.log('🔔 CUSTOMERS_DATA_REQUEST webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error('SHOPIFY_API_SECRET environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  if (verifyWebhook(body, hmacHeader, secret)) {
    console.log(`✅ Customer data request from shop: ${shopHeader}`);
    res.status(200).json({ success: true, message: 'Customer data request processed' });
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
});

// CUSTOMERS_REDACT webhook
app.post('/webhooks/customers/redact', (req, res) => {
  console.log('🔔 CUSTOMERS_REDACT webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error('SHOPIFY_API_SECRET environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  if (verifyWebhook(body, hmacHeader, secret)) {
    console.log(`✅ Customer redact request from shop: ${shopHeader}`);
    res.status(200).json({ success: true, message: 'Customer data redacted successfully' });
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
});

// SHOP_REDACT webhook
app.post('/webhooks/shop/redact', (req, res) => {
  console.log('🔔 SHOP_REDACT webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error('SHOPIFY_API_SECRET environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  if (verifyWebhook(body, hmacHeader, secret)) {
    console.log(`✅ Shop redact request from shop: ${shopHeader}`);
    res.status(200).json({ success: true, message: 'Shop data redacted successfully' });
  } else {
    res.status(401).json({ error: 'Invalid signature' });
  }
});

// Auth endpoint
app.get('/auth', (req, res) => {
  console.log('🔐 Auth endpoint accessed');
  res.json({
    success: true,
    message: 'Auth endpoint ready',
    status: 'working'
  });
});

// Server başlat
app.listen(PORT, () => {
  console.log(`🚀 Webhook Server running on port ${PORT}`);
  console.log(`📝 Test endpoints:`);
  console.log(`   GET  / - Server status`);
  console.log(`   GET  /auth - Auth endpoint`);
  console.log(`   POST /webhooks/app/uninstalled`);
  console.log(`   POST /webhooks/shop/update`);
  console.log(`   POST /webhooks/customers/data_request`);
  console.log(`   POST /webhooks/customers/redact`);
  console.log(`   POST /webhooks/shop/redact`);
});
