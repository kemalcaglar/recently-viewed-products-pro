const axios = require('axios');

// Shopify Admin API credentials
const SHOP_DOMAIN = 'recentlyviewedproducts.myshopify.com';
const ACCESS_TOKEN = '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';
const API_VERSION = '2025-07';

// Eski webhook ID'leri (silinecek)
const OLD_WEBHOOK_IDS = [
  1751701553517, // Eski ngrok app/uninstalled
  1751701586285, // Eski ngrok shop/update
  1751702831469, // Eski ngrok app/uninstalled
  1751702864237  // Eski ngrok shop/update
];

async function deleteWebhook(webhookId) {
  try {
    const response = await axios.delete(
      `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/webhooks/${webhookId}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Webhook deleted: ID ${webhookId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting webhook ${webhookId}:`, error.response?.data || error.message);
    return false;
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
  console.log('🗑️ Deleting old webhooks...\n');

  // Delete old webhooks
  for (const webhookId of OLD_WEBHOOK_IDS) {
    await deleteWebhook(webhookId);
    console.log(''); // Empty line for readability
  }

  // List remaining webhooks
  await listWebhooks();

  console.log('\n✨ Webhook cleanup completed!');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { deleteWebhook, listWebhooks };
