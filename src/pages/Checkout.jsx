import {totals} from '../shared/pricing';
import {useState,useEffect,useRef} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../commerce/Auth';
import {useShop,money,getCatalog} from '../store/Shop';
import {api,startPayment} from '../commerce/api';
import AddressFields from '../commerce/AddressFields';

export default function Checkout(){
  const {user,ready,profile,config,configError,refresh,logout,error:authError}=useAuth();
  const {items,clear}=useShop();
  const navigate=useNavigate();
  const [address,setAddress]=useState({});
  const [catalog,setCatalog]=useState([]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const key=useRef(crypto.randomUUID());

  useEffect(()=>{getCatalog().then(setCatalog).catch(e=>setError(e.message));},[]);
  
  const pricedItems=items.map(i=>({...i,...catalog.find(p=>p.id===i.id),quantity:i.quantity}));
  const unavailable=items.some(i=>!catalog.some(p=>p.id===i.id&&p.stock>=i.quantity));
  const amounts=totals(pricedItems,address,config||{});
  const subtotal=amounts.subtotalPaise/100,gst=amounts.gstPaise/100,shipping=amounts.shippingPaise/100;
  const attempt=JSON.stringify({items:items.map(i=>({id:i.id,quantity:i.quantity})),address});
  const previousAttempt=useRef('');
  async function submit(e){
    e.preventDefault();
    if(busy)return;
    setBusy(true);setError('');
    if(previousAttempt.current!==attempt){key.current=crypto.randomUUID();previousAttempt.current=attempt;}
    try{
      const order=await api('/orders',{
        method:'POST',
        headers:{'Idempotency-Key':key.current},
        body:JSON.stringify({items:items.map(i=>({id:i.id,quantity:i.quantity})),address,paymentMethod:config.paymentMode==='disabled'?'demo':'cashfree'})
      });
      clear();
      if(order.paymentMethod==='cashfree'){
        try{
          await startPayment(order.id);
        }catch{navigate('/account?payment=pending');}
      }else navigate('/account');
    }catch(e){setError(e.message);}finally{setBusy(false);}
  }
  
  if(configError)return <div className="commerce-page" role="alert">Checkout is temporarily unavailable. {configError} <button onClick={()=>window.location.reload()}>Retry</button></div>;
  if(authError)return <div className="commerce-page" role="alert">{authError} <button onClick={()=>refresh().catch(()=>{})}>Retry account</button> <button onClick={logout}>Sign out</button></div>;
  if(!ready||!config)return <div className="commerce-page">Loading checkout…</div>;
  if(!user)return <div className="commerce-page"><h1>Sign in to checkout.</h1><p>Keep your addresses and orders together.</p><Link className="store-pill" to="/login?next=/checkout">Continue with Google</Link></div>;
  if(!items.length)return <div className="commerce-page"><h1>Your bag is empty.</h1><Link to="/products">Explore products</Link></div>;
  
  return (
    <div className="commerce-page">
      <span className="shop-kicker">CHECKOUT</span>
      <h1>One step closer.</h1>
      <div className="commerce-checkout">
        <form className="commerce-form" onSubmit={submit}>
          <h2>Delivery address</h2>
          {profile?.addresses.length>0&&<label>Saved address<select defaultValue="" onChange={e=>setAddress(e.target.value===''?{}:profile.addresses[Number(e.target.value)])}><option value="">Use a new address</option>{profile.addresses.map((a,i)=><option key={i} value={i}>{a.name} — {a.line1}, {a.city}</option>)}</select></label>}
          <AddressFields value={address} onChange={setAddress}/>
          <section className="checkout-gateway"><span className="shop-kicker">PAYMENT METHOD</span><h2>Cashfree Payments</h2><p>UPI · Cards · Net banking</p><small>Available methods are confirmed by Cashfree at checkout. We never store your card number or UPI PIN.</small></section>
          <p className="commerce-notice">{config.paymentMode==='disabled'?(config.emulator?'Local demo order only. No payment will be collected.':'Payments are not connected yet. Please return once checkout is available.'):`Pay securely through Cashfree ${config.paymentMode==='sandbox'?'sandbox (test payments)':''}.`}</p>
          {unavailable&&<p role="alert" className="commerce-error">An item is unavailable or exceeds current stock. <Link to="/bag">Update your bag</Link></p>}
          {error&&<p role="alert" className="commerce-error">{error}</p>}
          <button className="store-pill" disabled={busy||unavailable||!catalog.length||(!config.emulator&&config.paymentMode==='disabled')}>{busy?'Creating order…':config.paymentMode==='disabled'?'Place demo order':'Continue to Cashfree'}</button>
          <p className="commerce-note">Review <Link to="/policies/shipping">shipping</Link> and <Link to="/policies/returns">returns</Link> before ordering.</p>
        </form>
        <aside className="store-summary">
          <h2>Your order</h2>
          {items.map(i=><div key={i.id}><span>{i.name} × {i.quantity}</span><strong>{money((catalog.find(p=>p.id===i.id)?.price||0)*i.quantity)}</strong></div>)}
          <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <div><span>GST</span><strong>{money(gst)}</strong></div>
          <div><span>Shipping</span><strong>{address?.pincode ? (shipping === 0 ? 'Free' : money(shipping)) : 'Enter Pincode'}</strong></div>
          <div style={{borderTop:'1px solid #e2e8f0',paddingTop:'15px',marginTop:'15px',fontSize:'16px'}}><span>Total</span><strong>{money(subtotal+shipping+gst)}</strong></div>
          <p>Prices and stock are rechecked on the server when you order.</p>
        </aside>
      </div>
    </div>
  );
}
