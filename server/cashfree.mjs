import appConfig from '../src/config/appConfig.js';
import { createHmac, timingSafeEqual } from 'node:crypto';

// Determine payment mode (sandbox or production) based on env or config
export const paymentMode = () => process.env.CASHFREE_MODE || appConfig.cashfree.defaultMode;

// Check if Cashfree credentials are present and mode is valid
export const cashfreeReady = () =>
  ['sandbox', 'production'].includes(paymentMode()) &&
  !!process.env.CASHFREE_CLIENT_ID &&
  !!process.env.CASHFREE_CLIENT_SECRET;

/**
 * Perform a request to the Cashfree API.
 * Throws errors with explicit `status` and `code` properties for upstream handling.
 */
export async function cashfree(path, options = {}) {
  if (!cashfreeReady()) {
    const e = new Error('Cashfree is not configured.');
    e.status = 502;
    e.code = 'CASHFREE_NOT_CONFIGURED';
    throw e;
  }
  const base = paymentMode() === 'production' ? appConfig.cashfree.productionApi : appConfig.cashfree.sandboxApi;
  const headers = {
    'Content-Type': 'application/json',
    'x-client-id': process.env.CASHFREE_CLIENT_ID,
    'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
    'x-api-version': process.env.CASHFREE_API_VERSION || appConfig.cashfree.apiVersion,
    ...(options.headers || {}),
  };
  try {
    const response = await fetch(base + path, {
      ...options,
      signal: AbortSignal.timeout(15000),
      headers,
    });
    const body = await response.json();
    if (!response.ok) {
      const e = new Error('Payment provider request failed. Please retry or contact support.');
      e.status = 502;
      e.code = 'CASHFREE_API_ERROR';
      e.details = body;
      throw e;
    }
    return body;
  } catch (err) {
    // Handle request timeout or network failures
    if (err.name === 'AbortError') {
      const e = new Error('Cashfree request timed out.');
      e.status = 502;
      e.code = 'CASHFREE_TIMEOUT';
      throw e;
    }
    // Re‑throw other errors preserving status/code if already set
    if (err.status && err.code) throw err;
    const e = new Error('Cashfree request failed: ' + (err.message || 'unknown error'));
    e.status = 502;
    e.code = 'CASHFREE_REQUEST_FAILED';
    throw e;
  }
}

/**
 * Verify Cashfree webhook signature.
 * Returns true if the signature matches, false otherwise.
 */
export function verifyWebhook(raw, timestamp, signature, secret = process.env.CASHFREE_CLIENT_SECRET) {
  if (!secret || !timestamp || !signature) return false;
  const expected = createHmac('sha256', secret).update(timestamp).update(raw).digest();
  const received = Buffer.from(signature, 'base64');
  return expected.length === received.length && timingSafeEqual(expected, received);
}
