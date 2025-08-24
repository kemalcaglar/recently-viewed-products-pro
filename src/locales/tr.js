export default {
  // Genel
  general: {
    title: 'Recently Viewed Products Widget',
    subtitle: 'Müşterilerinizin en son görüntülediği ürünleri gösterin ve satışları artırın',
    saveSettings: 'Ayarları Kaydet',
    preview: 'Önizleme',
    success: 'Başarılı!',
    error: 'Hata!',
    settingsSaved: 'Widget ayarları başarıyla kaydedildi.',
    settingsError: 'Ayarlar kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.'
  },

  // Tab'lar
  tabs: {
    general: 'Genel',
    appearance: 'Görünüm',
    advanced: 'Gelişmiş',
    analytics: 'Analitik',
    pages: 'Sayfalar'
  },

  // Genel Tab
  generalTab: {
    title: 'Widget Ayarları',
    showWidget: 'Widget\'ı Göster',
    showWidgetLabel: 'Enable recently viewed products widget',
    position: 'Widget Konumu',
    positionLabel: 'Widget\'ın sayfadaki konumu',
    positionOptions: {
      right: 'Sağ Kenar',
      left: 'Sol Kenar',
      bottom: 'Alt Kenar',
      top: 'Üst Kenar'
    },
    maxProducts: 'Maximum Product Count',
    maxProductsLabel: 'Maximum number of products to display',
    maxProductsCurrent: 'Current: {count} products',
    widgetTitle: 'Widget Title',
    widgetTitleLabel: 'Title to display in widget',
    widgetTitlePlaceholder: 'Recently Viewed Products'
  },

  // Görünüm Tab
  appearanceTab: {
    themeTitle: 'Tema Ayarları',
    primaryColor: 'Ana Renk',
    primaryColorDescription: 'Butonlar, yazılar ve vurgular için kullanılır',
    backgroundColor: 'Arka Plan Rengi',
    backgroundColorDescription: 'Widget\'ın arka plan rengi',
    fontSize: 'Yazı Boyutu',
    fontSizeLabel: 'Yazı boyutu (px)',
    fontSizeCurrent: 'Şu anda: {size}px',
    fontFamily: 'Yazı Tipi',
    fontFamilyLabel: 'Yazı tipi ailesi',
    fontOptions: {
      arial: 'Arial',
      helvetica: 'Helvetica',
      georgia: 'Georgia',
      times: 'Times New Roman',
      verdana: 'Verdana'
    },
    displayOptions: 'Görünüm Seçenekleri',
    showPrice: 'Ürün fiyatlarını göster',
    showCategory: 'Ürün kategorilerini göster',
    animationSpeed: 'Animation Speed',
    animationSpeedLabel: 'Animasyon süresi (ms)',
    animationSpeedCurrent: 'Şu anda: {speed}ms'
  },

  // Gelişmiş Tab
  advancedTab: {
    title: 'Advanced Settings',
    autoHide: 'Otomatik gizleme',
    autoHideDescription: 'Widget belirli süre sonra otomatik olarak gizlenir',
    hideDelay: 'Gizleme Gecikmesi',
    hideDelayLabel: 'Gizleme gecikmesi (ms)',
    hideDelayCurrent: 'Şu anda: {delay}ms',
    enableA11y: 'Erişilebilirlik özelliklerini etkinleştir',
    a11yDescription: 'Screen reader desteği ve klavye navigasyonu',
    enableDarkMode: 'Karanlık mod desteği',
    darkModeDescription: 'Sistem karanlık mod ayarlarına uyum sağlar'
  },

  // Analitik Tab
  analyticsTab: {
    title: 'Analitik ve İzleme',
    enableAnalytics: 'Analitik verileri topla',
    analyticsDescription: 'Widget kullanım verilerini ve ürün görüntüleme istatistiklerini toplar',
    analyticsActive: 'Analitik Aktif',
    analyticsActiveDescription: 'Widget kullanım verileri toplanıyor. Bu veriler mağaza performansını artırmak için kullanılır.',
    exportData: 'Verileri Export Et',
    clearData: 'Verileri Temizle',
    generalStats: 'Genel İstatistikler',
    totalProducts: 'Toplam Ürün',
    totalViews: 'Toplam Görüntüleme',
    averageTime: 'Ortalama Süre',
    activeDevices: 'Aktif Cihaz',
    topProducts: 'En Popüler Ürünler',
    noDataYet: 'Henüz veri toplanmamış',
    noDataDescription: 'Ürün sayfalarında gezinerek veri toplamaya başlayın',
    dailyStats: 'Günlük İstatistikler (Son 7 Gün)',
    dailyNoData: 'Günlük veriler henüz mevcut değil',
    dailyNoDataDescription: 'Zaman içinde günlük istatistikler görünecek'
  },

  // Sayfalar Tab
  pagesTab: {
    title: 'Sayfa Görünürlük Ayarları',
    description: 'Widget\'ın hangi sayfalarda görüneceğini belirleyin',
    mainPages: 'Main Pages',
    homepage: 'Anasayfa',
    productPages: 'Ürün Sayfaları',
    collectionPages: 'Koleksiyon Sayfaları',
    contentPages: 'Content Pages',
    blogPages: 'Blog Sayfaları',
    articlePages: 'Makale Sayfaları',
    staticPages: 'Statik Sayfalar (Hakkımızda, İletişim vb.)',
    searchPages: 'Arama Sayfası',
    shoppingPages: 'Shopping Pages',
    cartPage: 'Sepet Sayfası',
    checkoutPages: 'Ödeme Sayfaları',
    checkoutDisabled: 'Ödeme sayfalarında widget gösterilmesi önerilmez',
    customerPages: 'Müşteri Sayfaları'
  },

  // Widget Preview
  preview: {
    title: 'Widget Önizleme',
    description: 'Widget\'ın nasıl görüneceğini buradan önizleyebilirsiniz',
    demoProduct: 'Demo Ürün',
    demoProductDescription: 'Bu bir demo ürün sayfasıdır',
    productImage: 'Ürün Görseli',
    visitStore: 'Mağazayı Ziyaret Et',
    themeEditor: 'Tema Düzenleyici',
    demoProducts: [
      { title: 'Demo Ürün 1', price: '₺99.99' },
      { title: 'Demo Ürün 2', price: '₺149.99' },
      { title: 'Demo Ürün 3', price: '₺199.99' }
    ]
  }
}
