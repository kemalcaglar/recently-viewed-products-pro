/**
 * Ürün Analitik Sistemi
 * Bu dosya ürün görüntüleme verilerini toplar ve raporlar
 */

// Analitik veri yapısı
const ANALYTICS_DATA = {
  productViews: {},        // Ürün görüntüleme sayıları
  viewDuration: {},        // Görüntüleme süreleri
  pageTransitions: [],     // Sayfa geçişleri
  deviceInfo: {},          // Cihaz bilgileri
  sessionData: {},         // Oturum verileri
  timestamp: Date.now()
};

// Cihaz bilgilerini topla
const getDeviceInfo = () => ({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  screenResolution: `${screen.width}x${screen.height}`,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  timestamp: Date.now()
});

// Sayfa görüntüleme süresini hesapla
class PageViewTracker {
  constructor() {
    this.startTime = Date.now();
    this.productId = null;
    this.isTracking = false;
  }

  startTracking(productId) {
    this.productId = productId;
    this.startTime = Date.now();
    this.isTracking = true;

    // Sayfa kapanmadan önce veriyi kaydet
    window.addEventListener('beforeunload', () => {
      this.stopTracking();
    });

    // Sayfa gizlendiğinde veriyi kaydet
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopTracking();
      } else {
        this.startTracking(productId);
      }
    });
  }

  stopTracking() {
    if (!this.isTracking || !this.productId) return;

    const duration = Date.now() - this.startTime;
    const viewData = {
      productId: this.productId,
      duration: duration,
      timestamp: Date.now(),
      sessionId: this.getSessionId()
    };

    // Veriyi localStorage'a kaydet
    this.saveViewData(viewData);

    // Server'a gönder (opsiyonel)
    this.sendToServer(viewData);

    this.isTracking = false;
    this.productId = null;
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  saveViewData(viewData) {
    const analytics = JSON.parse(localStorage.getItem('product_analytics') || '{}');

    if (!analytics.productViews[viewData.productId]) {
      analytics.productViews[viewData.productId] = {
        totalViews: 0,
        totalDuration: 0,
        averageDuration: 0,
        lastViewed: null,
        viewHistory: []
      };
    }

    const product = analytics.productViews[viewData.productId];
    product.totalViews++;
    product.totalDuration += viewData.duration;
    product.averageDuration = Math.round(product.totalDuration / product.totalViews);
    product.lastViewed = viewData.timestamp;
    product.viewHistory.push({
      duration: viewData.duration,
      timestamp: viewData.timestamp,
      sessionId: viewData.sessionId
    });

    // Son 100 görüntülemeyi tut
    if (product.viewHistory.length > 100) {
      product.viewHistory = product.viewHistory.slice(-100);
    }

    localStorage.setItem('product_analytics', JSON.stringify(analytics));
  }

  async sendToServer(viewData) {
    try {
      // Shopify App Bridge üzerinden veri gönder
      if (window.shopify && window.shopify.config) {
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Shop-Domain': window.shopify.config.shopOrigin
          },
          body: JSON.stringify(viewData)
        });

        if (response.ok) {
          console.log('Analitik veri server\'a gönderildi');
        }
      }
    } catch (error) {
      console.error('Analitik veri gönderilemedi:', error);
    }
  }
}

// Sayfa geçişlerini takip et
class PageTransitionTracker {
  constructor() {
    this.currentPage = window.location.pathname;
    this.transitions = [];
    this.startTime = Date.now();
  }

  trackTransition(newPage) {
    const transition = {
      from: this.currentPage,
      to: newPage,
      duration: Date.now() - this.startTime,
      timestamp: Date.now()
    };

    this.transitions.push(transition);
    this.currentPage = newPage;
    this.startTime = Date.now();

    // localStorage'a kaydet
    this.saveTransitions();
  }

  saveTransitions() {
    const analytics = JSON.parse(localStorage.getItem('product_analytics') || '{}');
    analytics.pageTransitions = this.transitions.slice(-50); // Son 50 geçişi tut
    localStorage.setItem('product_analytics', JSON.stringify(analytics));
  }
}

// Analitik raporları oluştur
class AnalyticsReporter {
  constructor() {
    this.analytics = this.loadAnalytics();
  }

  loadAnalytics() {
    return JSON.parse(localStorage.getItem('product_analytics') || '{}');
  }

  // En popüler ürünler
  getTopProducts(limit = 10) {
    const products = Object.entries(this.analytics.productViews || {})
      .map(([id, data]) => ({
        id,
        ...data
      }))
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, limit);

