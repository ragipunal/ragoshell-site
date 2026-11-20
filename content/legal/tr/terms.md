# Kullanım Koşulları, Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi Hükümleri

Bu Kullanım Koşulları ("Koşullar"), [{domain}]({siteUrl}) web sitesinin ve `{appHost}`, `{apiHost}`, `{dlHost}` ile `{bridgeHost}` üzerinden sunulan isteğe bağlı {productName} Cloud hizmetlerinin kullanımını düzenler. Lütfen bu metni [Gizlilik Politikası]({privacyPath}), [İade Politikası]({refundsPath}) ve [Künye]({imprintPath}) sayfalarıyla birlikte okuyun.

## 1. Açık Kaynak İstemci Lisansı ve Bulut Hizmetleri Ayrımı

- **Ücretsiz ve özgür istemci (`{appLicenseName}`):** {productName} masaüstü ve mobil istemci uygulaması (`{productId}-mcp` dâhil; açık kaynaklı Robomongo 1.4.4 kod tabanının devamı) **GNU Genel Kamu Lisansı Sürüm 3.0 ([{appLicenseName}]({appLicenseUrl}))** altında lisanslanmıştır ve kaynak kodu [{appRepoUrl}]({appRepoUrl}) adresinde herkese açıktır. Bu Koşullardaki hiçbir hüküm, `{appLicenseName}` lisansının size tanıdığı istemci yazılımını çalıştırma, inceleme, değiştirme ve yeniden dağıtma özgürlüklerini kısıtlamaz.
- **İstemcide ödeme duvarı yoktur:** Yerel MongoDB yönetimi, gömülü JavaScript kabuğu, şema zekâsı, yerel salt-okunur MCP sunucusu ve kendi API anahtarınızla (`BYOK` / yerel `Ollama`) yapay zekâ asistanı sonsuza dek ücretsizdir ve {productName} Cloud hesabı gerektirmez.
- **Barındırılan ağ hizmetleri:** Bu Koşullar yalnızca sunucularımızda çalışan çevrimiçi hizmetleri (**{productName} Cloud**: Sıfır-Bilgi şifreli eşitleme, anahtarsız barındırılan yapay zekâ vekili, ekip çalışma alanları, barındırılan WebSocket köprüsü, hesap portalı ve imzalı sürüm dağıtımı) düzenler. Web sitesi kaynak kodu [{siteCodeLicenseName}]({siteCodeLicenseUrl}), site metinleri ise marka adları, logolar ve üçüncü taraf ticari markaları hariç olmak üzere [{siteContentLicenseName}]({siteContentLicenseUrl}) lisanslıdır.

## 2. Hesap Oluşturma, Cihaz Onayı ve Güvenlik

- **Hesap koşulları:** {productName} Cloud hesabı oluşturmak için en az 18 yaşında (veya tabi olduğunuz hukuk sisteminde reşit) olmanız ve doğrulanabilir geçerli bir e-posta adresi sağlamanız gerekir.
- **RFC 8628 Cihaz Onay Akışı:** Masaüstü ve mobil uygulamalar, OAuth 2.0 Device Authorization Grant (RFC 8628) standardıyla `{appUrl}/device` üzerinden hesabınıza bağlanır; her cihaz için ayrı döner yenileme belirteci ve kısa ömürlü `ES256` imzalı yetki belirteci üretilir. Bireysel `Pro` hesabında ve her `Team` koltuğunda aynı anda en fazla **5 aktif cihaz** eşleştirilebilir ve cihazlar `{appUrl}` üzerinden her an iptal edilebilir.
- **Kimlik bilgileri ve Sıfır-Bilgi sorumluluğu:** Hesap parolanızın, TOTP iki aşamalı doğrulama kodlarınızın, eşleştirilmiş cihazlarınızın ve **Sıfır-Bilgi eşitleme parolanızın** güvenliğinden siz sorumlusunuz. Eşitleme şifreleme anahtarı yalnızca cihazınızda (`Argon2id` + `AES-256-GCM`) türetilip sunucularımıza hiç gönderilmediğinden, **eşitleme parolanızı unutmanız hâlinde parolanızı sıfırlamamız veya şifreli verilerinizi kurtarmamız mümkün değildir**.

## 3. Abonelik Katmanları, Ödeme Kanalları ve Vergilendirme

