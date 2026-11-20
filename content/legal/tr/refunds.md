# Ücretsiz Deneme, İptal ve 14 Gün Koşulsuz İade Politikası

{productName} Cloud (`Pro` ve `Team`) aboneliklerinin, gizli iptal adımları veya kilitlenen verilerle değil, doğrudan sunduğu teknik değerle tercih edilmesini hedefliyoruz. Bu politika [Kullanım Koşulları]({termsPath}) ve [Gizlilik Politikası]({privacyPath}) metinlerinin ayrılmaz bir parçasıdır.

## 1. 14 Gün Ücretsiz Deneme

Her yeni {productName} Cloud hesabı, ücretli bir plana geçmeden önce **14 takvim günü ücretsiz deneme** hakkına sahiptir:

- **Kartsız hibrit deneme (varsayılan tasarım):** Doğrulanmış hesaplar, ödeme kartı bilgisi girmeden 14 gün boyunca tam Sıfır-Bilgi şifreli eşitleme (`S1`) hizmetini ve başlangıç tanışma kotası dâhilinde barındırılan yapay zekâ asistanını deneyebilir. 14. günün sonunda siz açıkça abone olmadığınız sürece **hiçbir otomatik çekim yapılmaz**; yalnızca buluta yeni yazma işlemleri durur.
- **Kart tanımlamalı kampanya denemeleri (ödeme adımında sunulması hâlinde):** Ödeme yöntemi tanımlanarak başlatılan bir deneme seçildiğinde, deneme bitiminden **3 gün önce (11. günde)** otomatik hatırlatma e-postası gönderilir; 15. günden önce `{appUrl}` üzerinden tek tıkla iptal edildiğinde hiçbir ücret tahsil edilmez.

## 2. İlk Satın Alımda 14 Gün Koşulsuz Tam İade

İlk ücretli abonelik satın alımınızdan (aylık veya yıllık, `Pro` veya `Team` fark etmeksizin) itibaren **14 takvim günü içinde hiçbir gerekçe göstermeksizin %100 koşulsuz tam iade** talep edebilirsiniz:

- **Küresel satın alımlar — Paddle (Merchant of Record):** İade talebinizi `{appUrl}` portalından, Paddle e-posta makbuzundaki self-servis bağlantıdan veya {supportContact} üzerinden iletebilirsiniz. Paddle, tahsil edilen KDV/VAT/Sales Tax dâhil tam tutarı ödeme yaptığınız araca iade eder.
- **Türkiye satın alımları — iyzico (`TRY`):** İade talebinizi `{appUrl}` portalından veya {supportContact} üzerinden iletebilirsiniz. Ödediğiniz `TRY` tutarının tamamı (%20 KDV dâhil) iyzico üzerinden kartınıza eksiksiz iade edilir ve ilgili elektronik iade/gider muhasebe süreci (`e-Arşiv` iade akışı) tamamlanır.
- **Karta yansıma süresi:** Onaylanan iadeler ödeme kuruluşuna anında iletilir; tutarın ekstrenize yansıması banka ve kart ağlarına bağlı olarak genellikle **3–10 iş günü** sürer.

## 3. Yıllık Yenileme Koruması ve Adil Kullanım Sınırı

- **Yıllık yenilemelerde 7 gün koruma:** Yıllık bir aboneliği iptal etmeyi unuttuğunuz için otomatik yenileme tahsilatı gerçekleşirse, yenileme tarihinden itibaren **7 takvim günü içinde** bize ulaşmanız yeterlidir. Yeni dönemde anlamlı düzeyde barındırılan yapay zekâ token kotası veya köprü bant genişliği tüketilmemiş olması kaydıyla yıllık yenileme bedelinin tamamı iade edilir.
- **Tek seferlik adil kullanım kuralı:** Hizmetin kötüye kullanımını (*abone olup aylık ticari LLM API kotasının tamamını tükettikten sonra 13. günde iade alarak işlemi tekrarlama*) önlemek amacıyla 14 günlük koşulsuz iade taahhüdü **hesap ve ödeme aracı başına bir kez** geçerlidir. İade onaylandığı anda bulut yetki belirteçleri ve aktif bulut oturumları derhâl iptal edilir. Ayıplı veya sunulamayan hizmetlere ilişkin emredici yasal tüketici hakları her zaman saklıdır.

## 4. Tek Tıkla İptal ve Tolerans Süreleri

- **Tek tıkla iptal:** Aboneliğinizi dilediğiniz an `{appUrl}` üzerinden tek tıkla iptal edebilirsiniz; telefon görüşmesi, caydırıcı anket veya destek onayı gerekmez. İptal sonrasında aboneliğiniz mevcut fatura döneminin sonuna (`current_period_end`) kadar `active (canceling)` durumunda kalır ve dönem sonuna dek tüm `Pro` / `Team` yetkileriniz kesintisiz devam eder.
- **7 gün ödeme hatası toleransı (*billing grace*):** Yenileme gününde kart son kullanma tarihi veya limit nedeniyle tahsilat başarısız olursa bulut erişiminiz anında kesilmez; e-posta ile bilgilendirilirsiniz ve ödeme yönteminizi güncelleyebilmeniz için **7 takvim günü tolerans** tanınır.
- **14 gün çevrimdışı yetki toleransı (*offline grace*):** İstemci uygulamalar çevrimiçiyken 7 günde bir yenilenen `ES256` imzalı yetki belirteçleri (`GET /v1/me/entitlements`) üzerinde yerel açık anahtarla **14 gün çevrimdışı tolerans** uygular; böylece uçuşlar, izole kurum ağları veya saha çalışmaları yerel eşitlenmiş iş akışınızı kesintiye uğratmaz. *(Canlı barındırılan yapay zekâ ve barındırılan WebSocket köprüsü doğası gereği aktif internet bağlantısı gerektirir.)*

## 5. Abonelik Sonrası Veriyi Rehin Almama Garantisi ve 90 Gün Saklama

Aboneliğin iptal, iade veya yenilememe yoluyla sona ermesi **hiçbir zaman verilerinizi kilit altına almaz**:

- **Yerel veriler asla silinmez veya kilitlenmez:** Masaüstü ve mobil cihazlarınızdaki tüm MongoDB bağlantı profilleri, işletim sistemi `KeyStore` parolaları/SSH anahtarları, kayıtlı snippet'ler, sorgu geçmişi, başlangıç betikleri ve arayüz ayarları **sonsuza dek %100 eksiksiz ve açık kalır**. {productName} istemciniz hiçbir yerel özellik kaybı olmadan Ücretsiz (`{appLicenseName}` + `BYOK` AI) katmanda çalışmaya devam eder.
- **Bulut eşitleme verileri için 90 gün salt-okunur erişim:** Abonelik (varsa ödeme tolerans süresi sonrasında) tamamen sona erdiğinde sunucuya yeni şifreli blob yazma (`PUT /v1/sync/*`) durur; ancak **mevcut şifreli bulut verileriniz 90 takvim günü boyunca salt-okunur (`GET /v1/sync/*`) ve dışa aktarılabilir (`POST /v1/account/export`) kalır**.
- **Hatırlatma bildirimleri ve temiz silme:** Süresi dolan `sync_blobs` kayıtları 90. günde kalıcı olarak temizlenmeden önce **30. ve 80. günlerde** hatırlatma e-postası gönderilir. 90 gün içinde aboneliğinizi yenilerseniz eşitleme kaldığınız yerden devam eder; bulut kopyalarınızın beklemeden hemen silinmesini isterseniz dilediğiniz an `{appUrl}` üzerinden `DELETE /v1/account` işlemini başlatabilirsiniz.
