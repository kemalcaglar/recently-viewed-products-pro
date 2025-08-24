export default {
  // General
  general: {
    title: 'Recently Viewed Products Widget',
    subtitle: 'Show your customers\' recently viewed products and increase sales',
    saveSettings: 'Save Settings',
    preview: 'Preview',
    success: 'Success!',
    error: 'Error!',
    settingsSaved: 'Widget settings saved successfully.',
    settingsError: 'An error occurred while saving settings. Please try again.'
  },

  // Tabs
  tabs: {
    general: 'General',
    appearance: 'Appearance',
    advanced: 'Advanced',
    analytics: 'Analytics',
    pages: 'Pages'
  },

  // General Tab
  generalTab: {
    title: 'Widget Settings',
    showWidget: 'Show Widget',
    showWidgetLabel: 'Enable recently viewed products widget',
    position: 'Widget Position',
    positionLabel: 'Widget position on the page',
    positionOptions: {
      right: 'Right Side',
      left: 'Left Side',
      bottom: 'Bottom',
      top: 'Top'
    },
    maxProducts: 'Maximum Product Count',
    maxProductsLabel: 'Maximum number of products to display',
    maxProductsCurrent: 'Currently: {count} products',
    widgetTitle: 'Widget Title',
    widgetTitleLabel: 'Title to display in the widget',
    widgetTitlePlaceholder: 'Recently Viewed Products'
  },

  // Appearance Tab
  appearanceTab: {
    themeTitle: 'Theme Settings',
    primaryColor: 'Primary Color',
    primaryColorDescription: 'Used for buttons, text and highlights',
    backgroundColor: 'Background Color',
    backgroundColorDescription: 'Widget background color',
    fontSize: 'Font Size',
    fontSizeLabel: 'Font size (px)',
    fontSizeCurrent: 'Currently: {size}px',
    fontFamily: 'Font Family',
    fontFamilyLabel: 'Font family',
    fontOptions: {
      arial: 'Arial',
      helvetica: 'Helvetica',
      georgia: 'Georgia',
      times: 'Times New Roman',
      verdana: 'Verdana'
    },
    displayOptions: 'Display Options',
    showPrice: 'Show product prices',
    showCategory: 'Show product categories',
    animationSpeed: 'Animation Speed',
    animationSpeedLabel: 'Animation duration (ms)',
    animationSpeedCurrent: 'Currently: {speed}ms'
  },

  // Advanced Tab
  advancedTab: {
    title: 'Advanced Settings',
    autoHide: 'Auto hide',
    autoHideDescription: 'Widget automatically hides after a certain time',
    hideDelay: 'Hide Delay',
    hideDelayLabel: 'Hide delay (ms)',
    hideDelayCurrent: 'Currently: {delay}ms',
    enableA11y: 'Enable accessibility features',
    a11yDescription: 'Screen reader support and keyboard navigation',
    enableDarkMode: 'Dark mode support',
    darkModeDescription: 'Adapts to system dark mode settings'
  },

  // Analytics Tab
  analyticsTab: {
    title: 'Analytics & Tracking',
    enableAnalytics: 'Collect analytics data',
    analyticsDescription: 'Collects widget usage data and product view statistics',
    analyticsActive: 'Analytics Active',
    analyticsActiveDescription: 'Widget usage data is being collected. This data is used to improve store performance.',
    exportData: 'Export Data',
    clearData: 'Clear Data',
    generalStats: 'General Statistics',
    totalProducts: 'Total Products',
    totalViews: 'Total Views',
    averageTime: 'Average Time',
    activeDevices: 'Active Devices',
    topProducts: 'Top Products',
    noDataYet: 'No data collected yet',
    noDataDescription: 'Start collecting data by browsing product pages',
    dailyStats: 'Daily Statistics (Last 7 Days)',
    dailyNoData: 'Daily data not available yet',
    dailyNoDataDescription: 'Daily statistics will appear over time'
  },

  // Pages Tab
  pagesTab: {
    title: 'Page Visibility Settings',
    description: 'Choose which pages the widget should appear on',
    mainPages: 'Main Pages',
    homepage: 'Homepage',
    productPages: 'Product Pages',
    collectionPages: 'Collection Pages',
    contentPages: 'Content Pages',
    blogPages: 'Blog Pages',
    articlePages: 'Article Pages',
    staticPages: 'Static Pages (About, Contact, etc.)',
    searchPages: 'Search Page',
    shoppingPages: 'Shopping Pages',
    cartPage: 'Cart Page',
    checkoutPages: 'Checkout Pages',
    checkoutDisabled: 'Widget display on checkout pages is not recommended',
    customerPages: 'Customer Pages'
  },

  // Widget Preview
  preview: {
    title: 'Widget Preview',
    description: 'Preview how your widget will look here',
    demoProduct: 'Demo Product',
    demoProductDescription: 'This is a demo product page',
    productImage: 'Product Image',
    visitStore: 'Visit Store',
    themeEditor: 'Theme Editor',
    demoProducts: [
      { title: 'Demo Product 1', price: '$99.99' },
      { title: 'Demo Product 2', price: '$149.99' },
      { title: 'Demo Product 3', price: '$199.99' }
    ]
  }
}
