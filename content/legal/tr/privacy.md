# Gizlilik Politikası, KVKK / GDPR Aydınlatma Metni ve Çerezsiz Bildirim

Bu Gizlilik Politikası ve Aydınlatma Metni; [{domain}]({siteUrl}) web sitesini ziyaret ettiğinizde, {productName} masaüstü ve mobil uygulamalarını kurup çalıştırdığınızda veya `{appHost}`, `{apiHost}`, `{dlHost}` ve `{bridgeHost}` üzerindeki isteğe bağlı {productName} Cloud hizmetlerini kullandığınızda hangi verilerin işlendiğini ve **hangi verilerin kesinlikle toplanmadığını** açıklar. Metin, **6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)** m. 10 ile Avrupa Birliği / AEA / Birleşik Krallık **Genel Veri Koruma Tüzüğü (GDPR)** m. 13-14 hükümlerine uyumlu olarak hazırlanmıştır.

## 1. Veri Sorumlusu ve İletişim Kanalları

- **Veri Sorumlusu:** {legalEntity}
- **Konum:** {legalAddress}
- **Gizlilik, KVKK ve GDPR Başvuruları:** {privacyContact}
- **Genel Destek:** {supportContact}
- **Güvenlik Açığı Bildirimi:** [{securityTxtPath}]({securityTxtPath})
- **Son Güncelleme Tarihi:** {draftDate}

## 2. Bu Web Sitesi ve Çerezsiz Bildirim

### 2.1 Sıfır Çerez ve Sıfır Tarayıcı Depolaması

Herkese açık {productName} tanıtım ve belge sitesi ([{domain}]({siteUrl})) **hiçbir HTTP çerezi bırakmaz** (`Set-Cookie` başlığı gönderilmez, `document.cookie` okunmaz/yazılmaz) ve **tarayıcı depolaması kullanmaz** (`localStorage`, `sessionStorage`, `IndexedDB` veya Cache Storage yoktur). İzleme veya zorunlu olmayan istemci depolaması bulunmadığından ziyaretçiler çerez onay pencereleriyle bölünmez.

Ayrı hesap portalında (`{appHost}`), yalnızca kullanıcı açıkça giriş yaptığında oturum güvenliği ve CSRF koruması için teknik olarak zorunlu çerezler (`Secure; HttpOnly; SameSite=Lax`) kullanılır; bu çerezler KVKK Çerez Uygulamaları Rehberi ve ePrivacy kuralları uyarınca yalnızca talep edilen oturum hizmetini yürütmek için var olduğundan açık rıza şartından muaftır.

### 2.2 Üçüncü Taraf İzleyici, Yazı Tipi veya CDN Yok

Sitedeki tüm stil dosyaları, vektör simgeler, paylaşım görselleri ve kendi sunucumuzda barındırılan yazı tipleri doğrudan `{domain}` üzerinden sunulur. **Üçüncü taraf betik, reklam ağı, izleme pikseli veya harici CDN yüklenmez.** İstemci tarafındaki aşamalı hareket modülü sıfır ağ telemetrisiyle aynı alan adından özetlenmiş (hashed) modül olarak çalışır; [İndir]({downloadPath}) sayfası da işletim sisteminize uygun paketi öne çıkarmak için aynı alan adından `/releases.json` dosyasını okuyan aynı kaynaklı bir betik çalıştırır ve kişisel hiçbir tanımlayıcı göndermez. Bugün sitede hiçbir analitik çalışmamaktadır; ileride çerezsiz sunucu/kenar analitiği seçilmesi hâlinde yayın öncesinde bu metin güncellenir.

### 2.3 Kenar Ağı ve Maskelenmiş Erişim Günlükleri

Gelen HTTPS trafiği Cloudflare TLS/WAF koruması ve karşılıklı kimlik doğrulamalı TLS (`Origin mTLS`) üzerinden kenar `nginx` sunucumuza ulaşır:

- **Maskelenmiş web erişim günlükleri:** Kenar `nginx` sunucumuz erişim günlüklerine yazmadan önce URL sorgu dizgelerini ve tam `User-Agent` başlıklarını çıkarır; ziyaretçi IPv4 adreslerini `/24` düzeyine (son oktet sıfırlanır, ör. `203.0.113.0`), IPv6 adreslerini ise `/48` düzeyine kısaltır.
- **Güvenlik ve oran sınırı (rate-limit) günlükleri:** Tam IP adresleri hız sınırlaması için geçici olarak bellekte işlenir; kimlik doğrulama kaba kuvvet denemeleri, geçersiz belirteç denemeleri veya ağ kötüye kullanımı gibi güvenlik olaylarında ise bilgi güvenliği meşru menfaati hukuki sebebine (KVKK m. 5/2-f; GDPR m. 6(1)(f)) dayanarak güvenlik günlüklerinde **en fazla 30 gün** saklanır ve ardından silinir.

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

