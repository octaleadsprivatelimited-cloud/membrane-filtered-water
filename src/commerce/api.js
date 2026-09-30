import appConfig, {apiUrl} from '../config/appConfig';
import { readApiResponse } from './response';
import { auth } from '../firebase/config';
export async function api(path, options={}) {
 const publicRequest=path==='/config'||path==='/products'||path.startsWith('/products/')||path==='/enquiries';
 if(!publicRequest)await auth.authStateReady();
 const token=publicRequest?null:await auth.currentUser?.getIdToken();
 const response=await fetch(apiUrl(path),{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...options.headers}});
 return readApiResponse(response);
}
export async function startPayment(orderId) {
 const payment=await api(`/orders/${orderId}/payment`,{method:'POST'});
 if(!window.Cashfree) await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=appConfig.cashfree.sdkUrl;script.onload=resolve;script.onerror=()=>reject(new Error('Payment checkout could not load. Retry from your account.'));document.head.appendChild(script);});
 const cashfree=window.Cashfree({mode:payment.mode});await cashfree.checkout({paymentSessionId:payment.paymentSessionId,redirectTarget:'_self'});
}
