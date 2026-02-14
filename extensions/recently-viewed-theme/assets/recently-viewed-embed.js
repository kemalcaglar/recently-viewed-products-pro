/**
 * KEDA Recently Viewed Products - Theme App Extension
 * Tüm temalarda çalışır; localStorage key: kedaRecentlyViewedProducts
 */
(function () {
  const STORAGE_KEY = 'kedaRecentlyViewedProducts';
  const MAX_PRODUCTS = 10;
  const SCENARIO_NAME = 'keda-recently-viewed';

  // Utility object for event tracking and storage management
  const recentlyViewedObj = {
    scenarioClass: `.${SCENARIO_NAME}`,
    scenarioName: SCENARIO_NAME
  };

  function getConfig() {
    const el = document.getElementById('recently-viewed-app-embed');
    if (!el) return null;
    return {
      position: el.dataset.position || 'right',
      title: el.dataset.title || 'Recently Viewed',
      vertical: parseInt(el.dataset.vertical, 10) || 50,
      maxProducts: parseInt(el.dataset.maxProducts, 10) || 5,
      borderRadius: parseInt(el.dataset.borderRadius, 10) || 0,
      productId: el.dataset.productId || '',
      productTitle: el.dataset.productTitle || '',
      productImage: el.dataset.productImage || '',
      productUrl: el.dataset.productUrl || '',
      productPrice: el.dataset.productPrice || '',
      buttonColor: el.dataset.buttonColor || '#ec621d',
      buttonHoverColor: el.dataset.buttonHoverColor || '#000000',
      textSize: parseInt(el.dataset.textSize, 10) || 13,
      textColor: el.dataset.textColor || '#000000',
      textBackgroundColor: el.dataset.textBackgroundColor || '#ffffff',
      textFontWeight: el.dataset.textFontWeight || '600',
      triggerLeftBoxShadow: el.dataset.triggerLeftBoxShadow || '0px 7px 29px 0px rgba(100, 100, 111, 0.2)',
      triggerRightBoxShadow: el.dataset.triggerRightBoxShadow || '0px 7px 29px 0px rgba(100, 100, 111, 0.2)',
      sliderBackgroundColor: el.dataset.sliderBackgroundColor || '#ffffff',
      triggerSliderBoxShadow: el.dataset.triggerSliderBoxShadow || '0px 2px 8px 0px rgba(99, 99, 99, 0.2)',
      closeIcon: el.dataset.closeIcon || '',
      upIcon: el.dataset.upIcon || '',
      downIcon: el.dataset.downIcon || '',
      expandIcon: el.dataset.expandIcon || '',
      collapseIcon: el.dataset.collapseIcon || '',
      closeShowTime: parseInt(el.dataset.closeShowTime, 10) || 1440, // minutes
      // Popup settings
      popupBgColor: el.dataset.popupBgColor || '#ffffff',
      popupBoxShadow: el.dataset.popupBoxShadow || '0px 7px 29px 0px rgba(100, 100, 111, 0.2)',
      popupTitleSize: el.dataset.popupTitleSize || '18px',
      popupTitleWeight: el.dataset.popupTitleWeight || '600',
      popupTitleColor: el.dataset.popupTitleColor || '#000000',
      popupCloseSize: el.dataset.popupCloseSize || '14px',
      popupCloseWeight: el.dataset.popupCloseWeight || '400',
      popupCloseColor: el.dataset.popupCloseColor || '#666666',
      popupProductTitleSize: el.dataset.popupProductTitleSize || '14px',
      popupProductTitleWeight: el.dataset.popupProductTitleWeight || '400',
      popupProductTitleColor: el.dataset.popupProductTitleColor || '#000000',
      popupProductTitleLines: el.dataset.popupProductTitleLines || '2',
      popupPriceSize: el.dataset.popupPriceSize || '16px',
      popupPriceWeight: el.dataset.popupPriceWeight || '600',
      popupPriceColor: el.dataset.popupPriceColor || '#ec621d',
      popupDiscountedPriceSize: el.dataset.popupDiscountedPriceSize || '12px',
      popupDiscountedPriceWeight: el.dataset.popupDiscountedPriceWeight || '400',
      popupDiscountedPriceColor: el.dataset.popupDiscountedPriceColor || '#999999',
      popupDotWidth: el.dataset.popupDotWidth || '8px',
      popupDotHeight: el.dataset.popupDotHeight || '8px',
      popupDotColor: el.dataset.popupDotColor || '#dddddd',
      popupDotActiveColor: el.dataset.popupDotActiveColor || '#ec621d',
      popupDotRadius: el.dataset.popupDotRadius || '50%'
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
      compare_at_price: config.productComparePrice || '',
      timestamp: new Date().toISOString()
    };
    const list = getRecentProducts().filter(function (p) { return p.id !== current.id; });
    list.unshift(current);
    saveRecentProducts(list);
  }

  const setLocalStorageWithExpiry = (key, value, expiryInMinutes) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + expiryInMinutes * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getLocalStorageWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  // HTML generation functions
  const html = {
    init: function (products, config) {
      return (`
        <div class="${SCENARIO_NAME}">
          ${this.trigger(products, config)}
          ${this.popup(products, config)}
        </div>
      `);
    },
    trigger: function (products, config) {
      return (`
        <div class="${SCENARIO_NAME}_trigger">
          <span class="keda-recently_close">
            <img src="${config.closeIcon}" alt="close" />
          </span>
          <div class="keda-recently_content">
            ${this.triggerLeft(config)}
            <div class="keda-recently_right">
              <div class="keda-recently_trigger_slider">
                ${this.triggerRight(products)}
              </div>
            </div>
          </div>
        </div>
      `);
    },
    triggerRight: function (products) {
      let html = '';
      products.forEach((product, i) => {
        if (product === undefined) return;
        html += (`
          <div class="keda-recently_trigger_product">
            <a href="${product.url}" target="_blank">
              <img src="${product.image}" alt="${product.title}" />
            </a>
          </div>
        `);
      });
      return html;
    },
    triggerLeft: function (config) {
      const {
        title,
        upIcon,
        downIcon,
        expandIcon,
      } = config;
      return (`
        <div class="keda-recently_left">
          <div class="keda-recently_title">
            ${title}
          </div>
          <div class="keda-recently_actions">
            <span class="keda-recently_expand">
              <img src="${expandIcon}" alt="expand" />
            </span>
            <span class="keda-recently_up">
              <img src="${upIcon}" alt="up" />
            </span>
            <span class="keda-recently_down">
              <img src="${downIcon}" alt="down" />
            </span>
          </div>
        </div>
      `);
    },
    popup: function (products, config) {
      const { title } = config;
      return (`
        <div class="${SCENARIO_NAME}_popup">
          <div class="keda-recently_content">
            <div class="keda-recently_recommend">
              <div class="keda-recently_title">
                <span>${title}</span>
                <span class="keda-recently_close">Kapat</span>
              </div>
              <div class="keda-recently_products owl-carousel">
                ${this.popupProducts(products)}
              </div>
            </div>
          </div>
        </div>
      `);
    },
    popupProducts: function (products) {
      let html = '';
      products.forEach((product, i) => {
        if (product === undefined) return;
        let {
          title,
          image,
          price,
          compare_at_price,
          url
        } = product;
        const hasDiscount =
          compare_at_price &&
          Number(compare_at_price) > Number(price);
        html += (`
          <div class="keda-recently_product">
            <a href="${url}" target="_blank">
              <img src="${image}" alt="${title}" />
            </a>
            <div class="keda-recently_product_info">
              <a href="${url}" target="_blank">
                <div class="keda-recently_product_title">${title}</div>
              </a>
               <div class="keda-recently_price_container">
                ${hasDiscount ? `<div class="keda-recently_discount_price">${compare_at_price} TL</div>` : ``}
                <div class="keda-recently_price">${price} TL</div>
              </div>
            </div>
          </div>
        `);
      });
      return html;
    },
  };

  const navigation = (direction, config) => {
    const target = document.querySelector(`${recentlyViewedObj.scenarioClass}_trigger`)
      .classList.contains("active") ? 1 : 2;
    if (target === 1) {
      const dots = document.querySelectorAll(`${recentlyViewedObj.scenarioClass}_popup .owl-dot`);
      const activeIndex = Array.from(dots).findIndex((dot) => dot.classList.contains('active'));
      if (activeIndex !== -1) {
        let target_index = 0;
        if (direction == "prev" && activeIndex == 0) {
          target_index = dots.length - 1;
        } else if (direction == "next" && activeIndex == dots.length - 1) {
          target_index = 0;
        } else {
          target_index = direction == "next" ? activeIndex + 1 : activeIndex - 1;
        }
        dots[target_index].click();
      }
    } else if (target === 2) {
      const container = document.querySelector(`${recentlyViewedObj.scenarioClass}_trigger .keda-recently_trigger_slider`);
      const containerHeight = container.scrollHeight;
      const containerScroll = container.scrollTop;
      const sliceHeight = 242;

      if (direction === 'prev') {
        if (containerScroll >= sliceHeight) {
          container.scrollTop -= sliceHeight;
        } else {
          container.scrollTop = container.scrollHeight - container.clientHeight;
        }
      } else if (
        direction === 'next'
        && (containerHeight - containerScroll <= container.getBoundingClientRect().height + 10)
      ) {
        container.scrollTop = 0;
      } else {
        container.scrollTop += sliceHeight;
      }
    }
  };

  const triggerEvents = (config) => {
    const main = document.querySelector(recentlyViewedObj.scenarioClass);
    const trigger = document.querySelector(`${recentlyViewedObj.scenarioClass}_trigger`);
    const popup = document.querySelector(`${recentlyViewedObj.scenarioClass}_popup`);
    const close = trigger.querySelector('.keda-recently_close');
    const expand = trigger.querySelector('.keda-recently_expand');
    const up = trigger.querySelector('.keda-recently_up');
    const down = trigger.querySelector('.keda-recently_down');
    const title = trigger.querySelector(".keda-recently_title");

    const isCloseName = `keda_${recentlyViewedObj.scenarioName}_close`;

    close.addEventListener('click', () => {
      main.remove();
      setLocalStorageWithExpiry(isCloseName, true, config.closeShowTime);
    });

    expand.addEventListener('click', () => {
      trigger.classList.toggle('active');
      popup.classList.toggle('active');
      expand.querySelector('img').src =
        trigger.classList.contains('active')
          ? config.collapseIcon
          : config.expandIcon;
    });

    title.addEventListener('click', () => {
      trigger.classList.toggle('active');
      popup.classList.toggle('active');
      expand.querySelector('img').src =
        trigger.classList.contains('active')
          ? config.collapseIcon
          : config.expandIcon;
    });

    up.addEventListener('click', () => {
      navigation('prev', config);
    });

    down.addEventListener('click', () => {
      navigation('next', config);
    });
  };

  const triggerStart = (shownProducts, config) => {
    document.body.insertAdjacentHTML('beforeend', html.init(shownProducts, config));
    triggerEvents(config);
  };

  const popupStart = (config) => {
    const main = document.querySelector(recentlyViewedObj.scenarioClass);
    const popup = document.querySelector(`${recentlyViewedObj.scenarioClass}_popup`);
    const slider = popup.querySelector('.keda-recently_products');
    const links = popup.querySelectorAll('.keda-recently_product a');
    const images = popup.querySelectorAll('.keda-recently_product img');

    const popupOwlSettings = {
      items: 1,
      loop: true,
      margin: 0,
      nav: false,
      dots: true,
      autoplay: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      dotsEach: window.innerWidth <= 768 ? 1 : 3,
      responsive: {
        0: {
          items: 1,
          margin: 0,
        },
        768: {
          items: 3,
          margin: 10,
        },
      },
    };

    jQuery(slider).owlCarousel(popupOwlSettings);

    const close = popup.querySelector('.keda-recently_close');
    const isCloseName = `keda_${recentlyViewedObj.scenarioName}_close`;

    close.addEventListener('click', () => {
      main.remove();
      setLocalStorageWithExpiry(isCloseName, true, config.closeShowTime);
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        console.log('Product clicked');
      });
    });

    images.forEach((image) => {
      image.addEventListener('click', () => {
        console.log('Product image clicked');
      });
    });
  };

  const checkOwlCarousel = (config) => {
    const start = () => {
      const recent = getRecentProducts();
      if (recent.length <= 2) return;

      const isCloseName = `keda_${recentlyViewedObj.scenarioName}_close`;
      const closeTime = getLocalStorageWithExpiry(isCloseName);
      if (closeTime) return;

      triggerStart(recent, config);
      popupStart(config);
    };

    if (window.jQuery && window.jQuery.fn.owlCarousel) {
      start();
    } else {
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.classList.add('keda-recently-owl-carousel');
          script.onload = () => resolve(script);
          script.onerror = () => reject(new Error(`Script load error: ${src}`));
          document.head.appendChild(script);
        });
      };

      loadScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js')
        .then(() => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.css';
          document.head.appendChild(link);
          start();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const checkJquery = (config) => {
    if (window.jQuery) {
      checkOwlCarousel(config);
      return true;
    } else {
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.classList.add('keda-recently-jquery');
          script.onload = () => resolve(script);
          script.onerror = () => reject(new Error(`Script load error: ${src}`));
          document.head.appendChild(script);
        });
      };

      loadScript('https://code.jquery.com/jquery-3.6.4.min.js')
        .then(() => {
          checkOwlCarousel(config);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  function init() {
    const config = getConfig();
    if (!config) return;

    // Body attribute for CSS selectors (e.g. body[data-recently-viewed-position="left"])
    if (config.position) {
      document.body.setAttribute('data-recently-viewed-position', config.position);
    }

    // Set CSS custom properties from config
    const root = document.documentElement;

    // Trigger settings
    root.style.setProperty('--keda-trigger-position', config.position);
    root.style.setProperty('--keda-trigger-vertical-position', config.vertical + '%');
    root.style.setProperty('--keda-trigger-border-radius', config.borderRadius + 'px');
    root.style.setProperty('--keda-trigger-button-color', config.buttonColor);
    root.style.setProperty('--keda-trigger-button-hover-color', config.buttonHoverColor);
    root.style.setProperty('--keda-trigger-text-color', config.textColor);
    root.style.setProperty('--keda-trigger-text-bg-color', config.textBackgroundColor);
    root.style.setProperty('--keda-trigger-text-size', config.textSize + 'px');
    root.style.setProperty('--keda-trigger-text-weight', config.textFontWeight);
    root.style.setProperty('--keda-trigger-left-box-shadow', config.triggerLeftBoxShadow);
    root.style.setProperty('--keda-trigger-right-box-shadow', config.triggerRightBoxShadow);
    root.style.setProperty('--keda-trigger-slider-bg-color', config.sliderBackgroundColor);
    root.style.setProperty('--keda-trigger-slider-box-shadow', config.triggerSliderBoxShadow);

    // Popup settings
    root.style.setProperty('--keda-popup-bg-color', config.popupBgColor);
    root.style.setProperty('--keda-popup-box-shadow', config.popupBoxShadow);
    root.style.setProperty('--keda-popup-title-size', config.popupTitleSize);
    root.style.setProperty('--keda-popup-title-weight', config.popupTitleWeight);
    root.style.setProperty('--keda-popup-title-color', config.popupTitleColor);
    root.style.setProperty('--keda-popup-close-size', config.popupCloseSize);
    root.style.setProperty('--keda-popup-close-weight', config.popupCloseWeight);
    root.style.setProperty('--keda-popup-close-color', config.popupCloseColor);
    root.style.setProperty('--keda-popup-product-title-size', config.popupProductTitleSize);
    root.style.setProperty('--keda-popup-product-title-weight', config.popupProductTitleWeight);
    root.style.setProperty('--keda-popup-product-title-color', config.popupProductTitleColor);
    root.style.setProperty('--keda-popup-product-title-lines', config.popupProductTitleLines);
    root.style.setProperty('--keda-popup-price-size', config.popupPriceSize);
    root.style.setProperty('--keda-popup-price-weight', config.popupPriceWeight);
    root.style.setProperty('--keda-popup-price-color', config.popupPriceColor);
    root.style.setProperty('--keda-popup-discounted-price-size', config.popupDiscountedPriceSize);
    root.style.setProperty('--keda-popup-discounted-price-weight', config.popupDiscountedPriceWeight);
    root.style.setProperty('--keda-popup-discounted-price-color', config.popupDiscountedPriceColor);
    root.style.setProperty('--keda-popup-dot-width', config.popupDotWidth);
    root.style.setProperty('--keda-popup-dot-height', config.popupDotHeight);
    root.style.setProperty('--keda-popup-dot-color', config.popupDotColor);
    root.style.setProperty('--keda-popup-dot-active-color', config.popupDotActiveColor);
    root.style.setProperty('--keda-popup-dot-radius', config.popupDotRadius);

    trackCurrentProduct(config);
    checkJquery(config);

    // Listen for storage changes
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) {
        // Reload the widget if needed
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();