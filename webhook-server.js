const express = require('express');
const crypto = require('crypto');
const sessionRoutes = require('./api/session');
const { webhookAuth, webhookRateLimit } = require('./src/middleware/webhookAuth');
const oauth = require('./api/oauth');
const billing = require('./api/billing');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8080;

// Middleware
// IMPORTANT: Raw body parsing for webhooks (must come before JSON parsing)
app.use('/webhooks', express.raw({ type: '*/*' }));
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

// Health check - Railway/deploy healthcheck için (en hafif endpoint, erken tanımlı)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Ana sayfa - App'in ana sayfası
// UYARI: res.send() icindeki string icinde backtick veya Authorization Bearer sessionToken
// iceren template literal KULLANMA - SyntaxError: Unexpected identifier 'Bearer' olur.
app.get('/', (req, res) => {
    const apiKeyForBridge = process.env.SHOPIFY_API_KEY || 'your-api-key';
    const shop = (req.query.shop || '').toString();
    const host = (req.query.host || '').toString();
    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recently Viewed Products Pro - Shopify Widget</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            text-align: center;
            margin-bottom: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            animation: fadeInDown 0.8s ease;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            color: white;
        }

        h1 {
            color: #2d3748;
            font-size: 42px;
            margin-bottom: 15px;
            font-weight: 700;
        }

        .description {
            color: #718096;
            font-size: 18px;
            margin-bottom: 30px;
            line-height: 1.6;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 48px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
            animation: fadeInUp 0.8s ease 0.2s backwards;
        }

        .feature-card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 40px;
            margin-bottom: 15px;
        }

        .feature-title {
            color: #2d3748;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .feature-text {
            color: #718096;
            font-size: 14px;
            line-height: 1.5;
        }

        .gallery {
            background: white;
            border-radius: 20px;
            padding: 50px 40px;
            margin-bottom: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            animation: fadeInUp 0.8s ease 0.4s backwards;
        }

        .gallery-title {
            text-align: center;
            color: #2d3748;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 40px;
        }

        .demo-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }

        .demo-image {
            position: relative;
            padding-bottom: 100%;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .demo-image:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .demo-image::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            opacity: 0.3;
        }

        .demo-image:nth-child(1)::before {
            content: '🛍️';
        }

        .demo-image:nth-child(2)::before {
            content: '👀';
        }

        .demo-image:nth-child(3)::before {
            content: '⭐';
        }

        .demo-image:nth-child(4)::before {
            content: '🎨';
        }

        .demo-image:nth-child(5)::before {
            content: '📱';
        }

        .demo-image:nth-child(6)::before {
            content: '💎';
        }

        .demo-image:nth-child(7)::before {
            content: '🚀';
        }

        .demo-image:nth-child(8)::before {
            content: '✨';
        }

        .demo-label {
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.9);
            padding: 8px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            color: #2d3748;
            text-align: center;
        }

        .support-section {
            background: white;
            border-radius: 20px;
            padding: 50px 40px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            animation: fadeInUp 0.8s ease 0.6s backwards;
        }

        .support-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        .support-title {
            color: #2d3748;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 15px;
        }

        .support-text {
            color: #718096;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.6;
        }

        .support-button {
            display: inline-block;
            background: #48bb78;
            color: white;
            padding: 16px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(72, 187, 120, 0.3);
        }

        .support-button:hover {
            background: #38a169;
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(72, 187, 120, 0.4);
        }

        .footer {
            text-align: center;
            padding: 30px 20px;
            color: white;
            font-size: 14px;
            margin-top: 40px;
            opacity: 0.9;
        }

        @media (max-width: 1024px) {
            .demo-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 32px;
            }

            .description {
                font-size: 16px;
            }

            .header,
            .gallery,
            .support-section {
                padding: 40px 30px;
            }

            .gallery-title {
                font-size: 24px;
            }

            .features {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
            h1 {
                font-size: 28px;
            }

            .header,
            .gallery,
            .support-section {
                padding: 30px 20px;
            }

            .cta-button,
            .support-button {
                padding: 14px 32px;
                font-size: 16px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <div class="logo">👁️</div>
            <h1>Recently Viewed Products Pro</h1>
            <p class="description">
                Highly customizable Recently Viewed Products Widget for Shopify.<br>
                Boost conversions by showing customers what they've been browsing.
            </p>
            <a href="#" id="btn-onboarding" class="cta-button" role="button">Go to onboarding</a>
        </div>

        <!-- Features Section -->
        <div class="features">
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <div class="feature-title">Lightning Fast</div>
                <div class="feature-text">Optimized performance with minimal load time impact</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎨</div>
                <div class="feature-title">Fully Customizable</div>
                <div class="feature-text">Match your store's design perfectly with custom styles</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📱</div>
                <div class="feature-title">Mobile Responsive</div>
                <div class="feature-text">Looks great on all devices and screen sizes</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔧</div>
                <div class="feature-title">Easy Setup</div>
                <div class="feature-text">Get started in minutes with our simple onboarding</div>
            </div>
        </div>

        <!-- Gallery Section -->
        <div class="gallery">
            <h2 class="gallery-title">Widget Showcase</h2>
            <div class="demo-grid">
                <div class="demo-image">
                    <div class="demo-label">Default Theme</div>
                </div>
                <div class="demo-image">
                    <div class="demo-label">Dark Mode</div>
                </div>
                <div class="demo-image">
                    <div class="demo-label">Minimal Style</div>
                </div>
                <div class="demo-image">
                    <div class="demo-label">Colorful</div>
                </div>
            </div>
            <div class="demo-grid">
                <div class="demo-image">
                    <div class="demo-label">Mobile View</div>
                </div>
                <div class="demo-image">
                    <div class="demo-label">Grid Layout</div>
                </div>
                <div class="demo-image">
                    <div class="demo-label">Slider Style</div>
                </div>
                <div class="demo-image">
                    <div class="demo-label">Custom Colors</div>
                </div>
            </div>
        </div>

        <!-- Support Section -->
        <div class="support-section">
            <div class="support-icon">💬</div>
            <h2 class="support-title">Support</h2>
            <p class="support-text">
                Questions, design request, feedback? Our team is happy to help.
            </p>
            <a href="#" id="btn-support" class="support-button" role="button">Send email to support</a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© 2026 Recently Viewed Products Pro. All rights reserved.</p>
        </div>
    </div>
    <script src="https://unpkg.com/@shopify/app-bridge@3/dist/index.global.js"></script>
    <script>
        (function() {
            var shop = ${JSON.stringify(shop)};
            var host = ${JSON.stringify(host)};
            var apiKey = ${JSON.stringify(apiKeyForBridge)};
            var supportEmail = 'caglarkemalofficial@gmail.com';

            function initButtons() {
                var btnOnboarding = document.getElementById('btn-onboarding');
                var btnSupport = document.getElementById('btn-support');
                if (btnOnboarding) {
                    btnOnboarding.addEventListener('click', function(e) {
                        e.preventDefault();
                        var appUrl = window.location.origin + window.location.pathname;
                        if (shop) appUrl += '?shop=' + encodeURIComponent(shop);
                        if (host) appUrl += (shop ? '&' : '?') + 'host=' + encodeURIComponent(host);
                        if (typeof window.Shopify !== 'undefined' && host && window.createApp) {
                            try {
                                var app = window.createApp({ apiKey: apiKey, host: host });
                                if (app && typeof app.redirect !== 'undefined' && app.redirect.dispatch) {
                                    app.redirect.dispatch(app.redirect.Action.APP, appUrl);
                                } else {
                                    window.location.href = appUrl;
                                }
                            } catch (err) {
                                window.location.href = appUrl;
                            }
                        } else {
                            window.location.href = appUrl;
                        }
                    });
                }
                if (btnSupport) {
                    btnSupport.addEventListener('click', function(e) {
                        e.preventDefault();
                        try {
                            var mailto = 'mailto:' + supportEmail + '?subject=Recently%20Viewed%20Products%20Pro%20Support';
                            if (window.top && window.top !== window) {
                                window.top.location.href = mailto;
                            } else {
                                window.location.href = mailto;
                            }
                        } catch (err) {
                            window.open('mailto:' + supportEmail, '_blank');
                        }
                    });
                }
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initButtons);
            } else {
                initButtons();
            }
        })();
    </script>
</body>

</html>
  `);
});

// HMAC verification function - Using middleware instead
// This function is now handled by webhookAuth middleware

// Webhook authentication middleware - MUST come before webhook routes
app.use(webhookAuth);
app.use(webhookRateLimit);

// Compliance webhooks only - as per Shopify requirements
// Main webhook endpoint for all compliance webhooks
app.post('/webhooks', (req, res) => {
    console.log('🔔 Main webhook endpoint received');
    console.log('Headers:', req.webhookData);
    console.log('Body:', req.body);

    // HMAC verification already handled by webhookAuth middleware
    console.log('✅ HMAC verification: SUCCESS (handled by middleware)');

    // Shopify compliance requirement: Respond with 200 series status code
    res.status(200).json({
        success: true,
        message: 'Webhook received successfully',
        timestamp: new Date().toISOString()
    });
});

// CUSTOMERS_DATA_REQUEST webhook - Shopify Compliance Requirement
app.post('/webhooks/customers/data_request', (req, res) => {
    console.log('🔔 CUSTOMERS_DATA_REQUEST webhook received');
    console.log('Headers:', req.webhookData);
    console.log('Body:', req.body);

    // HMAC verification already handled by webhookAuth middleware
    console.log('✅ HMAC verification: SUCCESS (handled by middleware)');

    // Shopify compliance requirement: Respond with 200 series status code
    // Action must be completed within 30 days
    res.status(200).json({
        success: true,
        message: 'Data request received and will be processed within 30 days',
        timestamp: new Date().toISOString()
    });
});

// CUSTOMERS_REDACT webhook - Shopify Compliance Requirement
app.post('/webhooks/customers/redact', (req, res) => {
    console.log('🔔 CUSTOMERS_REDACT webhook received');
    console.log('Headers:', req.webhookData);
    console.log('Body:', req.body);

    // HMAC verification already handled by webhookAuth middleware
    console.log('✅ HMAC verification: SUCCESS (handled by middleware)');

    // Shopify compliance requirement: Respond with 200 series status code
    // Action must be completed within 30 days
    res.status(200).json({
        success: true,
        message: 'Customer data redaction request received and will be processed within 30 days',
        timestamp: new Date().toISOString()
    });
});

// SHOP_REDACT webhook - Shopify Compliance Requirement
app.post('/webhooks/shop/redact', (req, res) => {
    console.log('🔔 SHOP_REDACT webhook received');
    console.log('Headers:', req.webhookData);
    console.log('Body:', req.body);

    // HMAC verification already handled by webhookAuth middleware
    console.log('✅ HMAC verification: SUCCESS (handled by middleware)');

    // Shopify compliance requirement: Respond with 200 series status code
    // Action must be completed within 30 days
    res.status(200).json({
        success: true,
        message: 'Shop data redaction request received and will be processed within 30 days',
        timestamp: new Date().toISOString()
    });
});

// Shopify OAuth - Kurulumdan hemen sonra kimlik doğrulama (App Store 2.3.2, 2.3.4)
function getAppBaseUrl(req) {
    const url = process.env.SHOPIFY_APP_URL;
    if (url) return url.replace(/\/$/, '');
    const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
    const host = req.get('x-forwarded-host') || req.get('host') || '';
    return proto + '://' + host;
}

app.get('/auth', (req, res) => {
    const shop = (req.query.shop || '').toString().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    const host = (req.query.host || '').toString();
    const code = req.query.code;

    if (!shop || !shop.includes('myshopify.com')) {
        res.status(400).send('Missing or invalid shop parameter. Install the app from Shopify Admin or App Store.');
        return;
    }

    const baseUrl = getAppBaseUrl(req);

    if (code) {
        oauth.exchangeCodeForToken(shop, code, baseUrl)
            .then(() => {
                const redirectTo = baseUrl + '/?shop=' + encodeURIComponent(shop) + '&host=' + encodeURIComponent(host);
                res.redirect(302, redirectTo);
            })
            .catch((err) => {
                console.error('OAuth token exchange failed:', err);
                res.status(500).send('Authentication failed. Please try again.');
            });
        return;
    }

    try {
        const authUrl = oauth.getAuthRedirectUrl(shop, host, baseUrl);
        res.redirect(302, authUrl);
    } catch (err) {
        console.error('OAuth redirect failed:', err);
        res.status(500).send('Authentication configuration error.');
    }
});

// Billing API - Abonelik durumu ve onay sayfası yönlendirmesi
app.get('/api/billing/status', (req, res) => {
    const shop = (req.query.shop || '').toString().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    if (!shop || !shop.includes('myshopify.com')) {
        return res.status(400).json({ error: 'Missing or invalid shop' });
    }
    billing.getSubscriptionStatus(shop)
        .then((result) => res.json(result))
        .catch((err) => {
            console.error('Billing status error:', err);
            res.status(500).json({ hasSubscription: false, error: err.message });
        });
});

app.get('/api/billing/subscribe', (req, res) => {
    const shop = (req.query.shop || '').toString().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    const host = (req.query.host || '').toString();
    if (!shop || !shop.includes('myshopify.com')) {
        return res.status(400).send('Missing or invalid shop');
    }
    const baseUrl = getAppBaseUrl(req);
    const returnUrl = baseUrl + '/?shop=' + encodeURIComponent(shop) + '&host=' + encodeURIComponent(host);
    billing.createSubscription(shop, returnUrl)
        .then(({ confirmationUrl }) => {
            res.redirect(302, confirmationUrl);
        })
        .catch((err) => {
            console.error('Billing subscribe error:', err);
            res.status(500).send('Could not create subscription: ' + err.message);
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

// Start server (0.0.0.0 = Railway/container içinden erişilebilir)
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Webhook server running on port ${PORT}`);
    console.log(`📡 Compliance Webhook endpoints (Shopify App Store Required):`);
    console.log(`   - HEALTH: http://0.0.0.0:${PORT}/health`);
    console.log(`   - ROOT: http://0.0.0.0:${PORT}/`);
    console.log(`   - CUSTOMERS_DATA_REQUEST: http://0.0.0.0:${PORT}/webhooks/customers/data_request`);
    console.log(`   - CUSTOMERS_REDACT: http://0.0.0.0:${PORT}/webhooks/customers/redact`);
    console.log(`   - SHOP_REDACT: http://0.0.0.0:${PORT}/webhooks/shop/redact`);
    console.log(`   - AUTH: http://0.0.0.0:${PORT}/auth`);
    console.log(`🌍 Server listening on all interfaces`);
    console.log(`✅ Shopify App Store Compliance Requirements: MET`);
});
server.on('error', (err) => {
    console.error('❌ Server listen error:', err);
    process.exit(1);
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
