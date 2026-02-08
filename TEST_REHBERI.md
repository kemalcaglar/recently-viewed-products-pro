# Recently Viewed Products Pro – Test Rehberi

Bu dokümanda yapılan güncellemelerin nasıl test edileceği adım adım anlatılır.

---

## 1. Ortam Hazırlığı

### Gerekli environment değişkenleri

`.env` dosyasında (veya Railway/hosting ortamında) şunlar tanımlı olmalı:

- `SHOPIFY_API_KEY` – Partner Dashboard’daki Client ID (shopify.app.toml’daki client_id)
- `SHOPIFY_API_SECRET` – Client secret
- `SHOPIFY_APP_URL` – Uygulama URL’i (örn: `https://recently-viewed-products-pro-production.up.railway.app`)
- `SHOPIFY_SCOPES` – (Opsiyonel) Varsayılan: `read_products,read_themes,write_products,write_themes`

### Lokal çalıştırma

```bash
npm install
npm start
```

Sunucu `http://localhost:8080` (veya `PORT` env) üzerinde ayağa kalkar.

---

## 2. OAuth Akışı Testi

**Amaç:** Kurulumdan hemen sonra OAuth ile giriş yapıldığını doğrulamak.

1. **Shopify Partner Dashboard** > Apps > Recently Viewed Products Pro > **Test your app** (veya App Store’dan “Add app”).
2. Test mağazasını seçip **Install** / **Add app** de.
3. Tarayıcı şu adrese yönlenmeli:  
   `https://<your-app-url>/auth?shop=xxx.myshopify.com&host=xxx`
4. Ardından Shopify izin sayfasına yönlendirilmelisin.
5. **Install app** de.
6. Son olarak uygulama ana sayfasına (`/?shop=...&host=...`) dönmelisin.

**Beklenen:** Hiçbir adımda “Auth endpoint ready” gibi sadece JSON yanıtı görmemelisin; tam OAuth akışı (yönlendirme → onay → token → app açılması) çalışmalı.

**Hata alırsan:**  
- `SHOPIFY_API_KEY` ve `SHOPIFY_API_SECRET` doğru mu kontrol et.  
- Partner Dashboard’da App setup > URLs kısmında **Redirect URL** = `https://<your-app-url>/auth` olmalı.

---

## 3. Theme App Extension (Tüm Temalarda Görünüm) Testi

**Amaç:** Widget’ın yalnızca yüklenen temada değil, her temada “App embed” ile kullanılabildiğini görmek.

1. Uygulamayı bir test mağazasına kur (OAuth ile).
2. **Shopify Admin** > **Online Store** > **Themes**.
3. **Customize** ile tema editörünü aç.
4. Sol panelde **App embeds** bölümüne gir.
5. **Recently Viewed Products** (veya extension adı) embed’ini bulup **Enable** yap, kaydet.
6. Mağaza ön yüzünde (herhangi bir sayfada) widget’ın göründüğünü kontrol et (kenarda “Recently Viewed” çubuğu).
7. Farklı bir tema seçip aynı embed’i tekrar aç; widget’ın o temada da çalıştığını doğrula.

**Not:** Extension’ı deploy etmek için:

```bash
shopify app deploy
```

veya Partner Dashboard üzerinden extension’ı yayına al.

---

### Sitede widget / ürün görünmüyorsa

1. **Extension deploy edildi mi?**  
   App embeds listesinde "Recently Viewed Products" **yoksa**, extension henüz deploy edilmemiştir. Aşağıdaki "App embeds'te görünmüyorsa" adımlarını uygula.

2. **App embed açık mı?**  
   **Online Store** → **Themes** → **Customize** → sol panel **App embeds** → **Recently Viewed Products** → **Enable** → **Save**.

3. **En az bir ürün sayfası ziyaret edildi mi?**  
   Widget, ziyaret edilen ürünleri tarayıcıda (localStorage) tutar. Önce mağaza ön yüzünde **bir ürün sayfasına** gir (örn. bir ürüne tıkla), sonra ana sayfaya veya başka sayfaya dön. Kenarda "Recently Viewed" çubuğu ve az önce baktığın ürün görünmeli. Hiç ürün sayfası açılmadıysa liste boş kalır (çubuk yine görünür, "Visit a product" yazabilir).

4. **Hangi tema kullanılıyor?**  
   Uygulama **tüm temalarda** Theme App Extension (App embed) ile çalışır. "test-data" dışındaki temalarda (Dawn vb.) widget'ı **sadece** App embeds'ten etkinleştirirsen görürsün; tema dosyasında snippet yoktur.

#### App embeds'te "Recently Viewed Products" görünmüyorsa

Extension'ı Shopify'a deploy etmen gerekir; deploy edilmeden tema editöründe listeye eklenmez.

1. **Shopify CLI kurulu mu?**  
   Terminalde: `shopify version`  
   Yoksa: https://shopify.dev/docs/apps/tools/cli/installation (örn. `npm install -g @shopify/cli @shopify/theme` veya Windows için Shopify CLI indir).

