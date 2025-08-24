import React, { useState, useEffect } from 'react'
import './RecentlyViewedWidget.css'

const RecentlyViewedWidget = ({ config = {} }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [recentProducts, setRecentProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)

  const defaultConfig = {
    position: 'right',
    maxProducts: 5,
    title: 'Son Görüntülenen Ürünler',
    showPrice: true,
    showCategory: true,
    theme: {
      primaryColor: '#000000',
      backgroundColor: '#ffffff',
      fontSize: '14px',
    },
  }

  const finalConfig = { ...defaultConfig, ...config }

  useEffect(() => {
    loadRecentProducts()
  }, [])

  const loadRecentProducts = () => {
    try {
      const stored = localStorage.getItem('recentlyViewedProducts')
      if (stored) {
        const products = JSON.parse(stored)
        setRecentProducts(products.slice(0, finalConfig.maxProducts))
      }
    } catch (error) {
      console.error('Error loading recent products:', error)
    }
  }

  const toggleWidget = () => {
    setIsOpen(!isOpen)
  }

  const closeWidget = () => {
    setIsOpen(false)
  }

  const nextPage = () => {
    if ((currentPage + 1) * 3 < recentProducts.length) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const getCurrentPageProducts = () => {
    const startIndex = currentPage * 3
    return recentProducts.slice(startIndex, startIndex + 3)
  }

  if (recentProducts.length === 0) {
    return null
  }

  return (
    <>
      {/* Kapalı Durum - Dikey Widget */}
      {!isOpen && (
        <div
          className="widget-closed widget-${finalConfig.position}"
          onClick={toggleWidget}>
          <div className="widget-title kemal">{finalConfig.title}</div>

          {/* Ürün Thumbnails */}
          <div className="product-thumbnails">
            {getCurrentPageProducts().map((product, index) => (
              <div key={product.id} className="product-thumbnail">
                <img src={product.image} alt={product.title} />
              </div>
            ))}
          </div>

          {/* Kontrol Butonları */}
          <div className="widget-controls">
            <button
              className="control-btn expand"
              onClick={(e) => {
                e.stopPropagation()
                toggleWidget()
              }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </button>
            <button
              className="control-btn scroll-up"
              onClick={(e) => {
                e.stopPropagation()
                prevPage()
              }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <polyline points="18,15 12,9 6,15" />
              </svg>
            </button>
            <button
              className="control-btn scroll-down"
              onClick={(e) => {
                e.stopPropagation()
                nextPage()
              }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Açık Durum - Popup */}
      {isOpen && (
        <div className="widget-overlay" onClick={closeWidget}>
          <div className="widget-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3 className="popup-title">{finalConfig.title}</h3>
              <button className="close-btn" onClick={closeWidget}>
                Kapat
              </button>
            </div>

            <div className="products-container">
              {getCurrentPageProducts().map((product, index) => (
                <div key={product.id} className="product-item">
                  <div className="product-image">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="product-info">
                    <div className="product-title">{product.title}</div>
                    {finalConfig.showCategory && product.category && (
                      <div className="product-category">{product.category}</div>
                    )}
                    {finalConfig.showPrice && product.price && (
                      <div className="product-price">{product.price}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {recentProducts.length > 3 && (
              <div className="pagination">
                {Array.from({
                  length: Math.ceil(recentProducts.length / 3),
                }).map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-dot ${
                      index === currentPage ? 'active' : ''
                    }`}
                    onClick={() => setCurrentPage(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle Bar - Sağ Kenar */}
      <div
        className="widget-toggle-bar"
        onClick={!isOpen ? toggleWidget : undefined}>
        <div className="toggle-title">{finalConfig.title}</div>
        <div className="toggle-controls">
          {isOpen ? (
            <button className="toggle-btn close-toggle" onClick={closeWidget}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <>
              <button
                className="toggle-btn scroll-up"
                onClick={(e) => {
                  e.stopPropagation()
                  prevPage()
                }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <polyline points="18,15 12,9 6,15" />
                </svg>
              </button>
              <button
                className="toggle-btn scroll-down"
                onClick={(e) => {
                  e.stopPropagation()
                  nextPage()
                }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default RecentlyViewedWidget
