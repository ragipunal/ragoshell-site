# Gizlilik Politikası, KVKK / GDPR Aydınlatma Metni ve Çerezsiz Bildirim

Bu Gizlilik Politikası ve Aydınlatma Metni; [{domain}]({siteUrl}) web sitesini ziyaret ettiğinizde, {productName} masaüstü ve mobil uygulamalarını kurup çalıştırdığınızda veya `{appHost}`, `{apiHost}`, `{dlHost}` ve `{bridgeHost}` üzerindeki isteğe bağlı {productName} Cloud hizmetlerini kullandığınızda hangi verilerin işlendiğini ve **hangi verilerin kesinlikle toplanmadığını** açıklar. Metin, **6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)** m. 10 ile Avrupa Birliği / AEA / Birleşik Krallık **Genel Veri Koruma Tüzüğü (GDPR)** m. 13–14 hükümlerine uyumlu olarak hazırlanmıştır.

## 1. Veri Sorumlusu ve İletişim Kanalları

- **Veri Sorumlusu:** {legalEntity}
- **Yasal Tebligat ve Merkez Adresi:** {legalAddress}
- **Gizlilik, KVKK ve GDPR Başvuruları:** {privacyContact}
- **Genel Destek:** {supportContact}
- **Güvenlik Açığı Bildirimi:** [{securityTxtPath}]({securityTxtPath})
- **Taslak Sürüm Tarihi:** {draftDate} (VERBİS kayıt yükümlülüğü eşik analizi ve kesin kurumsal sicil bilgileri, ücretli aboneliklerin ticari yayını öncesinde tamamlanır.)

## 2. Bu Web Sitesi ve Çerezsiz Bildirim

### 2.1 Sıfır Çerez ve Sıfır Tarayıcı Depolaması

Herkese açık {productName} tanıtım ve belge sitesi ([{domain}]({siteUrl})) **hiçbir HTTP çerezi bırakmaz** (`Set-Cookie` başlığı gönderilmez, `document.cookie` okunmaz/yazılmaz) ve **tarayıcı depolaması kullanmaz** (`localStorage`, `sessionStorage`, `IndexedDB` veya Cache Storage yoktur). İzleme veya zorunlu olmayan istemci depolaması bulunmadığından ziyaretçiler çerez onay pencereleriyle bölünmez.

Ayrı hesap portalında (`{appHost}`), yalnızca kullanıcı açıkça giriş yaptığında oturum güvenliği ve CSRF koruması için teknik olarak zorunlu çerezler (`Secure; HttpOnly; SameSite=Lax`) kullanılır; bu çerezler KVKK Çerez Uygulamaları Rehberi ve ePrivacy kuralları uyarınca yalnızca talep edilen oturum hizmetini yürütmek için var olduğundan açık rıza şartından muaftır.

### 2.2 Üçüncü Taraf İzleyici, Yazı Tipi veya CDN Yok

Sitedeki tüm stil dosyaları, vektör simgeler, paylaşım görselleri ve yazı tipleri (işletim sisteminin yerleşik sistem yazı tipi ailesi) doğrudan `{domain}` üzerinden sunulur. **Üçüncü taraf betik, reklam ağı, izleme pikseli veya harici CDN yüklenmez.** [İndir]({downloadPath}) sayfası, işletim sisteminize uygun paketi öne çıkarmak için aynı alan adından `/releases.json` dosyasını okuyan tek bir özetlenmiş (hashed) betik çalıştırır; bu istekle kişisel hiçbir tanımlayıcı gönderilmez. Bugün sitede hiçbir analitik çalışmamaktadır; ileride çerezsiz sunucu/kenar analitiği seçilmesi hâlinde yayın öncesinde bu metin güncellenir.

### 2.3 Kenar Ağı ve Maskelenmiş Erişim Günlükleri

Gelen HTTPS trafiği Cloudflare TLS/WAF koruması ve karşılıklı kimlik doğrulamalı TLS (`Origin mTLS`) üzerinden kenar `nginx` sunucumuza ulaşır:

