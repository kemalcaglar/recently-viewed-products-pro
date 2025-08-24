# 🚀 Kurulum Talimatları

Bu dosya, "Recently Viewed Products Widget" Shopify uygulamasını kurmanız için gerekli adımları içerir.

## 📋 Ön Gereksinimler

### Sistem Gereksinimleri

- **Node.js**: 18.0.0 veya üzeri
- **npm**: 9.0.0 veya üzeri
- **Git**: En son sürüm
- **Shopify Partner Hesabı**: Aktif partner hesabı

### Shopify Gereksinimleri

- Shopify Partner hesabı
- Test mağazası (Development Store)
- Shopify CLI 3.0

## 🔧 Adım Adım Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/shopify-recently-viewed-products-widget.git
cd shopify-recently-viewed-products-widget
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Development Server'ı Başlatın

```bash
npm run dev
```

Bu komut otomatik olarak:

- Shopify Partner hesabınıza giriş yapar
- Uygulama konfigürasyonunu yapar
- Test mağazasını seçer
- Development server'ı başlatır

### 4. Uygulama Konfigürasyonu

```bash
# Uygulama konfigürasyonunu bağlayın
npm run shopify:app:config:link

# Test mağazasını seçin
npm run shopify:app:config:use
```

### 5. Environment Variables

`.env` dosyası oluşturun:

```env
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SCOPES=read_products,write_products,read_themes,write_themes
SHOPIFY_APP_URL=https://your-app-url.com
```

### 6. Uygulamayı Test Mağazasına Deploy Edin

```bash
npm run shopify:app:deploy
```

## 🎯 Test Mağazası Kurulumu

### 1. Shopify Partner Dashboard

