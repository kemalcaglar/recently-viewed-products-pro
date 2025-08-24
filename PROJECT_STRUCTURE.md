# 📁 Proje Yapısı

```
shopifyAppv2/
├── 📄 README.md                           # Proje açıklaması ve dokümantasyon
├── 📄 INSTALL.md                          # Detaylı kurulum talimatları
├── 📄 PROJECT_STRUCTURE.md                # Bu dosya - proje yapısı
├── 📄 package.json                        # Node.js bağımlılıkları ve scriptler
├── 📄 shopify.app.toml                    # Shopify app konfigürasyonu
├── 📄 .env.example                        # Environment variables örneği
├── 📄 .gitignore                          # Git ignore dosyası
│
├── 📁 src/                                # Kaynak kod dosyaları
│   ├── 📁 components/                     # React bileşenleri
│   │   ├── 📄 RecentlyViewedWidget.jsx    # Ana widget bileşeni
│   │   ├── 📄 RecentlyViewedWidget.css    # Widget CSS stilleri
│   │   ├── 📄 AdminPanel.jsx              # Admin panel bileşeni
│   │   └── 📄 SettingsForm.jsx            # Ayarlar formu
│   │
│   ├── 📁 pages/                          # Sayfa bileşenleri
│   │   ├── 📄 App.jsx                     # Ana uygulama sayfası
│   │   ├── 📄 Dashboard.jsx               # Dashboard sayfası
│   │   └── 📄 Settings.jsx                # Ayarlar sayfası
│   │
│   ├── 📁 hooks/                          # Custom React hooks
│   │   ├── 📄 useWidgetConfig.js          # Widget konfigürasyon hook'u
│   │   ├── 📄 useProductTracker.js        # Ürün takip hook'u
│   │   └── 📄 useShopifyAPI.js            # Shopify API hook'u
│   │
│   ├── 📁 utils/                          # Yardımcı fonksiyonlar
│   │   ├── 📄 productTracker.js           # Ürün takip sistemi
│   │   ├── 📄 shopifyHelpers.js           # Shopify yardımcı fonksiyonları
│   │   ├── 📄 analytics.js                # Analitik fonksiyonları
│   │   └── 📄 constants.js                # Sabit değerler
│   │
│   ├── 📁 styles/                         # Global CSS/SCSS dosyaları
│   │   ├── 📄 global.css                  # Global stiller
│   │   ├── 📄 variables.css               # CSS değişkenleri
│   │   └── 📄 responsive.css              # Responsive tasarım
│   │
│   ├── 📁 assets/                         # Statik dosyalar
│   │   ├── 📁 images/                     # Resimler
│   │   ├── 📁 icons/                      # İkonlar
│   │   └── 📁 fonts/                      # Fontlar
│   │
│   ├── 📁 services/                       # API servisleri
│   │   ├── 📄 shopifyService.js           # Shopify API servisi
│   │   ├── 📄 widgetService.js            # Widget API servisi
│   │   └── 📄 analyticsService.js         # Analitik servisi
│   │
│   └── 📄 index.js                        # Ana giriş noktası
│
├── 📁 public/                             # Statik dosyalar
│   ├── 📄 index.html                      # Ana HTML dosyası
│   ├── 📄 favicon.ico                     # Favicon
│   └── 📁 assets/                         # Public assets
│
├── 📁 shopify/                            # Shopify app konfigürasyonu
│   ├── 📁 extensions/                     # App extensions
│   ├── 📁 webhooks/                       # Webhook handlers
│   └── 📁 functions/                      # Shopify Functions
│
├── 📁 snippets/                           # Shopify Liquid snippet'leri
│   ├── 📄 recently-viewed-products.liquid # Ana widget snippet'i
│   └── 📄 widget-config.liquid            # Widget konfigürasyon snippet'i
│
├── 📁 assets/                             # Shopify tema assets
│   ├── 📄 recently-viewed-products.css    # Widget CSS (tema için)
│   ├── 📄 recently-viewed-products.js     # Widget JS (tema için)
│   └── 📁 images/                         # Tema resimleri
│
├── 📁 docs/                               # Dokümantasyon
│   ├── 📄 API.md                          # API dokümantasyonu
│   ├── 📄 THEMING.md                      # Tema entegrasyonu
│   ├── 📄 DEPLOYMENT.md                   # Deployment rehberi
│   └── 📄 TROUBLESHOOTING.md              # Sorun giderme
│
├── 📁 tests/                              # Test dosyaları
│   ├── 📁 unit/                           # Unit testler
│   ├── 📁 integration/                    # Integration testler
│   └── 📁 e2e/                            # End-to-end testler
│
├── 📁 scripts/                            # Build ve deployment scriptleri
│   ├── 📄 build.js                        # Build scripti
│   ├── 📄 deploy.js                       # Deployment scripti
│   └── 📄 setup.js                        # Kurulum scripti
│
└── 📁 config/                             # Konfigürasyon dosyaları
    ├── 📄 webpack.config.js                # Webpack konfigürasyonu
    ├── 📄 babel.config.js                  # Babel konfigürasyonu
    ├── 📄 eslint.config.js                 # ESLint konfigürasyonu
    └── 📄 prettier.config.js               # Prettier konfigürasyonu
```