- **Hizmet katmanları:**
  1. **Ücretsiz (`{appLicenseName}`):** Tam özellikli masaüstü/mobil istemci + `BYOK` / yerel AI, sonsuza dek ücretsiz.
  2. **{productName} Pro (Bireysel):** Kişisel Sıfır-Bilgi şifreli eşitleme (`S1`, 20 koleksiyona kadar, koleksiyon başına 1 MB tavan), aylık anahtarsız barındırılan yapay zekâ token kotası (`S2`), öncelikli e-posta desteği (`S4`) ve isteğe bağlı barındırılan TLS WebSocket köprüsü (`S5`); aylık veya yıllık faturalandırılır.
  3. **{productName} Team (Kişi Başı, en az 3 koltuk):** Tüm `Pro` özelliklerine ek olarak ortak parolasız bağlantı meta verisi ve sorgu/snippet kütüphanesi içeren Ekip Kasası (`Owner`, `Admin`, `Member`, `Read-Only` rolleri). Dönem içinde eklenen koltuklar kalan süre oranında (prorated) ücretlendirilir; azaltılan koltuklar dönem sonuna kadar aktif kalır ve sonraki yenilemede faturadan düşülür.
- **Güncel fiyatlar:** Geçerli plan fiyatları, para birimleri, vergiler ve kota sınırları [Fiyat]({pricingPath}) sayfasında yayımlanır ve tahsilat öncesinde ödeme özeti ekranında açıkça gösterilir.
- **İkili ödeme mimarisi:**
  - **Küresel (Türkiye Dışı) — Paddle (Merchant of Record):** Türkiye dışındaki abonelikler Kayıtlı Satıcı (*Merchant of Record*) sıfatıyla **Paddle** tarafından satılır ve tahsil edilir. Kart ekstrenizde ve faturanızda satıcı olarak Paddle yer alır; alıcının ülkesindeki KDV/VAT/Sales Tax hesaplaması, tahsilatı ve beyanı Paddle tarafından yürütülür.
  - **Türkiye Cumhuriyeti (`TRY`) — iyzico (PSP):** Yerel `TRY` abonelikleri, bölgesel fiyat suistimalini önlemek amacıyla yalnızca Türkiye fatura adresine ve Türkiye çıkışlı banka/kredi kartlarına (`TR BIN` doğrulaması) açıktır ve **iyzico** altyapısıyla tahsil edilir. İlan edilen `TRY` fiyatlarına yürürlükteki KDV (%20) dâhildir; tahsilat sonrasında işletmeci tarafından resmi **e-Arşiv Fatura** (vergi mükellefleri için **e-Fatura**) düzenlenir.
- **Otomatik yenileme ve fiyat değişiklikleri:** Ücretli planlar, dönem bitmeden önce `{appUrl}` üzerinden tek tıkla iptal edilmediği sürece aylık veya yıllık dönem sonunda otomatik yenilenir. Liste fiyatlarında yapılacak artışlar en az **30 takvim günü önceden** e-postayla bildirilir ve yalnızca sonraki yenileme dönemlerinde uygulanır.
- **Gönüllü bağışlar:** Açık kaynak sponsorluk ve bağış kanalları (`GitHub Sponsors`, `Buy Me a Coffee` vb.) açık kaynak geliştirmeye yönelik gönüllü destektir; açıkça belirtilmedikçe ticari {productName} Cloud abonelik kotası doğurmaz.

## 4. Kabul Edilebilir Kullanım Kuralları

`{appHost}`, `{apiHost}` veya `{bridgeHost}` hizmetlerini kullanırken aşağıdaki davranışlar **kesinlikle yasaktır**:

