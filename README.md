# FocusFlow - Pomodoro Odaklanma Eklentisi

## Amaç

FocusFlow, Pomodoro tekniğini kullanarak kullanıcıların odaklanmasına yardımcı olan bir Chrome eklentisidir. Odaklanma süresi boyunca dikkat dağıtıcı web sitelerini (YouTube, Twitter, Instagram vb.) otomatik olarak engeller. Bu sayede kullanıcılar daha verimli çalışabilir ve dikkatlerini dağıtmaz.

## Özellikler

- **Pomodoro Timer**: 25 dakika odaklanma, 5 dakika kısa mola, her 4. pomodoro'da 15 dakika uzun mola.
- **Özelleştirilebilir Süreler**: Kullanıcı ayarlarından odak, kısa mola ve uzun mola sürelerini değiştirebilir.
- **Özelleştirilebilir Engellenen Siteler**: Kullanıcı kendi engellemek istediği siteleri ekleyebilir veya çıkarabilir. Varsayılan olarak YouTube, Twitter, Instagram, TikTok, Facebook, LinkedIn, Reddit, Pinterest ve Snapchat engellenir.
- **İstatistikler**: Toplam pomodoro sayısı, toplam odak süresi ve engellenen girişimleri takip eder.
- **Site Engelleme**: Odaklanma sırasında belirli sitelere erişimi engeller ve motive edici uyarı sayfası gösterir.
- **Bildirimler**: Pomodoro tamamlandığında bildirim gönderir.
- **Sekmeli Arayüz**: Timer, ayarlar, siteler ve istatistikler için ayrı sekmeler.
- **Ayarlar Kaydetme**: Süreler ve siteler Chrome storage'da saklanır.

## Nasıl Çalışır

1. **Kurulum**: Eklentiyi Chrome'da yükleyin (chrome://extensions/ > Geliştirici modu açık > Paketlenmemiş uzantıyı yükle).
2. **Kullanım**:
   - Popup'ı açın.
   - "Timer" sekmesinde "Başlat" butonuna tıklayın.
   - Odaklanma süresi boyunca engellenen sitelere gittiğinizde uyarı sayfası görürsünüz.
   - Süre dolunca otomatik olarak mola moduna geçer.
3. **Ayarlar**: "Ayarlar" sekmesinden süreleri değiştirin ve kaydedin.

## Teknik Detaylar

- **Manifest V3**: Modern Chrome eklenti standardı.
- **İzinler**: Storage (ayarlar için), Tabs/WebNavigation (site engelleme için), Notifications (bildirimler için).
- **Dosyalar**:
  - `background.js`: Site engelleme ve bildirim mantığı.
  - `popup.html/popup.js`: Kullanıcı arayüzü ve timer.
  - `blocked.html`: Engellenen sitelerde gösterilen sayfa.
  - `styles.css`: Stil dosyası.
  - `Readme.md`: Açıklama dosyası.
## Geliştirme
Kodları düzenledikten sonra eklentiyi yeniden yükleyin. Test için farklı sitelere gidin ve timer'ı çalıştırın.