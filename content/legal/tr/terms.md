# Kullanım Koşulları

Bu Kullanım Koşulları ("Koşullar"), [{domain}]({siteUrl}) web sitesinin ve `{appHost}`, `{apiHost}`, `{dlHost}` ile `{bridgeHost}` üzerinden sunulan isteğe bağlı {productName} Cloud hizmetlerinin kullanımını düzenler. Lütfen bu metni [Gizlilik Politikası]({privacyPath}) ve [Künye]({imprintPath}) sayfalarıyla birlikte okuyun. Satışta ücretli bir plan yoktur; bu Koşulların hiçbir hükmü size bir ödeme yükümlülüğü getirmez.

## 1. Açık Kaynak İstemci Lisansı ve Bulut Hizmetleri Ayrımı

- **Ücretsiz ve özgür istemci (`{appLicenseName}`):** {productName} masaüstü ve mobil istemci uygulaması (`{productId}-mcp` dâhil) **GNU Genel Kamu Lisansı Sürüm 3.0 ([{appLicenseName}]({appLicenseUrl}))** altında lisanslanmıştır ve kaynak kodu [{appRepoUrl}]({appRepoUrl}) adresinde herkese açıktır. Bu Koşullardaki hiçbir hüküm, `{appLicenseName}` lisansının size tanıdığı istemci yazılımını çalıştırma, inceleme, değiştirme ve yeniden dağıtma özgürlüklerini kısıtlamaz.
- **İstemcide ödeme duvarı yoktur:** Yerel MongoDB yönetimi, gömülü JavaScript kabuğu, şema zekâsı, yerel salt-okunur MCP sunucusu ve kendi API anahtarınızla (`BYOK` / yerel `Ollama`) yapay zekâ asistanı sonsuza dek ücretsizdir ve {productName} Cloud hesabı gerektirmez.
- **Barındırılan ağ hizmetleri:** Bu Koşullar yalnızca sunucularımızda çalışan çevrimiçi hizmetleri (**{productName} Cloud**: Sıfır-Bilgi şifreli eşitleme, barındırılan WebSocket köprüsü, hesap portalı ve imzalı sürüm dağıtımı) düzenler. Web sitesi kaynak kodu [{siteCodeLicenseName}]({siteCodeLicenseUrl}), site metinleri ise marka adları, logolar ve üçüncü taraf ticari markaları hariç olmak üzere [{siteContentLicenseName}]({siteContentLicenseUrl}) lisanslıdır.

## 2. Hesap Oluşturma, Cihaz Onayı ve Güvenlik

- **Hesap koşulları:** {productName} Cloud hesabı oluşturmak için en az 18 yaşında (veya tabi olduğunuz hukuk sisteminde reşit) olmanız ve doğrulanabilir geçerli bir e-posta adresi sağlamanız gerekir.
- **RFC 8628 Cihaz Onay Akışı:** Masaüstü ve mobil uygulamalar, OAuth 2.0 Device Authorization Grant (RFC 8628) standardıyla `{appUrl}/device` üzerinden hesabınıza bağlanır; her cihaz için ayrı döner yenileme belirteci ve kısa ömürlü `ES256` imzalı yetki belirteci üretilir. Her hesapta aynı anda en fazla **3 aktif cihaz** eşleştirilebilir ve cihazlar `{appUrl}` üzerinden her an iptal edilebilir.
- **Kimlik bilgileri ve Sıfır-Bilgi sorumluluğu:** Hesap parolanızın, TOTP iki aşamalı doğrulama kodlarınızın, eşleştirilmiş cihazlarınızın ve **Sıfır-Bilgi eşitleme parolanızın** güvenliğinden siz sorumlusunuz. Eşitleme şifreleme anahtarı yalnızca cihazınızda (`Argon2id` + `AES-256-GCM`) türetilip sunucularımıza hiç gönderilmediğinden, **eşitleme parolanızı unutmanız hâlinde parolanızı sıfırlamamız veya şifreli verilerinizi kurtarmamız mümkün değildir**.

### 2.1 Ücretsiz Hizmet, Sınırlar ve Pasif Hesaplar

