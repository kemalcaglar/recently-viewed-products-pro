const crypto = require('crypto');

// Test verileri
const testSecret = 'test_secret_key_123';
const testBody = '{"test": "data"}';

// HMAC hesapla
const hmac = crypto
  .createHmac('sha256', testSecret)
  .update(testBody, 'utf8')
  .digest('base64');

console.log('🔐 Doğru HMAC Hesaplandı!');
console.log('Body:', testBody);
console.log('Secret:', testSecret);
console.log('HMAC:', hmac);

console.log('\n📋 PowerShell Test Komutu:');
console.log('Invoke-WebRequest -Uri "http://localhost:3001/test-webhook" \\');
console.log('  -Method POST \\');
console.log(`  -Headers @{"Content-Type"="application/json"; "X-Shopify-Hmac-Sha256"="${hmac}"; "X-Shopify-Shop-Domain"="test-shop.myshopify.com"; "X-Shopify-Topic"="app/uninstalled"} \\`);
console.log(`  -Body '${testBody}'`);

console.log('\n🎯 Bu HMAC ile test yapın!');
