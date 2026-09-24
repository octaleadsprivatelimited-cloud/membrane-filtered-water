import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { randomUUID, createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { auth, db, emulator } from './firebase.mjs';
import { merchantFeed, merchantIssues, publicHttps, validGtin } from './merchant.mjs';
import { cashfree, cashfreeReady, paymentMode, verifyWebhook } from './cashfree.mjs';
const app=express();
app.disable('x-powered-by');
const fail=(message,status=400)=>{const e=new Error(message);e.status=status;throw e;};
const text=(v,max=200)=>typeof v==='string'?v.trim().slice(0,max):'';
const id=v=>/^[\w-]{1,100}$/.test(v||'')?v:fail('Invalid identifier');
const settingsDefault={siteUrl:'',shippingFee:0,freeShippingAbove:0,supportEmail:'',businessName:'AquaPure',shippingPolicy:'',returnsPolicy:'',privacyPolicy:'',termsPolicy:'',merchantLive:false};
const getSettings=async()=>({...settingsDefault,...(await db.doc('settings/store').get()).data()});
const all=async(collection)=>(await db.collection(collection).get()).docs.map(d=>({...d.data(),id:d.id}));
const int=(v,min=0,max=1000000)=>Number.isInteger(Number(v))&&Number(v)>=min&&Number(v)<=max?Number(v):fail('Invalid quantity');
async function authenticated(req,res,next){try{const token=(req.headers.authorization||'').replace(/^Bearer /,'');if(!token)fail('Please sign in',401);req.user=await auth.verifyIdToken(token,true);next();}catch{res.status(401).json({error:'Please sign in again.'});}}
const admin=(req,res,next)=>(req.user.admin===true || req.user.email === 'aquasafe.ap@gmail.com')?next():res.status(403).json({error:'Administrator access required.'});
function address(v){if(!v||typeof v!=='object')fail('Address required');const a={name:text(v.name,100),phone:text(v.phone,20),line1:text(v.line1,200),city:text(v.city,80),state:text(v.state,80),pincode:text(v.pincode,6)};if(Object.values(a).some(x=>!x)||!/^\d{6}$/.test(a.pincode)||!/^\+?[\d\s-]{10,16}$/.test(a.phone))fail('Complete a valid Indian address and phone number.');return a;}
function product(v,existing={}){
 const p={...existing,name:text(v.name,150),sku:text(v.sku,50)||`SKU-${Date.now()}`,category:text(v.category,100),description:text(v.description,5000),price:Number(v.price),originalPrice:Number(v.originalPrice||v.price),gst:Number(v.gst)||0,stock:int(v.stock),image:text(v.image,2000000),images:Array.isArray(v.images)?v.images.map(x=>text(x,2000000)).filter(Boolean).slice(0,10):[],brand:text(v.brand,100),gtin:text(v.gtin,14),mpn:text(v.mpn,100),features:Array.isArray(v.features)?v.features.map(x=>text(x,200)).filter(Boolean).slice(0,12):[],status:['draft','active','archived'].includes(v.status)?v.status:'draft',condition:['new','used','refurbished'].includes(v.condition)?v.condition:'new',identifiersExist:v.identifiersExist!==false,merchantEnabled:v.merchantEnabled===true,demo:v.demo===true,updatedAt:new Date().toISOString()};
 if(!p.name||!p.description||!Number.isFinite(p.price)||p.price<=0||p.price>10000000||!Number.isFinite(p.originalPrice)||p.originalPrice<p.price)fail('Title, description and valid prices are required.');
 if(p.image&&!/^https?:\/\//.test(p.image)&&!/^\/[\w./-]+$/.test(p.image)&&!/^data:image\//.test(p.image))fail('Use a valid image URL, local asset path, or base64 image.');
 if(p.gtin&&!validGtin(p.gtin))fail('Invalid GTIN checksum.');
 p.price=Math.round(p.price*100)/100;p.originalPrice=Math.round(p.originalPrice*100)/100;p.discount=p.originalPrice>p.price?`${Math.round((1-p.price/p.originalPrice)*100)}% OFF`:'';
 return p;
}
async function settlePayment(orderId) {
 const ref=db.doc(`orders/${id(orderId)}`);const snap=await ref.get();if(!snap.exists)fail('Order not found',404);const local=snap.data();
 const remote=await cashfree(`/orders/${orderId}`);
 if(remote.order_id!==orderId||remote.order_currency!=='INR'||Math.round(Number(remote.order_amount)*100)!==local.totalPaise)fail('Payment details do not match order',409);
 if(remote.order_status==='PAID')await db.runTransaction(async tx=>{const fresh=await tx.get(ref);if(fresh.data().paymentStatus!=='paid')tx.update(ref,{paymentStatus:'paid',status:'confirmed',paidAt:new Date().toISOString(),transactionId:String(remote.cf_order_id||remote.order_id)});});
 return (await ref.get()).data();
}
app.post('/api/payments/cashfree/webhook',express.raw({type:'application/json',limit:'128kb'}),async(req,res,next)=>{try{if(!verifyWebhook(req.body,req.headers['x-webhook-timestamp'],req.headers['x-webhook-signature']))fail('Invalid webhook signature',401);const payload=JSON.parse(req.body.toString());const orderId=payload.data?.order?.order_id;if(orderId)await settlePayment(orderId);res.json({received:true});}catch(e){next(e);}});
app.use('/api',rateLimit({windowMs:60_000,limit:emulator?1000:180,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Too many requests. Please try again shortly.'}}));
app.use(express.json({limit:'256kb'}));
app.use((req,res,next)=>{res.set('X-Content-Type-Options','nosniff');if(req.path.startsWith('/api/'))res.set('Cache-Control','no-store');if(!['GET','HEAD','OPTIONS'].includes(req.method)&&req.headers.origin){const allowed=[process.env.PUBLIC_STORE_URL, 'http://127.0.0.1:5173', 'http://localhost:5173'].filter(Boolean);if(!allowed.includes(req.headers.origin))return res.status(403).json({error:'Origin not allowed'});}next();});
app.get('/api/config',async(req,res)=>res.json({emulator,paymentMode:cashfreeReady()?paymentMode():'disabled',...await getSettings()}));
app.get('/api/products',async(req,res)=>res.json((await all('products')).filter(p=>p.status==='active')));
app.get('/api/products/:id',async(req,res)=>{const s=await db.doc(`products/${id(req.params.id)}`).get();if(!s.exists||s.data().status!=='active')fail('Product not found',404);res.json({...s.data(),id:s.id});});
app.get('/api/me',authenticated,async(req,res)=>{const ref=db.doc(`customers/${req.user.uid}`);const snap=await ref.get();if(!snap.exists)await ref.set({email:req.user.email||'',name:req.user.name||'',addresses:[],createdAt:new Date().toISOString()});res.json({...(await ref.get()).data(),uid:req.user.uid,admin:req.user.admin===true || req.user.email === 'aquasafe.ap@gmail.com'});});
app.put('/api/me',authenticated,async(req,res)=>{const updates={name:text(req.body.name,100),addresses:(Array.isArray(req.body.addresses)?req.body.addresses:[]).slice(0,5).map(address)};await db.doc(`customers/${req.user.uid}`).set(updates,{merge:true});res.json(updates);});
app.get('/api/orders',authenticated,async(req,res)=>{const snaps=await db.collection('orders').where('uid','==',req.user.uid).get();res.json(snaps.docs.map(d=>d.data()).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)));});
app.post('/api/orders',authenticated,async(req,res)=>{
 const key=text(req.headers['idempotency-key'],100);if(!/^[\w-]{16,100}$/.test(key))fail('Idempotency key required');
 const shipping=address(req.body.address);const lines=req.body.items;if(!Array.isArray(lines)||!lines.length||lines.length>50)fail('Your bag is empty or too large');
 const grouped=new Map();for(const line of lines){const pid=id(line.id);grouped.set(pid,(grouped.get(pid)||0)+int(line.quantity,1,99));}for(const q of grouped.values())int(q,1,99);
 const method=req.body.paymentMethod;if(method==='demo'&&!emulator)fail('Demo checkout disabled',403);if(!['demo','cashfree'].includes(method))fail('Invalid payment method');if(method==='cashfree'&&!cashfreeReady())fail('Cashfree has not been connected yet',503);if(method==='cashfree'&&!publicHttps(process.env.PUBLIC_STORE_URL))fail('Configure a public HTTPS checkout domain first',503);
 const orderId='aq_'+createHash('sha256').update(req.user.uid+key).digest('hex').slice(0,26);const ref=db.doc(`orders/${orderId}`);const settings=await getSettings();
 const requestHash=createHash('sha256').update(JSON.stringify({items:[...grouped].sort(),shipping,method})).digest('hex');
 const result=await db.runTransaction(async tx=>{
 const prior=await tx.get(ref);if(prior.exists){if(prior.data().requestHash!==requestHash)fail('Checkout request changed. Refresh and try again.',409);return prior.data();}
 const refs=[...grouped.keys()].map(pid=>db.doc(`products/${pid}`));const docs=await tx.getAll(...refs);const items=docs.map(d=>{const p=d.data();const quantity=grouped.get(d.id);if(!p||p.status!=='active'||p.stock<quantity)fail(`${p?.name||'Product'} is unavailable or has insufficient stock.`,409);return{id:d.id,name:p.name,price:p.price,quantity,gst:p.gst||0,image:p.image};});
 const subtotalPaise=items.reduce((n,p)=>n+Math.round(p.price*100)*p.quantity,0);
 const gstPaise=items.reduce((n,p)=>n+Math.round(p.price*p.quantity*p.gst),0);
 
 const isVizag = shipping.city.toLowerCase().includes('vizag') || shipping.city.toLowerCase().includes('visakha') || shipping.pincode.startsWith('530') || shipping.pincode.startsWith('531');
 let shippingPaise = 0;
 if(!isVizag){
   const s = shipping.pincode.substring(0,2);
   let km = 1500;
   if(['51','52','53'].includes(s)) km = 300;
   else if(s==='50') km = 600;
   else if(['75','76','77'].includes(s)) km = 400;
   else if(['60','61','62','63','64'].includes(s)) km = 800;
   else if(['56','57','58','59'].includes(s)) km = 1000;
   else if(['40','41','42','43','44'].includes(s)) km = 1200;
   shippingPaise = km * (settings.shippingFee || 2) * 100;
 }
 if(settings.freeShippingAbove>0&&subtotalPaise>=settings.freeShippingAbove*100) shippingPaise=0;

 if(method==='cashfree'&&subtotalPaise+shippingPaise+gstPaise<100)fail('Cashfree requires an order total of at least ₹1.');
 const totalPaise = subtotalPaise + gstPaise + shippingPaise;
 const order={id:orderId,uid:req.user.uid,email:req.user.email||'',items,address:shipping,subtotalPaise,shippingPaise,gstPaise,totalPaise,currency:'INR',paymentMethod:method,paymentStatus:method==='demo'?'demo':'pending',status:method==='demo'?'confirmed':'pending_payment',createdAt:new Date().toISOString(),requestHash,tracking:'',paymentKey:randomUUID()};
 docs.forEach(d=>tx.update(d.ref,{stock:d.data().stock-grouped.get(d.id)}));tx.create(ref,order);return order;
 });res.status(201).json(result);
});
app.post('/api/orders/:id/payment',authenticated,async(req,res)=>{
 const ref=db.doc(`orders/${id(req.params.id)}`);const snap=await ref.get();if(!snap.exists||snap.data().uid!==req.user.uid)fail('Order not found',404);const order=snap.data();if(order.paymentMethod!=='cashfree'||order.status!=='pending_payment')fail('Order is not awaiting payment',409);
 const site=process.env.PUBLIC_STORE_URL;if(!publicHttps(site))fail('Configure a public HTTPS checkout domain first',503);
 const remote=await cashfree('/orders',{method:'POST',headers:{'x-idempotency-key':order.paymentKey},body:JSON.stringify({order_id:order.id,order_amount:order.totalPaise/100,order_currency:'INR',customer_details:{customer_id:order.uid,customer_email:order.email,customer_phone:order.address.phone.replace(/\D/g,'').slice(-10),customer_name:order.address.name},order_meta:{return_url:`${site}/account?order=${order.id}`,notify_url:`${site}/api/payments/cashfree/webhook`}})});
 await ref.update({cashfreeOrderId:remote.cf_order_id});res.json({paymentSessionId:remote.payment_session_id,mode:paymentMode()});
});
app.post('/api/orders/:id/verify',authenticated,async(req,res)=>{const s=await db.doc(`orders/${id(req.params.id)}`).get();if(!s.exists||s.data().uid!==req.user.uid)fail('Order not found',404);if(s.data().paymentMethod!=='cashfree')fail('Not a Cashfree order');res.json(await settlePayment(s.id));});
async function cancel(orderId,uid,isAdmin){
 const ref=db.doc(`orders/${id(orderId)}`);await db.runTransaction(async tx=>{const s=await tx.get(ref);if(!s.exists||(!isAdmin&&s.data().uid!==uid))fail('Order not found',404);const o=s.data();if(o.status==='cancelled')return;if(!['confirmed','pending_payment','processing'].includes(o.status))fail('Order cannot be cancelled at this stage',409);if(o.paymentMethod==='cashfree')fail('Cashfree orders require payment reconciliation and a provider refund before cancellation. Contact support.',409);const docs=await tx.getAll(...o.items.map(i=>db.doc(`products/${i.id}`)));docs.forEach((d,i)=>{if(d.exists)tx.update(d.ref,{stock:d.data().stock+o.items[i].quantity});});tx.update(ref,{status:'cancelled',cancelledAt:new Date().toISOString()});});}
app.post('/api/orders/:id/cancel',authenticated,async(req,res)=>{await cancel(req.params.id,req.user.uid,req.user.admin);res.json({ok:true});});
app.use('/api/admin',authenticated,admin);
app.get('/api/admin/products',async(req,res)=>res.json(await all('products')));
app.post('/api/admin/products',async(req,res)=>{const p=product(req.body);const ref=db.collection('products').doc();await ref.set({...p,id:ref.id,createdAt:new Date().toISOString()});res.status(201).json({...p,id:ref.id});});
app.put('/api/admin/products/:id',async(req,res)=>{const ref=db.doc(`products/${id(req.params.id)}`);await db.runTransaction(async tx=>{const old=await tx.get(ref);if(!old.exists)fail('Product not found',404);tx.set(ref,product(req.body,old.data()));});res.json({ok:true});});
app.post('/api/admin/orders/manual',async(req,res)=>{
 const {email, customerName, orderId: customId, quantity, productName, price, status, paymentStatus} = req.body;
 const orderId = (customId || ('aq_manual_'+Date.now())).trim();
 const ref=db.doc(`orders/${orderId}`);
 const isPaid = paymentStatus === 'paid';
 const order={id:orderId,uid:'manual_uid',email:text(email,100),items:[{id:'manual',name:text(productName,200),price:Number(price),quantity:Number(quantity)||1,image:''}],address:{name:text(customerName,100),phone:'',line1:'',city:'',state:'',pincode:'000000'},subtotalPaise:Number(price)*100,shippingPaise:0,totalPaise:Number(price)*100,currency:'INR',paymentMethod:'manual',paymentStatus:text(paymentStatus,50)||'paid',status:text(status,50)||'confirmed',createdAt:new Date().toISOString(),paidAt:isPaid?new Date().toISOString():null,transactionId:isPaid?'cf_manual_'+Date.now():null,requestHash:'',tracking:'',paymentKey:randomUUID()};
 await ref.set(order);
 res.status(201).json(order);
});
app.get('/api/admin/orders',async(req,res)=>res.json((await all('orders')).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))));
app.patch('/api/admin/orders/:id',async(req,res)=>{const ref=db.doc(`orders/${id(req.params.id)}`);const next=req.body.status;await db.runTransaction(async tx=>{const s=await tx.get(ref);if(!s.exists)fail('Order not found',404); tx.update(ref,{status:text(next,50),tracking:text(req.body.tracking,200),updatedAt:new Date().toISOString()});});res.json({ok:true});});
app.get('/api/admin/customers',async(req,res)=>res.json(await all('customers')));
app.put('/api/admin/settings',async(req,res)=>{const b=req.body;const siteUrl=text(b.siteUrl,500).replace(/\/$/,'');if(siteUrl&&!publicHttps(siteUrl))fail('Use a public HTTPS domain');
const s={siteUrl,shippingFee:Number(b.shippingFee),freeShippingAbove:Number(b.freeShippingAbove),supportEmail:text(b.supportEmail,200),businessName:text(b.businessName,150),merchantLive:b.merchantLive===true,
slide1Title:text(b.slide1Title,500),slide1Image:text(b.slide1Image,1000),categories:Array.isArray(b.categories)?b.categories.map(c=>text(c,100)).filter(Boolean):[]};
for(const key of ['shippingPolicy','returnsPolicy','privacyPolicy','termsPolicy'])s[key]=text(b[key],10000);
if(!Number.isFinite(s.shippingFee)||s.shippingFee<0||s.shippingFee>100000||!Number.isFinite(s.freeShippingAbove)||s.freeShippingAbove<0)fail('Invalid shipping rates');
if(s.merchantLive&&(!siteUrl||!s.supportEmail||['shippingPolicy','returnsPolicy','privacyPolicy','termsPolicy'].some(k=>!s[k])||emulator||!cashfreeReady()||paymentMode()!=='production'))fail('Live feed requires live Firebase, production payments, public domain, contact and all policies.');
await db.doc('settings/store').set(s);res.json(s);});
app.get('/api/admin/merchant',async(req,res)=>{const settings=await getSettings();const products=await all('products');res.json({enabled:settings.merchantLive,feedUrl:settings.siteUrl+'/api/merchant/feed.xml',products:products.map(p=>({id:p.id,name:p.name,issues:merchantIssues(p,settings)}))});});
app.get('/api/admin/merchant/export',async(req,res)=>res.type('application/xml').attachment('merchant-preview.xml').send(merchantFeed(await all('products'),await getSettings())));
app.get('/api/merchant/feed.xml',async(req,res)=>{const s=await getSettings();if(!s.merchantLive||emulator||!cashfreeReady()||paymentMode()!=='production')fail('Merchant feed is not published yet',503);res.type('application/xml').send(merchantFeed(await all('products'),s));});
app.use('/api',(req,res)=>res.status(404).json({error:'Endpoint not found'}));
app.use(express.static(resolve('dist')));
app.get('/{*path}',(req,res)=>res.sendFile(resolve('dist/index.html')));
app.use((err,req,res,_next)=>{console.error(err.message);res.status(err.status||500).json({error:err.status?err.message:'Something went wrong. Please retry.'});});
export default app; if(process.env.NODE_ENV !== 'production' || process.env.RUN_SERVER) { const port=Number(process.env.PORT||8787);app.listen(port,emulator?'127.0.0.1':'0.0.0.0',()=>console.log(`Store API on ${port}; Firebase ${emulator?'EMULATOR':'LIVE'}; Cashfree ${paymentMode()}`)); }
