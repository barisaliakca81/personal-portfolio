# Barış Ali AKÇA | Frontend Developer

React, Vite, TypeScript ve Tailwind CSS ile hazırlanmış statik kişisel portfolyo. Türkçe ve İngilizce arayüz, altı bölüm, beş gerçek proje önizlemesi ve iki dilde PDF CV içerir. Blog ve yabancı dil yetkinliği bölümü bulunmaz.

## Proje izolasyonu

Tüm dosyalar bu bağımsız klasördedir: `C:\Users\baris\Desktop\barisaliakca\personal-portfolio`. Paket önbelleği `.npm-cache/`, geçici dosyalar `.tmp/`, test çıktıları `test-results/` içinde tutulur. Başka projelerden dosya veya yapılandırma alınmadı. Başka projelerin servislerini yöneten bir komut yoktur. Git deposu veya uzak repository oluşturulmadı; site yayınlanmadı.

## Yerelde çalıştırma

Node.js 24 ve npm gereklidir. PowerShell:

```powershell
cd C:\Users\baris\Desktop\barisaliakca\personal-portfolio
New-Item -ItemType Directory -Path .tmp -Force
$env:TEMP = Join-Path (Get-Location) '.tmp'
$env:TMP = $env:TEMP
# Bağımlılıklar zaten kurulu. Yeni kurulum gerekirse:
npm ci
npm run dev
```

