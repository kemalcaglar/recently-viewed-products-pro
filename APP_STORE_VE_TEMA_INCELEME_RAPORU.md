# Recently Viewed Products Pro – App Store & Tema Uyumluluk İnceleme Raporu

Bu rapor, uygulamanızın **Shopify App Store yayın kurallarına** uygunluğunu ve **tüm temalarla uyumluluk** durumunu özetler.

---

## 1. TÜM TEMALARDA UYUMLULUK DURUMU

### Mevcut durum: Sadece yüklenen temada çalışıyor

- Widget şu an **tek bir tema** ile çalışıyor: `layout/theme.liquid` içinde `{% render 'global-recently-viewed-widget' %}` ile eklenmiş.
- Bu layout, projede bulunan **tam tema** (sections, snippets, templates) ile birlikte **test-data** adlı temaya sizin tarafınızdan yüklendi.
- Yani widget, **sadece bu yüklediğiniz temayı kullanan mağazalarda** görünüyor.

### Tüm temalarda çalışması için gerekli: Theme App Extension

- **Theme App Extension** kullanılmadığı sürece uygulama **tüm temalarda** çalışmaz.
- Doğru yaklaşım: Projeye bir **Theme App Extension** ekleyip widget’ı orada (snippet/block olarak) sunmak. Böylece:
  - Mağaza sahibi **herhangi bir temada** (Dawn, Craft, vb.) Theme Editor’dan “App block” ekleyerek widget’ı açabilir.
  - Tek tema yüklemek gerekmez; tüm Online Store 2.0 temalarıyla uyumlu olur.

**Sonuç:** Şu an **tüm temalara uyumlu değil**. Tüm temalarda çalışması için **Theme App Extension** eklemeniz gerekiyor.

---

## 2. SHOPIFY APP STORE YAYIN KURALLARI

Shopify’ın resmi [App Store requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements) dokümanına göre özet:

### Karşılanan gereksinimler

| Gereksinim | Durum | Not |
|------------|--------|-----|
| Compliance webhooks | ✅ | `customers/data_request`, `customers/redact`, `shop/redact` tanımlı ve yanıt veriyor |
| Webhook HMAC doğrulama | ✅ | `validateWebhookRequest` ile HMAC kontrolü yapılıyor |
| Geçerli TLS/SSL | ✅ | Railway üzerinde HTTPS kullanılıyor |
| Session token altyapısı | ✅ | `/api/session` (generate/validate/refresh) mevcut |
| Embedded deneyim | ✅ | Admin içinde çalışan arayüz var |
| Domain kısıtı | ✅ | URL’de "Shopify" veya "example" yok |
| Zorunlu scope’lar | ✅ | `read_products`, `write_products`, `read_themes`, `write_themes` makul |

### Karşılanmayan veya riskli gereksinimler

#### 2.3.2 & 2.3.4 – Kurulumdan hemen sonra OAuth

- **Kural:** Uygulama, kurulumdan (ve yeniden kurulumdan) hemen sonra **OAuth ile kimlik doğrulama** yapmalı; mağaza arayüzüne geçmeden önce OAuth tamamlanmış olmalı.
- **Mevcut durum:**  
  - `webhook-server.js` içinde `/auth` sadece JSON döndürüyor; **Shopify OAuth akışı (yönlendirme, code ile token alma, session kaydetme) yok.**  
  - `api/auth.js` de sadece “Auth endpoint ready” benzeri bir yanıt veriyor; gerçek OAuth yok.
- **Sonuç:** ❌ **Uyumsuz.** Gerçek OAuth implementasyonu şart.

#### 2.3.1 – Kurulum sadece Shopify üzerinden

- Manuel myshopify.com / domain girişi istenmemeli. OAuth doğru yapılırsa bu da çözülür. Şu an OAuth olmadığı için akış tam uyumlu değil.

#### 2.2.3 – En güncel App Bridge

- Dokümana göre tüm uygulamalar **en güncel Shopify App Bridge** kullanmalı; script ilk script etiketi olarak eklenmeli.
- Projede `@shopify/app-bridge@3.7.9` (unpkg) ve `your-api-key` placeholder’ı var. Production’da:
  - Güncel App Bridge sürümü kullanılmalı,
  - `apiKey` gerçek client_id ile değiştirilmeli.

#### 2.2.4 – GraphQL Admin API (Nisan 2025)

- Nisan 2025 itibarıyla yeni public uygulamalar **yalnızca GraphQL Admin API** kullanacak; REST Admin API legacy sayılıyor.
- Projede Admin API çağrıları (ürün/theme ayarları vb.) için **GraphQL** kullanımı görünmüyor. Ürün/mağaza verisi çekiyorsanız GraphQL’e geçmeniz gerekebilir.

#### 1.2 – Ödeme: Billing API veya Managed Pricing

- Listede **$2.99/ay** ücret var; fakat projede **Shopify Billing API** veya **Managed Pricing** implementasyonu yok.
- Ücretli plan sunacaksanız: Ücretler mutlaka **Shopify Billing API** veya **Managed Pricing** ile alınmalı; harici ödeme kabul edilmez.

