# Künye ve Yasal Bildirim

Bu Künye ve Yasal Bildirim sayfası; 5651 sayılı Kanun, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve uluslararası elektronik ticaret şeffaflık standartları uyarınca [{domain}]({siteUrl}) web sitesi ile {productName} yazılım ve hizmetlerine ilişkin işletmeci kimliğini, resmi iletişim kanallarını, sorumlu güvenlik bildirimi sürecini ve açık kaynak lisans bilgilerini içerir.

## 1. Hizmet Sağlayıcı ve Ticari Sicil Bilgileri

| Alan | Bilgi |
| --- | --- |
| **Hizmet Sağlayıcı / İşletmeci** | {legalEntity} |
| **Konum** | {legalAddress} |
| **Ticari Durum** | Ticari faaliyet / ücretli satış yoktur (ücretsiz bireysel açık kaynak proje) |
| **Birincil Alan Adları** | `{domain}`, `{appHost}`, `{apiHost}`, `{dlHost}`, `{demoHost}` |
| **Son Güncelleme Tarihi** | {draftDate} |

## 2. Resmi İletişim Kanalları

- **Genel Destek:** {supportContact}
- **Gizlilik, KVKK ve GDPR Başvuruları:** {privacyContact} (bkz. [Gizlilik Politikası]({privacyPath}))
- **Açık Hata ve Özellik Takip Sistemi (Issue Tracker):** [{issuesUrl}]({issuesUrl})

Lütfen herkese açık hata kayıtlarında veritabanı parolası, SSH anahtarı, özel bağlantı dizgesi, API anahtarları veya henüz yamalanmamış güvenlik açığı ayrıntısı paylaşmayın.

## 3. Güvenlik Açığı Bildirimi

{productName} istemcisi, MCP sunucusu, web sitesi ve bulut altyapısına yönelik sorumlu güvenlik araştırmalarını memnuniyetle karşılıyoruz:

- **RFC 9116 `security.txt`:** [{securityTxtPath}]({securityTxtPath}) (`{securityTxtUrl}`)
- **Koordineli açıklama süresi:** İlk teyitten itibaren 90 gün.
- **Bildirim yöntemi:** Güvenlik açıklarını herkese açık ortamda paylaşmadan [{securityTxtPath}]({securityTxtPath}) ve `SECURITY.md` yönergeleri doğrultusunda özel olarak {securityContact} adresine veya GitHub Security Advisories üzerinden bildirin; talep hâlinde PGP/`age` şifreleme anahtarı sağlanır.

## 4. Açık Kaynak Depoları ve Lisans Bilgileri

- **{productName} Masaüstü, Mobil ve WebAssembly İstemci (`{productId}`, `{productId}-mcp` ve `{demoHost}`):**
  - Kaynak kodu deposu: [{appRepoUrl}]({appRepoUrl})
  - Lisans: **[{appLicenseName}]({appLicenseUrl})** (GNU Genel Kamu Lisansı Sürüm 3.0)
  - Atıf: {productName} açık kaynaklıdır; tüm üçüncü taraf lisans bildirimleri ve Qt LGPLv3/GPLv3 yükümlülükleri her kurulum paketinin ve WebAssembly paketinin içinde (`THIRD-PARTY-NOTICES.txt` ve `licenses/`) sunulur.
- **{productName} Web Sitesi (`{domain}`):**
  - Kaynak kodu deposu: [{siteRepoUrl}]({siteRepoUrl})
  - Kod lisansı: **[{siteCodeLicenseName}]({siteCodeLicenseUrl})**
  - Belge ve metin içeriği lisansı: **[{siteContentLicenseName}]({siteContentLicenseUrl})** *({productName} adı, yazı logosu, çiçek amblemi ve üçüncü taraf ticari markaları hariçtir)*

## 5. Ticari Markalar

{trademarkNotice}

Tanımlayıcı kullanım ve marka kurallarına ilişkin ayrıntılar için [Marka Bildirimi]({trademarkPath}) sayfasını inceleyebilirsiniz.
