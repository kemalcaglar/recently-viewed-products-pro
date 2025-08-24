import crypto from 'crypto';

/**
 * HMAC-SHA256 ile webhook imzasını doğrular
 * @param {string} body - Webhook body (raw string)
 * @param {string} hmacHeader - X-Shopify-Hmac-Sha256 header
 * @param {string} secret - App secret key
 * @returns {boolean} - İmza geçerli mi?
 */
export function verifyWebhook(body, hmacHeader, secret) {
  if (!body || !hmacHeader || !secret) {
    console.error('HMAC verification: Missing required parameters');
    return false;
  }

  try {
    // HMAC hesapla
    const calculatedHmac = crypto
      .createHmac('sha256', secret)
      .update(body, 'utf8')
      .digest('base64');

    // Header'daki HMAC ile karşılaştır
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

/**
 * Webhook body'den HMAC hesaplar
 * @param {string} body - Webhook body
 * @param {string} secret - App secret
 * @returns {string} - HMAC hash
 */
export function calculateHmac(body, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');
}

/**
 * Webhook güvenlik kontrolü
 * @param {Object} req - Express request object
 * @param {string} secret - App secret
 * @returns {boolean} - Güvenli mi?
 */
export function validateWebhookRequest(req, secret) {
  const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
  const shopHeader = req.get('X-Shopify-Shop-Domain');
  const topicHeader = req.get('X-Shopify-Topic');

  // Gerekli header'ları kontrol et
  if (!hmacHeader || !shopHeader || !topicHeader) {
    console.error('Missing required webhook headers');
    return false;
  }

  // HMAC doğrulaması
  const body = req.body;
  const rawBody = typeof body === 'string' ? body : JSON.stringify(body);

  return verifyWebhook(rawBody, hmacHeader, secret);
}
