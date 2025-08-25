const axios = require('axios');

// Shopify Admin API credentials
const SHOP_DOMAIN = 'recentlyviewedproducts.myshopify.com';
const ACCESS_TOKEN = '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';
const API_VERSION = '2025-07';

// Railway webhook endpoints
const RAILWAY_BASE_URL = 'https://recently-viewed-products-pro-production.up.railway.app';

// Compliance webhook topics (Shopify Admin API format)
const COMPLIANCE_WEBHOOKS = [
  {
    topic: 'app/uninstalled',
    address: `${RAILWAY_BASE_URL}/webhooks/app/uninstalled`,
    format: 'json'
  },
  {
    topic: 'shop/update',
    address: `${RAILWAY_BASE_URL}/webhooks/shop/update`,
    format: 'json'
  },
  {
    topic: 'customers/data_request',
    address: `${RAILWAY_BASE_URL}/webhooks/customers/data_request`,
    format: 'json'
  },
  {
    topic: 'customers/redact',
    address: `${RAILWAY_BASE_URL}/webhooks/customers/redact`,
    format: 'json'
  },
  {
    topic: 'shop/redact',
    address: `${RAILWAY_BASE_URL}/webhooks/shop/redact`,
    format: 'json'
  }
];

async function createWebhookSubscription(webhookData) {
  try {
    console.log(`🚀 Creating webhook subscription for: ${webhookData.topic}`);

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

    console.log(`✅ Webhook subscription created: ${webhookData.topic}`);
    console.log(`   ID: ${response.data.webhook.id}`);
    console.log(`   Address: ${response.data.webhook.address}`);
    console.log(`   Status: ${response.data.webhook.status}`);
    return response.data.webhook;

  } catch (error) {
    console.error(`❌ Error creating webhook ${webhookData.topic}:`, error.response?.data || error.message);
    return null;
  }
}

async function listAllWebhooks() {
  try {
    console.log('\n📋 Fetching all webhook subscriptions...');

    const response = await axios.get(
      `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/webhooks.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN
        }
      }
    );

    if (response.data.webhooks && response.data.webhooks.length > 0) {
      console.log('\n📋 Current Webhook Subscriptions:');
      response.data.webhooks.forEach(webhook => {
        console.log(`   - ${webhook.topic}: ${webhook.address} (ID: ${webhook.id}, Status: ${webhook.status})`);
      });
    } else {
      console.log('   No webhook subscriptions found');
    }

    return response.data.webhooks;

  } catch (error) {
    console.error('❌ Error listing webhooks:', error.response?.data || error.message);
    return [];
  }
}

async function deleteWebhook(webhookId) {
  try {
    const response = await axios.delete(
      `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/webhooks/${webhookId}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN
        }
      }
    );

    console.log(`🗑️ Webhook deleted: ID ${webhookId}`);
    return true;

  } catch (error) {
    console.error(`❌ Error deleting webhook ${webhookId}:`, error.response?.data || error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Creating Shopify Compliance Webhook Subscriptions...\n');
  console.log(`📍 Railway Base URL: ${RAILWAY_BASE_URL}\n`);

  // First, list existing webhooks
  const existingWebhooks = await listAllWebhooks();

  // Delete existing webhooks if any
  if (existingWebhooks.length > 0) {
    console.log('\n🗑️ Cleaning up existing webhooks...');
    for (const webhook of existingWebhooks) {
      await deleteWebhook(webhook.id);
    }
    console.log('✅ Existing webhooks cleaned up\n');
  }

  // Create new compliance webhook subscriptions
  console.log('🔧 Creating new compliance webhook subscriptions...\n');

  const createdWebhooks = [];
  for (const webhookData of COMPLIANCE_WEBHOOKS) {
    const webhook = await createWebhookSubscription(webhookData);
    if (webhook) {
      createdWebhooks.push(webhook);
    }
    console.log(''); // Empty line for readability
  }

  // List all webhooks after creation
  console.log('\n📋 Final Webhook Status:');
  await listAllWebhooks();

  console.log('\n✨ Webhook subscription creation completed!');
  console.log(`📊 Created: ${createdWebhooks.length}/${COMPLIANCE_WEBHOOKS.length} webhooks`);

  if (createdWebhooks.length === COMPLIANCE_WEBHOOKS.length) {
    console.log('🎉 All compliance webhooks created successfully!');
    console.log('✅ "Provides mandatory compliance webhooks" requirement should be met!');
  } else {
    console.log('⚠️ Some webhooks failed to create. Check errors above.');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createWebhookSubscription, listAllWebhooks, deleteWebhook };