Adres: [http://127.0.0.1:5187/](http://127.0.0.1:5187/). Bilgisayar yeniden başladığında bu sunucu da kapanır; tekrar `npm run dev` çalıştırın. Sunucu dolu bir portu kullanan başka işlemi durdurmaz; hata vererek çıkar.

```powershell
npm run lint
npm run typecheck
npm run build
npm test
npm run verify:production
```

`dist/` statik üretim çıktısıdır. `npm run preview`, bu çıktıyı 5187 portunda açar; aynı porttaki `dev` ile eşzamanlı çalıştırılmaz. Tarayıcı testleri kendi sunucusunu **5191** portunda, üretim kontrolü **5188** portunda açıp kapatır. Açık olan 5187 geliştirme sunucusu korunur.

## İçerik ve dil yönetimi

| Dosya / alan | İçerik |
| --- | --- |
| `src/data/portfolio.ts` | Kişisel bilgilerin tek kaynağı |
| `name`, `firstName`, `lastName`, `title` | İsim ve mesleki unvan |
| `location`, `introduction`, `biography` | Türkçe ve İngilizce konum / tanıtım |
| `education`, `experience` | Eğitim, GNO, staj tarihleri ve kurumlar |
| `skillGroups` | Kullanıcının bildirdiği 23 teknoloji ve araç |
| `projects` | Gerçek çalışmaların adresleri, açıklamaları ve görselleri |
| `email`, `socialLinks` | E-posta, GitHub ve LinkedIn |
| `cvPath.tr`, `cvPath.en` | Dil seçimine göre PDF yolları |
| `src/data/translations.ts` | Menü, buton, bölüm ve erişilebilirlik metinleri |
| `src/data/sections.ts` | Altı bölümün navigasyonu |

TR / EN düğmeleri bütün arayüzü ve CV bağlantısını değiştirir. Tercih localStorage içinde saklanır. `?lang=tr` veya `?lang=en` açık seçimleri kayıtlı tercihin önüne geçer. Örneğin `/?lang=en#ozgecmis`. Proje detayları `/?lang=en#/proje/cilltech` biçimindeki hash adresleriyle açılır; statik sunucuda yenileme 404 üretmez.

Giga Yazılım için görev unvanı ve sorumluluklar paylaşılmadığından yalnızca “Staj” yazıldı. Eğitim başlangıç yılı ve GNO paydası varsayılmadı. Projelere ait teknoloji yığınları ve katkı ayrıntıları paylaşılmadığından `technologies` dizileri boş bırakıldı. Sahte uzmanlık yüzdeleri veya başarı metrikleri eklenmedi.

## Proje önizlemeleri

Beş karttaki görseller, kullanıcının verdiği canlı adreslerin gerçek ana sayfa ekran görüntüleridir. Görseller `public/images/projects/` içinde yereldir; ziyaretçiler için üçüncü taraf iframe veya görüntü servisi yüklenmez. Kart görselleri lazy loading kullanır. Büyütülmüş detay ve canlı site bağlantıları ayrıdır.

Önizlemeleri yeniden çekmek için `node scripts/capture-projects.mjs` komutu kullanılabilir. Yalnızca seçili projeleri güncellemek için örneğin `node scripts/capture-projects.mjs estedore hillora`. Ağ erişimi ve sistemde Microsoft Edge gerekir. Script geçici tarayıcı profili kullanır; canlı sitelerde içerik değiştirmez.

## CV dosyaları

- `public/cv/baris-ali-akca-cv-tr.pdf`
- `public/cv/baris-ali-akca-cv-en.pdf`

İkisi de kullanıcı tarafından verilen bilgilerden hazırlanmış, metin seçilebilir ve bağlantıları tıklanabilir tek sayfalık özgeçmişlerdir. Fotoğraf, sertifika, yabancı dil veya belirtilmemiş sorumluluk eklenmedi.

CV içeriğini güncellemek için önce `src/data/portfolio.ts` dosyasını düzenleyin. Sonra `node scripts/export-cv-data.mjs` ve ReportLab + pypdf kurulu Python ile `python scripts/create-cv.py` çalıştırın. Üretici Windows Arial fontlarını kullanır. Paketler sistem geneline kurulmaz; gerekirse proje içinde ayrı ortam kullanın. Üretilen PDF'leri teslimden önce render ederek kontrol edin.

## Erişilebilirlik ve kontroller

Yerel CSS Scroll Snap masaüstünde `proximity` modundadır; mobilde normal kaydırma kullanılır. Uzun bölümler içerikle büyür. Mouse wheel veya dokunma engellenmez. IntersectionObserver aktif bölümü ve görünüm geçişlerini yönetir. `prefers-reduced-motion` animasyonları kapatır. Fontlar yerel WOFF2 dosyalarıdır.

`npm test`, sistemdeki Microsoft Edge ile masaüstü ve dokunmatik mobil emülasyonda 12 test çalıştırır. Yeni tarayıcı yüklemez; mevcut kişisel tarayıcı profilini kullanmaz. PDF indirme, iki dilin kalıcılığı, içerik doğruluğu, beş önizleme, proje filtreleri, detay bağlantılarında yenileme, odak yönetimi, mobil menü, 320–1920 piksel taşma ve axe WCAG AA denetimleri kapsanır. Gerçek iPhone/Safari ve ekran okuyucu ile manuel test yapılmış sayılmaz. Lighthouse puanı ölçülmedi.

Son sonuçlar `TEST-RESULTS.md` dosyasındadır.

## GitHub Pages

Yayınlama kararı size aittir; bu görevde repository oluşturma, push veya deployment yapılmadı.

1. GitHub'da yeni ve boş bir public depo oluşturun. Kök adres için `barisaliakca81.github.io`, proje adresi için `personal-portfolio` gibi bir depo adı kullanılabilir.
2. Yalnızca bu yeni proje klasöründe `git init`, `git add .`, `git commit -m "Initial portfolio"`, `git branch -M main` işlemlerini kendiniz uygulayın; yeni deponuzun adresini `origin` olarak ekleyip gönderin.
3. Depoda **Settings → Pages → Source → GitHub Actions** seçin.
4. **Actions → Deploy portfolio to GitHub Pages → Run workflow** ile başlatın. Sonraki `main` push işlemleri otomatik build ve yayın yapar.

`.github/workflows/deploy.yml`, lint ve TypeScript kontrolünden sonra build alır; Pages yapılandırmasından `base_path` okuyup `VITE_BASE_PATH` değerini otomatik ayarlar. Kök depo için `/`, proje deposu için `/personal-portfolio/` kullanılır.

Alt yol kontrolü:

```powershell
$env:VITE_BASE_PATH = '/personal-portfolio/'
npm run build
npm run verify:production
Remove-Item Env:VITE_BASE_PATH
# Son teslim çıktısını yeniden kök adrese hazırlamak için:
npm run build
```

Domain satın alınmadığından DNS ve CNAME yapılandırılmadı. Yayın adresi kesinleştiğinde `index.html` içine canonical ve `og:url` ekleyin; sosyal ağ uyumluluğu için kişiselleştirilmiş `og-cover.svg` yerine 1200×630 PNG/JPEG paylaşım görseli ve tam HTTPS adresini kullanın.

Başvuru: [Vite statik dağıtım](https://vite.dev/guide/static-deploy.html), [GitHub Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).