# Proje Yapısı

Güncel yapı (gereksiz dosyalar temizlendi).

```
recently-viewed-products-pro/
├── webhook-server.js              # Ana sunucu (Express): /, /health, /auth, billing, webhooks, admin UI
├── package.json
├── shopify.app.toml               # Shopify app config (client_id, URL, webhooks, scopes)
├── railway.json                   # Railway deploy (healthcheck)
├── nixpacks.toml                  # Build (npm install --omit=dev)
├── .env / env.example
├── .gitignore, .npmrc
│
├── api/                           # Backend API modülleri
│   ├── session.js                 # /api/session (session token doğrulama)
│   ├── oauth.js                   # OAuth (token exchange, /auth)
│   └── billing.js                 # Billing API (abonelik durumu, subscribe)
│
├── src/
│   ├── middleware/
│   │   ├── sessionAuth.js         # Session token validation (api/session için)
│   │   └── webhookAuth.js         # Webhook HMAC + rate limit
│   └── utils/
│       └── hmac.js                # Webhook HMAC doğrulama (webhookAuth tarafından kullanılır)
│
├── extensions/                    # Theme App Extension (tüm temalarda App embed)
│   └── recently-viewed-theme/
│       ├── shopify.extension.toml
│       ├── blocks/
│       │   └── recently_viewed_embed.liquid
│       ├── assets/
│       │   ├── recently-viewed-embed.css
│       │   └── recently-viewed-embed.js
│       └── locales/
│
├── layout/                        # (Opsiyonel) Özel tema: theme.liquid
├── sections/                      # (Opsiyonel) Tema section'ları
├── snippets/                      # (Opsiyonel) global-recently-viewed-widget.liquid vb.
├── templates/                     # (Opsiyonel) Tema şablonları
├── config/                        # (Opsiyonel) Tema settings
├── locales/                       # (Opsiyonel) Tema çevirileri
├── assets/                        # (Opsiyonel) Tema asset'leri
│
└── Dokümantasyon
    ├── README.md
    ├── TEST_REHBERI.md
    ├── NGROK_REHBERI.md
    ├── DEPLOY_FIX.md
    ├── APP_STORE_LISTING.md
    ├── APP_STORE_VE_TEMA_INCELEME_RAPORU.md
    ├── INSTALL.md
    └── PROJECT_STRUCTURE.md       # Bu dosya
```

## Kullanılan bileşenler

- **webhook-server.js**: Ana sayfa (admin UI HTML), `/health`, `/auth`, `/api/billing/*`, `/webhooks`, `/api/session` route’ları.
- **api/session.js**: Session token bilgisi ve doğrulama (App Bridge ile kullanılır).
- **api/oauth.js**: Kurulum sonrası OAuth akışı.
- **api/billing.js**: Abonelik durumu ve onay URL’i.
- **src/middleware/webhookAuth.js**: Webhook isteklerinde HMAC doğrulama ve rate limit.
- **src/utils/hmac.js**: HMAC hesaplama (webhookAuth tarafından kullanılır).
- **extensions/recently-viewed-theme**: Mağaza ön yüzünde “Recently Viewed” widget’ı (App embeds ile tüm temalarda).

## Kaldırılan / kullanılmayan (temizlik)

- `api/auth.js`, `api/webhooks/*` (sunucu kendi webhook handler’larını kullanıyor)
- `src/routes/webhooks.js`, `src/app.js`, `src/app-bridge.js`, `src/pages/App.jsx`, `src/components/*`, `src/locales/*`, `src/utils/analytics.js`, `i18n.js`, `productTracker.js`
- Test dosyaları: `app-bridge-test.html`, `session-test.html`, `test-button.html`, `simple-test-button.html`, `test-hmac.js`, `test-webhook.js`, `test-correct-hmac.js`, `create-webhooks-manual.js`
- `gitignore` (duplicate), `shopify.app.recently-viewed-products.toml`, `vercel.json`, `index.html`
