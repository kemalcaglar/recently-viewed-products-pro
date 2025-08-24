/**
 * Recently Viewed Products Widget
 * Bu dosya widget'ın ana işlevselliğini sağlar
 */

class RecentlyViewedWidget {
  constructor(config = {}) {
    this.config = {
      position: 'right',
      maxProducts: 5,
      title: 'Son Görüntülenen Ürünler',
      theme: {
        primaryColor: '#000000',
        backgroundColor: '#ffffff',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif'
      },
      ...config
    };

    this.isOpen = false;
    this.recentProducts = [];
    this.currentPage = 0;

    this.init();
  }

  init() {
    this.loadRecentProducts();
    this.createWidget();
    this.bindEvents();
  }

  loadRecentProducts() {
    try {
      const stored = localStorage.getItem('recentlyViewedProducts');
      if (stored) {
        this.recentProducts = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading recent products:', error);
    }
  }

  createWidget() {
    if (this.recentProducts.length === 0) return;

    // Widget HTML'ini oluştur
    const widgetHTML = `
      <div class="widget-closed widget-${this.config.position}" id="recently-viewed-widget">
        <div class="widget-title">${this.config.title}</div>
        <div class="widget-controls">
          <button class="control-btn expand-btn" title="Genişlet">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
          <button class="control-btn scroll-up" title="Yukarı">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="18,15 12,9 6,15"/>
            </svg>
          </button>
          <button class="control-btn scroll-down" title="Aşağı">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Widget'ı sayfaya ekle
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // CSS değişkenlerini ayarla
    const widget = document.getElementById('recently-viewed-widget');
    widget.style.setProperty('--primary-color', this.config.theme.primaryColor);
    widget.style.setProperty('--background-color', this.config.theme.backgroundColor);
    widget.style.setProperty('--font-size', this.config.theme.fontSize);
    widget.style.setProperty('--font-family', this.config.theme.fontFamily);
  }

  createPopup() {
    const popupHTML = `
      <div class="widget-overlay" id="widget-overlay">
        <div class="widget-popup">
          <div class="popup-header">
            <h3 class="popup-title">${this.config.title}</h3>
            <button class="close-btn" id="close-widget">Kapat</button>
          </div>
          
          <div class="products-container" id="products-container">
            ${this.renderProducts()}
          </div>
          
          ${this.renderPagination()}
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);
  }

  renderProducts() {
    const startIndex = this.currentPage * 3;
    const products = this.recentProducts.slice(startIndex, startIndex + 3);

    return products.map(product => `
      <div class="product-item" data-product-url="${product.url}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-title">${product.title}</div>
      </div>
    `).join('');
  }

  renderPagination() {
    if (this.recentProducts.length <= 3) return '';

    const totalPages = Math.ceil(this.recentProducts.length / 3);
    const dots = Array.from({ length: totalPages }, (_, index) =>
      `<button class="pagination-dot ${index === this.currentPage ? 'active' : ''}" data-page="${index}"></button>`
    ).join('');

    return `<div class="pagination">${dots}</div>`;
  }

  bindEvents() {
    // Widget kontrolleri
    document.addEventListener('click', (e) => {
      if (e.target.closest('.expand-btn')) {
        this.openWidget();
      } else if (e.target.closest('.scroll-up')) {
        this.prevPage();
      } else if (e.target.closest('.scroll-down')) {
        this.nextPage();
      } else if (e.target.closest('.close-btn')) {
        this.closeWidget();
      } else if (e.target.closest('.pagination-dot')) {
        const page = parseInt(e.target.dataset.page);
        this.goToPage(page);
      } else if (e.target.closest('.product-item')) {
        const productUrl = e.target.closest('.product-item').dataset.productUrl;
        if (productUrl) {
          window.location.href = productUrl;
        }
      } else if (e.target.closest('.widget-overlay') && !e.target.closest('.widget-popup')) {
        this.closeWidget();
      }
    });
  }

  openWidget() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.createPopup();

    // Animasyon için kısa gecikme
    setTimeout(() => {
      const overlay = document.getElementById('widget-overlay');
      if (overlay) {
        overlay.style.opacity = '1';
      }
    }, 10);
  }

  closeWidget() {
    if (!this.isOpen) return;

    this.isOpen = false;
    const overlay = document.getElementById('widget-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateWidget();
    }
  }

  nextPage() {
    if ((this.currentPage + 1) * 3 < this.recentProducts.length) {
      this.currentPage++;
      this.updateWidget();
    }
  }

  goToPage(page) {
    this.currentPage = page;
    this.updateWidget();
  }

  updateWidget() {
    if (this.isOpen) {
      const container = document.getElementById('products-container');
      const pagination = document.querySelector('.pagination');

      if (container) {
        container.innerHTML = this.renderProducts();
      }

      if (pagination) {
        pagination.innerHTML = this.renderPagination();
      }
    }
  }

  addProduct(product) {
    // Mevcut ürünleri kontrol et
    const existingIndex = this.recentProducts.findIndex(p => p.id === product.id);

    if (existingIndex !== -1) {
      // Ürün zaten varsa, başa taşı
      this.recentProducts.splice(existingIndex, 1);
    }

    // Yeni ürünü başa ekle
    this.recentProducts.unshift(product);

    // Maksimum ürün sayısını kontrol et
    if (this.recentProducts.length > this.config.maxProducts) {
      this.recentProducts = this.recentProducts.slice(0, this.config.maxProducts);
    }

    // localStorage'a kaydet
    try {
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(this.recentProducts));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    // Widget'ı güncelle
    this.updateWidget();
  }
}

// Global fonksiyonlar (Liquid snippet'inden çağrılır)
window.initializeTracker = function (options = {}) {
  console.log('Product tracker initialized with options:', options);
};

window.trackProduct = function (product) {
  if (window.recentlyViewedWidget) {
    window.recentlyViewedWidget.addProduct(product);
  }
};

// Widget'ı başlat
document.addEventListener('DOMContentLoaded', function () {
  if (window.widgetConfig) {
    window.recentlyViewedWidget = new RecentlyViewedWidget(window.widgetConfig);
  }
});
