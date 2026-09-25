import appConfig from '../src/config/appConfig.js';
import { createHmac, timingSafeEqual } from 'node:crypto';
export const paymentMode = () => process.env.CASHFREE_MODE || appConfig.cashfree.defaultMode;
export const cashfreeReady = () => ['sandbox','production'].includes(paymentMode()) && !!process.env.CASHFREE_CLIENT_ID && !!process.env.CASHFREE_CLIENT_SECRET;
export async function cashfree(path, options={}) {
 if (!cashfreeReady()) throw new Error('Cashfree is not configured.');
 const base=paymentMode()==='production'?appConfig.cashfree.productionApi:appConfig.cashfree.sandboxApi;
 const response=await fetch(base+path,{...options,signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json','x-client-id':process.env.CASHFREE_CLIENT_ID,'x-client-secret':process.env.CASHFREE_CLIENT_SECRET,'x-api-version':process.env.CASHFREE_API_VERSION||appConfig.cashfree.apiVersion,...options.headers}});
 const body=await response.json();
 if(!response.ok) { const e=new Error('Payment provider request failed. Please retry or contact support.');e.status=502;throw e; }
 return body;
}
export function verifyWebhook(raw, timestamp, signature, secret=process.env.CASHFREE_CLIENT_SECRET) {
 if(!secret||!timestamp||!signature)return false;
 const expected=createHmac('sha256',secret).update(timestamp).update(raw).digest();
 const received=Buffer.from(signature,'base64');
 return expected.length===received.length&&timingSafeEqual(expected,received);
}