- **Maskelenmiş web erişim günlükleri:** Kenar `nginx` sunucumuz erişim günlüklerine yazmadan önce URL sorgu dizgelerini ve tam `User-Agent` başlıklarını çıkarır; ziyaretçi IPv4 adreslerini `/24` düzeyine (son oktet sıfırlanır, ör. `203.0.113.0`), IPv6 adreslerini ise `/48` düzeyine kısaltır.
- **Güvenlik ve oran sınırı (rate-limit) günlükleri:** Tam IP adresleri hız sınırlaması için geçici olarak bellekte işlenir; kimlik doğrulama kaba kuvvet denemeleri, sahte webhook imzaları veya ağ kötüye kullanımı gibi güvenlik olaylarında ise bilgi güvenliği meşru menfaati hukuki sebebine (KVKK m. 5/2-f; GDPR m. 6(1)(f)) dayanarak güvenlik günlüklerinde **en fazla 30 gün** saklanır ve ardından silinir.

## 3. Masaüstü ve Mobil Uygulama

### 3.1 Yerel Veritabanı Bağlantıları, Kimlik Bilgileri ve MCP Sunucusu

{productName}, yerel öncelikli (local-first) bir MongoDB istemcisidir. Uygulamayı {productName} Cloud hesabı olmadan kullandığınızda:

- MongoDB bağlantı profilleriniz, sorgularınız, kabuk betikleriniz, örneklenen koleksiyon şemalarınız ve sorgu sonuçlarınız **yalnızca kendi cihazınızda** (`~/.{productId}/` veya platformun izole uygulama dizininde) kalır.
- Veritabanı parolaları, SSH özel anahtarları/parolaları, TLS sertifika parolaları ve yapay zekâ API anahtarları hiçbir zaman `{productId}.json` içine düz metin yazılmaz; yalnızca işletim sisteminin şifreli kimlik kasasında (`KeyStore`: macOS/iOS Keychain, Windows Credential Locker / DPAPI, Linux Secret Service, Android Keystore) tutulur.
- Gömülü salt-okunur Model Context Protocol sunucusu (`{productId}-mcp`) **varsayılan olarak kapalıdır** ve yalnızca açıkça izin verdiğiniz yerel yapay zekâ istemcileriyle yerel `stdio` kanalı üzerinden konuşur.

### 3.2 İsteğe Bağlı Sürüm Denetimi ve Anonim Kullanım İstatistiği

İnternet bağlantısı bulunduğunda Karşılama ekranı, yeni sürümleri ve kritik zorunlu güvenlik güncellemelerini bildirmek amacıyla en fazla 12 saatte bir kez `{apiUrl}/v1/release-check` uç noktasını yoklar (çevrimdışı ortamda hiçbir istek göndermez ve hata göstermez):

- **Sürüm denetimi alanları:** `schemaVersion`, `appVersion`, `platform`, `arch`, `formFactor`, `osVersion` ve `uiLanguage`.
- **İsteğe bağlı toplu kullanım sayaçları (`usage` nesnesi):** Yalnızca `shareAnonymousUsage` ayarı açıkken gönderilir. Cihaz üzerinde rastgele yerel UUID'den tuzlanmış SHA-256 ile türetilip 32 onaltılık karaktere kısaltılmış kurulum karması (`installId`), kimliksiz özellik sayaçları (`launchCount`, `lastSessionSec`, kayıtlı/SSH/TLS/replica-set bağlantı adetleri, `shellsOpened`, `queriesExecuted`, mantıksal `aiEnabled`, `uiTheme`, `uiDensity`) ve bağlanılan MongoDB sunucularının yalnızca `major.minor` sürüm bilgisini (ör. `7.0`) içerir. *(Not: `shareAnonymousUsage` varsayılan değerinin ilk açılışta kapalı `false` mı yoksa meşru menfaat kapsamında açık `true` mu olacağı Faz `0.9` kararıyla kesinleşecektir; her iki durumda da aşağıdaki yerel kontroller tam olarak elinizdedir.)*
- **Asla toplanmayan ve kaydedilmeyen veriler:** Sürüm denetim servisi **istemci IP adreslerini diske veya SQLite veritabanına asla yazmaz**; sunucu adlarını (hostname), bağlantı URI'lerini, veritabanı veya koleksiyon adlarını, kullanıcı adlarını, parolaları, SSH anahtarlarını ve sorgu/betik metinlerini hiçbir koşulda toplamaz.
- **İstediğiniz an kapatma yöntemleri:**
  1. **Tercihler › Güncellemeler ve Kullanım** bölümünden **Güncelleme denetimleriyle anonim kullanım istatistiklerini paylaş** (`shareAnonymousUsage: false`) kutusunun işaretini kaldırarak sürüm bildirimlerini korurken `usage` nesnesini tamamen devre dışı bırakabilirsiniz.
  2. **Başlangıçta güncellemeleri otomatik denetle** (`checkForUpdates: false`) seçeneğini kapatarak otomatik denetimi durdurabilirsiniz.
  3. İzole/kurumsal (air-gapped) ağlarda `{productId}.json` dosyasına `"disableHttpsFeatures": true` ekleyerek tüm dış HTTPS denetimlerini tamamen kapatabilirsiniz.

