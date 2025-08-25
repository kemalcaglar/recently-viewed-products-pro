const crypto = require('crypto');

/**
 * Session Token Verification Middleware
 * Validates Shopify session tokens for embedded app authentication
 */
const validateSessionToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or invalid authorization header',
        message: 'Session token required'
      });
    }

    const sessionToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify session token structure
    if (!sessionToken || sessionToken.split('.').length !== 3) {
      return res.status(401).json({
        error: 'Invalid session token format',
        message: 'Token must be a valid JWT'
      });
    }

    // For now, we'll accept valid JWT format tokens
    // In production, you should verify the signature using your app's secret
    try {
      // Basic JWT validation (header.payload.signature)
      const [header, payload, signature] = sessionToken.split('.');

      // Decode header and payload
      const decodedHeader = JSON.parse(Buffer.from(header, 'base64').toString());
      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());

      // Validate required fields
      if (!decodedPayload.iss || !decodedPayload.dest || !decodedPayload.aud) {
        return res.status(401).json({
          error: 'Invalid session token payload',
          message: 'Missing required fields'
        });
      }

      // Check expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedPayload.exp && decodedPayload.exp < currentTime) {
        return res.status(401).json({
          error: 'Session token expired',
          message: 'Token has expired'
        });
      }

      // Add session data to request
      req.sessionData = {
        shop: decodedPayload.dest,
        user: decodedPayload.sub,
        sessionId: decodedPayload.sid,
        issuedAt: decodedPayload.iat
      };

      console.log('✅ Session token validated for shop:', decodedPayload.dest);
      next();

    } catch (jwtError) {
      console.error('❌ JWT parsing error:', jwtError.message);
      return res.status(401).json({
        error: 'Invalid session token',
        message: 'Token parsing failed'
      });
    }

  } catch (error) {
    console.error('❌ Session validation error:', error.message);
    return res.status(500).json({
      error: 'Session validation failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Optional session validation - doesn't block requests
 */
const optionalSessionValidation = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const sessionToken = authHeader.substring(7);

      try {
        // Basic JWT validation
        if (sessionToken && sessionToken.split('.').length === 3) {
          const [header, payload] = sessionToken.split('.');

          try {
            const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());

            // Validate required fields
            if (decodedPayload.dest && decodedPayload.sub) {
              req.sessionData = {
                shop: decodedPayload.dest,
                user: decodedPayload.sub,
                sessionId: decodedPayload.sid || `session_${Date.now()}`,
                issuedAt: decodedPayload.iat || Math.floor(Date.now() / 1000)
              };

              console.log('✅ Optional session validation successful for shop:', decodedPayload.dest);
            } else {
              console.log('ℹ️ Optional session validation: missing required fields');
            }
          } catch (jwtError) {
            console.log('ℹ️ Optional session validation: JWT parsing failed');
          }
        } else {
          console.log('ℹ️ Optional session validation: invalid token format');
        }
      } catch (error) {
        console.log('ℹ️ Optional session validation error, continuing without session');
      }
    } else {
      console.log('ℹ️ No authorization header, continuing without session');
    }

    next();
  } catch (error) {
    console.log('ℹ️ Optional session validation error, continuing without session');
    next();
  }
};

module.exports = {
  validateSessionToken,
  optionalSessionValidation
};
