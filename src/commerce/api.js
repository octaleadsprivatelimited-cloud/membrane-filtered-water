import { auth } from '../firebase/config';
export async function api(path, options={}) {
 await auth.authStateReady();
 const token=await auth.currentUser?.getIdToken();
 const response=await fetch(`/api${path}`,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...options.headers}});
 const body=await response.json();if(!response.ok)throw new Error(body.error||'Request failed');return body;
}
export async function startPayment(orderId) {
 const payment=await api(`/orders/${orderId}/payment`,{method:'POST'});
 if(!window.Cashfree) await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://sdk.cashfree.com/js/v3/cashfree.js';script.onload=resolve;script.onerror=()=>reject(new Error('Payment checkout could not load. Retry from your account.'));document.head.appendChild(script);});
 const cashfree=window.Cashfree({mode:payment.mode});await cashfree.checkout({paymentSessionId:payment.paymentSessionId,redirectTarget:'_self'});
}
