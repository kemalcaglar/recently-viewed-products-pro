const axios = require('axios');

// Shopify Admin API credentials
const SHOP_DOMAIN = 'recentlyviewedproducts.myshopify.com';
const ACCESS_TOKEN = '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';
const API_VERSION = '2025-07';

// Webhook endpoints
const WEBHOOK_ENDPOINTS = [
  {
    topic: 'app/uninstalled',
    address: 'https://e1c37ff24c6c.ngrok-free.app/webhooks/app/uninstalled',
    format: 'json'
  },
  {
    topic: 'shop/update',
    address: 'https://e1c37ff24c6c.ngrok-free.app/webhooks/shop/update',
    format: 'json'
  }
];

async function createWebhook(webhookData) {
  try {
    const response = await axios.post(
      `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/webhooks.json`,
      {
        webhook: webhookData
      },
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Webhook created: ${webhookData.topic}`);
    console.log(`   ID: ${response.data.webhook.id}`);
    console.log(`   Address: ${response.data.webhook.address}`);
    return response.data.webhook;
  } catch (error) {
    console.error(`❌ Error creating webhook ${webhookData.topic}:`, error.response?.data || error.message);
    return null;
  }
}

async function listWebhooks() {
  try {
    const response = await axios.get(
      `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/webhooks.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN
        }
      }
    );

    console.log('\n📋 Current Webhooks:');
    response.data.webhooks.forEach(webhook => {
      console.log(`   - ${webhook.topic}: ${webhook.address} (ID: ${webhook.id})`);
    });

    return response.data.webhooks;
  } catch (error) {
    console.error('❌ Error listing webhooks:', error.response?.data || error.message);
    return [];
  }
}

async function main() {
  console.log('🚀 Creating Shopify Webhooks...\n');

  // Create each webhook
  for (const webhookData of WEBHOOK_ENDPOINTS) {
    await createWebhook(webhookData);
    console.log(''); // Empty line for readability
  }

  // List all webhooks
  await listWebhooks();

  console.log('\n✨ Webhook creation completed!');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createWebhook, listWebhooks };
