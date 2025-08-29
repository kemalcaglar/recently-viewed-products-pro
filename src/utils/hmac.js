const crypto = require('crypto');

/**
 * HMAC-SHA256 ile webhook imzasını doğrular
 * Shopify'ın resmi dokümantasyonuna uygun
 * @param {Buffer|string} body - Webhook body (raw buffer or string)
 * @param {string} hmacHeader - X-Shopify-Hmac-Sha256 header
 * @param {string} secret - App secret key
 * @returns {boolean} - İmza geçerli mi?
 */
function verifyWebhook(body, hmacHeader, secret) {
  if (!body || !hmacHeader || !secret) {
    console.error('HMAC verification: Missing required parameters');
    return false;
  }

  try {
    // Body'yi buffer olarak al
    const bodyBuffer = Buffer.isBuffer(body) ? body : Buffer.from(body, 'utf8');

    // HMAC hesapla - Shopify'ın standardına uygun
    const calculatedHmac = crypto
      .createHmac('sha256', secret)
      .update(bodyBuffer)
      .digest('base64');

    // Header'daki HMAC ile karşılaştır
    const isValid = crypto.timingSafeEqual(
      Buffer.from(calculatedHmac),
      Buffer.from(hmacHeader)
    );

    console.log('HMAC verification:', isValid ? 'SUCCESS' : 'FAILED');
    console.log('  - Calculated HMAC:', calculatedHmac);
    console.log('  - Received HMAC:', hmacHeader);
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
function calculateHmac(body, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');
}

/**
 * Webhook güvenlik kontrolü
 * Shopify'ın resmi dokümantasyonuna uygun
 * @param {Object} req - Express request object
 * @param {string} secret - App secret
 * @returns {boolean} - Güvenli mi?
 */
function validateWebhookRequest(req, secret) {
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const body = req.body; // Raw body from express.raw() middleware

  if (!hmacHeader || !body) {
    console.error('Missing HMAC header or body');
    console.error('HMAC Header:', hmacHeader);
    console.error('Body type:', typeof body);
    console.error('Body length:', body ? body.length : 'undefined');
    return false;
  }

  return verifyWebhook(body, hmacHeader, secret);
}

module.exports = {
  verifyWebhook,
  calculateHmac,
  validateWebhookRequest
};
