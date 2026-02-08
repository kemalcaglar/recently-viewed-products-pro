# Ngrok Kullanım ve Hata Giderme

Uygulama yerelde `http://localhost:8080` (veya `0.0.0.0:8080`) üzerinde çalışır. Shopify OAuth veya webhook testi için dış dünyaya açmak istersen **ngrok** kullanılır.

---

## 1. Ngrok kurulumu (Windows)

1. https://ngrok.com/download adresinden **Windows (64-bit)** indir.
2. Zip'i aç, `ngrok.exe` dosyasını bir klasöre koy (örn. `C:\ngrok`).
3. (İsteğe bağlı) [ngrok.com](https://dashboard.ngrok.com/signup) üzerinden ücretsiz hesap aç, **Auth Token** al.  
   Sonra: `ngrok config add-authtoken BURAYA_TOKEN_YAPIŞTIR`

---

## 2. Doğru komut (bu proje için)

Sunucuyu **önce** başlat:

```bash
cd c:\Users\kemal\Desktop\SMPL\shopifyAppv2\recently-viewed-products-pro
npm start
```

Ayrı bir terminalde ngrok'u **8080 portuna** yönlendir:

```bash
ngrok http 8080
```

Tarayıcıda **0.0.0.0 kullanma** – ngrok çalışırken örneğin şöyle bir URL verir:

- `https://xxxx-xx-xx-xx-xx.ngrok-free.app`

OAuth veya webhook testi için bu **https** adresini kullan (localhost değil).

---

## 3. Sık görülen hatalar ve çözümler

### "cannot execute binary file"

- **Sebep:** Yanlış mimari (örn. Linux ngrok Windows’ta çalıştırılıyor).
- **Çözüm:** [ngrok.com/download](https://ngrok.com/download) üzerinden **Windows (64-bit)** sürümünü indirip kullan.

### "offline" veya "Session expired"

- **Sebep:** Giriş yapılmamış veya auth token eksik/yanlış.
- **Çözüm:**
  1. https://dashboard.ngrok.com/get-started/your-authtoken
  2. Token’ı kopyala, terminalde: `ngrok config add-authtoken BURAYA_TOKEN`
  3. `ngrok http 8080` ile tekrar dene.

### "ERR_NGROK_108" veya "tunnel session failed"

- **Sebep:** İnternet/ngrok servisi veya bölge kısıtı.
- **Çözüm:**
  - İnternet bağlantısını kontrol et.
  - VPN kullanıyorsan kapatıp dene.
  - Bir süre sonra tekrar `ngrok http 8080` çalıştır.

### URL her seferinde değişiyor

- **Sebep:** Ücretsiz ngrok’ta her çalıştırmada yeni URL verilir.
- **Çözüm:**
  - Test için: Her ngrok açılışında Partner Dashboard’da **App URL** ve **Redirect URL**’i yeni ngrok adresiyle güncelle.
  - Kalıcı çözüm: Production için **Railway** (veya sabit domain’li bir host) kullan; ngrok sadece geliştirme için.

### Tarayıcıda "Bu siteye ulaşılamıyor" (0.0.0.0:8080)

- **Sebep:** `0.0.0.0` tarayıcıda geçerli bir adres değil; sadece sunucunun “tüm arayüzlerde dinle” demesi için kullanılır.
- **Çözüm:**
  - Yerel test: Adres çubuğuna **http://localhost:8080** veya **http://127.0.0.1:8080** yaz.
  - Dış erişim: Ngrok’u çalıştırıp verdiği **https://....ngrok-free.app** adresini kullan.

---

### ERR_NGROK_3200 – "The endpoint ... is offline" (Mağazada uygulama açılınca)

- **Sebep:** Uygulama daha önce ngrok URL'i ile ayarlanmış; ngrok kapalı veya URL değişmiş. Shopify hâlâ eski ngrok adresine istek atıyor.
- **Çözüm (Railway kullanıyorsan):** App URL'yi **Railway** adresine çevir:
  1. **Shopify Partner Dashboard** → partners.shopify.com → **Apps** → **recently-viewed-products** (veya ilgili uygulama).
  2. **Configuration** / **App setup** (veya **URL'ler**) bölümüne gir.
  3. **App URL** alanını şu yap: `https://recently-viewed-products-pro-production.up.railway.app` (sonunda slash olmasın).
  4. **Allowed redirection URL(s)** içinde ngrok adresi varsa kaldır; şunu ekle: `https://recently-viewed-products-pro-production.up.railway.app/auth`
  5. **Save** de. Birkaç saniye sonra mağazada uygulamaya tekrar tıkla; sayfa Railway üzerinden açılmalı.

---

## 4. Özet komut sırası

1. Terminal 1: `npm start` (sunucu 8080’de çalışsın).
2. Terminal 2: `ngrok http 8080`.
3. Ngrok’un verdiği **https** URL’ini Shopify App / Webhook URL’lerinde kullan; tarayıcıda **0.0.0.0** kullanma.

Sorun devam ederse ngrok çalıştırdığın terminaldeki **tam hata mesajını** paylaşırsan ona göre net adım önerebilirim.
