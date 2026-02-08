/**
 * Shopify Billing API (GraphQL) - App Store gereksinimi
 * $2.99/ay, 3 gün deneme
 */

const https = require('https');
const oauth = require('./oauth');

const API_VERSION = '2024-01';
const PLAN_NAME = 'Recently Viewed Products Pro';
const PRICE_AMOUNT = 2.99;
const CURRENCY = 'USD';
const TRIAL_DAYS = 3;

function graphqlRequest(shop, accessToken, query, variables) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const req = https.request({
      hostname: shop,
      path: '/admin/api/' + API_VERSION + '/graphql.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * Abonelik durumunu kontrol et (currentAppInstallation.activeSubscriptions)
 */
function getSubscriptionStatus(shop) {
  const session = oauth.getSession(shop);
  if (!session || !session.accessToken) {
    return Promise.resolve({ hasSubscription: false, error: 'No session' });
  }

  const query = `
    query {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          status
        }
      }
    }
  `;

  return graphqlRequest(shop, session.accessToken, query, {})
    .then((resp) => {
      const install = resp.data && resp.data.currentAppInstallation;
      const subs = (install && install.activeSubscriptions) || [];
      const active = subs.some((s) => s.status === 'ACTIVE');
      return { hasSubscription: active, subscriptions: subs };
    })
    .catch((err) => {
      console.error('Billing status check failed:', err);
      return { hasSubscription: false, error: err.message };
    });
}

/**
 * Yeni abonelik oluştur; confirmationUrl döner
 */
function createSubscription(shop, returnUrl) {
  const session = oauth.getSession(shop);
  if (!session || !session.accessToken) {
    return Promise.reject(new Error('No session for shop: ' + shop));
  }

  const mutation = `
    mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int) {
      appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, trialDays: $trialDays) {
        userErrors { field message }
        appSubscription { id }
        confirmationUrl
      }
    }
  `;

  const variables = {
    name: PLAN_NAME,
    returnUrl: returnUrl,
    trialDays: TRIAL_DAYS,
    lineItems: [
      {
        plan: {
          appRecurringPricingDetails: {
            price: {
              amount: PRICE_AMOUNT.toString(),
              currencyCode: CURRENCY
            },
            interval: 'EVERY_30_DAYS'
          }
        }
      }
    ]
  };

  return graphqlRequest(shop, session.accessToken, mutation, variables)
    .then((resp) => {
      const payload = resp.data && resp.data.appSubscriptionCreate;
      if (!payload) {
        throw new Error(resp.errors ? JSON.stringify(resp.errors) : 'No data');
      }
      if (payload.userErrors && payload.userErrors.length > 0) {
        throw new Error(payload.userErrors.map((e) => e.message).join(', '));
      }
      if (!payload.confirmationUrl) {
        throw new Error('No confirmation URL returned');
      }
      return {
        confirmationUrl: payload.confirmationUrl,
        subscriptionId: payload.appSubscription && payload.appSubscription.id
      };
    });
}

module.exports = {
  getSubscriptionStatus,
  createSubscription
};
