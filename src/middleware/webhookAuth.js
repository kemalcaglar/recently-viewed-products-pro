const { validateWebhookRequest } = require('../utils/hmac.js');

/**
 * Webhook authentication middleware
 * Tüm webhook request'lerini HMAC ile doğrular
 */
function webhookAuth(req, res, next) {
  // Sadece webhook route'larında çalış
  if (!req.path.startsWith('/webhooks')) {
    return next();
  }

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (!secret) {
    console.error('SHOPIFY_WEBHOOK_SECRET environment variable not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // HMAC doğrulaması - Raw body kullan
  if (!validateWebhookRequest(req, secret)) {
    console.error('Webhook HMAC verification failed');
    return res.status(401).json({ error: 'Unauthorized webhook request' });
  }

  // Webhook bilgilerini request'e ekle
  req.webhookData = {
    shop: req.headers['x-shopify-shop-domain'],
    topic: req.headers['x-shopify-topic'],
    hmac: req.headers['x-shopify-hmac-sha256'],
    timestamp: req.headers['x-shopify-shop-domain'],
  };

  console.log('Webhook authenticated:', req.webhookData);
  next();
}

/**
 * Webhook rate limiting middleware
 * Aynı shop'tan gelen webhook'ları sınırlar
 */
function webhookRateLimit(req, res, next) {
  if (!req.path.startsWith('/webhooks')) {
    return next();
  }

  const shop = req.headers['x-shopify-shop-domain'];
  const now = Date.now();

  // Basit in-memory rate limiting
  if (!req.app.locals.webhookRateLimit) {
    req.app.locals.webhookRateLimit = new Map();
  }

  const shopLimits = req.app.locals.webhookRateLimit.get(shop) || { count: 0, resetTime: now + 60000 };

  // 1 dakikada maksimum 10 webhook
  if (now > shopLimits.resetTime) {
    shopLimits.count = 1;
    shopLimits.resetTime = now + 60000;
  } else if (shopLimits.count >= 10) {
    console.warn(`Rate limit exceeded for shop: ${shop}`);
    return res.status(429).json({ error: 'Too many requests' });
  } else {
    shopLimits.count++;
  }

  req.app.locals.webhookRateLimit.set(shop, shopLimits);
  next();
}

module.exports = {
  webhookAuth,
  webhookRateLimit
};