## 🔄 Veri Akışı

```
Müşteri → Ürün Sayfası → Product Tracker → localStorage → Widget → Görüntüleme
   ↓
Shopify API → Admin Panel → Konfigürasyon → Widget Ayarları → Tema Entegrasyonu
```

## 🎯 Ana Bileşenler

### 1. **RecentlyViewedWidget** (`src/components/`)

- Ana widget bileşeni
- Kapalı ve açık durumları
- Responsive tasarım
- Özelleştirilebilir tema

### 2. **Product Tracker** (`src/utils/`)

- Ürün görüntüleme takibi
- localStorage yönetimi
- Analytics veri toplama
- Event handling

### 3. **Admin Panel** (`src/pages/`)

- Widget konfigürasyonu
- Tema ayarları
- Analytics dashboard
- Kullanıcı arayüzü

### 4. **Shopify Integration** (`snippets/`, `assets/`)

- Liquid snippet'leri
- Tema entegrasyonu
- CSS/JS dosyaları
- Konfigürasyon yönetimi

## 🚀 Geliştirme Workflow

### 1. **Local Development**

```bash
npm run dev                    # Development server başlat
npm run shopify:app:dev       # Shopify app development
npm run build                  # Production build
```

### 2. **Testing**

```bash
npm run test                   # Unit testler
npm run test:integration       # Integration testler
npm run test:e2e               # End-to-end testler
```

### 3. **Deployment**

```bash
npm run shopify:app:deploy    # Shopify app deploy
npm run shopify theme push     # Tema dosyalarını push
npm run shopify theme pull     # Tema dosyalarını pull
```

## 🔧 Teknoloji Stack

### **Frontend**

- React 18.2.0
- Shopify Polaris UI
- CSS3 + CSS Variables
- Responsive Design

### **Backend**

- Node.js 18+
- Express.js
- Shopify API
- Webhooks

### **Tools**

- Shopify CLI 3.0
- Vite (Build tool)
- ESLint + Prettier
- TypeScript (Opsiyonel)

### **Storage**

- localStorage (Client-side)
- Shopify Metafields
- Session Storage
- Analytics Database

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px
- **Small Mobile**: < 320px

## 🎨 Tema Sistemi

### **CSS Variables**

```css
:root {
  --primary-color: #000000;
  --background-color: #ffffff;
  --font-size: 14px;
  --font-family: Arial, sans-serif;
  --border-radius: 8px;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --transition: all 0.3s ease;
}
```

### **Tema Özelleştirme**

- Renk paleti
- Typography
- Spacing
- Animations
- Dark mode support

## 🔒 Güvenlik

### **API Security**

- Shopify OAuth
- API key validation
- Rate limiting
- CORS configuration

### **Data Privacy**

- GDPR compliance
- Cookie consent
- Data encryption
- User consent management

## 📊 Analytics & Monitoring

### **Performance Metrics**

- Widget load time
- User interactions
- Product view tracking
- Conversion rates

### **Error Tracking**

- JavaScript errors
- API failures
- User feedback
- Performance issues

---

Bu yapı, modern Shopify app development best practice'lerine uygun olarak tasarlanmıştır ve ölçeklenebilir bir mimari sunar.