- Tek kişilik `Pro` hesabını birden fazla kişi arasında paylaşmak, barındırılan yapay zekâ kotasını veya köprü bant genişliğini üçüncü kişilere yeniden satmak/aktarmak ya da deneme/iade haklarını suistimal etmek amacıyla otomatik veya tek kullanımlık çoklu hesaplar açmak.
- **SSRF, port tarama ve ağ suistimali:** `{bridgeHost}` köprüsünü veya herhangi bir bulut uç noktasını yerel döngü (loopback), özel iç ağ, link-local veya bulut metadata IP aralıklarını (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16` ve IPv6 karşılıkları) taramak/yoklamak için kullanmak, DNS yeniden bağlama (rebinding) saldırısı denemek, barındırılan köprü üzerinden TLS'siz hedeflere bağlanmaya çalışmak veya yetkiniz olmayan üçüncü taraf sistemlere erişim girişiminde bulunmak.
- Hız sınırlarını (rate limit), kriptografik belirteç doğrulamasını, ödeme webhook imzalarını veya plan kotalarını aşmaya çalışmak ya da hukuka aykırı/zararlı yükler iletmek.

SSRF, port tarama, kimlik bilgisi deneme saldırıları veya ödeme dolandırıcılığı gibi ağır güvenlik ihlallerinde bulut uç noktaları otomatik olarak derhâl askıya alınabilir. Acil güvenlik riski taşımayan aykırılıklarda makul bildirim ve düzeltme süresi tanınır; kusurunuz olmaksızın {productName} Cloud hizmetinin kalıcı olarak sonlandırılması hâlinde kullanılmayan ön ödemeli abonelik tutarı gün esaslı (prorated) iade edilir.

### 4.1 Barındırılan WebSocket Köprüsü (`{bridgeHost}`)

- **Köprüden geçen veriler:** Barındırılan `{bridgeHost}` hizmeti üzerinden bağlandığınızda MongoDB bağlantı adresiniz (gömülü kimlik bilgileri dâhil), kimlik doğrulama el sıkışmaları ve çalıştırdığınız tüm veritabanı komutları aktarım noktamızdan geçer — istemciniz ile köprü arasında şifreli `wss://`, köprü ile MongoDB sunucunuz arasında TLS bağlantısıyla. Köprü yalnızca WebSocket çerçeveleme katmanını sonlandırır; belge içeriğini, sorgu sonuçlarını veya kimlik bilgilerini incelemez ve saklamaz; aktarılan trafik yalnızca belirttiğiniz hedefe ulaştırmak için kullanılır.
- **Tasarım gereği hedef kısıtları:** Barındırılan köprü genel IP (egress) politikası uygular ve TLS'siz hedefleri reddeder. Yerel döngü, özel ağ, link-local, bulut metadata ve ayrılmış adres aralıklarının yanı sıra `tls=true`/`ssl=true` içermeyen `mongodb://` adresleri reddedilir (`mongodb+srv://` kabul edilir).
- **Kapasite sınırları:** Eşleştirilmiş cihaz ve hesap başına sınırlı sayıda eşzamanlı köprü oturumu uygulanır (yayımlanan sınırlar; şu anda cihaz başına 2 eşzamanlı oturum). Bu sınırları aşmaya çalışmak Madde 4 kapsamında kota suistimali sayılır.
- **İşletim günlükleri:** Oturum kimlik doğrulama sonuçları ve reddedilen hedeflerin alan adları (asla kimlik bilgileri, tam bağlantı adresleri veya veritabanı içerikleri değil) [Gizlilik Politikası]({privacyPath}) kapsamında işletim günlüklerinde yer alabilir.
- **Kendi altyapınızda alternatif:** Aynı açık kaynaklı köprüyü özel veya TLS'siz hedeflere karşı kendi sorumluluğunuzda kendiniz barındırabilirsiniz (`{appRepoUrl}`); bu maddedeki kısıtlar yalnızca barındırılan `{bridgeHost}` hizmeti için geçerlidir.

## 5. Veritabanı Güvenliği, Hizmet Sürekliliği ve Sorumluluk Sınırı

- **Veritabanı yönetim riski ve yedekleme yükümlülüğü:** {productName}, bağlandığınız MongoDB sunucuları üzerinde doğrudan gerçek komutlar ve JavaScript betikleri çalıştırır (`dropDatabase`, `deleteMany`, indeks işlemleri dâhil). **MongoDB sunucularınızda düzenli ve test edilmiş bağımsız yedekler almak, en az yetki prensibiyle veritabanı rolleri tanımlamak ve üretim verisini korumak münhasıran sizin sorumluluğunuzdadır.**
- **Yapay zekâ çıktılarının kontrolü:** Yapay zekâ asistanının (`BYOK` veya {productName} Cloud) ürettiği MQL sorguları, aggregation boru hatları ve indeks önerileri yardımcı niteliktedir ve hata içerebilir; her komutu canlı veritabanında çalıştırmadan önce incelemek ve doğrulamak kullanıcının sorumluluğundadır.
- **Garanti ve sorumluluk tavanı:** Emredici mevzuat hükümleri saklı kalmak kaydıyla {productName} Cloud hizmetleri "olduğu gibi" ve "mevcut olduğu ölçüde" sunulur. Uygulanacak hukukun izin verdiği azami ölçüde, {productName} Cloud hizmetlerinden kaynaklanan toplam mali sorumluluğumuz, sorumluluğu doğuran olaydan önceki son **12 ay içinde** ödediğiniz toplam abonelik bedelini (veya emredici hukuk gerektiriyorsa 50 USD karşılığını) aşamaz; dolaylı zararlar, kâr kaybı veya veri kaybından sorumluluk kabul edilmez. 6098 sayılı Türk Borçlar Kanunu ve 6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca ağır kusur, kast veya vazgeçilemez tüketici haklarına ilişkin emredici hükümler saklıdır.

## 6. Fikri Mülkiyet ve MongoDB Ticari Marka Bildirimi

- **İşletmeci markası ve kullanıcı verisi:** {productName} adı, iki tonlu yazı logosu ve çiçek amblemi işletmecinin ayırt edici işaretleridir; `{appLicenseName}` veya `{siteCodeLicenseName}` lisansları üçüncü kişilere bu markaları kendi ürün adlarında kullanma hakkı vermez. Veritabanı şemalarınız, sorgularınız, betikleriniz ve eşitlediğiniz içeriklerin tüm mülkiyeti size aittir.
- **Üçüncü taraf ticari markaları:** {trademarkNotice} Ayrıntılar için [Marka Bildirimi]({trademarkPath}) sayfasına bakabilirsiniz.

## 7. Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi Hükümleri (6502 Sayılı TKHK)

Elektronik ortamda {productName} Cloud aboneliği satın alan tüketiciler bakımından—özellikle Türkiye Cumhuriyeti'nde **6502 sayılı Tüketicinin Korunması Hakkında Kanun** ve **Mesafeli Sözleşmeler Yönetmeliği** kapsamındaki doğrudan `TRY` abonelik işlemlerinde—aşağıdaki maddeler hem **Ön Bilgilendirme Formu** hem de **Mesafeli Satış Sözleşmesi** hükümlerini oluşturur:

### 7.1 Satıcı ve Hizmet Sağlayıcı Bilgileri

- **Satıcı / Hizmet Sağlayıcı:** {legalEntity}
- **Merkez ve Tebligat Adresi:** {legalAddress}
- **Destek ve Şikâyet İletişim Kanalı:** {supportContact}
- *(Türkiye dışındaki küresel ödemelerde Kayıtlı Satıcı [Merchant of Record] sıfatıyla Paddle üzerinden işlem yapıldığında, ödeme ve vergi faturası yönünden Paddle Alıcı Koşulları ile aşağıdaki teknik hizmet taahhütlerimiz birlikte uygulanır.)*

### 7.2 Hizmetin Konusu ve Temel Nitelikleri

Sözleşmenin konusu; alıcının seçtiği plana göre cihazlar arası uçtan uca şifreli yapılandırma eşitlemesi (`S1`), aylık plan kotası dâhilinde anahtarsız barındırılan yapay zekâ sorgu desteği (`S2`), ekip planlarında ortak Ekip Kasası (`S3`), öncelikli e-posta desteği (`S4`) ve isteğe bağlı barındırılan TLS WebSocket köprüsü (`S5`) sunan gayrimaddi, dönemsel dijital abonelik hizmetidir. Uyumlu işletim sistemleri ve donanım/yazılım gereksinimleri [İndir]({downloadPath}) sayfasında belirtilmiştir. Fiziksel kargo veya teslimat söz konusu değildir.

### 7.3 Vergiler Dahil Bedel, Ödeme ve Elektronik İfa Şekli

Hizmetin tüm vergiler dâhil toplam aylık veya yıllık bedeli (Türkiye `TRY` planlarında %20 KDV dâhil tutar), faturalama dönemi ve ödeme yöntemi, sipariş onayı öncesinde ödeme özeti ekranında alıcıya açıkça gösterilir ve elektronik onayla tahsil edilir. Teslim/ifa, ödemenin onaylanmasının hemen ardından `{appUrl}` hesabına ilgili yetkinin tanımlanmasıyla **elektronik ortamda derhâl** gerçekleştirilir; yasal **e-Arşiv Fatura** / **e-Fatura** (veya Paddle makbuzu) alıcının kayıtlı e-posta adresine elektronik olarak iletilir.

### 7.4 Cayma Hakkı ve 14 Gün Koşulsuz İade Taahhüdü

Mesafeli Sözleşmeler Yönetmeliği m. 15/1-(ğ) hükmü *"elektronik ortamda anında ifa edilen hizmetler"* bakımından yasal cayma hakkı istisnası öngörmekteyse de, **tüketici lehine sözleşmesel güvence olarak ilk abonelik satın alımlarında 14 takvim günü boyunca hiçbir gerekçe göstermeksizin koşulsuz cayma ve %100 tam iade hakkı tanıyoruz**. Başvuru kanalları ve adil kullanım kuralları [İade Politikası]({refundsPath}) sayfasında ayrıntılı olarak düzenlenmiştir.

### 7.5 Uygulanacak Hukuk ve Uyuşmazlıkların Çözümü

İşletmeci ile doğrudan kurulan sözleşmelerde Türkiye Cumhuriyeti hukuku uygulanır (yurt dışındaki tüketicilerin mutad mesken hukukundan doğan emredici tüketici korumaları saklıdır). Türkiye'deki tüketiciler, uyuşmazlık tutarına göre Ticaret Bakanlığı'nca her yıl ilan edilen parasal sınırlar dâhilinde yerleşim yerlerindeki veya işlemin yapıldığı yerdeki **İl veya İlçe Tüketici Hakem Heyetlerine**, bu sınırları aşan uyuşmazlıklarda ise **Tüketici Mahkemelerine** başvurabilirler.