    return products;
  }

  // En uzun süre görüntülenen ürünler
  getMostEngagedProducts(limit = 10) {
    const products = Object.entries(this.analytics.productViews || {})
      .map(([id, data]) => ({
        id,
        ...data
      }))
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, limit);

    return products;
  }

  // Günlük görüntüleme istatistikleri
  getDailyStats(days = 7) {
    const stats = {};
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = 0; i < days; i++) {
      const date = new Date(now - (i * dayMs));
      const dateStr = date.toISOString().split('T')[0];
      stats[dateStr] = {
        totalViews: 0,
        uniqueProducts: 0,
        averageDuration: 0
      };
    }

    // Ürün verilerini günlere göre grupla
    Object.values(this.analytics.productViews || {}).forEach(product => {
      product.viewHistory.forEach(view => {
        const dateStr = new Date(view.timestamp).toISOString().split('T')[0];
        if (stats[dateStr]) {
          stats[dateStr].totalViews++;
          stats[dateStr].averageDuration += view.duration;
        }
      });
    });

    // Ortalama süreleri hesapla
    Object.values(stats).forEach(day => {
      if (day.totalViews > 0) {
        day.averageDuration = Math.round(day.averageDuration / day.totalViews);
      }
    });

    return stats;
  }

  // Cihaz istatistikleri
  getDeviceStats() {
    const deviceInfo = this.analytics.deviceInfo || {};
    const stats = {
      platforms: {},
      screenResolutions: {},
      languages: {},
      timezones: {}
    };

    Object.values(deviceInfo).forEach(info => {
      // Platform
      const platform = info.platform || 'Unknown';
      stats.platforms[platform] = (stats.platforms[platform] || 0) + 1;

      // Ekran çözünürlüğü
      const resolution = info.screenResolution || 'Unknown';
      stats.screenResolutions[resolution] = (stats.screenResolutions[resolution] || 0) + 1;

      // Dil
      const language = info.language || 'Unknown';
      stats.languages[language] = (stats.languages[language] || 0) + 1;

      // Zaman dilimi
      const timezone = info.timezone || 'Unknown';
      stats.timezones[timezone] = (stats.timezones[timezone] || 0) + 1;
    });

    return stats;
  }

  // Genel istatistikler
  getGeneralStats() {
    const products = Object.values(this.analytics.productViews || {});

    return {
      totalProducts: products.length,
      totalViews: products.reduce((sum, p) => sum + p.totalViews, 0),
      totalDuration: products.reduce((sum, p) => sum + p.totalDuration, 0),
      averageViewsPerProduct: products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.totalViews, 0) / products.length) : 0,
      averageDurationPerView: products.reduce((sum, p) => sum + p.totalDuration, 0) / products.reduce((sum, p) => sum + p.totalViews, 0) || 0
    };
  }

  // Export fonksiyonu
  exportData() {
    const data = {
      ...this.analytics,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product_analytics_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Veriyi temizle
  clearData() {
    localStorage.removeItem('product_analytics');
    this.analytics = {};
  }
}

// Global instance'lar
export const pageViewTracker = new PageViewTracker();
export const pageTransitionTracker = new PageTransitionTracker();
export const analyticsReporter = new AnalyticsReporter();

// Utility fonksiyonlar
export const trackProductView = (productId) => {
  pageViewTracker.startTracking(productId);
};

export const trackPageTransition = (newPage) => {
  pageTransitionTracker.trackTransition(newPage);
};

export const getAnalytics = () => {
  return analyticsReporter.loadAnalytics();
};

export const getTopProducts = (limit) => {
  return analyticsReporter.getTopProducts(limit);
};

export const getDailyStats = (days) => {
  return analyticsReporter.getDailyStats(days);
};

export const exportAnalytics = () => {
  analyticsReporter.exportData();
};

// Otomatik başlatma
document.addEventListener('DOMContentLoaded', () => {
  // Cihaz bilgilerini kaydet
  const deviceInfo = getDeviceInfo();
  const analytics = JSON.parse(localStorage.getItem('product_analytics') || '{}');
  analytics.deviceInfo = deviceInfo;
  localStorage.setItem('product_analytics', JSON.stringify(analytics));

  // Sayfa geçişlerini takip et
  let currentPage = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== currentPage) {
      trackPageTransition(window.location.pathname);
      currentPage = window.location.pathname;
    }
  }, 1000);
});