2. **Proje klasörüne gir ve uygulamaya bağlan:**  
   ```bash
   cd c:\Users\kemal\Desktop\SMPL\shopifyAppv2\recently-viewed-products-pro
   shopify app config link
   ```  
   Açılan tarayıcıdan Partner hesabını ve **Recently Viewed Products Pro** uygulamasını seç. (Daha önce linklediysen bu adım atlanabilir.)

3. **Theme App Extension'ı deploy et:**  
   ```bash
   shopify app deploy
   ```  
   Sorulursa "Deploy to production?" için **Yes** de. İşlem bittiğinde "Deployed to Shopify" benzeri bir mesaj görmelisin.

4. **Tema editörünü yenile:**  
   Shopify Admin → **Online Store** → **Themes** → **Customize**. Sol panelde **App embeds**'e tekrar gir; listede **Recently Viewed Products** (veya **Recently Viewed**) artık görünmeli. Enable → Save.

**Not:** Deploy sadece extension'ı (widget kodunu) Shopify'a yükler; sunucu (Railway) ayrı çalışır. Deploy sonrası uygulama yüklü olan **tüm test mağazalarında** App embeds listesinde çıkar.

**403 "You are not a member of the requested organization":** Giriş yaptığın Shopify hesabı, uygulamanın bağlı olduğu Partner organizasyonunda değil. Çözüm: (a) Uygulamanın sahibi olan Partner hesabıyla giriş yap (partners.shopify.com → sağ üstte hangi hesap/org görünüyor kontrol et), veya (b) O organizasyona seni "Staff" olarak eklesinler (Partner Dashboard → Settings → Users and permissions). Sonra `shopify auth logout` deyip tekrar `shopify app deploy` çalıştır.

---

## 4. Billing API Testi

**Amaç:** $2.99/ay plan ve 3 gün denemenin oluşturulduğunu ve onay sayfasına gidildiğini görmek.

1. OAuth ile uygulamaya gir (URL’de `?shop=...&host=...` olsun).
2. Tarayıcıda şu adresi aç (shop’u kendi test mağazanla değiştir):  
   `https://<your-app-url>/api/billing/status?shop=xxx.myshopify.com`
3. Yanıt: `{ "hasSubscription": false }` veya `{ "hasSubscription": true, ... }` olmalı.
4. Abonelik yoksa:  
   `https://<your-app-url>/api/billing/subscribe?shop=xxx.myshopify.com&host=xxx`  
   adresine git.
5. Shopify abonelik onay sayfasına yönlendirilmelisin; plan adı ve $2.99/ay görünmeli.
6. **Approve** de; ardından uygulama ana sayfasına dönülmeli.
7. Tekrar `/api/billing/status?shop=...` çağır; `hasSubscription: true` dönmeli.

**Test modu:** Geliştirme mağazasında ücret gerçekten alınmaz; test charge olarak görünür.

---

## 5. Dinamik Shop Linkleri (App.jsx / Admin UI)

**Amaç:** “Visit Store” ve “Theme Editor” butonlarının her mağaza için doğru linke gitmesi.

1. Uygulamayı **farklı bir test mağazasıyla** aç (farklı myshopify.com).
2. Admin arayüzünde **Visit Store** ve **Theme Editor** butonlarına tıkla.
3. **Visit Store** → ilgili mağazanın ön yüzü açılmalı (örn: `https://that-store.myshopify.com`).
4. **Theme Editor** → o mağazanın tema editörü açılmalı (`.../admin/themes/current/editor`).

Sabit `recentlyviewedproducts.myshopify.com` veya sabit tema ID görülmemeli.

---

## 6. Compliance Webhooks Testi

**Amaç:** GDPR uyumlu webhook’ların 200 döndüğünü görmek.

Aşağıdaki endpoint’lere **POST** isteği atıp **200** ve uygun JSON yanıtı almalısın. HMAC doğrulaması için `X-Shopify-Hmac-Sha256` header’ı gerekir (gerçek webhook’larda Shopify bunu ekler).

- `https://<your-app-url>/webhooks/customers/data_request`
- `https://<your-app-url>/webhooks/customers/redact`
- `https://<your-app-url>/webhooks/shop/redact`

Manuel test için `test-webhook.js` veya `create-webhooks-manual.js` kullanılabilir; canlı ortamda webhook’lar Partner Dashboard veya API ile kayıtlı olmalı.

---

## 7. Özet Kontrol Listesi

| Test | Beklenen |
|------|----------|
| OAuth | Kurulumda Shopify’a yönlendirme, onay sonrası app’e dönüş |
| Theme Extension | App embeds’te “Recently Viewed” görünür, tüm temalarda etkinleştirilebilir |
| Billing status | `/api/billing/status?shop=...` JSON döner |
| Billing subscribe | `/api/billing/subscribe?shop=...&host=...` onay sayfasına gider |
| Visit Store / Theme Editor | Oturumdaki mağazaya ait URL’lere gider |
| Compliance webhooks | İlgili path’lere POST → 200 |

Tüm adımlar başarılıysa uygulama App Store gereksinimleri ve “tüm temalarda çalışma” hedefi için test edilmiş sayılır.