### 3.3 Kendi Anahtarınla ve Yerel Yapay Zekâ

Yapay zekâ sorgu asistanını kendi Anthropic veya Google Gemini API anahtarınızla (`BYOK`) ya da yerel `Ollama` sunucunuzla kullandığınızda istekler **doğrudan cihazınızdan** seçtiğiniz uç noktaya gider. {productName} sunucuları API anahtarınızı, doğal dil istemlerinizi veya şema özetlerinizi asla görmez; bu kullanımda ilgili sağlayıcının kendi gizlilik koşulları geçerlidir.

## 4. {productName} Cloud Hizmetleri

{productName} Cloud (`Pro` veya `Team`) kullanımı tamamen isteğe bağlıdır. Hesap açtığınızda veya abone olduğunuzda yalnızca hizmetin ifası için zorunlu asgari veriler işlenir:

### 4.1 Hesap, Cihaz Onayı ve Faturalama Verileri

- **İşlenen veriler:** Doğrulanmış e-posta adresi, `Argon2id` parola özeti (parolanın kendisi asla saklanmaz), isteğe bağlı TOTP 2FA sırrı veya WebAuthn passkey açık anahtarı, **RFC 8628 Cihaz Onay Akışı** ile eşleştirilen cihaz kayıtları (cihaz etiketi, işletim sistemi, son görülme zamanı, döner yenileme belirteci), abonelik/yetki durumu ve ödeme sağlayıcısı müşteri/işlem referansları. Kredi/banka kartı numaraları sunucularımıza hiçbir zaman uğramaz.
- **Hukuki sebep ve saklama süresi:** Hesabınız aktif olduğu sürece sözleşmenin kurulması ve ifası (KVKK m. 5/2-c; GDPR m. 6(1)(b)); fatura ve muhasebe kayıtları bakımından kanuni yükümlülüğün yerine getirilmesi (KVKK m. 5/2-a,ç; GDPR m. 6(1)(c) — 213 sayılı Vergi Usul Kanunu ve 6102 sayılı Türk Ticaret Kanunu uyarınca e-Arşiv/fatura kayıtları için **10 yıl**).

### 4.2 Sıfır-Bilgi Uçtan Uca Şifreli Eşitleme

