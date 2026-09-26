import { Request, Response, NextFunction } from 'express';
import twilio from 'twilio';

/**
 * Enterprise Twilio Webhook Security Middleware
 * Validates the X-Twilio-Signature header against the incoming request URL and parameters
 * using the Twilio Auth Token.
 */
export function validateTwilioWebhook(req: Request, res: Response, next: NextFunction) {
  // Allow bypass in local development or demo simulation mode
  if (process.env.NODE_ENV !== 'production' || process.env.LOCAL_RUN === 'true' || process.env.SKIP_TWILIO_VALIDATION === 'true') {
    return next();
  }

  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  if (!twilioAuthToken || twilioAuthToken === 'your_twilio_auth_token') {
    console.warn('[Twilio Security] Warning: TWILIO_AUTH_TOKEN not configured in production. Permitting request for fallback.');
    return next();
  }

  const twilioSignature = req.headers['x-twilio-signature'] as string;
  if (!twilioSignature) {
    console.error('[Twilio Security] 403 Forbidden: Missing X-Twilio-Signature header on incoming webhook request.');
    return res.status(403).type('text/plain').send('Forbidden: Missing Twilio Signature');
  }

  // Construct full request URL for signature matching
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const fullUrl = `${protocol}://${host}${req.originalUrl || req.url}`;

  // Validate signature against POST body params
  const isValid = twilio.validateRequest(
    twilioAuthToken,
    twilioSignature,
    fullUrl,
    req.body || {}
  );

  if (!isValid) {
    console.error(`[Twilio Security] 403 Forbidden: Invalid Twilio signature for URL: ${fullUrl}`);
    return res.status(403).type('text/plain').send('Forbidden: Invalid Twilio Signature');
  }

  return next();
}
