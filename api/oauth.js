/**
 * Shopify OAuth - Kurulum ve yeniden kurulumda hemen kimlik doğrulama
 * App Store gereksinimi: 2.3.2, 2.3.4
 */

const crypto = require('crypto');
const https = require('https');

const SCOPES = process.env.SHOPIFY_SCOPES || 'read_products,read_themes,write_products,write_themes';

// In-memory session store (production için Redis/DB önerilir)
const sessions = new Map();

function getSession(shop) {
  return sessions.get(shop) || null;
}

function setSession(shop, data) {
  sessions.set(shop, { ...data, updatedAt: new Date() });
}

function getAuthRedirectUrl(shop, host, baseUrl) {
  const clientId = process.env.SHOPIFY_API_KEY;
  if (!clientId) throw new Error('SHOPIFY_API_KEY is not set');
  const redirectUri = baseUrl + '/auth';
  const state = crypto.randomBytes(16).toString('hex');
  const nonce = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: redirectUri,
    state,
    nonce,
    grant_options: JSON.stringify({ access_mode: 'offline' })
  });
  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}

function exchangeCodeForToken(shop, code, baseUrl) {
  return new Promise((resolve, reject) => {
    const clientId = process.env.SHOPIFY_API_KEY;
    const clientSecret = process.env.SHOPIFY_API_SECRET;
    if (!clientId || !clientSecret) {
      reject(new Error('SHOPIFY_API_KEY or SHOPIFY_API_SECRET is not set'));
      return;
    }
    const postData = JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code
    });
    const req = https.request({
      hostname: shop,
      path: '/admin/oauth/access_token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.access_token) {
            setSession(shop, {
              accessToken: data.access_token,
              scope: data.scope
            });
            resolve(data);
          } else {
            reject(new Error(body || 'No access_token in response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

module.exports = {
  getSession,
  setSession,
  getAuthRedirectUrl,
  exchangeCodeForToken,
  sessions
};