- **İstemci tarafı şifreleme:** Eşitlenen veriler (bağlantı profilleri, açıkça seçmeniz hâlinde parolalar, SSH ayarları, snippet'ler, sorgu geçmişi, başlangıç betiği ve arayüz tercihleri) sunucuya gönderilmeden **önce cihazınızda** eşitleme parolanızdan `Argon2id` ile türetilen anahtar ve `AES-256-GCM` kullanılarak şifrelenir.
- **Sıfır sunucu bilgisi:** Veritabanımız (`sync_blobs`) yalnızca opak şifreli bayt dizisini, koleksiyon adını, boyutu ve ETag/sürüm bilgisini tutar. **Şifreleme anahtarınız {productName} sunucularına asla gönderilmez; ne biz ne de herhangi bir alt işleyici eşitlenen içeriklerinizi okuyabilir ve eşitleme parolanızı unutmanız hâlinde verilerinizi kurtarmamız teknik olarak imkânsızdır.**
- **Abonelik bitimi sonrası saklama:** Ücretli abonelik sona erdiğinde şifreli blob'lar **90 takvim günü** boyunca salt-okunur (`GET /v1/sync/*`) ve dışa aktarılabilir (`POST /v1/account/export`) tutulur; bu sürede abonelik yenilenmezse veya hesabınızı daha erken silmezseniz kalıcı olarak temizlenir (bkz. [İade Politikası]({refundsPath})).

### 4.3 Anahtarsız Barındırılan Yapay Zekâ Asistanı

{productName} Cloud barındırılan yapay zekâ asistanını (`POST /v1/ai/generate`) kullandığınızda, sorgu isteminiz ve ilgili koleksiyon alan/tip özeti yalnızca yanıt üretmek üzere TLS üzerinden ticari LLM API sağlayıcısına iletilir. **İstemler, şema özetleri ve üretilen yanıtlar {productName} sunucu günlüklerine veya veritabanlarına asla kaydedilmez**; kullanılan ticari API uç noktalarında müşteri girdileriyle model eğitimi yapılması kapalıdır. Yalnızca plan kotasını uygulamak amacıyla aylık toplam token sayacı (`ai_usage`: kullanıcı kimliği, fatura ayı, toplam token) tutulur.

### 4.4 Barındırılan WebSocket Köprüsü

`Pro` ve `Team` aboneleri isteğe bağlı barındırılan WebSocket→TCP köprüsünü (`{bridgeHost}`) kullandığında, yalnızca kullanıcının izin listesine (allowlist) eklediği herkese açık `host:port` hedeflerine ve uçtan uca zorunlu TLS ile bağlanılmasına izin verilir; TLS tarayıcınız/istemciniz ile kendi MongoDB sunucunuz arasında sonlandığından veritabanı kimlik bilgileri ve sorgu içerikleri köprü tarafından çözülemez. SSRF ve ağ suistimalini önlemek amacıyla bağlantı güvenlik günlüklerinde yalnızca zaman damgası, kullanıcı kimliği, hedef `host:port` ve bayt miktarı—**içerik olmaksızın**—**en fazla 30 gün** saklanır.

## 5. Alt İşleyiciler ve Yurt Dışı Veri Aktarımı

Kişisel verilerinizi hiçbir üçüncü tarafa satmayız ve reklam ağlarıyla paylaşmayız. Yalnızca aşağıdaki altyapı ve ödeme alt işleyicilerinden yararlanılır:

| Sağlayıcı / Kategori | Görev ve İşlenen Veri Kapsamı | Bölge | Veri Koruma Güvenceleri |
| --- | --- | --- | --- |
| **Cloudflare, Inc.** | Yetkili DNS, Anycast WAF/DDoS koruması, Origin mTLS ve Cloudflare R2 nesne depolama (`{dlHost}` üzerindeki açık kurulum paketleri + yükleme öncesi `restic` ile şifrelenmiş yedekler) | Küresel / AB | EU-US Data Privacy Framework, GDPR DPA ve Standart Sözleşme Maddeleri (SCC); yedekler istemci tarafında şifrelenir |
| **Birincil VPS Barındırma Sağlayıcısı** | Kenar `nginx`, Go API/portal (`{apiHost}`, `{appHost}`) ve izole PostgreSQL container'larını barındıran sanal sunucu altyapısı | AB / Türkiye | ISO 27001 fiziksel/ağ güvenliği, GDPR DPA, izole iç Docker ağları |
| **Paddle (`Paddle.com Market Limited` / `Paddle.com Inc.`)** | Türkiye dışı abonelikler için küresel Kayıtlı Satıcı (*Merchant of Record — MoR*): ödeme, kart/cüzdan tahsilatı, küresel KDV/VAT hesabı, faturalama ve iade | Birleşik Krallık / AB / Küresel | PCI-DSS Seviye 1, GDPR DPA, BK yeterlilik kararı ve SCC (vergi mevzuatı yönünden bağımsız veri sorumlusu) |
| **iyzico (`iyzi Ödeme ve Elektronik Para Hizmetleri A.Ş.`)** | Türkiye (`TRY`) abonelikleri için Ödeme Hizmeti Sağlayıcısı (PSP): yerel kart tahsilatı ve abonelik ödemeleri | Türkiye Cumhuriyeti | TCMB / BDDK lisanslı ödeme kuruluşu, PCI-DSS Seviye 1, KVKK uyumlu |
| **İşlemsel E-posta Sağlayıcısı (Faz `0.7`: Amazon SES / Postmark / Resend)** | E-posta doğrulama, parola sıfırlama, fatura ve hesap silme bildirimleri (`0` pazarlama bülteni) | AB / ABD | Aktarımda TLS, SPF/DKIM/DMARC, GDPR DPA ve SCC |
| **Ticari LLM API Sağlayıcıları (Anthropic PBC / Google Cloud Gemini API)** | *Yalnızca Barındırılan Bulut AI kullanan aboneler için:* model eğitimi yapılmaksızın anlık sorgu/şema çıkarımı | ABD / AB | Model eğitimsiz ticari API şartları, GDPR DPA ve SCC, {productName} tarafında sıfır istem kaydı |

Türkiye dışına veri aktarımları 6698 sayılı KVKK m. 9 (2024 değişikliği uyarınca yeterlilik kararları veya Kuruma bildirilen standart sözleşme güvenceleri) kapsamında; AEA/BK kaynaklı aktarımlar ise GDPR Bölüm V (m. 45–46 yeterlilik kararları ve Standart Sözleşme Maddeleri) uyarınca yürütülür.

## 6. KVKK Madde 11 ve GDPR Madde 15–22 Kapsamındaki Haklarınız

Tabi olduğunuz mevzuata göre aşağıdaki haklara sahipsiniz:

- **KVKK Madde 11 kapsamında:** Kişisel verilerinizin işlenip işlenmediğini öğrenme; işlenmişse bilgi talep etme; işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme; yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme; eksik veya yanlış işlenmişse düzeltilmesini isteme; KVKK m. 7 çerçevesinde silinmesini veya yok edilmesini isteme; düzeltme/silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme; münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.
- **GDPR Madde 15–22 ve 77 kapsamında:** Kişisel verilere erişim, düzeltme, silme ("unutulma hakkı"), işlemeyi kısıtlama, yapılandırılmış ve makinece okunabilir biçimde **veri taşınabilirliği**, meşru menfaate dayalı işlemeye itiraz etme, açık rızayı geçmişe etkili olmaksızın dilediğiniz an geri çekme ve Kişisel Verileri Koruma Kurumu'na veya yerel veri koruma otoritesine şikâyette bulunma.

**Self-servis araçlar ve başvuru yöntemi:**

- **Anında Veri Dışa Aktarma (`POST /v1/account/export`):** `{appUrl}` üzerinden hesap profilinizi, eşleştirilmiş cihazlarınızı, abonelik/yetki meta verilerinizi ve şifreli `sync_blobs` kayıtlarınızı içeren JSON arşivini indirebilirsiniz.
- **Hesap Silme (`DELETE /v1/account`):** `{appUrl}` üzerinden hesabınızın tamamen silinmesini başlatabilirsiniz. Yanlışlıkla yapılan işlemleri veya ele geçirilmiş oturumları geri alabilmeniz için **30 takvim günü geri alınabilir bekleme süresi** uygulanır; 30. günün sonunda hesabınız, cihaz belirteçleriniz ve şifreli eşitleme verileriniz canlı veritabanlarından kalıcı olarak silinir (şifreli felaket kurtarma yedekleri döner saklama takvimi sonunda otomatik düşer; kanunen tutulması zorunlu vergi/fatura kayıtları ise yalnızca yasal zamanaşımı süresince saklanır).
- **Yazılı Başvurular:** Taleplerinizi {privacyContact} kanalı üzerinden de iletebilirsiniz. Doğrulanmış başvurular Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ ve GDPR m. 12(3) uyarınca ücretsiz olarak en geç **30 gün** içinde sonuçlandırılır.

## 7. Güvenlik Önlemleri ve 72 Saat Veri İhlali Bildirimi

Hesap ve servis altyapımız; `Argon2id` parola özetleme, istemci tarafı `AES-256-GCM` eşitleme şifrelemesi, kısa ömürlü `ES256` belirteçleri, Cloudflare Authenticated Origin Pulls (`mTLS`), güvenlik duvarı IP kısıtlamaları, Linux yetkileri düşürülmüş salt-okunur root olmayan container mimarisi, otomatik güvenlik açığı taramaları (`govulncheck`, `npm audit`, OSV-Scanner, Trivy) ve sunucu dışı şifreli `restic` yedekleriyle korunur.

Kişisel verilerin kanuni olmayan yollarla başkaları tarafından elde edilmesi veya bireylerin hak ve özgürlükleri açısından risk doğuran bir veri ihlali yaşanması hâlinde, durumun öğrenilmesinden itibaren **72 saat içinde** yetkili denetim makamlarına (Kişisel Verileri Koruma Kurulu ve/veya ilgili GDPR veri koruma otoritesi) ve gecikmeksizin etkilenen kullanıcılara KVKK m. 12/5 ve GDPR m. 33–34 uyarınca bildirim yapılır.
