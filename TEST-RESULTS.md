# Son doğrulama sonuçları

Tarih: 24 Ekim 2026. Bilgisayarın yeniden başlatılmasının ardından kişiselleştirilmiş son sürüm kontrol edildi.

## Başarılı kontroller

- `npm run lint`: sıfır hata, sıfır uyarı.
- TypeScript: üretim build'i içindeki `tsc -b` kontrolü başarılı.
- `npm run build`: hem `/` hem `/personal-portfolio/` temel yoluyla başarılı. Teslim edilen `dist/`, kök adres için hazırlandı.
- `npm test`: **12/12 başarılı**; 6 masaüstü ve 6 dokunmatik mobil emülasyon testi.
- Kişisel isim, iletişim, akademik bilgiler, GNO, 23 teknoloji ve iki staj kaydı doğrulandı.
- Türkçe/İngilizce bölüm metinleri, dil tercihinin korunması ve dile uygun CV yolu doğrulandı.
- Beş gerçek proje ekran görüntüsü yükleniyor; kategori filtreleri, canlı adresler ve detay hash bağlantıları çalışıyor.
- Detay sayfasında yenileme, Escape ve klavye odağının açan öğeye dönmesi başarılı.
- Türkçe CV'nin tarayıcıdan indirilip dosyaya kaydedilmesi masaüstü ve mobil testlerinde başarılı.
- Türkçe ve İngilizce PDF'ler HTTP 200 döndürüyor, PDF dosya imzaları doğrulandı.
- Ayrı indirme kontrolünde Edge ve Chrome ile Türkçe CV'nin gerçek indirmesi başarılı.
- 320, 375, 390, 768, 1024, 1280, 1440, 1920 piksel genişliklerde iki dilde sayfa ve ana başlık taşması yok.
- `prefers-reduced-motion` tercihi doğrulandı.
- İki dilde altı bölüm, proje detayı ve mobil menü üzerinde axe WCAG A/AA otomatik denetimlerinde **0 ihlal**.
- `npm run verify:production`: kök ve proje alt yolunda altı bölüm, yerel görseller, iki PDF, İngilizce detay bağlantısı, yenileme ve Escape başarılı. JavaScript ve HTTP hatası yok.

## Görsel kontrol

Türkçe ve İngilizce CV'ler tek sayfa olarak render edilip incelendi; Türkçe karakterler, hizalama ve bağlantılı metinler doğrulandı. Son site ekran görüntülerinde masaüstü ana sayfa, proje kartları, eğitim/deneyim ve mobil İngilizce ana sayfa/iletişim incelendi. İki dilde tüm bölüm ekran görüntüleri `test-results/` altında bulunur.

## Sınırlar ve çalışma durumu

- Lighthouse ölçülmedi; puan iddia edilmez.
- Mobil testler Microsoft Edge/Chromium üzerinde emülasyondur; fiziksel iPhone/Safari veya ekran okuyucu ile manuel test değildir.
- Kullanıcı paylaşmadığı için proje teknoloji yığınları, katkı detayları, eğitim başlangıç tarihi veya Giga görev unvanı uydurulmadı.
- Blog ve yabancı dil yetkinliği bölümü sitede yoktur. Site dili için TR/EN seçimi vardır.
- Yayın, Git push veya repository oluşturma işlemi yapılmadı.
- 5187 portundaki portfolyo geliştirme sunucusu yeniden açıldı ve çalışır bırakıldı. Testler 5191 ve 5188 portlarındaki yalnızca kendilerine ait geçici sunucuları kapattı.
- Başka projelerin dosyaları, depoları, paketleri ve servisleri değiştirilmedi.
