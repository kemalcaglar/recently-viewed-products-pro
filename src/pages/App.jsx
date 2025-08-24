import React, { useState, useEffect } from 'react'
import {
  Page,
  Layout,
  Card,
  Button,
  TextField,
  Select,
  ColorPicker,
  RangeSlider,
  Checkbox,
  Stack,
  Text,
  Heading,
  Badge,
  Tabs,
  Icon,
  Banner,
  ActionList,
  Popover,
} from '@shopify/polaris'
import {
  SettingsMajor,
  AnalyticsMajor,
  ThemeEditMajor,
  ViewMajor,
  GlobeMajor,
} from '@shopify/polaris-icons'
import {
  t,
  setLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
} from '../utils/i18n'

const App = () => {
  const [config, setConfig] = useState({
    // Widget Settings
    showWidget: true,
    position: 'right',
    verticalValue: 50,
    maxProducts: 5,
    title: 'Recently Viewed Products',

    // Widget Title Colors
    widgetTitleBackground: '#ffffff',
    widgetTitleColor: '#000000',

    // Button Colors
    expandButtonBackground: '#000000',
    scrollUpButtonBackground: '#000000',
    scrollDownButtonBackground: '#000000',
    closeButtonBackground: '#ffffff',
    closeButtonColor: '#000000',

    // Product Thumbnail Colors
    thumbnailBackground: '#ffffff',

    // Popup Colors
    popupHeaderBackground: '#ffffff',
    popupHeaderColor: '#000000',
    swiperBackground: '#ffffff',
    productNameBackground: '#ffffff',
    productNameColor: '#000000',
    priceBackground: '#ffffff',
    priceColor: '#666666',

    // Typography Settings
    widgetTitleFontSize: 14,
    widgetTitleFontWeight: 400,
    popupTitleFontSize: 16,
    popupTitleFontWeight: 400,
    productNameFontSize: 14,
    productNameFontWeight: 400,
    priceFontSize: 12,
    priceFontWeight: 600,

    // Display Options
    showPrice: true,
    animationSpeed: 300,

    // Advanced Settings
    enableAnalytics: true,
    enableA11y: true,
    enableDarkMode: false,

    // Page Visibility Settings
    showOnHomepage: true,
    showOnProductPages: true,
    showOnCollectionPages: true,
    showOnBlogPages: true,
    showOnArticlePages: true,
    showOnStaticPages: true,
    showOnSearchPages: true,
    showOnCartPage: false,
    showOnCheckoutPages: false,
  })

  const [activeTab, setActiveTab] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [showDemoPopup, setShowDemoPopup] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage())
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)

  const tabs = [
    {
      id: 'general',
      content: t('tabs.general'),
      icon: SettingsMajor,
      accessibilityLabel: t('tabs.general'),
      panelID: 'general-panel',
    },
    {
      id: 'appearance',
      content: t('tabs.appearance'),
      icon: ThemeEditMajor,
      accessibilityLabel: t('tabs.appearance'),
      panelID: 'appearance-panel',
    },
    {
      id: 'advanced',
      content: t('tabs.advanced'),
      icon: ViewMajor,
      accessibilityLabel: t('tabs.advanced'),
      panelID: 'advanced-panel',
    },
    {
      id: 'analytics',
      content: t('tabs.analytics'),
      icon: AnalyticsMajor,
      accessibilityLabel: t('tabs.analytics'),
      panelID: 'analytics-panel',
    },
    {
      id: 'pages',
      content: t('tabs.pages'),
      icon: ViewMajor,
      accessibilityLabel: t('tabs.pages'),
      panelID: 'pages-panel',
    },
  ]

  const handleConfigChange = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('')

    try {
      // Save settings to Shopify API
      // This part will be integrated with Shopify API in real implementation
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call

      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleDemoPopup = () => {
    setShowDemoPopup(!showDemoPopup)
  }

  const handleLanguageChange = (languageCode) => {
    const success = setLanguage(languageCode)
    if (success) {
      setCurrentLanguage(languageCode)
      setShowLanguageSelector(false)
    }
  }

  const renderGeneralTab = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Heading>Widget Settings</Heading>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Show Widget
                </Text>
                <Checkbox
                  label="Enable recently viewed products widget"
                  checked={config.showWidget}
                  onChange={(checked) =>
                    handleConfigChange('showWidget', checked)
                  }
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Widget Position
                </Text>
                <Select
                  label="Widget horizontal position"
                  options={[
                    { label: 'Right Edge', value: 'right' },
                    { label: 'Left Edge', value: 'left' },
                  ]}
                  value={config.position}
                  onChange={(value) => handleConfigChange('position', value)}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Widget Vertical Position
                </Text>
                <TextField
                  label="Widget distance from top (%)"
                  value={config.verticalValue}
                  onChange={(value) =>
                    handleConfigChange('verticalValue', value)
                  }
                  placeholder="50"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.verticalValue}% (0% = top, 100% = bottom, 50%
                  = center)
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Maximum Product Count
                </Text>
                <RangeSlider
                  label="Maximum number of products to display"
                  value={config.maxProducts}
                  min={3}
                  max={10}
                  step={1}
                  onChange={(value) => handleConfigChange('maxProducts', value)}
                  output
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.maxProducts} products
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Widget Title
                </Text>
                <TextField
                  label="Title to display in widget"
                  value={config.title}
                  onChange={(value) => handleConfigChange('title', value)}
                  placeholder="Recently Viewed Products"
                />
              </Stack>
            </Stack>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  )

  const renderAppearanceTab = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Heading>Widget Title Colors</Heading>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Widget Title Background Color
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('widgetTitleBackground', color.hex)
                  }
                  color={config.widgetTitleBackground}
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Widget title background color
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Widget Title Font Color
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('widgetTitleColor', color.hex)
                  }
                  color={config.widgetTitleColor}
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Widget title font color
                </Text>
              </Stack>
            </Stack>
          </Card.Section>
        </Card>

        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Heading>Button Colors</Heading>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Widget Open/Close Button
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('expandButtonBackground', color.hex)
                  }
                  color={config.expandButtonBackground}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Up Arrow Button
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('scrollUpButtonBackground', color.hex)
                  }
                  color={config.scrollUpButtonBackground}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Down Arrow Button
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('scrollDownButtonBackground', color.hex)
                  }
                  color={config.scrollDownButtonBackground}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Close Button Background
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('closeButtonBackground', color.hex)
                  }
                  color={config.closeButtonBackground}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Close Button Font Color
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('closeButtonColor', color.hex)
                  }
                  color={config.closeButtonColor}
                />
              </Stack>
            </Stack>
          </Card.Section>
        </Card>

        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Heading>Product Thumbnail Colors</Heading>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Thumbnail Background
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('thumbnailBackground', color.hex)
                  }
                  color={config.thumbnailBackground}
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Product thumbnails background color
                </Text>
              </Stack>
            </Stack>
          </Card.Section>
        </Card>

        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Heading>Popup Colors</Heading>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Popup Header Background
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('popupHeaderBackground', color.hex)
                  }
                  color={config.popupHeaderBackground}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Popup Header Font Color
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('popupHeaderColor', color.hex)
                  }
                  color={config.popupHeaderColor}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Swiper Slider Background
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('swiperBackground', color.hex)
                  }
                  color={config.swiperBackground}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Product Name Background
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('productNameBackground', color.hex)
                  }
                  color={config.productNameBackground}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Product Name Font Color
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('productNameColor', color.hex)
                  }
                  color={config.productNameColor}
                />
              </Stack>
            </Stack>
          </Card.Section>
        </Card>

        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Heading>Typography Settings</Heading>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Widget Title Font Size
                </Text>
                <RangeSlider
                  label="Font size (px)"
                  value={config.widgetTitleFontSize}
                  min={12}
                  max={24}
                  step={1}
                  onChange={(value) =>
                    handleConfigChange('widgetTitleFontSize', value)
                  }
                  output
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.widgetTitleFontSize}px
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Widget Title Font Weight
                </Text>
                <RangeSlider
                  label="Font weight"
                  value={config.widgetTitleFontWeight}
                  min={300}
                  max={900}
                  step={100}
                  onChange={(value) =>
                    handleConfigChange('widgetTitleFontWeight', value)
                  }
                  output
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.widgetTitleFontWeight}
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Popup Title Font Size
                </Text>
                <RangeSlider
                  label="Font size (px)"
                  value={config.popupTitleFontSize}
                  min={14}
                  max={28}
                  step={1}
                  onChange={(value) =>
                    handleConfigChange('popupTitleFontSize', value)
                  }
                  output
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.popupTitleFontSize}px
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Popup Title Font Weight
                </Text>
                <RangeSlider
                  label="Font weight"
                  value={config.popupTitleFontWeight}
                  min={300}
                  max={900}
                  step={100}
                  onChange={(value) =>
                    handleConfigChange('popupTitleFontWeight', value)
                  }
                  output
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.popupTitleFontWeight}
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Product Name Font Size
                </Text>
                <RangeSlider
                  label="Font size (px)"
                  value={config.productNameFontSize}
                  min={12}
                  max={20}
                  step={1}
                  onChange={(value) =>
                    handleConfigChange('productNameFontSize', value)
                  }
                  output
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.productNameFontSize}px
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Product Name Font Weight
                </Text>
                <RangeSlider
                  label="Font weight"
                  value={config.productNameFontWeight}
                  min={300}
                  max={900}
                  step={100}
                  onChange={(value) =>
                    handleConfigChange('productNameFontWeight', value)
                  }
                  output
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.productNameFontWeight}
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Price Background
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('priceBackground', color.hex)
                  }
                  color={config.priceBackground}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Price Font Color
                </Text>
                <ColorPicker
                  onChange={(color) =>
                    handleConfigChange('priceColor', color.hex)
                  }
                  color={config.priceColor}
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Price Font Size
                </Text>
                <RangeSlider
                  label="Font size (px)"
                  value={config.priceFontSize}
                  min={10}
                  max={18}
                  step={1}
                  onChange={(value) =>
                    handleConfigChange('priceFontSize', value)
                  }
                  output
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.priceFontSize}px
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Price Font Weight
                </Text>
                <RangeSlider
                  label="Font weight"
                  value={config.priceFontWeight}
                  min={300}
                  max={900}
                  step={100}
                  onChange={(value) =>
                    handleConfigChange('priceFontWeight', value)
                  }
                  output
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.priceFontWeight}
                </Text>
              </Stack>
            </Stack>
          </Card.Section>
        </Card>

        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Heading>Display Options</Heading>

              <Stack vertical spacing="tight">
                <Checkbox
                  label="Show product prices"
                  checked={config.showPrice}
                  onChange={(checked) =>
                    handleConfigChange('showPrice', checked)
                  }
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="bodyMd" as="h3">
                  Animation Speed
                </Text>
                <RangeSlider
                  label="Animation duration (ms)"
                  value={config.animationSpeed}
                  min={100}
                  max={1000}
                  step={50}
                  onChange={(value) =>
                    handleConfigChange('animationSpeed', value)
                  }
                  output
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Current: {config.animationSpeed}ms
                </Text>
              </Stack>
            </Stack>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  )

  const renderAdvancedTab = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Heading>Advanced Settings</Heading>

              <Stack vertical spacing="tight">
                <Checkbox
                  label="Enable accessibility features"
                  checked={config.enableA11y}
                  onChange={(checked) =>
                    handleConfigChange('enableA11y', checked)
                  }
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Screen reader support and keyboard navigation
                </Text>
              </Stack>

              <Stack vertical spacing="tight">
                <Checkbox
                  label="Dark mode support"
                  checked={config.enableDarkMode}
                  onChange={(checked) =>
                    handleConfigChange('enableDarkMode', checked)
                  }
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Adapts to system dark mode settings
                </Text>
              </Stack>
            </Stack>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  )

  const renderAnalyticsTab = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Heading>Analytics and Tracking</Heading>

              <Stack vertical spacing="tight">
                <Checkbox
                  label="Collect analytics data"
                  checked={config.enableAnalytics}
                  onChange={(checked) =>
                    handleConfigChange('enableAnalytics', checked)
                  }
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Collects widget usage data and product view statistics
                </Text>
              </Stack>

              {config.enableAnalytics && (
                <Stack vertical spacing="loose">
                  <Banner title="Analytics Active" tone="success">
                    <p>
                      Widget usage data is being collected. This data is used to
                      improve store performance.
                    </p>
                  </Banner>

                  <Stack distribution="equalSpacing">
                    <Button
                      variant="primary"
                      onClick={() => {
                        // Export analytics data
                        console.log('Exporting analytics data...')
                      }}>
                      Export Data
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        // Clear analytics data
                        console.log('Clearing analytics data...')
                      }}>
                      Clear Data
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Card.Section>
        </Card>
      </Layout.Section>

      {/* General Statistics */}
      {config.enableAnalytics && (
        <Layout.Section>
          <Card>
            <Card.Section>
              <Stack vertical spacing="loose">
                <Heading>General Statistics</Heading>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginTop: '20px',
                  }}>
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}>
                      📊
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}>
                      0
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      Total Products
                    </div>
                  </div>

                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}>
                      👁️
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}>
                      0
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      Total Views
                    </div>
                  </div>

                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}>
                      ⏱️
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}>
                      0s
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      Average Duration
                    </div>
                  </div>

                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}>
                      📱
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}>
                      0
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      Active Devices
                    </div>
                  </div>
                </div>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      )}

      {/* Most Popular Products */}
      {config.enableAnalytics && (
        <Layout.Section>
          <Card>
            <Card.Section>
              <Stack vertical spacing="loose">
                <Heading>Most Popular Products</Heading>

                <div
                  style={{
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    padding: '20px',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <div style={{ textAlign: 'center', color: '#666' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      📈
                    </div>
                    <div style={{ fontSize: '18px', marginBottom: '8px' }}>
                      No data collected yet
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      Start collecting data by browsing product pages
                    </div>
                  </div>
                </div>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      )}

      {/* Daily Statistics */}
      {config.enableAnalytics && (
        <Layout.Section>
          <Card>
            <Card.Section>
              <Stack vertical spacing="loose">
                <Heading>Daily Statistics (Last 7 Days)</Heading>

                <div
                  style={{
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    padding: '20px',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <div style={{ textAlign: 'center', color: '#666' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      📊
                    </div>
                    <div style={{ fontSize: '18px', marginBottom: '8px' }}>
                      Daily data not available yet
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      Daily statistics will appear over time
                    </div>
                  </div>
                </div>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      )}
    </Layout>
  )

  const renderPagesTab = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <Card.Section>
            <Stack vertical spacing="loose">
              <Heading>Page Visibility Settings</Heading>
              <Text variant="bodyMd" as="p" color="subdued">
                Determine which pages the widget will appear on
              </Text>

              <Stack vertical spacing="tight">
                <Text variant="headingMd" as="h3">
                  Main Pages
                </Text>

                <Checkbox
                  label="Homepage"
                  checked={config.showOnHomepage}
                  onChange={(checked) =>
                    handleConfigChange('showOnHomepage', checked)
                  }
                />

                <Checkbox
                  label="Product Pages"
                  checked={config.showOnProductPages}
                  onChange={(checked) =>
                    handleConfigChange('showOnProductPages', checked)
                  }
                />

                <Checkbox
                  label="Collection Pages"
                  checked={config.showOnCollectionPages}
                  onChange={(checked) =>
                    handleConfigChange('showOnCollectionPages', checked)
                  }
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="headingMd" as="h3">
                  Content Pages
                </Text>

                <Checkbox
                  label="Blog Pages"
                  checked={config.showOnBlogPages}
                  onChange={(checked) =>
                    handleConfigChange('showOnBlogPages', checked)
                  }
                />

                <Checkbox
                  label="Article Pages"
                  checked={config.showOnArticlePages}
                  onChange={(checked) =>
                    handleConfigChange('showOnArticlePages', checked)
                  }
                />

                <Checkbox
                  label="Static Pages (About, Contact, etc.)"
                  checked={config.showOnStaticPages}
                  onChange={(checked) =>
                    handleConfigChange('showOnStaticPages', checked)
                  }
                />

                <Checkbox
                  label="Search Page"
                  checked={config.showOnSearchPages}
                  onChange={(checked) =>
                    handleConfigChange('showOnSearchPages', checked)
                  }
                />
              </Stack>

              <Stack vertical spacing="tight">
                <Text variant="headingMd" as="h3">
                  Shopping Pages
                </Text>

                <Checkbox
                  label="Cart Page"
                  checked={config.showOnCartPage}
                  onChange={(checked) =>
                    handleConfigChange('showOnCartPage', checked)
                  }
                />

                <Checkbox
                  label="Checkout Pages"
                  checked={config.showOnCheckoutPages}
                  onChange={(checked) =>
                    handleConfigChange('showOnCheckoutPages', checked)
                  }
                  disabled={true}
                />
                <Text variant="bodyMd" as="p" color="subdued">
                  Widget display on checkout pages is not recommended
                </Text>
              </Stack>
            </Stack>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderGeneralTab()
      case 1:
        return renderAppearanceTab()
      case 2:
        return renderAdvancedTab()
      case 3:
        return renderAnalyticsTab()
      case 4:
        return renderPagesTab()
      default:
        return renderGeneralTab()
    }
  }

  return (
    <Page
      title={t('general.title')}
      subtitle={t('general.subtitle')}
      primaryAction={{
        content: t('general.saveSettings'),
        onAction: handleSave,
        loading: isSaving,
      }}
      secondaryActions={[
        {
          content: t('general.preview'),
          onAction: () => window.open('/preview', '_blank'),
        },
      ]}
      actionGroups={[
        {
          title: 'Language',
          actions: [
            {
              content: '🌍 Choose Language',
              onAction: () => setShowLanguageSelector(true),
            },
          ],
        },
      ]}>
      {saveStatus === 'success' && (
        <Banner title="Success!" tone="success">
          <p>Widget settings saved successfully.</p>
        </Banner>
      )}

      {saveStatus === 'error' && (
        <Banner title="Error!" tone="critical">
          <p>An error occurred while saving settings. Please try again.</p>
        </Banner>
      )}

      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              <Tabs tabs={tabs} selected={activeTab} onSelect={setActiveTab}>
                {renderTabContent()}
              </Tabs>
            </Card.Section>
          </Card>
        </Layout.Section>

        {/* Widget Preview Section */}
        <Layout.Section>
          <Card>
            <Card.Section>
              <Stack vertical spacing="loose">
                <Heading>Widget Preview</Heading>
                <Text variant="bodyMd" as="p" color="subdued">
                  You can preview how the widget will look here
                </Text>

                <div
                  style={{
                    border: '2px dashed #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                    minHeight: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                  {/* Demo Product Page Background */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      opacity: 0.3,
                    }}></div>

                  {/* Demo Product Content */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      maxWidth: '400px',
                      textAlign: 'center',
                    }}>
                    <div
                      style={{
                        width: '200px',
                        height: '150px',
                        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                        borderRadius: '8px',
                        margin: '0 auto 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}>
                      Product Image
                    </div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                      Demo Product
                    </h3>
                    <p style={{ margin: '0 0 20px 0', color: '#666' }}>
                      This is a demo product page
                    </p>
                  </div>

                  {/* Widget Preview - Right Edge */}
                  <div
                    onClick={toggleDemoPopup}
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: config.backgroundColor,
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      padding: '16px',
                      color: config.primaryColor,
                      fontSize: `${config.fontSize}px`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      zIndex: 2,
                      width: '80px',
                      minHeight: '300px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    {/* Close Button */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '12px',
                        opacity: 0.7,
                      }}>
                      ✕
                    </div>

                    {/* Vertical Title */}
                    <div
                      style={{
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        textAlign: 'center',
                      }}>
                      {config.title}
                    </div>

                    {/* Product Thumbnails */}
                    <div style={{ margin: '20px 0' }}>
                      {[1, 2, 3].map((_, index) => (
                        <div
                          key={index}
                          style={{
                            width: '60px',
                            height: '60px',
                            background:
                              'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
                            borderRadius: '6px',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            border: '1px solid #f0f0f0',
                          }}>
                          🛍️
                        </div>
                      ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          background: config.primaryColor,
                          color: config.backgroundColor,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                        }}>
                        ↑
                      </div>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          background: config.primaryColor,
                          color: config.backgroundColor,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                        }}>
                        ↓
                      </div>
                    </div>
                  </div>

                  {/* Widget Preview - Left Edge (Alternative) */}
                  {config.position === 'left' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: config.backgroundColor,
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        padding: '16px',
                        color: config.primaryColor,
                        fontFamily: config.fontFamily,
                        fontSize: `${config.fontSize}px`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        zIndex: 2,
                      }}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                          }}>
                          {config.title}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                          👁️ <span>3</span>
                        </div>
                        {config.showPrice && (
                          <div
                            style={{
                              fontSize: '10px',
                              opacity: 0.6,
                              marginTop: '4px',
                            }}>
                            💰
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Widget Preview - Bottom Edge */}
                  {config.position === 'bottom' && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: config.backgroundColor,
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        padding: '16px',
                        color: config.primaryColor,
                        fontSize: `${config.fontSize}px`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        zIndex: 2,
                      }}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontWeight: 'bold',
                            marginBottom: '8px',
                          }}>
                          {config.title}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                          👁️ <span>3</span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '8px',
                            marginTop: '4px',
                          }}>
                          {config.showPrice && (
                            <span style={{ fontSize: '10px', opacity: 0.6 }}>
                              💰
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Widget Preview - Top Edge */}
                  {config.position === 'top' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: config.backgroundColor,
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        padding: '16px',
                        color: config.primaryColor,
                        fontSize: `${config.fontSize}px`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        zIndex: 2,
                      }}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontWeight: 'bold',
                            marginBottom: '8px',
                          }}>
                          {config.title}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                          👁️ <span>3</span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '8px',
                            marginTop: '4px',
                          }}>
                          {config.showPrice && (
                            <span style={{ fontSize: '10px', opacity: 0.6 }}>
                              💰
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Stack distribution="equalSpacing">
                  <Button
                    variant="primary"
                    onClick={() =>
                      window.open(
                        'https://recentlyviewedproducts.myshopify.com',
                        '_blank'
                      )
                    }>
                    Visit Store
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      window.open(
                        'https://recentlyviewedproducts.myshopify.com/admin/themes/180276658541/editor',
                        '_blank'
                      )
                    }>
                    Theme Editor
                  </Button>
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>

      {/* CSS Animations */}
      <style>
        {`
             @keyframes slideIn {
               from {
                 opacity: 0;
                 transform: translateY(20px);
               }
               to {
                 opacity: 1;
                 transform: translateY(0);
               }
             }
           `}
      </style>

      {/* Demo Popup */}
      {showDemoPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}>
          <div
            style={{
              background: config.backgroundColor,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              animation: 'slideIn 0.3s ease',
            }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                borderBottom: '1px solid #e0e0e0',
              }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: config.primaryColor,
                }}>
                {config.title}
              </h3>
              <button
                onClick={toggleDemoPopup}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  color: config.primaryColor,
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                }}>
                ✕
              </button>
            </div>

            <div
              style={{
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
              {/* Demo Products */}
              {[
                {
                  title: 'Demo Product 1',
                  image: '🛍️',
                  price: '₺99.99',
                  category: 'Electronics',
                },
                {
                  title: 'Demo Product 2',
                  image: '🎯',
                  price: '₺149.99',
                  category: 'Clothing',
                },
                {
                  title: 'Demo Product 3',
                  image: '🚀',
                  price: '₺199.99',
                  category: 'Sports',
                },
              ].map((product, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0',
                  }}>
                  <div
                    style={{
                      width: '100%',
                      height: '120px',
                      background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      marginBottom: '12px',
                    }}>
                    {product.image}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: config.primaryColor,
                      lineHeight: 1.4,
                      marginBottom: '6px',
                    }}>
                    {product.title}
                  </div>

                  {config.showPrice && (
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: 600,
                      }}>
                      {product.price}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toggle Bar Preview */}
      <div
        style={{
          position: 'fixed',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          background: config.primaryColor,
          color: config.backgroundColor,
          width: '40px',
          padding: '16px 8px',
          borderRadius: '8px 0 0 8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          cursor: 'pointer',
        }}>
        <div
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontWeight: '600',
            fontSize: '12px',
            textAlign: 'center',
            marginBottom: '16px',
            whiteSpace: 'nowrap',
          }}>
          {config.title}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
          }}>
          <div
            style={{
              background: config.backgroundColor,
              color: config.primaryColor,
              border: 'none',
              borderRadius: '4px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}>
            ↑
          </div>
          <div
            style={{
              background: config.backgroundColor,
              color: config.primaryColor,
              border: 'none',
              borderRadius: '4px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}>
            ↓
          </div>
        </div>
      </div>

      {/* Language Selector Popover */}
      <Popover
        active={showLanguageSelector}
        activator={
          <Button
            icon={GlobeMajor}
            onClick={() => setShowLanguageSelector(true)}
            variant="tertiary">
            {getSupportedLanguages().find(
              (lang) => lang.code === currentLanguage
            )?.flag || '🌍'}
          </Button>
        }
        onClose={() => setShowLanguageSelector(false)}
        preferredPosition="below"
        preferredAlignment="center">
        <ActionList
          actionRole="menuitem"
          items={getSupportedLanguages().map((lang) => ({
            content: `${lang.flag} ${lang.name}`,
            onAction: () => handleLanguageChange(lang.code),
            active: lang.code === currentLanguage,
          }))}
        />
      </Popover>
    </Page>
  )
}

export default App
