import {db} from '../server/database.mjs';
import test, {after} from 'node:test';
after(async()=>{await db.close?.();});
import assert from 'node:assert/strict';
import {randomUUID,createHmac} from 'node:crypto';
import {auth,emulator} from '../server/firebase.mjs';
import {merchantIssues,merchantFeed,validGtin} from '../server/merchant.mjs';
import {verifyWebhook} from '../server/cashfree.mjs';
if(!emulator)throw new Error('Integration tests are emulator-only');
const base='http://127.0.0.1:8787/api';
async function request(path,token,method='GET',body,key){const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...(key?{'Idempotency-Key':key}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,body:await r.json()};}
async function login(user){const custom=await auth.createCustomToken(user.uid);const r=await fetch('http://127.0.0.1:9199/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=demo-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:custom,returnSecureToken:true})});return (await r.json()).idToken;}
test('commerce security, inventory and lifecycle',async t=>{
 const a=await auth.createUser({email:`qa-admin-${randomUUID()}@example.test`});await auth.setCustomUserClaims(a.uid,{admin:true});const u=await auth.createUser({email:`qa-customer-${randomUUID()}@example.test`});const stranger=await auth.createUser({email:`qa-other-${randomUUID()}@example.test`});const at=await login(a),ut=await login(u),st=await login(stranger);let pid;const orderIds=[];
 try {
 await t.test('anonymous and customer admin requests rejected',async()=>{assert.equal((await request('/admin/products')).status,401);assert.equal((await request('/admin/products',ut)).status,403);});
 const product={name:'QA purifier',description:'Integration test product',price:100,originalPrice:125,stock:2,image:'/membrane-tech.jpg',brand:'QA',features:['Test'],status:'draft',demo:true};
 await t.test('drafts hidden; published products visible',async()=>{const r=await request('/admin/products',at,'POST',product);assert.equal(r.status,201);pid=r.body.id;assert.equal((await request('/products/'+pid)).status,404);assert.equal((await request('/admin/products/'+pid,at,'PUT',{...product,status:'active'})).status,200);assert.equal((await request('/products/'+pid)).status,200);});
 const addr={name:'Test Customer',phone:'0000000000',line1:'Test street',city:'Test city',state:'Karnataka',pincode:'560001'};
 await t.test('profile cannot grant admin privilege',async()=>{await request('/me',ut);assert.equal((await request('/me',ut,'PUT',{name:'QA',addresses:[addr],admin:true})).status,200);assert.equal((await request('/admin/orders',ut)).status,403);});
 const key=randomUUID();const payload={items:[{id:pid,quantity:1,price:0.01}],address:addr,paymentMethod:'demo',totalPaise:1};let order;
 await t.test('server prices and idempotency',async()=>{const r=await request('/orders',ut,'POST',payload,key);assert.equal(r.status,201);order=r.body;orderIds.push(order.id);assert.equal(order.subtotalPaise,10000);assert.equal(order.totalPaise,10000+order.shippingPaise+(order.gstPaise||0));const duplicate=await request('/orders',ut,'POST',payload,key);assert.equal(duplicate.body.id,order.id);assert.equal((await db.doc('products/'+pid).get()).data().stock,1);assert.equal((await request('/orders',ut,'POST',{...payload,items:[{id:pid,quantity:2}]},key)).status,409);});
 await t.test('order isolation',async()=>{assert.equal((await request('/orders',st)).body.length,0);assert.equal((await request(`/orders/${order.id}/cancel`,st,'POST')).status,404);});
 await t.test('overselling prevented in concurrent checkouts',async()=>{const results=await Promise.all([request('/orders',ut,'POST',payload,randomUUID()),request('/orders',st,'POST',payload,randomUUID())]);assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);orderIds.push(results.find(r=>r.status===201).body.id);assert.equal((await db.doc('products/'+pid).get()).data().stock,0);});
 await t.test('cancel restores stock exactly once',async()=>{assert.equal((await request(`/orders/${order.id}/cancel`,ut,'POST')).status,200);assert.equal((await request(`/orders/${order.id}/cancel`,ut,'POST')).status,200);assert.equal((await db.doc('products/'+pid).get()).data().stock,1);});
 await t.test('invalid fulfillment transitions blocked',async()=>{const other=orderIds[1];assert.equal((await request('/admin/orders/'+other,at,'PATCH',{status:'delivered'})).status,409);assert.equal((await request('/admin/orders/'+other,at,'PATCH',{status:'processing'})).status,200);assert.equal((await request('/admin/orders/'+other,at,'PATCH',{status:'shipped',tracking:'QA-123'})).status,200);});
 await t.test('admin manual orders validate totals, protect existing IDs and reject customer access',async()=>{
 const manualId='qa_manual_'+randomUUID();const body={orderId:manualId,customerName:'QA Customer',email:'qa@example.test',productName:'Manual item',price:12.34,quantity:3,status:'confirmed',paymentStatus:'paid'};
 assert.equal((await request('/admin/orders/manual',ut,'POST',body)).status,403);
 assert.equal((await request('/admin/orders/manual',at,'POST',{...body,price:-1})).status,400);
 assert.equal((await request('/admin/orders/manual',at,'POST',{...body,paymentStatus:'pending'})).status,400);
 const r=await request('/admin/orders/manual',at,'POST',body);assert.equal(r.status,201);orderIds.push(r.body.id);assert.equal(r.body.totalPaise,3702);assert.equal(r.body.transactionId,null);
 assert.equal((await request('/admin/orders/manual',at,'POST',body)).status,409);
 assert.equal((await db.doc('orders/'+manualId).get()).data().totalPaise,3702);
 });
 await t.test('unconfigured live payment and feed stay disabled',async()=>{assert.equal((await request('/orders',ut,'POST',{...payload,paymentMethod:'cashfree'},randomUUID())).status,503);assert.equal((await request('/merchant/feed.xml')).status,503);});
 } finally {if(pid)await db.doc('products/'+pid).delete();for(const oid of orderIds)await db.doc('orders/'+oid).delete();for(const user of [a,u,stranger]){await auth.deleteUser(user.uid);await db.doc('customers/'+user.uid).delete();}}
});
test('merchant validation excludes placeholders and escapes XML',()=>{const p={id:'p1',name:'Filter & care',description:'A <filter>',price:10,stock:0,image:'https://shop.aquapure.com/product.png',brand:'AquaPure',mpn:'M-1',status:'active',merchantEnabled:true};const s={siteUrl:'https://shop.aquapure.com'};assert.deepEqual(merchantIssues(p,s),[]);assert.ok(merchantIssues({...p,demo:true},s).length);assert.ok(merchantIssues({...p,image:'/local.png'},s).length);assert.match(merchantFeed([p],s),/Filter &amp; care/);assert.match(merchantFeed([p],s),/out_of_stock/);assert.equal(validGtin('4006381333931'),true);assert.equal(validGtin('4006381333932'),false);});
test('Cashfree webhook signature uses exact raw body',()=>{const secret='test-secret';const raw=Buffer.from('{"amount":100.00}');const timestamp='1700000000';const signature=createHmac('sha256',secret).update(timestamp).update(raw).digest('base64');assert.equal(verifyWebhook(raw,timestamp,signature,secret),true);assert.equal(verifyWebhook(Buffer.from('{"amount":100}'),timestamp,signature,secret),false);assert.equal(verifyWebhook(raw,timestamp,'bad',secret),false);});
