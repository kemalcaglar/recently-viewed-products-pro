import express from 'express';
import { validateWebhookRequest } from '../utils/hmac.js';

const router = express.Router();

// App uninstalled webhook
router.post('/app/uninstalled', (req, res) => {
  const secret = process.env.SHOPIFY_API_SECRET;

  // HMAC doğrulaması
  if (!validateWebhookRequest(req, secret)) {
    console.error('Invalid HMAC for app uninstalled webhook');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    console.log(`App uninstalled from shop: ${shopDomain}`);

    // App kaldırıldığında yapılacak işlemler
    // - Veritabanından shop bilgilerini sil
    // - LocalStorage temizle
    // - Analytics verilerini arşivle

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('App uninstalled webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shop update webhook
router.post('/shop/update', (req, res) => {
  const secret = process.env.SHOPIFY_API_SECRET;

  if (!validateWebhookRequest(req, secret)) {
    console.error('Invalid HMAC for shop update webhook');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    const shopData = req.body;

    console.log(`Shop updated: ${shopDomain}`, shopData);

    // Shop güncellendiğinde yapılacak işlemler
    // - Shop bilgilerini güncelle
    // - Widget ayarlarını kontrol et

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Shop update webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Customer data request (GDPR)
router.post('/customers/data_request', (req, res) => {
  const secret = process.env.SHOPIFY_API_SECRET;

  if (!validateWebhookRequest(req, secret)) {
    console.error('Invalid HMAC for customer data request webhook');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    const customerData = req.body;

    console.log(`Customer data request from: ${shopDomain}`, customerData);

    // GDPR uyumluluğu için müşteri verilerini hazırla
    // - Ürün görüntüleme geçmişi
    - Analytics verileri
      - Widget ayarları

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Customer data request webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Customer data redact (GDPR)
router.post('/customers/redact', (req, res) => {
  const secret = process.env.SHOPIFY_API_SECRET;

  if (!validateWebhookRequest(req, secret)) {
    console.error('Invalid HMAC for customer redact webhook');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    const customerData = req.body;

    console.log(`Customer data redact from: ${shopDomain}`, customerData);

    // GDPR uyumluluğu için müşteri verilerini sil
    // - Ürün görüntüleme geçmişi
    // - Analytics verileri
    // - Widget ayarları

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Customer redact webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shop redact (GDPR)
router.post('/shop/redact', (req, res) => {
  const secret = process.env.SHOPIFY_API_SECRET;

  if (!validateWebhookRequest(req, secret)) {
    console.error('Invalid HMAC for shop redact webhook');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    const shopData = req.body;

    console.log(`Shop redact from: ${shopDomain}`, shopData);

    // GDPR uyumluluğu için shop verilerini sil
    // - Tüm shop verileri
    // - Analytics verileri
    // - Widget ayarları

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Shop redact webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
