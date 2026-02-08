# Deploy Hatalarini Giderme (deployLogs.json)

## deployLogs.json'da gorulen hatalar

1. **SyntaxError: Unexpected identifier 'Bearer'** (webhook-server.js:141)  
   - **Sebep:** `res.send(\`...\`)` icindeki HTML/script icinde backtick (\`) kullanilmis.  
     Ornek: `'Authorization': \`Bearer ${ sessionToken }\`` satiri template literal'i kapatir, Node "Bearer"i kod sanir.
   - **Yapilan:** Bu satir projede kaldirildi. Yorumlardaki backtick ve \${} ifadeleri de guvenli metinle degistirildi.

2. **npm warn: Use \`--omit=dev\` instead**  
   - **Yapilan:** `nixpacks.toml` eklendi; install asamasinda `npm ci --omit=dev` kullaniliyor.

## Deploy hala ayni hatayi veriyorsa

Railway bazen **eski build cache** veya **farkli branch** kullanir. Asagidakileri yap:

1. **Guncel kodu push et**  
   - `webhook-server.js` degisikliklerinin commit edildiginden ve push edildiginden emin ol.  
   - Railway’in bagli oldugu branch (genelde `main`) ile ayni branch’e push et.

2. **Railway’de cache’i temizle**  
   - Railway Dashboard → Proje → Settings → “Clear build cache” (varsa) ile bir kez temizle.  
   - Ardindan “Redeploy” yap.

3. **Dogrulama**  
   - Lokal: `node -c webhook-server.js` hatasiz calismali.  
   - Repoda `webhook-server.js` icinde `\`Bearer\` veya \`Bearer ${` aramasi yap; sonuc cikmamali.

Bu adimlardan sonra yeni deploy’da SyntaxError ve (mumkunse) npm uyarisi duzelmis olmali.
