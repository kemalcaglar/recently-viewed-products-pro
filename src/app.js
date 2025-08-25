/**
 * Recently Viewed Products Pro - Main App
 * Includes App Bridge integration for session tokens
 */

import { createApp } from '@shopify/app-bridge';
import { authenticatedFetch } from '@shopify/app-bridge/utilities';

class RecentlyViewedProductsApp {
  constructor() {
    this.app = null;
    this.isInitialized = false;
    this.sessionToken = null;
  }

  /**
   * Initialize the app with App Bridge
   */
  async initialize() {
    try {
      // Get Shopify context
      const urlParams = new URLSearchParams(window.location.search);
      const host = urlParams.get('host');
      const shop = window.Shopify?.shop || 'unknown';

      if (!host) {
        console.error('❌ Missing host parameter');
        return false;
      }

      // Initialize App Bridge
      this.app = createApp({
        apiKey: 'your-api-key', // Will be replaced by Shopify
        host: host,
        forceRedirect: false
      });

      console.log('✅ App Bridge initialized successfully');
      this.isInitialized = true;

      // Get initial session token
      await this.getSessionToken();

      return true;
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      return false;
    }
  }

  /**
   * Get session token using App Bridge
   */
  async getSessionToken() {
    try {
      if (!this.app) {
        throw new Error('App Bridge not initialized');
      }

      const response = await authenticatedFetch(this.app, '/api/session/info');

      if (response.ok) {
        const data = await response.json();
        this.sessionToken = data.sessionData;
        console.log('✅ Session token retrieved:', this.sessionToken);
        return this.sessionToken;
      } else {
        throw new Error(`Failed to get session token: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Session token retrieval failed:', error);
      return null;
    }
  }

  /**
   * Validate session token
   */
  async validateSession() {
    try {
      if (!this.app) {
        return false;
      }

      const response = await authenticatedFetch(this.app, '/api/session/validate');
      return response.ok;
    } catch (error) {
      console.error('❌ Session validation failed:', error);
      return false;
    }
  }

  /**
   * Refresh session
   */
  async refreshSession() {
    try {
      if (!this.app) {
        return false;
      }

      const response = await authenticatedFetch(this.app, '/api/session/refresh', {
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
        this.sessionToken = data.sessionData;
        console.log('✅ Session refreshed:', this.sessionToken);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('❌ Session refresh failed:', error);
      return false;
    }
  }

  /**
   * Get app status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasApp: !!this.app,
      hasSessionToken: !!this.sessionToken,
      sessionData: this.sessionToken
    };
  }

  /**
   * Show test page
   */
  showTestPage() {
    // Create test page content
    const testContent = `
      <div style="padding: 20px; max-width: 900px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h1 style="color: #004c3f; text-align: center;">🔐 App Bridge Session Token Test</h1>
        <p style="text-align: center; color: #666;">Recently Viewed Products Pro - Session Token Testing</p>
        
        <div style="background: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #0066cc;">📊 App Status:</h4>
          <pre style="background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(this.getStatus(), null, 2)}</pre>
        </div>

        <div style="margin: 20px 0; text-align: center;">
          <button onclick="app.testSessionToken()" style="background: #008060; color: white; border: none; padding: 12px 24px; border-radius: 6px; margin: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
            🧪 Test Session Token
          </button>
          <button onclick="app.validateSession()" style="background: #008060; color: white; border: none; padding: 12px 24px; border-radius: 6px; margin: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
            ✅ Validate Session
          </button>
          <button onclick="app.refreshSession()" style="background: #008060; color: white; border: none; padding: 12px 24px; border-radius: 6px; margin: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
            🔄 Refresh Session
          </button>
        </div>

        <div id="testResults" style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; margin: 20px 0; display: none;">
          <h4 style="margin-top: 0; color: #2c3e50;">Test Results:</h4>
          <div id="resultContent" style="font-family: monospace; font-size: 13px; white-space: pre-wrap; max-height: 300px; overflow-y: auto;"></div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <button onclick="app.hideTestPage()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            ← Back to App
          </button>
        </div>
      </div>
    `;

    // Store original content
    this.originalContent = document.body.innerHTML;

    // Replace current content with test page
    document.body.innerHTML = testContent;

    // Make app instance globally available for button clicks
    window.app = this;
  }

  /**
   * Hide test page and return to app
   */
  hideTestPage() {
    if (this.originalContent) {
      document.body.innerHTML = this.originalContent;
      // Re-initialize the app
      this.initialize();
    }
  }

  /**
   * Test session token
   */
  async testSessionToken() {
    try {
      const resultElement = document.getElementById('resultContent');
      resultElement.textContent = '🧪 Testing session token...';
      document.getElementById('testResults').style.display = 'block';

      const sessionToken = await this.getSessionToken();

      if (sessionToken) {
        resultElement.textContent = '✅ Session token test successful!\n\nToken Data:\n' + JSON.stringify(sessionToken, null, 2);
        resultElement.style.color = '#155724';
        resultElement.style.background = '#d4edda';
      } else {
        resultElement.textContent = '❌ Session token test failed.\n\nNo session token received.';
        resultElement.style.color = '#721c24';
        resultElement.style.background = '#f8d7da';
      }
    } catch (error) {
      const resultElement = document.getElementById('resultContent');
      resultElement.textContent = '❌ Session token test failed:\n\n' + error.message;
      resultElement.style.color = '#721c24';
      resultElement.style.background = '#f8d7da';
      document.getElementById('testResults').style.display = 'block';
    }
  }

  /**
   * Validate session
   */
  async validateSession() {
    try {
      const resultElement = document.getElementById('resultContent');
      resultElement.textContent = '🧪 Validating session...';
      document.getElementById('testResults').style.display = 'block';

      const isValid = await this.validateSession();

      if (isValid) {
        resultElement.textContent = '✅ Session validation successful!\n\nSession is valid and authenticated.';
        resultElement.style.color = '#155724';
        resultElement.style.background = '#d4edda';
      } else {
        resultElement.textContent = '❌ Session validation failed.\n\nSession is not valid or expired.';
        resultElement.style.color = '#721c24';
        resultElement.style.background = '#f8d7da';
      }
    } catch (error) {
      const resultElement = document.getElementById('resultContent');
      resultElement.textContent = '❌ Session validation failed:\n\n' + error.message;
      resultElement.style.color = '#721c24';
      resultElement.style.background = '#f8d7da';
      document.getElementById('testResults').style.display = 'block';
    }
  }

  /**
   * Refresh session
   */
  async refreshSession() {
    try {
      const resultElement = document.getElementById('resultContent');
      resultElement.textContent = '🔄 Refreshing session...';
      document.getElementById('testResults').style.display = 'block';

      const success = await this.refreshSession();

      if (success) {
        resultElement.textContent = '✅ Session refresh successful!\n\nNew Session Data:\n' + JSON.stringify(this.sessionToken, null, 2);
        resultElement.style.color = '#155724';
        resultElement.style.background = '#d4edda';
      } else {
        resultElement.textContent = '❌ Session refresh failed.\n\nCould not refresh the session.';
        resultElement.style.color = '#721c24';
        resultElement.style.background = '#f8d7da';
      }
    } catch (error) {
      const resultElement = document.getElementById('resultContent');
      resultElement.textContent = '❌ Session refresh failed:\n\n' + error.message;
      resultElement.style.color = '#721c24';
      resultElement.style.background = '#f8d7da';
      document.getElementById('testResults').style.display = 'block';
    }
  }
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', async function () {
  console.log('🚀 Recently Viewed Products Pro App Loading...');

  const app = new RecentlyViewedProductsApp();
  const success = await app.initialize();

  if (success) {
    console.log('✅ App initialized successfully');

    // Add test button to the page
    const testButton = document.createElement('button');
    testButton.textContent = '🧪 Test Session Tokens';
    testButton.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #008060; color: white; border: none; padding: 15px 25px; border-radius: 8px; cursor: pointer; z-index: 1000; font-size: 16px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    testButton.onclick = () => app.showTestPage();

    document.body.appendChild(testButton);

    // Make app globally available
    window.app = app;
  } else {
    console.error('❌ App initialization failed');
  }
});

export default RecentlyViewedProductsApp;
