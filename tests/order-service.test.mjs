import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {auth,emulator} from '../server/firebase.mjs';
import {db} from '../server/database.mjs';
if(!emulator)throw new Error('Local tests only');
after(async()=>{await db.close?.();});
async function token(admin=false){const u=await auth.createUser({email:`service-${randomUUID()}@example.test`});if(admin)await auth.setCustomUserClaims(u.uid,{admin:true});const t=await auth.createCustomToken(u.uid);const r=await fetch('http://127.0.0.1:9199/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=demo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:t,returnSecureToken:true})});return {...u,token:(await r.json()).idToken};}
async function post(path,user,body){const r=await fetch('http://127.0.0.1:8787/api'+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${user.token}`},body:JSON.stringify(body)});return {status:r.status,body:await r.json()};}
test('request ownership, cancellation inventory, idempotent review and refund separation',async()=>{
 const owner=await token(),stranger=await token(),admin=await token(true),oid='qa_'+randomUUID(),pid='qa_'+randomUUID();
 const ref=db.doc('orders/'+oid);const requestPath=`/orders/${oid}/requests`;
 try{
  await db.doc('products/'+pid).set({stock:3});await ref.set({id:oid,uid:owner.uid,items:[{id:pid,quantity:2}],status:'confirmed',paymentMethod:'cashfree',paymentStatus:'paid',totalPaise:25000});
  assert.equal((await post(requestPath,stranger,{type:'cancellation',reason:'Wrong product selected'})).status,404);
  const r=await post(requestPath,owner,{type:'cancellation',reason:'Wrong product selected'});assert.equal(r.status,201);
  const duplicate=await post(requestPath,owner,{type:'cancellation',reason:'Wrong product selected'});assert.equal(duplicate.body.id,r.body.id);
  const reviewPath=`/admin/orders/${oid}/requests/${r.body.id}`,decision={decision:'approved',note:'Approved before dispatch'};
  assert.equal((await post(reviewPath,owner,decision)).status,403);
  assert.equal((await post(reviewPath,admin,decision)).status,200);assert.equal((await post(reviewPath,admin,decision)).status,200);
  assert.equal((await db.doc('products/'+pid).get()).data().stock,5);
  let o=(await ref.get()).data();assert.equal(o.status,'cancelled');assert.equal(o.paymentStatus,'paid');assert.equal(o.serviceRequests.find(r=>r.type==='refund').providerStatus,'not_submitted');
  await ref.set({status:'delivered',serviceRequests:[]},{merge:true});
  const refund=await post(requestPath,owner,{type:'refund',reason:'Product arrived damaged'});assert.equal(refund.status,201);
  const refundPath=`/admin/orders/${oid}/requests/${refund.body.id}`;
  assert.equal((await post(refundPath,admin,decision)).status,409);
  assert.equal((await post(refundPath,admin,{...decision,returnConfirmed:true})).status,200);
  assert.equal((await db.doc('products/'+pid).get()).data().stock,5);
  await ref.set({status:'pending_payment',paymentStatus:'pending',serviceRequests:[]},{merge:true});
  const pending=await post(requestPath,owner,{type:'cancellation',reason:'No longer needed'});
  assert.equal((await post(`/admin/orders/${oid}/requests/${pending.body.id}`,admin,decision)).status,409);
  assert.equal((await post(requestPath,owner,{type:'refund',reason:'Refund without payment'})).status,409);
 }finally{await ref.delete();await db.doc('products/'+pid).delete();for(const u of [owner,stranger,admin])await auth.deleteUser(u.uid);}
});