- [Shopify Partners](https://partners.shopify.com) adresine gidin
- Giriş yapın

### 2. Test Mağazası Oluşturun

- "Stores" > "Add store" > "Development store"
- Mağaza adı ve URL belirleyin
- "Create store" butonuna tıklayın

### 3. Uygulamayı Yükleyin

- Test mağazasına gidin
- "Apps" > "Develop apps" > "Create an app"
- App name: "Recently Viewed Products Widget"
- App URL: Uygulamanızın URL'i
- Allowed redirection URLs: Callback URL'leriniz

### 4. API Credentials

- API key ve API secret key'i kopyalayın
- `.env` dosyasına ekleyin

## 🎨 Tema Entegrasyonu

### 1. Liquid Snippet Ekleme

`recently-viewed-products.liquid` dosyasını tema dosyalarınıza ekleyin:

```liquid
{% render 'recently-viewed-products' %}
```

### 2. Ürün Sayfasına Ekleme

`product.liquid` dosyasında, ürün detaylarından sonra ekleyin:

```liquid
{% comment %} Ürün detayları {% endcomment %}
<div class="product-details">
  <!-- Mevcut ürün içeriği -->
</div>

{% comment %} Son görüntülenen ürünler widget'ı {% endcomment %}
{% render 'recently-viewed-products' %}
```

### 3. CSS ve JS Dosyalarını Yükleme

Tema `layout/theme.liquid` dosyasına ekleyin:

```liquid
<head>
  <!-- Mevcut head içeriği -->

  <!-- Widget CSS -->
  {{ 'recently-viewed-products.css' | asset_url | stylesheet_tag }}
</head>

<body>
  <!-- Mevcut body içeriği -->

  <!-- Widget JS -->
  {{ 'recently-viewed-products.js' | asset_url | script_tag }}
</body>
```

## ⚙️ Widget Konfigürasyonu

### 1. Admin Panel Erişimi

- Shopify admin panelinde "Apps" bölümüne gidin
- "Recently Viewed Products Widget" uygulamasını açın

### 2. Temel Ayarlar

- **Widget'ı Göster**: Aktif/Pasif
- **Widget Konumu**: Sağ, Sol, Alt, Üst
- **Maksimum Ürün Sayısı**: 3-10 arası
- **Widget Başlığı**: Özelleştirilebilir metin

### 3. Tema Ayarları

- **Ana Renk**: Butonlar ve yazılar için
- **Arka Plan Rengi**: Widget arka planı
- **Yazı Boyutu**: 10px - 24px arası
- **Yazı Tipi**: Arial, Helvetica, Georgia, vb.

### 4. Görünüm Seçenekleri

- **Ürün Fiyatları**: Göster/Gizle
- **Ürün Kategorileri**: Göster/Gizle
- **Animasyon Hızı**: 100ms - 1000ms
- **Otomatik Gizleme**: Aktif/Pasif

## 🧪 Test Etme

### 1. Widget Görünümü

- Test mağazasında ürün sayfasına gidin
- Sağ kenarda widget'ın görünüp görünmediğini kontrol edin
- Widget'a tıklayarak açık durumunu test edin

### 2. Ürün Takibi

- Farklı ürün sayfalarını ziyaret edin
- Widget'ta ürünlerin güncellenip güncellenmediğini kontrol edin
- Ürün sayısı limitini test edin

### 3. Responsive Tasarım

- Farklı ekran boyutlarında test edin
- Mobil cihazlarda widget'ın uyumluluğunu kontrol edin

### 4. Özelleştirmeler

- Admin panelinden farklı ayarları test edin
- Renk değişikliklerinin etkisini kontrol edin
- Font ve boyut değişikliklerini test edin

## 🔍 Sorun Giderme

### Widget Görünmüyor

- Console'da hata mesajlarını kontrol edin
- CSS ve JS dosyalarının yüklenip yüklenmediğini kontrol edin
- Shopify tema ayarlarında widget'ın aktif olduğundan emin olun

### Ürünler Takip Edilmiyor

- `productTracker.js` dosyasının yüklendiğini kontrol edin
- Console'da `trackProduct` fonksiyonunun çalıştığını kontrol edin
- localStorage'da veri olup olmadığını kontrol edin

### Stil Sorunları

- CSS dosyasının doğru yüklendiğini kontrol edin
- CSS değişkenlerinin tanımlandığını kontrol edin
- Tema CSS'leri ile çakışma olup olmadığını kontrol edin

## 📱 Mobil Optimizasyon

### 1. Touch Events

- Mobil cihazlarda dokunma olaylarını test edin
- Widget kontrollerinin dokunmatik ekranlarda çalıştığını kontrol edin

### 2. Responsive Breakpoints

- 768px ve 480px breakpoint'lerinde test edin
- Widget boyutlarının mobil cihazlara uygun olduğunu kontrol edin

### 3. Performance

- Mobil cihazlarda widget'ın performansını test edin
- Sayfa yükleme hızını etkilemediğini kontrol edin

## 🚀 Production'a Geçiş

### 1. Production Mağazası

- Test mağazasında tüm özellikleri test edin
- Production mağazasına uygulamayı yükleyin
- SSL sertifikasının aktif olduğundan emin olun

### 2. Monitoring

- Google Analytics entegrasyonu
- Error tracking (Sentry, LogRocket)
- Performance monitoring

### 3. Backup

- Widget konfigürasyonlarını yedekleyin
- Tema dosyalarının yedeğini alın
- Uygulama ayarlarını export edin

## 📚 Ek Kaynaklar

- [Shopify App Development](https://shopify.dev/docs/apps)
- [Shopify Liquid Documentation](https://shopify.dev/docs/themes/liquid)
- [Shopify CLI Documentation](https://shopify.dev/docs/apps/tools/cli)
- [Shopify App Bridge](https://shopify.dev/docs/apps/tools/app-bridge)

## 🤝 Destek

Herhangi bir sorun yaşarsanız:

1. GitHub Issues'da sorun bildirin
2. Console hata mesajlarını paylaşın
3. Ekran görüntüleri ekleyin
4. Adım adım yapılan işlemleri açıklayın

---

**Not**: Bu kurulum talimatları Shopify'in en güncel versiyonu için hazırlanmıştır. Shopify güncellemeleri ile bazı adımlar değişebilir.
