const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(express.text({ verify: (req, res, buf) => { req.rawBody = buf; } }));

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

// Webhook test endpoint'i
app.post('/test-webhook', (req, res) => {
  console.log('\n🔔 Webhook Test Request Alındı!');

  // Headers'ı logla
  console.log('Headers:', req.headers);

  // Body'yi logla
  console.log('Body:', req.body);
  console.log('Raw Body:', req.rawBody?.toString());

  // HMAC doğrulaması
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('\n📋 Webhook Headers:');
  console.log('HMAC:', hmacHeader);
  console.log('Shop:', shopHeader);
  console.log('Topic:', topicHeader);

  // Test secret (gerçek uygulamada environment variable'dan gelir)
  const testSecret = 'test_secret_key_123';

  if (hmacHeader) {
    const body = req.rawBody || req.body;
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);

    const isValid = verifyWebhook(rawBody, hmacHeader, testSecret);

    if (isValid) {
      console.log('✅ HMAC Doğrulama BAŞARILI!');
      res.status(200).json({
        success: true,
        message: 'Webhook authenticated successfully',
        hmac: 'valid'
      });
    } else {
      console.log('❌ HMAC Doğrulama BAŞARISIZ!');
      res.status(401).json({
        success: false,
        message: 'Invalid HMAC signature',
        hmac: 'invalid'
      });
    }
  } else {
    console.log('⚠️ HMAC header bulunamadı');
    res.status(400).json({
      success: false,
      message: 'Missing HMAC header',
      hmac: 'missing'
    });
  }
});

// Test endpoint'i
app.get('/test', (req, res) => {
  res.json({
    message: 'Webhook Test Server Çalışıyor!',
    endpoints: {
      'POST /test-webhook': 'Webhook test endpoint',
      'GET /test': 'Test endpoint'
    },
    instructions: [
      '1. Bu endpoint\'e webhook gönder',
      '2. HMAC header\'ı ekle',
      '3. Sonucu kontrol et'
    ]
  });
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`🚀 Webhook Test Server başlatıldı: http://localhost:${PORT}`);
  console.log(`📝 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔔 Webhook endpoint: http://localhost:${PORT}/test-webhook`);
  console.log('\n💡 Test için:');
  console.log('curl -X POST http://localhost:3001/test-webhook \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "X-Shopify-Hmac-Sha256: YOUR_HMAC" \\');
  console.log('  -H "X-Shopify-Shop-Domain: test-shop.myshopify.com" \\');
  console.log('  -H "X-Shopify-Topic: app/uninstalled" \\');
  console.log('  -d \'{"test": "data"}\'');
});
