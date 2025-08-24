/**
 * Recently Viewed Products Tracker
 * Bu dosya müşterilerin görüntülediği ürünleri takip eder
 */

const STORAGE_KEY = 'recentlyViewedProducts';
const MAX_PRODUCTS = 10;

/**
 * Ürün bilgilerini alır ve geçmişe ekler
 * @param {Object} product - Ürün bilgileri
 * @param {string} product.id - Ürün ID'si
 * @param {string} product.title - Ürün başlığı
 * @param {string} product.image - Ürün resmi
 * @param {string} product.url - Ürün URL'i
 * @param {number} product.price - Ürün fiyatı
 */
export const trackProduct = (product) => {
  try {
    // Mevcut ürünleri al
    const existingProducts = getRecentProducts();

    // Aynı ürün varsa kaldır
    const filteredProducts = existingProducts.filter(p => p.id !== product.id);

    // Yeni ürünü başa ekle
    const updatedProducts = [product, ...filteredProducts];

    // Maksimum ürün sayısını kontrol et
    const limitedProducts = updatedProducts.slice(0, MAX_PRODUCTS);

    // localStorage'a kaydet
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedProducts));

    // Custom event tetikle (diğer bileşenler için)
    window.dispatchEvent(new CustomEvent('productsUpdated', {
      detail: { products: limitedProducts }
    }));

    return limitedProducts;
  } catch (error) {
    console.error('Error tracking product:', error);
    return [];
  }
};

/**
 * Son görüntülenen ürünleri getirir
 * @returns {Array} Ürün listesi
 */
export const getRecentProducts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting recent products:', error);
    return [];
  }
};

/**
 * Belirli bir ürünü geçmişten kaldırır
 * @param {string} productId - Kaldırılacak ürün ID'si
 */
export const removeProduct = (productId) => {
  try {
    const existingProducts = getRecentProducts();
    const filteredProducts = existingProducts.filter(p => p.id !== productId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));

    // Custom event tetikle
    window.dispatchEvent(new CustomEvent('productsUpdated', {
      detail: { products: filteredProducts }
    }));

    return filteredProducts;
  } catch (error) {
    console.error('Error removing product:', error);
    return [];
  }
};

/**
 * Tüm ürün geçmişini temizler
 */
export const clearProductHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);

    // Custom event tetikle
    window.dispatchEvent(new CustomEvent('productsUpdated', {
      detail: { products: [] }
    }));

    return [];
  } catch (error) {
    console.error('Error clearing product history:', error);
    return [];
  }
};

/**
 * Ürün geçmişindeki ürün sayısını döndürür
 * @returns {number} Ürün sayısı
 */
export const getProductCount = () => {
  try {
    const products = getRecentProducts();
    return products.length;
  } catch (error) {
    console.error('Error getting product count:', error);
    return 0;
  }
};

/**
 * Ürün geçmişinde belirli bir ürün var mı kontrol eder
 * @param {string} productId - Kontrol edilecek ürün ID'si
 * @returns {boolean} Ürün var mı
 */
export const hasProduct = (productId) => {
  try {
    const products = getRecentProducts();
    return products.some(p => p.id === productId);
  } catch (error) {
    console.error('Error checking product existence:', error);
    return false;
  }
};

/**
 * Ürün geçmişini belirli bir tarihten sonraki ürünlerle filtreler
 * @param {Date} date - Filtreleme tarihi
 * @returns {Array} Filtrelenmiş ürün listesi
 */
export const getProductsAfterDate = (date) => {
  try {
    const products = getRecentProducts();
    return products.filter(product => {
      if (product.timestamp) {
        return new Date(product.timestamp) > date;
      }
      return true; // Timestamp yoksa tüm ürünleri dahil et
    });
  } catch (error) {
    console.error('Error filtering products by date:', error);
    return [];
  }
};

/**
 * Ürün geçmişini analitik veriler için hazırlar
 * @returns {Object} Analitik veriler
 */
export const getAnalytics = () => {
  try {
    const products = getRecentProducts();

    return {
      totalProducts: products.length,
      uniqueProducts: new Set(products.map(p => p.id)).size,
      categories: products.reduce((acc, product) => {
        if (product.category) {
          acc[product.category] = (acc[product.category] || 0) + 1;
        }
        return acc;
      }, {}),
      averagePrice: products.length > 0
        ? products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length
        : 0
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return {
      totalProducts: 0,
      uniqueProducts: 0,
      categories: {},
      averagePrice: 0
    };
  }
};

/**
 * Ürün takip sistemini başlatır
 * @param {Object} options - Başlatma seçenekleri
 */
export const initializeTracker = (options = {}) => {
  const {
    autoTrack = true,
    maxProducts = MAX_PRODUCTS,
    enableAnalytics = false
  } = options;

  // Global değişkenleri güncelle
  if (maxProducts !== MAX_PRODUCTS) {
    MAX_PRODUCTS = maxProducts;
  }

  // Otomatik takip aktifse, sayfa yüklendiğinde mevcut ürünü takip et
  if (autoTrack) {
    // Shopify'da ürün sayfasında mıyız kontrol et
    if (window.Shopify && window.Shopify.theme) {
      const productData = window.Shopify.theme.product;
      if (productData) {
        trackProduct({
          id: productData.id,
          title: productData.title,
          image: productData.featured_image,
          url: window.location.href,
          price: productData.price,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  // Analytics aktifse, periyodik olarak veri topla
  if (enableAnalytics) {
    setInterval(() => {
      const analytics = getAnalytics();
      // Analytics verilerini sunucuya gönder veya console'a yazdır
      console.log('Product Analytics:', analytics);
    }, 60000); // Her dakika
  }

  console.log('Product Tracker initialized with options:', options);
};

// Default export
export default {
  trackProduct,
  getRecentProducts,
  removeProduct,
  clearProductHistory,
  getProductCount,
  hasProduct,
  getProductsAfterDate,
  getAnalytics,
  initializeTracker
};
