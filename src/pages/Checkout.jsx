import {useState,useEffect,useRef} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../commerce/Auth';
import {useShop,money,getCatalog} from '../store/Shop';
import {api,startPayment} from '../commerce/api';
import AddressFields from '../commerce/AddressFields';

export default function Checkout(){
  const {user,ready,profile,config,error:authError}=useAuth();
  const {items,clear}=useShop();
  const navigate=useNavigate();
  const [address,setAddress]=useState({});
  const [catalog,setCatalog]=useState([]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const key=useRef(crypto.randomUUID());

  useEffect(()=>{getCatalog().then(setCatalog).catch(e=>setError(e.message));},[]);
  
  const subtotal=items.reduce((n,i)=>n+(catalog.find(p=>p.id===i.id)?.price||0)*i.quantity,0);
  const gst=items.reduce((n,i)=>n+(catalog.find(p=>p.id===i.id)?.price||0)*i.quantity*((catalog.find(p=>p.id===i.id)?.gst||0)/100),0);
  
  let shipping = 0;
  if (address?.pincode && address?.city) {
    const isVizag = address.city.toLowerCase().includes('vizag') || address.city.toLowerCase().includes('visakha') || address.pincode.startsWith('530') || address.pincode.startsWith('531');
    if (!isVizag) {
      const s = address.pincode.substring(0,2);
      let km = 1500;
      if(['51','52','53'].includes(s)) km = 300;
      else if(s==='50') km = 600;
      else if(['75','76','77'].includes(s)) km = 400;
      else if(['60','61','62','63','64'].includes(s)) km = 800;
      else if(['56','57','58','59'].includes(s)) km = 1000;
      else if(['40','41','42','43','44'].includes(s)) km = 1200;
      shipping = km * (config?.shippingFee || 2);
    }
  }
  if(config?.freeShippingAbove>0&&subtotal>=config.freeShippingAbove) shipping = 0;

  async function submit(e){
    e.preventDefault();
    if(busy)return;
    setBusy(true);setError('');
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
  
  if(authError)return <div className="commerce-page" role="alert">{authError}</div>;
  if(!ready||!config)return <div className="commerce-page">Loading checkout…</div>;
  if(!user)return <div className="commerce-page"><h1>Sign in to checkout.</h1><p>Keep your addresses and orders together.</p><Link className="store-pill" to="/login">Sign in / create account</Link></div>;
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
          <p className="commerce-notice">{config.paymentMode==='disabled'?'Local demo order only. No payment will be collected.':`Pay securely through Cashfree ${config.paymentMode==='sandbox'?'sandbox (test payments)':''}.`}</p>
          {error&&<p role="alert" className="commerce-error">{error}</p>}
          <button className="store-pill" disabled={busy||!catalog.length||(!config.emulator&&config.paymentMode==='disabled')}>{busy?'Creating order…':config.paymentMode==='disabled'?'Place demo order':'Continue to Cashfree'}</button>
          <p className="commerce-note">Review <Link to="/policies/shipping">shipping</Link> and <Link to="/policies/returns">returns</Link> before ordering.</p>
        </form>
        <aside className="store-summary">
          <h2>Your order</h2>
          {items.map(i=><div key={i.id}><span>{i.name} × {i.quantity}</span><strong>{money((catalog.find(p=>p.id===i.id)?.price||0)*i.quantity)}</strong></div>)}
          <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <div><span>GST</span><strong>{money(gst)}</strong></div>
          <div><span>Shipping</span><strong>{address?.pincode ? (shipping === 0 ? 'Free (Vizag)' : money(shipping)) : 'Enter Pincode'}</strong></div>
          <div style={{borderTop:'1px solid #e2e8f0',paddingTop:'15px',marginTop:'15px',fontSize:'16px'}}><span>Total</span><strong>{money(subtotal+shipping+gst)}</strong></div>
          <p>Prices and stock are rechecked on the server when you order.</p>
        </aside>
      </div>
    </div>
  );
}