#### 4.3.3 – İstatistik / garantiler

- Listede **kanıtlanamayan iddialar** kullanılmamalı (ör. “Satışları %25'e kadar artırın”, “95% müşteri memnuniyeti”, “4.8/5 ortalama puan”, “1000+ aktif mağaza”).
- Bu tür ifadeler **App Store listing’den çıkarılmalı**; sadece özellik ve gerçek bilgiler kalmalı.

#### 4.3.1 – Online Store kanalı

- Uygulama mağaza ön yüzüne (tema) gömülüyorsa, listing’de **“Merchant must have online store”** (veya eşdeğer) belirtilmeli; böylece mağaza sahibi uyumluluğu anlar.

---

## 3. EKSİK / RİSKLİ TEKNİK NOKTALAR

1. **Hardcoded mağaza / tema**
   - `App.jsx` içinde “Visit Store” ve “Theme Editor” linkleri `recentlyviewedproducts.myshopify.com` ve tema ID’si (180276658541) ile sabit. Production’da bunlar **oturumdaki shop bilgisine** göre dinamik olmalı.

2. **Webhook path uyumu**
   - `shopify.app.toml`: `uri = "/webhooks"` ve `compliance_topics`.
   - Sunucuda compliance webhook path’leri (`/webhooks/customers/data_request` vb.) ile toml’daki path’in aynı convention’da olduğundan emin olun (Shopify’ın beklediği path’e 200 dönüyor olmalı).

3. **src/routes/webhooks.js**
   - Yorum satırında sözdizimi hatası var (örn. “- Analytics verileri” satırı). Derleme/çalışma hatasına yol açmıyorsa bile düzeltmek iyi olur.

---

## 4. YAPILACAKLAR LİSTESİ (Öncelik sırasıyla)

### Kritik (App Store onayı için gerekli)

1. **OAuth implementasyonu**
   - Kurulum ve yeniden kurulumda **hemen** Shopify OAuth akışı (redirect → code → token → session) uygulayın.
   - `/auth` (ve gerekirse `api/auth.js`) bu akışı yürütecek şekilde yazılmalı.

2. **Theme App Extension ekleyin**
   - Widget’ı **Theme App Extension** içinde sunun; böylece mağaza sahibi herhangi bir temada “App block” ekleyerek kullanabilsin.
   - Mevcut tema yapısı (layout/theme.liquid) sadece o temayla sınırlı kalmaya devam eder; “tüm temalarda” için extension şart.

3. **Ücretli plan varsa: Billing**
   - $2.99/ay veya başka ücret varsa **Shopify Billing API** veya **Managed Pricing** entegre edin; harici ödeme kullanmayın.

4. **Listing iddialarını düzeltin**
   - “Satışları %25'e kadar artırın”, “95% müşteri memnuniyeti”, “4.8/5”, “1000+ aktif mağaza” gibi kanıtlanamayan ifadeleri kaldırın; sadece özellik ve gerçek bilgileri bırakın.

### Önemli

5. **App Bridge ve API key**
   - Production’da güncel App Bridge sürümü ve gerçek `client_id` (apiKey) kullanın.

6. **Dinamik mağaza linkleri**
   - “Visit Store” ve “Theme Editor” linklerini oturumdaki shop domain’ine (ve gerekirse tema bilgisine) göre oluşturun; sabit mağaza/tema ID’si kullanmayın.

7. **Admin API**
   - Ürün/tema/ayar okuma-yazma için GraphQL Admin API kullanımına geçin (özellikle 2025 sonrası için).

### İsteğe bağlı

8. **Online Store zorunluluğu**
   - Listing’de uygulamanın Online Store (tema) kullanan mağazalar için olduğunu net yazın.

9. **Webhook path ve yanıtlar**
   - Compliance webhook path’lerinin Shopify ile bire bir eşleştiğini ve her zaman 2xx döndüğünü doğrulayın.

---

## 5. ÖZET TABLO

| Konu | Uyumlu mu? | Aksiyon |
|------|------------|--------|
| Tüm temalarda çalışma | ❌ | Theme App Extension ekleyin |
| OAuth hemen kurulum sonrası | ❌ | Gerçek OAuth akışı implemente edin |
| Compliance webhooks | ✅ | — |
| Session token | ✅ | — |
| Billing (ücretli plan) | ❌ | Shopify Billing API veya Managed Pricing |
| Listing iddiaları | ❌ | İstatistik/garanti ifadelerini kaldırın |
| App Bridge / apiKey | ⚠️ | Güncel sürüm + gerçek client_id |
| GraphQL Admin API | ⚠️ | Kullanım varsa GraphQL’e geçin |
| Hardcoded shop/theme | ❌ | Dinamik shop/tema linkleri |

Bu adımlar tamamlandığında uygulama hem App Store kurallarına daha yakın olur hem de **tüm temalarda** (Theme App Extension ile) kullanılabilir hale gelir.
