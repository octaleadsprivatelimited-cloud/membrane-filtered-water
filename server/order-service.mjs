import {randomUUID} from 'node:crypto';
const fail=(message,status=409)=>{throw Object.assign(new Error(message),{status});};
const clean=value=>typeof value==='string'?value.trim().slice(0,1000):'';
export function registerOrderService(app,{db,authenticated,admin}){
 app.post('/api/orders/:id/requests',authenticated,async(req,res)=>{
  if(!/^[\w-]{1,100}$/.test(req.params.id))fail('Invalid order ID',400);
  const {type}=req.body,reason=clean(req.body.reason);
  if(!['cancellation','refund'].includes(type)||reason.length<5)fail('Choose a request type and provide a reason of at least five characters.',400);
  const ref=db.doc(`orders/${req.params.id}`);
  const result=await db.runTransaction(async tx=>{
   const snap=await tx.get(ref);if(!snap.exists||snap.data().uid!==req.user.uid)fail('Order not found',404);
   const o=snap.data(),requests=o.serviceRequests||[];
   const existing=requests.find(r=>r.type===type&&r.status!=='rejected');if(existing)return existing;
   if(requests.length>=10)fail('Please contact support for further assistance.');
   if(type==='cancellation'&&!['pending_payment','confirmed','processing'].includes(o.status))fail('Cancellation is only available before shipping.');
   if(type==='refund'&&(o.paymentStatus!=='paid'||!['delivered','cancelled'].includes(o.status)))fail('Refund review requires a paid, delivered or cancelled order. Demo payments cannot be refunded.');
   const request={id:randomUUID(),type,reason,status:'requested',requestedAt:new Date().toISOString(),amountPaise:type==='refund'?o.totalPaise:null};
   tx.update(ref,{serviceRequests:[...requests,request]});return request;
  });res.status(201).json(result);
 });
 app.post('/api/admin/orders/:id/requests/:requestId',authenticated,admin,async(req,res)=>{
  if(!/^[\w-]{1,100}$/.test(req.params.id))fail('Invalid order ID',400);
  const decision=req.body.decision,note=clean(req.body.note);
  if(!['approved','rejected'].includes(decision)||note.length<5)fail('A valid decision and review note are required.',400);
  const ref=db.doc(`orders/${req.params.id}`);
  const result=await db.runTransaction(async tx=>{
   const snap=await tx.get(ref);if(!snap.exists)fail('Order not found',404);
   const o=snap.data(),requests=o.serviceRequests||[],request=requests.find(r=>r.id===req.params.requestId);
   if(!request)fail('Request not found',404);
   if(request.status===decision)return o;
   if(request.status!=='requested')fail('This request has already been reviewed.');
   const updates={},now=new Date().toISOString();
   if(decision==='approved'&&request.type==='cancellation'){
    if(!['pending_payment','confirmed','processing'].includes(o.status))fail('Order has already shipped or been cancelled.');
    if(o.paymentMethod==='cashfree'&&o.paymentStatus!=='paid')fail('Verify or close the Cashfree payment session before approving cancellation. Provider reconciliation is required.');
    const docs=await tx.getAll(...o.items.filter(i=>i.id!=='manual').map(i=>db.doc(`products/${i.id}`)));
    for(const doc of docs){if(doc.exists)tx.update(doc.ref,{stock:doc.data().stock+o.items.find(i=>i.id===doc.id).quantity});}
    updates.status='cancelled';updates.cancelledAt=now;
    if(o.paymentStatus==='paid'&&!requests.some(r=>r.type==='refund'&&r.status!=='rejected'))requests.push({id:randomUUID(),type:'refund',reason:'Approved cancellation',status:'approved',amountPaise:o.totalPaise,requestedAt:now,reviewedAt:now,reviewedBy:req.user.uid,note,providerStatus:'not_submitted'});
   }
   if(decision==='approved'&&request.type==='refund'){
    if(o.paymentStatus!=='paid'||!['delivered','cancelled'].includes(o.status))fail('This order is not eligible for refund review.');
    if(o.status==='delivered'&&req.body.returnConfirmed!==true)fail('Confirm the return was received or explicitly waived before approving.');
    request.providerStatus='not_submitted';request.returnConfirmed=req.body.returnConfirmed===true;
   }
   Object.assign(request,{status:decision,note,reviewedAt:now,reviewedBy:req.user.uid});
   updates.serviceRequests=requests;tx.update(ref,updates);return {...o,...updates};
  });res.json(result);
 });
}
