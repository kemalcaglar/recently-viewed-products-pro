const express = require('express');
const crypto = require('crypto');
const sessionRoutes = require('./api/session');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Shopify-Hmac-Sha256, X-Shopify-Shop-Domain, X-Shopify-Topic');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

// Import session routes
app.use('/api/session', sessionRoutes);

// Ana sayfa - App'in ana sayfası
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recently Viewed Products Pro</title>
        <script src="https://unpkg.com/@shopify/app-bridge@3.7.9/dist/index.global.js"></script>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 0;
                background: #f6f6f7;
            }
            .header {
                background: #004c3f;
                color: white;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .header p {
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 16px;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            .widget-section {
                background: white;
                border-radius: 12px;
                padding: 30px;
                margin-bottom: 30px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .widget-section h2 {
                color: #004c3f;
                margin-top: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .widget-section p {
                color: #666;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            .settings-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            .setting-group {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }
            .setting-group h3 {
                color: #495057;
                margin-top: 0;
                font-size: 18px;
                font-weight: 600;
            }
            .setting-item {
                margin-bottom: 15px;
            }
            .setting-item label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #495057;
            }
            .setting-item input, .setting-item select {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 14px;
            }
            .setting-item input[type="color"] {
                width: 60px;
                height: 40px;
                padding: 2px;
            }
            .test-button {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #008060;
                color: white;
                border: none;
                padding: 15px 25px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
            }
            .test-button:hover {
                background: #006b52;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            }
            .status-bar {
                background: #e7f3ff;
                border: 1px solid #b3d9ff;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
                text-align: center;
            }
            .status-bar.success {
                background: #d4edda;
                border-color: #c3e6cb;
                color: #155724;
            }
            .status-bar.error {
                background: #f8d7da;
                border-color: #f5c6cb;
                color: #721c24;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔍 Recently Viewed Products Pro</h1>
            <p>Highly customizable Recently Viewed Products Widget for Shopify</p>
        </div>

        <div class="container">
            <div class="widget-section">
                <h2>🎨 Widget Customization</h2>
                <p>Customize the appearance of your Recently Viewed Products widget. All changes will be applied to your store's frontend.</p>
                
                <div class="settings-grid">
                    <div class="setting-group">
                        <h3>Close Button Settings</h3>
                        <div class="setting-item">
                            <label for="closeButtonText">Button Text:</label>
                            <input type="text" id="closeButtonText" value="Kapat" placeholder="Button text">
                        </div>
                        <div class="setting-item">
                            <label for="closeButtonColor">Text Color:</label>
                            <input type="color" id="closeButtonColor" value="#000000">
                        </div>
                        <div class="setting-item">
                            <label for="closeButtonBackground">Background Color:</label>
                            <input type="color" id="closeButtonBackground" value="#ffffff">
                        </div>
                        <div class="setting-item">
                            <label for="closeButtonFontSize">Font Size:</label>
                            <select id="closeButtonFontSize">
                                <option value="12px">12px</option>
                                <option value="14px" selected>14px</option>
                                <option value="16px">16px</option>
                                <option value="18px">18px</option>
                                <option value="20px">20px</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="closeButtonFontWeight">Font Weight:</label>
                            <select id="closeButtonFontWeight">
                                <option value="normal">Normal</option>
                                <option value="bold" selected>Bold</option>
                                <option value="600">600</option>
                                <option value="700">700</option>
                            </select>
                        </div>
                    </div>

                    <div class="setting-group">
                        <h3>Product Name Settings</h3>
                        <div class="setting-item">
                            <label for="productNameColor">Text Color:</label>
                            <input type="color" id="productNameColor" value="#333333">
                        </div>
                        <div class="setting-item">
                            <label for="productNameBackground">Background Color:</label>
                            <input type="color" id="productNameBackground" value="#ffffff">
                        </div>
                        <div class="setting-item">
                            <label for="productNameFontSize">Font Size:</label>
                            <select id="productNameFontSize">
                                <option value="12px">12px</option>
                                <option value="14px" selected>14px</option>
                                <option value="16px">16px</option>
                                <option value="18px">18px</option>
                                <option value="20px">20px</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="productNameFontWeight">Font Weight:</label>
                            <select id="productNameFontWeight">
                                <option value="normal">Normal</option>
                                <option value="bold" selected>Bold</option>
                                <option value="600">600</option>
                                <option value="700">700</option>
                            </select>
                        </div>
                    </div>

                    <div class="setting-group">
                        <h3>Price Settings</h3>
                        <div class="setting-item">
                            <label for="priceColor">Text Color:</label>
                            <input type="color" id="priceColor" value="#008060">
                        </div>
                        <div class="setting-item">
                            <label for="priceBackground">Background Color:</label>
                            <input type="color" id="priceBackground" value="#ffffff">
                        </div>
                        <div class="setting-item">
                            <label for="priceFontSize">Font Size:</label>
                            <select id="priceFontSize">
                                <option value="12px">12px</option>
                                <option value="14px" selected>14px</option>
                                <option value="16px">16px</option>
                                <option value="18px">18px</option>
                                <option value="20px">20px</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="priceFontWeight">Font Weight:</label>
                            <select id="priceFontWeight">
                                <option value="normal">Normal</option>
                                <option value="bold" selected>Bold</option>
                                <option value="600">600</option>
                                <option value="700">700</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <button onclick="saveSettings()" style="background: #008060; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin: 0 10px;">
                        💾 Save Settings
                    </button>
                    <button onclick="resetSettings()" style="background: #6c757d; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin: 0 10px;">
                        🔄 Reset to Default
                    </button>
                </div>

                <div id="statusBar" class="status-bar" style="display: none;"></div>
            </div>

            <div class="widget-section">
                <h2>📱 Widget Preview</h2>
                <p>Preview how your widget will look with the current settings.</p>
                <div id="widgetPreview" style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; text-align: center;">
                    <div style="margin-bottom: 15px;">
                        <button id="previewCloseButton" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
                            Kapat
                        </button>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <div id="previewProductName" style="padding: 10px; border-radius: 4px;">
                            Sample Product Name
                        </div>
                    </div>
                    <div>
                        <div id="previewPrice" style="padding: 10px; border-radius: 4px;">
                            $29.99
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Test Button -->
        <button class="test-button" onclick="window.showTestPage()">
            🧪 Test Session Tokens
        </button>

        <script>
            // Initialize App Bridge
            let appBridge = null;
            let isBridgeReady = false;

            // Initialize when page loads
            document.addEventListener('DOMContentLoaded', function() {
                console.log('🚀 Recently Viewed Products Pro App Loading...');
                initializeAppBridge();
                updatePreview();
            });

            // Initialize Shopify App Bridge
            async function initializeAppBridge() {
                try {
                    console.log('🔄 Initializing App Bridge...');

                    // Check if we're in Shopify admin context
                    if (typeof window.Shopify === 'undefined') {
                        console.log('ℹ️ Not in Shopify admin context');
                        return;
                    }

                    // Get Shopify context
                    const urlParams = new URLSearchParams(window.location.search);
                    const host = urlParams.get('host');

                    if (!host) {
                        console.log('ℹ️ Missing host parameter');
                        return;
                    }

                    // Initialize App Bridge
                    appBridge = window.createApp({
                        apiKey: 'your-api-key', // Will be replaced by Shopify
                        host: host,
                        forceRedirect: false
                    });

                    console.log('✅ App Bridge initialized:', appBridge);
                    isBridgeReady = true;

                } catch (error) {
                    console.error('❌ App Bridge initialization failed:', error);
                }
            }

            // Update preview
            function updatePreview() {
                const closeButton = document.getElementById('previewCloseButton');
                const productName = document.getElementById('previewProductName');
                const price = document.getElementById('previewPrice');

                // Close button
                closeButton.style.color = document.getElementById('closeButtonColor').value;
                closeButton.style.backgroundColor = document.getElementById('closeButtonBackground').value;
                closeButton.style.fontSize = document.getElementById('closeButtonFontSize').value;
                closeButton.style.fontWeight = document.getElementById('closeButtonFontWeight').value;

                // Product name
                productName.style.color = document.getElementById('productNameColor').value;
                productName.style.backgroundColor = document.getElementById('productNameBackground').value;
                productName.style.fontSize = document.getElementById('productNameFontSize').value;
                productName.style.fontWeight = document.getElementById('productNameFontWeight').value;

                // Price
                price.style.color = document.getElementById('priceColor').value;
                price.style.backgroundColor = document.getElementById('priceBackground').value;
                price.style.fontSize = document.getElementById('priceFontSize').value;
                price.style.fontWeight = document.getElementById('priceFontWeight').value;
            }

            // Save settings
            function saveSettings() {
                const settings = {
                    closeButton: {
                        text: document.getElementById('closeButtonText').value,
                        color: document.getElementById('closeButtonColor').value,
                        background: document.getElementById('closeButtonBackground').value,
                        fontSize: document.getElementById('closeButtonFontSize').value,
                        fontWeight: document.getElementById('closeButtonFontWeight').value
                    },
                    productName: {
                        color: document.getElementById('productNameColor').value,
                        background: document.getElementById('productNameBackground').value,
                        fontSize: document.getElementById('productNameFontSize').value,
                        fontWeight: document.getElementById('productNameFontWeight').value
                    },
                    price: {
                        color: document.getElementById('priceColor').value,
                        background: document.getElementById('priceBackground').value,
                        fontSize: document.getElementById('priceFontSize').value,
                        fontWeight: document.getElementById('priceFontWeight').value
                    }
                };

                // Save to localStorage (in real app, this would save to Shopify)
                localStorage.setItem('recentlyViewedWidgetSettings', JSON.stringify(settings));
                
                showStatus('✅ Settings saved successfully!', 'success');
                updatePreview();
            }

            // Reset settings
            function resetSettings() {
                document.getElementById('closeButtonText').value = 'Kapat';
                document.getElementById('closeButtonColor').value = '#000000';
                document.getElementById('closeButtonBackground').value = '#ffffff';
                document.getElementById('closeButtonFontSize').value = '14px';
                document.getElementById('closeButtonFontWeight').value = 'bold';
                
                document.getElementById('productNameColor').value = '#333333';
                document.getElementById('productNameBackground').value = '#ffffff';
                document.getElementById('productNameFontSize').value = '14px';
                document.getElementById('productNameFontWeight').value = 'bold';
                
                document.getElementById('priceColor').value = '#008060';
                document.getElementById('priceBackground').value = '#ffffff';
                document.getElementById('priceFontSize').value = '14px';
                document.getElementById('priceFontWeight').value = 'bold';
                
                updatePreview();
                showStatus('🔄 Settings reset to default!', 'success');
            }

            // Show status
            function showStatus(message, type = 'success') {
                const statusBar = document.getElementById('statusBar');
                statusBar.textContent = message;
                statusBar.className = 'status-bar ' + type;
                statusBar.style.display = 'block';
                
                setTimeout(() => {
                    statusBar.style.display = 'none';
                }, 3000);
            }

            // Show test page - Make it global
            window.showTestPage = function() {
                if (!appBridge) {
                    alert('App Bridge not initialized. Please wait for initialization to complete.');
                    return;
                }
                
                // Create test page content
                const testContent = '<div style="padding: 20px; max-width: 900px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">' +
                    '<h1 style="color: #004c3f; text-align: center;">🔐 App Bridge Session Token Test</h1>' +
                    '<p style="text-align: center; color: #666;">Recently Viewed Products Pro - Session Token Testing</p>' +
                    
                    '<div style="background: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 6px; margin: 20px 0;">' +
                        '<h4 style="margin-top: 0; color: #0066cc;">📊 App Status:</h4>' +
                        '<pre style="background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto;">App Bridge: ' + (isBridgeReady ? 'Ready' : 'Not Ready') + '</pre>' +
                    '</div>' +

                    '<div style="margin: 20px 0; text-align: center;">' +
                        '<button onclick="window.testSessionToken()" style="background: #008060; color: white; border: none; padding: 12px 24px; border-radius: 6px; margin: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">' +
                            '🧪 Test Session Token' +
                        '</button>' +
                        '<button onclick="window.validateSession()" style="background: #008060; color: white; border: none; padding: 12px 24px; border-radius: 6px; margin: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">' +
                            '✅ Validate Session' +
                        '</button>' +
                        '<button onclick="window.refreshSession()" style="background: #008060; color: white; border: none; padding: 12px 24px; border-radius: 6px; margin: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">' +
                            '🔄 Refresh Session' +
                        '</button>' +
                    '</div>' +

                    '<div id="testResults" style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; margin: 20px 0; display: none;">' +
                        '<h4 style="margin-top: 0; color: #2c3e50;">Test Results:</h4>' +
                        '<div id="resultContent" style="font-family: monospace; font-size: 13px; white-space: pre-wrap; max-height: 300px; overflow-y: auto;"></div>' +
                    '</div>' +

                    '<div style="text-align: center; margin-top: 30px;">' +
                        '<button onclick="window.location.reload()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">' +
                            '← Back to App' +
                        '</button>' +
                    '</div>' +
                '</div>';

                // Replace current content with test page
                document.body.innerHTML = testContent;
                
                // Make functions globally available
                window.testSessionToken = testSessionToken;
                window.validateSession = validateSession;
                window.refreshSession = refreshSession;
            };

            // Test session token - Make it global
            window.testSessionToken = async function() {
                try {
                    const resultElement = document.getElementById('resultContent');
                    resultElement.textContent = '🧪 Testing session token...';
                    document.getElementById('testResults').style.display = 'block';

                    const response = await appBridge.authenticatedFetch('/api/session/info');
                    
                    if (response.ok) {
                        const data = await response.json();
                        resultElement.textContent = '✅ Session token test successful!\n\nToken Data:\n' + JSON.stringify(data, null, 2);
                        resultElement.style.color = '#155724';
                        resultElement.style.background = '#d4edda';
                    } else {
                        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                    }
                } catch (error) {
                    const resultElement = document.getElementById('resultContent');
                    resultElement.textContent = '❌ Session token test failed:\n\n' + error.message;
                    resultElement.style.color = '#721c24';
                    resultElement.style.background = '#f8d7da';
                    document.getElementById('testResults').style.display = 'block';
                }
            };

            // Validate session - Make it global
            window.validateSession = async function() {
                try {
                    const resultElement = document.getElementById('resultContent');
                    resultElement.textContent = '🧪 Validating session...';
                    document.getElementById('testResults').style.display = 'block';

                    const response = await appBridge.authenticatedFetch('/api/session/validate');
                    
                    if (response.ok) {
                        const data = await response.json();
                        resultElement.textContent = '✅ Session validation successful!\n\nResponse:\n' + JSON.stringify(data, null, 2);
                        resultElement.style.color = '#155724';
                        resultElement.style.background = '#d4edda';
                    } else {
                        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                    }
                } catch (error) {
                    const resultElement = document.getElementById('resultContent');
                    resultElement.textContent = '❌ Session validation failed:\n\n' + error.message;
                    resultElement.style.color = '#721c24';
                    resultElement.style.background = '#f8d7da';
                    document.getElementById('testResults').style.display = 'block';
                }
            };

            // Refresh session - Make it global
            window.refreshSession = async function() {
                try {
                    const resultElement = document.getElementById('resultContent');
                    resultElement.textContent = '🔄 Refreshing session...';
                    document.getElementById('testResults').style.display = 'block';

                    const response = await appBridge.authenticatedFetch('/api/session/refresh', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            shop: window.Shopify?.shop || 'unknown',
                            user: 'current'
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        resultElement.textContent = '✅ Session refresh successful!\n\nNew Session Data:\n' + JSON.stringify(data, null, 2);
                        resultElement.style.color = '#155724';
                        resultElement.style.background = '#d4edda';
                    } else {
                        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                    }
                } catch (error) {
                    const resultElement = document.getElementById('resultContent');
                    resultElement.textContent = '❌ Session refresh failed:\n\n' + error.message;
                    resultElement.style.color = '#721c24';
                    resultElement.style.background = '#f8d7da';
                    document.getElementById('testResults').style.display = 'block';
                }
            };

            // Add event listeners for real-time preview
            document.addEventListener('DOMContentLoaded', function() {
                const inputs = document.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.addEventListener('change', updatePreview);
                    input.addEventListener('input', updatePreview);
                });
            });
        </script>
    </body>
    </html>
  `);
});

// HMAC verification function
function verifyWebhook(body, hmacHeader, secret) {
  if (!body || !hmacHeader || !secret) {
    console.log('❌ Missing required parameters for HMAC verification');
    return false;
  }

  try {
    const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
    const calculatedHmac = crypto
      .createHmac('sha256', secret)
      .update(bodyString, 'utf8')
      .digest('base64');

    console.log('🔐 HMAC Verification:');
    console.log('  - Calculated HMAC:', calculatedHmac);
    console.log('  - Received HMAC:', hmacHeader);
    console.log('  - Match:', calculatedHmac === hmacHeader);

    return calculatedHmac === hmacHeader;
  } catch (error) {
    console.error('❌ HMAC verification error:', error);
    return false;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// APP_UNINSTALLED webhook
app.post('/webhooks/app/uninstalled', (req, res) => {
  console.log('🔔 APP_UNINSTALLED webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('Headers:', { hmacHeader, shopHeader, topicHeader });
  console.log('Body:', req.body);

  // HMAC verification
  const secret = process.env.SHOPIFY_API_SECRET || 'test_secret';
  const isValid = verifyWebhook(req.body, hmacHeader, secret);

  if (isValid) {
    console.log('✅ HMAC verification: SUCCESS');
    res.status(200).send('OK');
  } else {
    console.log('❌ HMAC verification: FAILED');
    res.status(401).send('Unauthorized');
  }
});

// SHOP_UPDATE webhook
app.post('/webhooks/shop/update', (req, res) => {
  console.log('🔔 SHOP_UPDATE webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('Headers:', { hmacHeader, shopHeader, topicHeader });
  console.log('Body:', req.body);

  // HMAC verification
  const secret = process.env.SHOPIFY_API_SECRET || 'test_secret';
  const isValid = verifyWebhook(req.body, hmacHeader, secret);

  if (isValid) {
    console.log('✅ HMAC verification: SUCCESS');
    res.status(200).send('OK');
  } else {
    console.log('❌ HMAC verification: FAILED');
    res.status(401).send('Unauthorized');
  }
});

// CUSTOMERS_DATA_REQUEST webhook
app.post('/webhooks/customers/data_request', (req, res) => {
  console.log('🔔 CUSTOMERS_DATA_REQUEST webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('Headers:', { hmacHeader, shopHeader, topicHeader });
  console.log('Body:', req.body);

  // HMAC verification
  const secret = process.env.SHOPIFY_API_SECRET || 'test_secret';
  const isValid = verifyWebhook(req.body, hmacHeader, secret);

  if (isValid) {
    console.log('✅ HMAC verification: SUCCESS');
    res.status(200).send('OK');
  } else {
    console.log('❌ HMAC verification: FAILED');
    res.status(401).send('Unauthorized');
  }
});

// CUSTOMERS_REDACT webhook
app.post('/webhooks/customers/redact', (req, res) => {
  console.log('🔔 CUSTOMERS_REDACT webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('Headers:', { hmacHeader, shopHeader, topicHeader });
  console.log('Body:', req.body);

  // HMAC verification
  const secret = process.env.SHOPIFY_API_SECRET || 'test_secret';
  const isValid = verifyWebhook(req.body, hmacHeader, secret);

  if (isValid) {
    console.log('✅ HMAC verification: SUCCESS');
    res.status(200).send('OK');
  } else {
    console.log('❌ HMAC verification: FAILED');
    res.status(401).send('Unauthorized');
  }
});

// SHOP_REDACT webhook
app.post('/webhooks/shop/redact', (req, res) => {
  console.log('🔔 SHOP_REDACT webhook received');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const shopHeader = req.headers['x-shopify-shop-domain'];
  const topicHeader = req.headers['x-shopify-topic'];

  console.log('Headers:', { hmacHeader, shopHeader, topicHeader });
  console.log('Body:', req.body);

  // HMAC verification
  const secret = process.env.SHOPIFY_API_SECRET || 'test_secret';
  const isValid = verifyWebhook(req.body, hmacHeader, secret);

  if (isValid) {
    console.log('✅ HMAC verification: SUCCESS');
    res.status(200).send('OK');
  } else {
    console.log('❌ HMAC verification: FAILED');
    res.status(401).send('Unauthorized');
  }
});

// Auth endpoint for Shopify OAuth
app.get('/auth', (req, res) => {
  console.log('🔐 Auth endpoint accessed');
  res.json({
    message: 'Auth endpoint for Recently Viewed Products Pro',
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
  console.log(`📡 Webhook endpoints:`);
  console.log(`   - HEALTH: http://0.0.0.0:${PORT}/health`);
  console.log(`   - ROOT: http://0.0.0.0:${PORT}/`);
  console.log(`   - APP_UNINSTALLED: http://0.0.0.0:${PORT}/webhooks/app/uninstalled`);
  console.log(`   - SHOP_UPDATE: http://0.0.0.0:${PORT}/webhooks/shop/update`);
  console.log(`   - CUSTOMERS_DATA_REQUEST: http://0.0.0.0:${PORT}/webhooks/customers/data_request`);
  console.log(`   - CUSTOMERS_REDACT: http://0.0.0.0:${PORT}/webhooks/customers/redact`);
  console.log(`   - SHOP_REDACT: http://0.0.0.0:${PORT}/webhooks/shop/redact`);
  console.log(`   - AUTH: http://0.0.0.0:${PORT}/auth`);
  console.log(`🌍 Server listening on all interfaces`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  process.exit(0);
});
