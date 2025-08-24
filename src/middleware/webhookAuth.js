import { validateWebhookRequest } from '../utils/hmac.js';

/**
 * Webhook authentication middleware
 * Tüm webhook request'lerini HMAC ile doğrular
 */
export function webhookAuth(req, res, next) {
  // Sadece webhook route'larında çalış
  if (!req.path.startsWith('/webhooks')) {
    return next();
  }

  const secret = process.env.SHOPIFY_API_SECRET;

  if (!secret) {
    console.error('SHOPIFY_API_SECRET environment variable not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // HMAC doğrulaması
  if (!validateWebhookRequest(req, secret)) {
    console.error('Webhook HMAC verification failed');
    return res.status(401).json({ error: 'Unauthorized webhook request' });
  }

  // Webhook bilgilerini request'e ekle
  req.webhookData = {
    shop: req.get('X-Shopify-Shop-Domain'),
    topic: req.get('X-Shopify-Topic'),
    hmac: req.get('X-Shopify-Hmac-Sha256'),
    timestamp: req.get('X-Shopify-Shop-Domain'),
  };

  console.log('Webhook authenticated:', req.webhookData);
  next();
}

/**
 * Webhook rate limiting middleware
 * Aynı shop'tan gelen webhook'ları sınırlar
 */
export function webhookRateLimit(req, res, next) {
  if (!req.path.startsWith('/webhooks')) {
    return next();
  }

  const shop = req.get('X-Shopify-Shop-Domain');
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
