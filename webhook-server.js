const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 8080;

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

// HMAC verification function
function verifyWebhook(body, hmacHeader, secret) {
  if (!body || !hmacHeader || !secret) {
    console.log('❌ Missing required parameters for HMAC verification');
    return false;
  }

  try {
    const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
    const calculatedHmac = crypto
      .createHmac('sha256', secret)
      .update(bodyString, 'utf8')
      .digest('base64');

    console.log('🔐 HMAC Verification:');
    console.log('  - Calculated HMAC:', calculatedHmac);
    console.log('  - Received HMAC:', hmacHeader);
    console.log('  - Match:', calculatedHmac === hmacHeader);

    return calculatedHmac === hmacHeader;
  } catch (error) {
    console.error('❌ HMAC verification error:', error);
    return false;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Recently Viewed Products Pro - Webhook Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      '/health': 'Health check endpoint',
      '/webhooks/app/uninstalled': 'APP_UNINSTALLED webhook',
      '/webhooks/shop/update': 'SHOP_UPDATE webhook',
      '/webhooks/customers/data_request': 'CUSTOMERS_DATA_REQUEST webhook',
      '/webhooks/customers/redact': 'CUSTOMERS_REDACT webhook',
      '/webhooks/shop/redact': 'SHOP_REDACT webhook',
      '/auth': 'Auth endpoint for Shopify OAuth'
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

  // HMAC verification
  const secret = process.env.SHOPIFY_API_SECRET || 'test_secret';
  const isValid = verifyWebhook(req.body, hmacHeader, secret);

  if (isValid) {
    console.log('✅ HMAC verification: SUCCESS');
    res.status(200).send('OK');
  } else {
    console.log('❌ HMAC verification: FAILED');
    res.status(401).send('Unauthorized');
  }
});

// SHOP_UPDATE webhook
app.post('/webhooks/shop/update', (req, res) => {
  console.log('🔔 SHOP_UPDATE webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('Headers:', { hmacHeader, shopHeader, topicHeader });
  console.log('Body:', req.body);

  // HMAC verification
  const secret = process.env.SHOPIFY_API_SECRET || 'test_secret';
  const isValid = verifyWebhook(req.body, hmacHeader, secret);

  if (isValid) {
    console.log('✅ HMAC verification: SUCCESS');
    res.status(200).send('OK');
  } else {
    console.log('❌ HMAC verification: FAILED');
    res.status(401).send('Unauthorized');
  }
});

// CUSTOMERS_DATA_REQUEST webhook
app.post('/webhooks/customers/data_request', (req, res) => {
  console.log('🔔 CUSTOMERS_DATA_REQUEST webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('Headers:', { hmacHeader, shopHeader, topicHeader });
  console.log('Body:', req.body);

  // HMAC verification
  const secret = process.env.SHOPIFY_API_SECRET || 'test_secret';
  const isValid = verifyWebhook(req.body, hmacHeader, secret);

  if (isValid) {
    console.log('✅ HMAC verification: SUCCESS');
    res.status(200).send('OK');
  } else {
    console.log('❌ HMAC verification: FAILED');
    res.status(401).send('Unauthorized');
  }
});

// CUSTOMERS_REDACT webhook
app.post('/webhooks/customers/redact', (req, res) => {
  console.log('🔔 CUSTOMERS_REDACT webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('Headers:', { hmacHeader, shopHeader, topicHeader });
  console.log('Body:', req.body);

  // HMAC verification
  const secret = process.env.SHOPIFY_API_SECRET || 'test_secret';
  const isValid = verifyWebhook(req.body, hmacHeader, secret);

  if (isValid) {
    console.log('✅ HMAC verification: SUCCESS');
    res.status(200).send('OK');
  } else {
    console.log('❌ HMAC verification: FAILED');
    res.status(401).send('Unauthorized');
  }
});

// SHOP_REDACT webhook
app.post('/webhooks/shop/redact', (req, res) => {
  console.log('🔔 SHOP_REDACT webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('Headers:', { hmacHeader, shopHeader, topicHeader });
  console.log('Body:', req.body);

  // HMAC verification
  const secret = process.env.SHOPIFY_API_SECRET || 'test_secret';
  const isValid = verifyWebhook(req.body, hmacHeader, secret);

  if (isValid) {
    console.log('✅ HMAC verification: SUCCESS');
    res.status(200).send('OK');
  } else {
    console.log('❌ HMAC verification: FAILED');
    res.status(401).send('Unauthorized');
  }
});

// Auth endpoint for Shopify OAuth
app.get('/auth', (req, res) => {
  console.log('🔐 Auth endpoint accessed');
  res.json({
    message: 'Auth endpoint for Recently Viewed Products Pro',
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
  console.log(`📡 Webhook endpoints:`);
  console.log(`   - HEALTH: http://0.0.0.0:${PORT}/health`);
  console.log(`   - ROOT: http://0.0.0.0:${PORT}/`);
  console.log(`   - APP_UNINSTALLED: http://0.0.0.0:${PORT}/webhooks/app/uninstalled`);
  console.log(`   - SHOP_UPDATE: http://0.0.0.0:${PORT}/webhooks/shop/update`);
  console.log(`   - CUSTOMERS_DATA_REQUEST: http://0.0.0.0:${PORT}/webhooks/customers/data_request`);
  console.log(`   - CUSTOMERS_REDACT: http://0.0.0.0:${PORT}/webhooks/customers/redact`);
  console.log(`   - SHOP_REDACT: http://0.0.0.0:${PORT}/webhooks/shop/redact`);
  console.log(`   - AUTH: http://0.0.0.0:${PORT}/auth`);
  console.log(`🌍 Server listening on all interfaces`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  process.exit(0);
});