- **Ücretsiz ve olduğu gibi:** {productName} Cloud ücretsiz sunulur. Hizmet, kanunun izin verdiği ölçüde "olduğu gibi" ve "erişilebildiği kadarıyla" sunulur; kesintisizlik, performans veya belirli bir amaca uygunluk garantisi verilmez ve sorumluluğumuz kanunun izin verdiği ölçüde sınırlıdır. Kast ve ağır ihmalden doğan sorumluluk ile emredici tüketici haklarınız saklıdır. Eşitlediğiniz verilerin kendi kopyalarını saklayın.
- **Hesap başına sınırlar:** en fazla 3 aktif cihaz; şifreli eşitlemede her biri en fazla 1 MiB olan 20 koleksiyon ve UTC gününde 500 yükleme (aşan yüklemeler ertesi güne kadar reddedilir); barındırılan köprüde aynı anda bir oturum, oturum başına en fazla 2 saat, 15 dakika trafik olmazsa kapanma ve takvim ayında (UTC) iki yön toplamı 1 GB trafik. Aylık trafik bitince köprü ay sonuna kadar yeni oturum açmaz ve açık oturumu kapatır. Bunlara ek olarak dakika başına istek sınırları uygulanır.
- **Değişiklik ve hizmetin sona ermesi:** Hizmeti sürdürülebilir ve güvenli tutmak için bu sınırları değiştirebilir veya yeni kayıtları geçici olarak durdurabiliriz. Sınırları düşürmeden önce, mümkün olduğunda, fiyat sayfasında ve bu Koşullarda duyururuz. Ücretsiz bir hizmeti makul bir bildirim süresiyle sona erdirebiliriz; verilerinizi her zaman `{appUrl}` üzerinden dışa aktarabilirsiniz ve uygulama bulut olmadan çalışmaya devam eder.
- **Pasif hesaplar:** Bir hesapta 12 ay boyunca hiçbir etkinlik olmazsa (hesaba bağlı hiçbir cihazda uygulama kullanılmaz, portala giriş yapılmaz, yükleme yapılmaz), 11 ayın sonunda doğrulanmış e-posta adresine uyarı gönderilir. Bu arada hesap kullanılmazsa, uyarının teslim edilmesinden 30 gün sonra hesabın şifreli eşitleme verisi silinir. Hesap ve cihazları silinmez; uygulamayı kullanmak ya da giriş yapmak süreyi yeniden başlatır.
- **Tek bir hesabı kısıtlama:** Kötüye kullanım hâlinde tek bir hesabın eşitlemesini veya köprü erişimini kapatabiliriz (Madde 3).

## 3. Kabul Edilebilir Kullanım Kuralları

`{appHost}`, `{apiHost}` veya `{bridgeHost}` hizmetlerini kullanırken aşağıdaki davranışlar **kesinlikle yasaktır**:

