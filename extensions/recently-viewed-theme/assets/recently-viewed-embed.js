/**
 * Recently Viewed Products - Theme App Extension
 * Tüm temalarda çalışır; localStorage key: recentlyViewedProducts
 */
(function() {
  const STORAGE_KEY = 'recentlyViewedProducts';
  const MAX_PRODUCTS = 10;

  function getConfig() {
    const el = document.getElementById('recently-viewed-app-embed');
    if (!el) return null;
    return {
      position: el.dataset.position || 'right',
      title: el.dataset.title || 'Recently Viewed',
      vertical: parseInt(el.dataset.vertical, 10) || 50,
      maxProducts: parseInt(el.dataset.maxProducts, 10) || 5,
      productId: el.dataset.productId || '',
      productTitle: el.dataset.productTitle || '',
      productImage: el.dataset.productImage || '',
      productUrl: el.dataset.productUrl || '',
      productPrice: el.dataset.productPrice || ''
    };
  }

  function getRecentProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveRecentProducts(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, MAX_PRODUCTS)));
  }

  function trackCurrentProduct(config) {
    if (!config.productId) return;
    const current = {
      id: config.productId,
      title: config.productTitle,
      image: config.productImage,
      url: config.productUrl,
      price: config.productPrice,
      timestamp: new Date().toISOString()
    };
    const list = getRecentProducts().filter(function(p) { return p.id !== current.id; });
    list.unshift(current);
    saveRecentProducts(list);
  }

  function loadSwiper(callback) {
    if (window.Swiper) {
      callback();
      return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    document.head.appendChild(link);
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  function init() {
    var config = getConfig();
    if (!config) return;

    trackCurrentProduct(config);
    var recent = getRecentProducts();
    if (recent.length === 0) return;

    var root = document.getElementById('recently-viewed-app-embed');
    root.style.display = '';

    var isLeft = config.position === 'left';
    var posCss = isLeft ? 'left: 0' : 'right: 0';
    var flexDir = isLeft ? 'row-reverse' : 'row';

    var closedHtml =
      '<div id="rv-embed-closed" class="rv-embed-closed" style="position:fixed;' + posCss + ';top:' + config.vertical + '%;transform:translateY(-50%);z-index:1000;display:flex;' + (isLeft ? 'flex-direction:row-reverse' : 'flex-direction:row') + ';align-items:stretch;min-height:220px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">' +
      '<div class="rv-embed-side" style="display:flex;flex-direction:column;align-items:center;background:#000;min-height:220px;">' +
      '<div class="rv-embed-title" style="writing-mode:vertical-rl;text-orientation:mixed;padding:1rem 0;color:#fff;font-size:14px;font-weight:600;">' + (config.title || 'Recently Viewed') + '</div>' +
      '<div style="display:flex;flex-direction:column;">' +
      '<button type="button" id="rv-embed-expand" style="background:#000;border:none;color:#fff;padding:8px;cursor:pointer;" title="Expand">&#9654;</button>' +
      '<button type="button" id="rv-embed-up" style="background:#000;border:none;color:#fff;padding:4px;cursor:pointer;">&#9650;</button>' +
      '<button type="button" id="rv-embed-down" style="background:#000;border:none;color:#fff;padding:4px;cursor:pointer;">&#9660;</button>' +
      '</div></div>' +
      '<div id="rv-embed-thumbnails" class="rv-embed-thumbnails" style="display:flex;flex-direction:column;gap:6px;background:#f5f5f5;padding:8px;min-width:70px;align-items:center;justify-content:center;"></div>' +
      '</div>';

    var popupHtml =
      '<div id="rv-embed-popup" class="rv-embed-popup" style="display:none;position:fixed;top:50%;' + (isLeft ? 'left' : 'right') + ':10px;transform:translateY(-50%);width:min(90vw,400px);max-height:360px;background:#fff;z-index:10001;box-shadow:0 4px 20px rgba(0,0,0,0.2);border-radius:8px;overflow:hidden;flex-direction:column;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #eee;">' +
      '<h3 style="margin:0;font-size:16px;">' + (config.title || 'Recently Viewed') + '</h3>' +
      '<button type="button" id="rv-embed-close-popup" style="background:none;border:none;cursor:pointer;text-decoration:underline;font-size:14px;">Close</button>' +
      '</div>' +
      '<div class="swiper rv-swiper" style="flex:1;padding:12px;height:260px;">' +
      '<div class="swiper-wrapper" id="rv-swiper-wrapper"></div>' +
      '<div class="swiper-pagination" id="rv-swiper-pagination"></div>' +
      '</div></div>';

    root.insertAdjacentHTML('afterend', closedHtml + popupHtml);

    var closed = document.getElementById('rv-embed-closed');
    var popup = document.getElementById('rv-embed-popup');
    var thumbnails = document.getElementById('rv-embed-thumbnails');
    var wrapper = document.getElementById('rv-swiper-wrapper');
    var slideIndex = 0;
    var maxVisible = 3;

    function renderThumbnails() {
      var list = getRecentProducts();
      thumbnails.innerHTML = list.slice(0, 5).map(function(p) {
        return '<a href="' + p.url + '" style="width:50px;height:50px;border-radius:4px;overflow:hidden;display:block;"><img src="' + p.image + '" alt="" style="width:100%;height:100%;object-fit:cover;"></a>';
      }).join('');
    }

    function openPopup() {
      loadSwiper(function() {
        var list = getRecentProducts();
        wrapper.innerHTML = list.map(function(p) {
          return '<div class="swiper-slide" style="text-align:center;"><a href="' + p.url + '" style="display:block;padding:8px;"><img src="' + p.image + '" alt="" style="width:100%;max-height:140px;object-fit:contain;"><div style="font-size:12px;margin-top:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + p.title + '</div>' + (p.price ? '<div style="font-size:13px;font-weight:600;">' + p.price + '</div>' : '') + '</a></div>';
        }).join('');
        if (window.rvSwiper) window.rvSwiper.destroy(true, true);
        window.rvSwiper = new window.Swiper('.rv-swiper', {
          slidesPerView: 2,
          spaceBetween: 10,
          pagination: { el: '#rv-swiper-pagination', clickable: true },
          breakpoints: { 480: { slidesPerView: 2 }, 768: { slidesPerView: 3 } }
        });
        popup.style.display = 'flex';
      });
    }

    function closePopup() {
      popup.style.display = 'none';
    }

    document.getElementById('rv-embed-expand').addEventListener('click', openPopup);
    document.getElementById('rv-embed-close-popup').addEventListener('click', closePopup);

    document.getElementById('rv-embed-up').addEventListener('click', function() {
      if (window.rvSwiper && popup.style.display === 'flex') window.rvSwiper.slidePrev();
    });
    document.getElementById('rv-embed-down').addEventListener('click', function() {
      if (window.rvSwiper && popup.style.display === 'flex') window.rvSwiper.slideNext();
    });

    renderThumbnails();
    window.addEventListener('storage', function(e) {
      if (e.key === STORAGE_KEY) renderThumbnails();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