Yapay zekâ sorgu asistanı siz açana kadar kapalıdır ve {productName}'in kendine ait bir yapay zekâ hizmeti yoktur. Uç noktayı siz seçersiniz: Anthropic, Google Gemini, OpenAI uyumlu bir sunucu (çevrimiçi bir hizmet ya da kendi çalıştırdığınız bir sunucu) veya `Ollama`, LM Studio gibi yerel bir model. Oluştur'a basmadan hiçbir şey gönderilmez. Bastığınızda istek **doğrudan cihazınızdan** o uç noktaya gider ve şunları içerir: doğal dille yazdığınız istek; veritabanı ve koleksiyon adları; koleksiyonun alan adları, türleri, indeksleri ve belge sayısı; sunucu sürümü; aynı veritabanındaki ilişkili koleksiyonların alanları. Örneklenen belge değerleri (sık geçen değerler, en küçük ve en büyük değer) yalnızca Tercihler'de izin verirseniz eklenir. **Bağlantıyı test et** yalnızca uç noktanın model listesini ister; şema ya da istem göndermez.

- {productName} sunucuları API anahtarınızı, istemlerinizi, şema özetlerinizi veya üretilen sorguyu asla almaz. Bir anahtar yalnızca girildiği uç noktaya gönderilir ve kendi cihazınızın dışına hiçbir zaman düz `http` ile gitmez.
- Kendi cihazınızda ya da yerel ağınızda çalışan bir modelde veri o bilgisayardan çıkmaz; ancak model ya da o adresin arkasındaki bir vekil sunucu isteği çevrimiçi bir hizmete iletiyorsa (ör. `Ollama` bulut modelleri) veri o hizmete gider.
- Seçtiğiniz uç nokta isteği kendi koşulları ve gizlilik politikası altında işler; kullanım ücretleri sizinle o sağlayıcı arasındadır. Bu uç nokta {productName}'in alt işleyicisi değildir: üçüncü taraf ya da kendi barındırdığınız uç noktaların verileri nasıl işlediğini {productName} denetlemez ve bundan sorumlu değildir. Bir sağlayıcıyı iş verisi ya da kişisel veriyle kullanmadan önce veri kullanımı ve saklama koşullarını kontrol edin.

## 4. {productName} Cloud Hizmetleri

{productName} Cloud kullanımı tamamen isteğe bağlı ve ücretsizdir; satışta ücretli bir plan yoktur. Hesap açtığınızda yalnızca hizmetin ifası için zorunlu asgari veriler işlenir:

### 4.1 Hesap ve Cihaz Onayı

- **İşlenen veriler:** Doğrulanmış e-posta adresi, `Argon2id` parola özeti (parolanın kendisi asla saklanmaz), isteğe bağlı TOTP 2FA sırrı veya WebAuthn passkey açık anahtarı, **RFC 8628 Cihaz Onay Akışı** ile eşleştirilen cihaz kayıtları (cihaz etiketi, işletim sistemi, son görülme zamanı, döner yenileme belirteci), portal giriş zamanları, hesabın yetki durumu (hangi bulut özelliklerini kullanabileceği) ve pasiflik uyarısının gönderildiği tarih (Madde 4.2).
- **Hukuki sebep ve saklama süresi:** Hesabınız var olduğu sürece sözleşmenin kurulması ve ifası (KVKK m. 5/2-c; GDPR m. 6(1)(b)). Pasiflik tek başına hesabı silmez (Madde 4.2).

### 4.2 Sıfır-Bilgi Uçtan Uca Şifreli Eşitleme

