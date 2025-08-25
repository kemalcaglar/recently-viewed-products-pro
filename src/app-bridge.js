/**
 * Shopify App Bridge Integration
 * Handles session tokens and authentication for embedded apps
 */

import { createApp } from '@shopify/app-bridge';
import { authenticatedFetch } from '@shopify/app-bridge/utilities';

class ShopifyAppBridge {
  constructor() {
    this.app = null;
    this.sessionToken = null;
    this.isInitialized = false;
  }

  /**
   * Initialize App Bridge
   */
  async initialize() {
    try {
      // Check if we're in Shopify admin
      if (typeof window !== 'undefined' && window.Shopify) {
        this.app = createApp({
          apiKey: window.Shopify.apiKey || 'your-api-key',
          host: window.Shopify.host || window.location.search.match(/host=([^&]*)/)?.[1],
          forceRedirect: true
        });

        console.log('✅ App Bridge initialized successfully');
        this.isInitialized = true;

        // Get initial session token
        await this.getSessionToken();

        return true;
      } else {
        console.log('ℹ️ Not in Shopify admin context');
        return false;
      }
    } catch (error) {
      console.error('❌ App Bridge initialization failed:', error);
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

      // Use authenticatedFetch to get session token
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
   * Make authenticated request
   */
  async authenticatedRequest(endpoint, options = {}) {
    try {
      if (!this.app) {
        throw new Error('App Bridge not initialized');
      }

      const response = await authenticatedFetch(this.app, endpoint, options);
      return response;
    } catch (error) {
      console.error('❌ Authenticated request failed:', error);
      throw error;
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

      const response = await this.authenticatedRequest('/api/session/validate');
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

      const response = await this.authenticatedRequest('/api/session/refresh', {
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
}

// Export singleton instance
const appBridge = new ShopifyAppBridge();

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    appBridge.initialize().then(success => {
      if (success) {
        console.log('🚀 Shopify App Bridge ready for session tokens');
      }
    });
  });
}

export default appBridge;
