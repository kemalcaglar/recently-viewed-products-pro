const express = require('express');
const { validateSessionToken, optionalSessionValidation } = require('../src/middleware/sessionAuth');

const router = express.Router();

/**
 * GET /api/session/validate
 * Validates session token and returns session data
 * Requires valid session token
 */
router.get('/validate', validateSessionToken, (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Session token validated successfully',
      sessionData: req.sessionData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Session validation endpoint error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Session validation failed',
      message: error.message
    });
  }
});

/**
 * GET /api/session/info
 * Returns session information if available (optional validation)
 */
router.get('/info', optionalSessionValidation, (req, res) => {
  try {
    if (req.sessionData) {
      res.json({
        success: true,
        message: 'Session information retrieved',
        sessionData: req.sessionData,
        hasValidSession: true,
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        success: true,
        message: 'No active session',
        hasValidSession: false,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Session info endpoint error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve session info',
      message: error.message
    });
  }
});

/**
 * POST /api/session/refresh
 * Simulates session token refresh (for testing purposes)
 */
router.post('/refresh', optionalSessionValidation, (req, res) => {
  try {
    const mockSessionData = {
      shop: req.body.shop || 'test.myshopify.com',
      user: req.body.user || '123',
      sessionId: `session_${Date.now()}`,
      issuedAt: Math.floor(Date.now() / 1000)
    };

    res.json({
      success: true,
      message: 'Session refreshed successfully',
      sessionData: mockSessionData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Session refresh endpoint error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Session refresh failed',
      message: error.message
    });
  }
});

/**
 * GET /api/session/health
 * Health check endpoint for session service
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Session service is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
