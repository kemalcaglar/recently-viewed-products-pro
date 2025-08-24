const crypto = require('crypto');

// Test verileri
const testSecret = 'test_secret_key_123';
const testBody = JSON.stringify({
  id: 12345,
  shop_domain: 'test-shop.myshopify.com',
  topic: 'app/uninstalled'
});

// HMAC hesaplama
function calculateHmac(body, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');
}

// HMAC doğrulama
function verifyHmac(body, hmacHeader, secret) {
  const calculatedHmac = calculateHmac(body, secret);

  // Timing-safe comparison
  const isValid = crypto.timingSafeEqual(
    Buffer.from(calculatedHmac),
    Buffer.from(hmacHeader)
  );

  return isValid;
}

// Test senaryoları
console.log('🔐 HMAC Test Başlıyor...\n');

// Test 1: HMAC hesaplama
console.log('📝 Test 1: HMAC Hesaplama');
const hmac = calculateHmac(testBody, testSecret);
console.log('Body:', testBody);
console.log('Secret:', testSecret);
console.log('Calculated HMAC:', hmac);
console.log('');

// Test 2: HMAC doğrulama (başarılı)
console.log('✅ Test 2: HMAC Doğrulama (Başarılı)');
const isValid1 = verifyHmac(testBody, hmac, testSecret);
console.log('Sonuç:', isValid1 ? 'BAŞARILI' : 'BAŞARISIZ');
console.log('');

// Test 3: HMAC doğrulama (başarısız - yanlış secret)
console.log('❌ Test 3: HMAC Doğrulama (Yanlış Secret)');
const wrongSecret = 'wrong_secret_key';
const isValid2 = verifyHmac(testBody, hmac, wrongSecret);
console.log('Sonuç:', isValid2 ? 'BAŞARILI' : 'BAŞARISIZ');
console.log('');

// Test 4: HMAC doğrulama (başarısız - yanlış body)
console.log('❌ Test 4: HMAC Doğrulama (Yanlış Body)');
const wrongBody = JSON.stringify({ id: 99999, wrong: 'data' });
const isValid3 = verifyHmac(wrongBody, hmac, testSecret);
console.log('Sonuç:', isValid3 ? 'BAŞARILI' : 'BAŞARISIZ');
console.log('');

// Test 5: Webhook header simülasyonu
console.log('🌐 Test 5: Webhook Header Simülasyonu');
const webhookHeaders = {
  'X-Shopify-Hmac-Sha256': hmac,
  'X-Shopify-Shop-Domain': 'test-shop.myshopify.com',
  'X-Shopify-Topic': 'app/uninstalled'
};

console.log('Webhook Headers:');
Object.entries(webhookHeaders).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

console.log('\n🎯 Tüm testler tamamlandı!');
console.log('HMAC implementasyonu çalışıyor mu kontrol edin.');