- Tek kişilik hesabı birden fazla kişi arasında paylaşmak, köprü bant genişliğini üçüncü kişilere yeniden satmak/aktarmak ya da hesap sınırlarını aşmak amacıyla otomatik veya tek kullanımlık çoklu hesaplar açmak.
- **SSRF, port tarama ve ağ suistimali:** `{bridgeHost}` köprüsünü veya herhangi bir bulut uç noktasını yerel döngü (loopback), özel iç ağ, link-local veya bulut metadata IP aralıklarını (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16` ve IPv6 karşılıkları) taramak/yoklamak için kullanmak, DNS yeniden bağlama (rebinding) saldırısı denemek, barındırılan köprü üzerinden TLS'siz hedeflere bağlanmaya çalışmak veya yetkiniz olmayan üçüncü taraf sistemlere erişim girişiminde bulunmak.
- Hız sınırlarını (rate limit), kriptografik belirteç doğrulamasını veya kotaları aşmaya çalışmak ya da hukuka aykırı/zararlı yükler iletmek.

SSRF, port tarama, kimlik bilgisi deneme saldırıları veya dolandırıcılık gibi ağır güvenlik ihlallerinde bulut uç noktaları otomatik olarak derhâl askıya alınabilir. Acil güvenlik riski taşımayan aykırılıklarda makul bildirim ve düzeltme süresi tanınır.

### 3.1 Barındırılan WebSocket Köprüsü (`{bridgeHost}`)

- **Köprüden geçen veriler:** Barındırılan `{bridgeHost}` hizmeti üzerinden bağlandığınızda MongoDB bağlantı adresiniz (gömülü kimlik bilgileri dâhil), kimlik doğrulama el sıkışmaları ve çalıştırdığınız tüm veritabanı komutları aktarım noktamızdan geçer: istemciniz ile köprü arasında şifreli `wss://`, köprü ile MongoDB sunucunuz arasında TLS bağlantısıyla. Köprü yalnızca WebSocket çerçeveleme katmanını sonlandırır; belge içeriğini, sorgu sonuçlarını veya kimlik bilgilerini incelemez ve saklamaz; aktarılan trafik yalnızca belirttiğiniz hedefe ulaştırmak için kullanılır.
- **Tasarım gereği hedef kısıtları:** Barındırılan köprü genel IP (egress) politikası uygular ve TLS'siz hedefleri reddeder. Yerel döngü, özel ağ, link-local, bulut metadata ve ayrılmış adres aralıklarının yanı sıra `tls=true`/`ssl=true` içermeyen `mongodb://` adresleri reddedilir (`mongodb+srv://` kabul edilir).
- **Kapasite sınırları:** Hesap başına aynı anda bir köprü oturumu açılabilir; oturum en fazla 2 saat sürer, 15 dakika trafik olmazsa kapanır ve hesap başına takvim ayında 1 GB trafik hakkı vardır (Madde 2.1). Köprünün toplam eşzamanlı oturum sayısı da sınırlıdır; köprü doluyken yeni oturum reddedilebilir. Bu sınırları aşmaya çalışmak Madde 3 kapsamında kota suistimali sayılır; bu durumda hesabın köprü erişimini kapatabiliriz ve açık oturumu yaklaşık bir dakika içinde sona erer.
- **İşletim günlükleri:** Oturum kimlik doğrulama sonuçları ve reddedilen hedeflerin alan adları (asla kimlik bilgileri, tam bağlantı adresleri veya veritabanı içerikleri değil) [Gizlilik Politikası]({privacyPath}) kapsamında işletim günlüklerinde yer alabilir; aylık trafik sayacı da orada (Madde 4.3) anlatılır.
- **Kendi altyapınızda alternatif:** Aynı açık kaynaklı köprüyü özel veya TLS'siz hedeflere karşı kendi sorumluluğunuzda kendiniz barındırabilirsiniz (`{appRepoUrl}`); bu maddedeki kısıtlar yalnızca barındırılan `{bridgeHost}` hizmeti için geçerlidir.

## 4. Veritabanı Güvenliği ve Yapay Zekâ Asistanı

- **Veritabanı yönetim riski ve yedekleme yükümlülüğü:** {productName}, bağlandığınız MongoDB sunucuları üzerinde doğrudan gerçek komutlar ve JavaScript betikleri çalıştırır (`dropDatabase`, `deleteMany`, indeks işlemleri dâhil). **MongoDB sunucularınızda düzenli ve test edilmiş bağımsız yedekler almak, en az yetki prensibiyle veritabanı rolleri tanımlamak ve üretim verisini korumak münhasıran sizin sorumluluğunuzdadır.**
- **Yapay zekâ çıktılarının kontrolü:** Yapay zekâ asistanının (kendi anahtarınızla, OpenAI uyumlu bir uç noktayla ya da yerel modelle) ürettiği MQL sorguları, aggregation boru hatları ve indeks önerileri yardımcı niteliktedir ve hata içerebilir; her komutu canlı veritabanında çalıştırmadan önce incelemek ve doğrulamak kullanıcının sorumluluğundadır.
- **Yapay zekâ uç noktasını siz seçersiniz:** {productName} bir yapay zekâ hizmeti işletmez. Yapılandırdığınız sağlayıcı ya da sunucu, kendi koşullarına tabi bir üçüncü taraf ya da kendi barındırdığınız hizmettir; erişilebilirliği, verileri işleme biçimi ve kullanım ücretleri sizinle o sağlayıcı arasındadır.

## 5. Fikri Mülkiyet ve MongoDB Ticari Marka Bildirimi

- **İşletmeci markası ve kullanıcı verisi:** {productName} adı, iki tonlu yazı logosu ve çiçek amblemi işletmecinin ayırt edici işaretleridir; `{appLicenseName}` veya `{siteCodeLicenseName}` lisansları üçüncü kişilere bu markaları kendi ürün adlarında kullanma hakkı vermez. Veritabanı şemalarınız, sorgularınız, betikleriniz ve eşitlediğiniz içeriklerin tüm mülkiyeti size aittir.
- **Üçüncü taraf ticari markaları:** {trademarkNotice} Ayrıntılar için [Marka Bildirimi]({trademarkPath}) sayfasına bakabilirsiniz.

## 6. Uygulanacak Hukuk ve Uyuşmazlıkların Çözümü

Bu Koşullara ve işletmeci ile doğrudan kurulan sözleşmelere Türkiye Cumhuriyeti hukuku uygulanır (yurt dışındaki tüketicilerin mutad mesken hukukundan doğan emredici tüketici korumaları saklıdır). Türkiye'deki tüketiciler, uyuşmazlık tutarına göre Ticaret Bakanlığı'nca her yıl ilan edilen parasal sınırlar dâhilinde yerleşim yerlerindeki veya işlemin yapıldığı yerdeki **İl veya İlçe Tüketici Hakem Heyetlerine**, bu sınırları aşan uyuşmazlıklarda ise **Tüketici Mahkemelerine** başvurabilirler.