- **İstemci tarafı şifreleme:** Eşitlenen veriler (bağlantı profilleri, açıkça seçmeniz hâlinde parolalar, SSH ayarları, snippet'ler, sorgu geçmişi, başlangıç betiği ve arayüz tercihleri) sunucuya gönderilmeden **önce cihazınızda** eşitleme parolanızdan `Argon2id` ile türetilen anahtar ve `AES-256-GCM` kullanılarak şifrelenir.
- **Sıfır sunucu bilgisi:** Veritabanımız (`sync_blobs`) yalnızca opak şifreli bayt dizisini, koleksiyon adını, boyutu ve ETag/sürüm bilgisini tutar. **Şifreleme anahtarınız {productName} sunucularına asla gönderilmez; ne biz ne de herhangi bir alt işleyici eşitlenen içeriklerinizi okuyabilir ve eşitleme parolanızı unutmanız hâlinde verilerinizi kurtarmamız teknik olarak imkânsızdır.**
- **Günlük yükleme sayacı:** Günde 500 yükleme sınırını uygulamak için hesap, UTC tarihi ve o gün yapılan yükleme sayısı saklanır (`sync_write_days`). Önceki günler bir sonraki yüklemede silinir; sayaç eşitleme verinizle ya da hesabınızla birlikte silinir. İşletimsel bir sayaçtır ve veri dışa aktarımına dâhil değildir. Hukuki sebep: kötüye kullanımı önlemede meşru menfaat (KVKK m. 5/2-f; GDPR m. 6(1)(f)).
- **Pasif hesaplar:** Bir hesapta 12 ay boyunca etkinlik olmazsa (şunların en yenisi: hesaba bağlı bir cihazda uygulamanın kullanılması, portala giriş, yükleme ya da hesabın açılışı), 11 ayın sonunda doğrulanmış e-posta adresine uyarı gönderilir. Bu arada hesap kullanılmazsa, uyarının teslim edilmesinden 30 gün sonra şifreli eşitleme verileri ve günlük sayaç silinir. Hesap silinmez; silmenin yapıldığına dair e-posta adresi ya da içerik barındırmayan bir iç kayıt tutulur. Hukuki sebep: saklama sınırlaması ilkesi (KVKK m. 4/2-d; GDPR m. 5(1)(e)).

### 4.3 Barındırılan WebSocket Köprüsü

İsteğe bağlı barındırılan köprüyü (`{bridgeHost}`) kullandığınızda istemciniz MongoDB bağlantı adresinizi (içindeki kimlik bilgileriyle) ve her komutu şifreli `wss://` üzerinden gönderir. Köprü sunucunuza TLS ile bağlanır, komutları çalıştırır ve sonuçları döndürür. Bunlar yalnızca oturum sürerken bellekte tutulur, diske yazılmaz. Yalnızca TLS kullanan herkese açık hedeflere izin verilir.

- **İşletim günlükleri:** Hatalar ve reddedilen hedefler (alan adı ve sebep); asla kimlik bilgileri, tam bağlantı adresleri veya veritabanı içerikleri değil. **En fazla 30 gün** saklanır.
- **Aylık trafik sayacı:** Aylık 1 GB sınırını uygulamak için köprü bir dosya tutar: içinde geçerli takvim ayı ve o ay köprüyü kullanan her hesap için hesap kimliğinin SHA-256 özeti ile aktarılan bayt sayısı bulunur. Özet takma adlıdır, anonim değildir: onu bir hesap kimliğiyle eşleştirebiliriz. Sayaçlar her ayın başında sıfırlanır; bir değer en fazla kendi ayının sonuna kadar saklanır.
- **Kısıtlama listesi:** Kötüye kullanım nedeniyle bir hesabın köprü erişimini kapatırsak, hesap kimliği kısıtlama sürdüğü sürece iç bir listede tutulur.
- **Hukuki sebep:** Güvenlik ve kötüye kullanımı önlemede meşru menfaat (KVKK m. 5/2-f; GDPR m. 6(1)(f)).

## 5. Alt İşleyiciler ve Yurt Dışı Veri Aktarımı

Kişisel verilerinizi hiçbir üçüncü tarafa satmayız ve reklam ağlarıyla paylaşmayız. Yalnızca aşağıdaki altyapı alt işleyicilerinden yararlanılır:

| Sağlayıcı / Kategori | Görev ve İşlenen Veri Kapsamı | Bölge | Veri Koruma Güvenceleri |
| --- | --- | --- | --- |
| **Cloudflare, Inc.** | Yetkili DNS, Anycast WAF/DDoS koruması, Origin mTLS, Cloudflare Email Routing (destek/gizlilik/güvenlik gelen e-posta yönlendirmesi) ve `{dlHost}` üzerindeki açık kurulum paketleri | Küresel / AB | EU-US Data Privacy Framework, GDPR DPA ve Standart Sözleşme Maddeleri (SCC) |
| **Birincil VPS Barındırma Sağlayıcısı** | Kenar `nginx`, Go API/portal (`{apiHost}`, `{appHost}`), barındırılan köprü (`{bridgeHost}`), izole PostgreSQL container'ları ve şifreli yerel `restic` yedeklerini barındıran sunucu altyapısı | AB / Türkiye | ISO 27001 fiziksel/ağ güvenliği, GDPR DPA, izole iç Docker ağları |
| **Resend** | Giden işlemsel e-postalar: e-posta doğrulama, parola sıfırlama, 2FA kurtarma, pasiflik uyarıları ve hesap silme bildirimleri (`0` pazarlama bülteni) | AB / ABD | Aktarımda TLS, SPF/DKIM/DMARC, GDPR DPA ve SCC |

Türkiye dışına veri aktarımları 6698 sayılı KVKK m. 9 (2024 değişikliği uyarınca yeterlilik kararları veya Kuruma bildirilen standart sözleşme güvenceleri) kapsamında; AEA/BK kaynaklı aktarımlar ise GDPR Bölüm V (m. 45-46 yeterlilik kararları ve Standart Sözleşme Maddeleri) uyarınca yürütülür.

## 6. KVKK Madde 11 ve GDPR Madde 15-22 Kapsamındaki Haklarınız

Tabi olduğunuz mevzuata göre aşağıdaki haklara sahipsiniz:

- **KVKK Madde 11 kapsamında:** Kişisel verilerinizin işlenip işlenmediğini öğrenme; işlenmişse bilgi talep etme; işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme; yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme; eksik veya yanlış işlenmişse düzeltilmesini isteme; KVKK m. 7 çerçevesinde silinmesini veya yok edilmesini isteme; düzeltme/silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme; münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.
- **GDPR Madde 15-22 ve 77 kapsamında:** Kişisel verilere erişim, düzeltme, silme ("unutulma hakkı"), işlemeyi kısıtlama, yapılandırılmış ve makinece okunabilir biçimde **veri taşınabilirliği**, meşru menfaate dayalı işlemeye itiraz etme, açık rızayı geçmişe etkili olmaksızın dilediğiniz an geri çekme ve Kişisel Verileri Koruma Kurumu'na veya yerel veri koruma otoritesine şikâyette bulunma.

**Self-servis araçlar ve başvuru yöntemi:**

- **Anında Veri Dışa Aktarma (`POST /v1/account/export`):** `{appUrl}` üzerinden hesap profilinizi, eşleştirilmiş cihazlarınızı, yetki meta verilerinizi ve şifreli `sync_blobs` kayıtlarınızı içeren JSON arşivini indirebilirsiniz.
- **Hesap Silme (`DELETE /v1/account`):** `{appUrl}` üzerinden hesabınızın tamamen silinmesini başlatabilirsiniz. Yanlışlıkla yapılan işlemleri veya ele geçirilmiş oturumları geri alabilmeniz için **30 takvim günü geri alınabilir bekleme süresi** uygulanır; 30. günün sonunda hesabınız, cihaz belirteçleriniz ve şifreli eşitleme verileriniz canlı veritabanlarından kalıcı olarak silinir (şifreli yerel `restic` yedekleri döner saklama takvimi sonunda otomatik düşer).
- **Yazılı Başvurular:** Taleplerinizi {privacyContact} kanalı üzerinden de iletebilirsiniz. Doğrulanmış başvurular Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ ve GDPR m. 12(3) uyarınca ücretsiz olarak en geç **30 gün** içinde sonuçlandırılır.

## 7. Güvenlik Önlemleri ve 72 Saat Veri İhlali Bildirimi

Hesap ve servis altyapımız; `Argon2id` parola özetleme, istemci tarafı `AES-256-GCM` eşitleme şifrelemesi, kısa ömürlü `ES256` belirteçleri, Cloudflare Authenticated Origin Pulls (`mTLS`), güvenlik duvarı IP kısıtlamaları, Linux yetkileri düşürülmüş salt-okunur root olmayan container mimarisi, otomatik güvenlik açığı taramaları (`govulncheck`, `npm audit`, OSV-Scanner, Trivy) ve şifreli yerel `restic` yedekleriyle korunur.

Kişisel verilerin kanuni olmayan yollarla başkaları tarafından elde edilmesi veya bireylerin hak ve özgürlükleri açısından risk doğuran bir veri ihlali yaşanması hâlinde, durumun öğrenilmesinden itibaren **72 saat içinde** yetkili denetim makamlarına (Kişisel Verileri Koruma Kurulu ve/veya ilgili GDPR veri koruma otoritesi) ve gecikmeksizin etkilenen kullanıcılara KVKK m. 12/5 ve GDPR m. 33-34 uyarınca bildirim yapılır.
