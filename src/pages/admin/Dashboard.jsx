import PaymentCenter from '../../commerce/PaymentCenter';
import {downloadOrders} from '../../commerce/admin-export';
import {apiUrl} from '../../config/appConfig';
import {useState,useEffect} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../../commerce/Auth';
import {api} from '../../commerce/api';
import {auth} from '../../firebase/config';
import {money} from '../../store/Shop';
import Orders from '../../commerce/Orders';
import ProductEditor from '../../commerce/ProductEditor';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, DollarSign, Clock, Box, Leaf, List, FileText } from 'lucide-react';
export default function Dashboard(){const {user,ready,profile,logout,refreshConfig,error:authError}=useAuth();const navigate=useNavigate();const [tab,setTab]=useState('Overview');const [enquiries,setEnquiries]=useState([]);const [today]=useState(()=>new Date().toDateString());const [products,setProducts]=useState([]);const [orders,setOrders]=useState([]);const [customers,setCustomers]=useState([]);const [settings,setSettings]=useState(null);const [merchant,setMerchant]=useState(null);const [editor,setEditor]=useState(false);const [manualOrderEditor,setManualOrderEditor]=useState(false);const [selected,setSelected]=useState(null);const [query,setQuery]=useState('');const [error,setError]=useState('');const [notice,setNotice]=useState('');const [busy,setBusy]=useState(false);const load=async()=>{const [p,o,c,s,m,q]=await Promise.all([api('/admin/products'),api('/admin/orders'),api('/admin/customers'),api('/config'),api('/admin/merchant'),api('/admin/enquiries')]);setEnquiries(q);setProducts(p);setOrders(o);setCustomers(c);setSettings(s);setMerchant(m);};useEffect(()=>{if(ready&&!user)navigate('/admin');if(ready&&user&&profile&&!profile.admin){navigate('/account');}if(profile?.admin)load().catch(e=>setError(e.message));},[ready,user,profile,navigate,logout]);if(authError)return <div className="commerce-page" role="alert">{authError} <button onClick={()=>window.location.reload()}>Retry</button> <button onClick={logout}>Sign out</button></div>;if(!ready||!profile)return <p className="commerce-page" role="status">Loading administrator account…</p>;if(!profile.admin)return <p className="commerce-page" role="alert">Administrator access required. <Link to="/account">Go to your account</Link></p>;async function saveSettings(e){e.preventDefault();setBusy(true);setError('');try{await api('/admin/settings',{method:'PUT',body:JSON.stringify(settings)});setNotice('Store settings saved.');await refreshConfig();await load();}catch(e){setError(e.message);}finally{setBusy(false);}}async function exportFeed(){try{const token=await auth.currentUser.getIdToken();const r=await fetch(apiUrl('/admin/merchant/export'),{headers:{Authorization:`Bearer ${token}`}});if(!r.ok)throw new Error('Could not export feed');const url=URL.createObjectURL(await r.blob());const a=document.createElement('a');a.href=url;a.download='merchant-preview.xml';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){setError(e.message);}}
const uniqueCategories = Array.from(new Set([...(settings?.categories || []), ...products.map(p => p.category).filter(Boolean)]));

const menuItems = [{name:'Dashboard',icon:LayoutDashboard,tab:'Overview'},{name:'Categories',icon:List,tab:'Categories'},{name:'Products',icon:Package,tab:'Products'},{name:'Orders',icon:ShoppingCart,tab:'Orders'},{name:'Payments',icon:DollarSign,tab:'Payments'},{name:'Users',icon:Users,tab:'Customers'},{name:'Settings',icon:Settings,tab:'Settings'},{name:'Policies',icon:FileText,tab:'Policies'},{name:'Enquiries',icon:FileText,tab:'Enquiries'},{name:'Google Merchant',icon:Leaf,tab:'Google Merchant'}];

return <div className="admin-shell">
  <aside className="admin-sidebar">
    <div className="admin-sidebar-header">
      
      <div>
        <Link to="/" className="store-logo"><img src="/logo.jpg" alt="membraneIQ" style={{ height: "30px", objectFit: "contain" }} /></Link>
        <span>Admin Panel</span>
      </div>
    </div>
    <span>Menu</span>
    <nav>
      {menuItems.map(({name,icon:Icon,tab:t})=><button key={name} aria-pressed={tab===t} onClick={()=>{setTab(t);setNotice('');setError('');setQuery('');setEditor(false);setManualOrderEditor(false);}}><Icon /> {name}</button>)}
    </nav>
    <div className="admin-user-profile">
      <div className="admin-user-info">
        <div className="admin-avatar">A</div>
        <div className="admin-user-details">
          <strong>Aqua Admin</strong>
          <span>{profile?.email || 'admin@Aqua Safe Water Technologiescom'}</span>
        </div>
      </div>
      <button className="admin-logout-btn" onClick={async()=>{await logout();navigate('/admin');}}><LogOut size={16}/> Logout</button>
    </div>
  </aside>
  <main className="admin-content">
    <header className="commerce-heading">
      <div>
        <h1>{tab === 'Overview' ? 'Dashboard' : tab}</h1>
        <span className="shop-kicker">{tab === 'Overview' ? 'Welcome to Aqua Safe Water Technologies Admin Panel' : `Manage your ${tab.toLowerCase()}`}</span>
      </div>
      <div className="commerce-heading-actions">
        <button disabled={busy} onClick={()=>downloadOrders(orders)}>Export Orders</button>
        <button disabled={busy} onClick={()=>downloadOrders(orders,true)}>Export Payments</button>
      </div>
    </header>
    {error&&<p className="commerce-error" role="alert">{error}</p>}
    {notice&&<p className="commerce-notice" role="status">{notice}</p>}

    {tab==='Overview'&&<>
      <div className="admin-metrics">
        <article>
          <span>Total Revenue <DollarSign size={18}/></span>
          <strong>{money(orders.filter(o=>o.paymentStatus==='paid').reduce((n,o)=>n+o.totalPaise/100,0))}</strong>
          <span className="metric-sub positive">+{orders.filter(o=>o.paymentStatus==='paid').length} paid orders</span>
        </article>
        <article>
          <span>Total Orders <ShoppingCart size={18}/></span>
          <strong>{orders.length}</strong>
          <span className="metric-sub warning">{orders.filter(o=>new Date(o.createdAt).toDateString()===today).length} orders today</span>
        </article>
        <article>
          <span>Total Customers <Users size={18}/></span>
          <strong>{customers.length}</strong>
          <span className="metric-sub">Registered users</span>
        </article>
        <article>
          <span>Products <Box size={18}/></span>
          <strong>{products.filter(p=>p.status==='active').length}</strong>
          <span className="metric-sub">Active listings</span>
        </article>
        <article>
          <span>Pending <Clock size={18}/></span>
          <strong style={{color:'#d97706'}}>{orders.filter(o=>o.status==='pending_payment').length}</strong>
          <span className="metric-sub warning">Require attention</span>
        </article>
      </div>
      <div className="admin-grid">
        <section className="commerce-panel"><h2>Payment Summary</h2>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontSize:'14px'}}><span>Avg. Order Value</span> <strong>{orders.length ? money(orders.reduce((n,o)=>n+o.totalPaise/100,0)/orders.length) : '0'}</strong></div>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontSize:'14px'}}><span>Pending Payments</span> <span className="commerce-badge pending">{orders.filter(o=>o.paymentStatus==='pending').length}</span></div>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontSize:'14px'}}><span>Completed</span> <span className="commerce-badge delivered">{orders.filter(o=>o.paymentStatus==='paid').length}</span></div>
        </section>
        <section className="commerce-panel"><h2>Recent Orders</h2><Orders orders={orders.slice(0,5)} reload={load} admin/></section>
      </div>
      <div className="admin-grid">
        <section className="commerce-panel">
          <h2>Recent Payments</h2>
          <div className="commerce-table-wrap" style={{marginBottom: 0, border: 'none', boxShadow: 'none'}}>
            <table className="commerce-table">
              <thead><tr><th>Order ID</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                 {orders.filter(o=>o.paymentStatus==='paid').slice(0,5).map(o => (
                   <tr key={o.id}>
                     <td><small style={{margin:0,fontSize:'11px'}}>{o.id}</small></td>
                     <td><strong>{money(o.totalPaise/100)}</strong></td>
                     <td><span className="commerce-badge delivered">Paid</span></td>
                   </tr>
                 ))}
                 {orders.filter(o=>o.paymentStatus==='paid').length === 0 && <tr><td colSpan="3">No recent payments.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
        <section className="commerce-panel">
          <h2>Most Purchased Products</h2>
          <div className="commerce-table-wrap" style={{marginBottom: 0, border: 'none', boxShadow: 'none'}}>
            <table className="commerce-table">
              <thead><tr><th>Product Name</th><th>Sold</th></tr></thead>
              <tbody>
                 {(() => {
                    const counts = {};
                    orders.filter(o=>o.status!=='cancelled'&&o.status!=='pending_payment').forEach(o => { (o.items||[]).forEach(i => { counts[i.name] = (counts[i.name]||0) + i.quantity; }) });
                    const top = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);
                    if (!top.length) return <tr><td colSpan="2">No sales yet.</td></tr>;
                    return top.map(([name, count]) => (
                      <tr key={name}><td><strong>{name}</strong></td><td>{count} units</td></tr>
                    ));
                 })()}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>}
{tab==='Products'&&<><div className="commerce-toolbar"><input placeholder="Search products…" aria-label="Search products" value={query} onChange={e=>setQuery(e.target.value)}/><button className="store-pill" onClick={()=>{setSelected(null);setEditor(true);}}>Add product</button></div><div className="commerce-table-wrap"><table className="commerce-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Action</th></tr></thead><tbody>{products.filter(p=>p.name.toLowerCase().includes(query.toLowerCase())).map(p=><tr key={p.id}><td><strong>{p.name}</strong><small>{p.sku}</small></td><td>{p.category||'—'}</td><td>{money(p.price)}</td><td>{p.stock}</td><td><span className="commerce-badge">{p.status}</span></td><td><button onClick={()=>{setSelected(p);setEditor(true);}}>Edit</button></td></tr>)}</tbody></table></div><p className="commerce-note">Archive a product using Edit to remove it from the storefront without losing order records.</p></>}
{editor && <ProductEditor key={selected?.id||'new'} product={selected} categories={uniqueCategories} onClose={()=>setEditor(false)} onDone={()=>{setEditor(false);setNotice('Product saved.');load().catch(e=>setError(e.message));}} />}
{tab==='Orders'&&<>
  <div className="commerce-toolbar">
    <button className="store-pill" onClick={() => setManualOrderEditor(true)}>Add Manual Order</button>
  </div>
  {manualOrderEditor && (
    <div className="commerce-modal-backdrop">
      <div className="commerce-modal">
        <div className="commerce-heading commerce-inline">
          <h2>Create Manual Order</h2>
          <button onClick={() => setManualOrderEditor(false)}>✕</button>
        </div>
        <form className="commerce-form" onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            setBusy(true); setError('');
            try {
               await api('/admin/orders/manual', { method: 'POST', body: JSON.stringify(Object.fromEntries(f)) });
               setNotice('Manual order created successfully!');
               setManualOrderEditor(false);
               await load();
            } catch(err) { setError(err.message); }
            finally { setBusy(false); }
        }}>
          {error && <p role="alert" className="commerce-error">{error}</p>}
          <div className="commerce-fields">
             <label>Order Name (Customer Name) <input type="text" name="customerName" required/></label>
             <label>Customer Email <input type="email" name="email" required/></label>
             <label>Order ID (Optional - leave blank to auto-generate) <input type="text" name="orderId"/></label>
             <label>No. of Products (Quantity) <input type="number" min="1" name="quantity" defaultValue="1" required/></label>
             <label>Products (Product Name) <input type="text" name="productName" required/></label>
             <label>Unit Price (₹) <input type="number" min="0.01" step="0.01" name="price" required/></label>
             <label>Status 
               <select name="status" defaultValue="confirmed">
                 <option value="pending_payment">Pending Payment</option>
                 <option value="confirmed">Confirmed</option>
                 <option value="processing">Processing</option>
                 <option value="shipped">Shipped</option>
                 <option value="delivered">Delivered</option>
               </select><details><summary>Order details & tracking</summary><Orders orders={[o]} reload={load} admin/></details>
             </label>
             <label>Payment Status
               <select name="paymentStatus" defaultValue="paid">
                 <option value="paid">Paid (recorded manually)</option>
                 <option value="pending">Pending</option>
               </select><details><summary>Order details & tracking</summary><Orders orders={[o]} reload={load} admin/></details>
             </label>
          </div>
          <div className="commerce-modal-actions">
             <button type="button" onClick={() => setManualOrderEditor(false)} style={{background:'transparent',border:'none',cursor:'pointer'}}>Cancel</button>
             <button type="submit" className="store-pill" disabled={busy}>{busy?'Saving...':'Create Order'}</button>
          </div>
        </form>
      </div>
    </div>
  )}
  <div className="commerce-table-wrap">
    <table className="commerce-table">
      <thead><tr><th>Order Name</th><th>Order ID</th><th>No. Products</th><th>Products</th><th>Price</th><th>Status</th><th>Payment</th><th>Action</th></tr></thead>
      <tbody>
        {orders.map(o => (
           <tr key={o.id}>
             <td><strong>{o.address?.name || o.email || '—'}</strong><br/><small>{o.email}</small></td>
             <td><small>{o.id}</small></td>
             <td>{o.items?.reduce((n, i) => n + (i.quantity||1), 0) || 0}</td>
             <td>{o.items?.map(i => i.name).join(', ')}</td>
             <td>{money(o.totalPaise/100)}</td>
             <td><span className="commerce-badge">{o.status}</span></td>
             <td><span className={"commerce-badge " + (o.paymentStatus==='paid'?'delivered':'pending')}>{o.paymentStatus}</span></td>
             <td>
               <select aria-label={`Update status for ${o.id}`} value={o.status} disabled={busy||!['confirmed','processing','shipped'].includes(o.status)} onChange={async(e) => {
                  setBusy(true);setError('');try{await api(`/admin/orders/${o.id}`,{method:'PATCH',body:JSON.stringify({status:e.target.value,tracking:o.tracking})});await load();}catch(err){setError(err.message);}finally{setBusy(false);}
               }}>
                  <option value={o.status}>{o.status.replaceAll('_',' ')}</option>
                  {{confirmed:'processing',processing:'shipped',shipped:'delivered'}[o.status]&&<option value={{confirmed:'processing',processing:'shipped',shipped:'delivered'}[o.status]}>{{confirmed:'processing',processing:'shipped',shipped:'delivered'}[o.status]}</option>}
               </select><details><summary>Order details & tracking</summary><Orders orders={[o]} reload={load} admin/></details>
             </td>
           </tr>
        ))}
        {orders.length === 0 && <tr><td colSpan="8" style={{textAlign:'center', padding:'20px'}}>No orders found.</td></tr>}
      </tbody>
    </table>
  </div>
</>}
{tab==='Payments'&&<PaymentCenter orders={orders} reload={load} admin/>}
{tab==='Enquiries'&&<section><h2>Customer support inbox</h2>{enquiries.map(q=><article className="commerce-panel" key={q.id}><div className="commerce-inline"><strong>{q.subject}</strong><span className="commerce-badge">{q.status}</span></div><p>{q.name} · {q.email} · {q.phone}</p><p style={{whiteSpace:'pre-wrap'}}>{q.message}</p><small>{new Date(q.createdAt).toLocaleString()}</small><button className="store-pill" disabled={busy} onClick={async()=>{setBusy(true);try{await api(`/admin/enquiries/${q.id}`,{method:'PATCH',body:JSON.stringify({status:q.status==='open'?'resolved':'open'})});await load();}catch(e){setError(e.message);}finally{setBusy(false);}}}>{q.status==='open'?'Mark resolved':'Reopen'}</button></article>)}{!enquiries.length&&<p>No enquiries yet.</p>}</section>}
{tab==='Customers' &&<div className="commerce-table-wrap"><table className="commerce-table"><thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Orders</th></tr></thead><tbody>{customers.map(c=><tr key={c.id}><td>{c.name||'—'}</td><td>{c.email}</td><td>{c.createdAt?new Date(c.createdAt).toLocaleDateString():'—'}</td><td>{orders.filter(o=>o.uid===c.id).length}</td></tr>)}</tbody></table></div>}
{tab==='Google Merchant'&&<><section className="commerce-panel"><h2>Product feed readiness</h2><p>Status: {merchant?.enabled?'Live publication enabled':'Not published'}. A public HTTPS domain, real product photos, valid identifiers, policies and live checkout are needed before submission. Google approval is not automatic.</p><p><code>{merchant?.feedUrl}</code></p><button className="store-pill" onClick={exportFeed}>Download eligible-product XML preview</button><p className="commerce-note">An empty preview means no products currently pass the readiness checks. Add this feed in Merchant Center only after deployment and account verification.</p></section>{merchant?.products.map(p=><article className="commerce-panel" key={p.id}><strong>{p.name}</strong>{p.issues.length?<ul>{p.issues.map(i=><li key={i}>• {i}</li>)}</ul>:<p>Ready for the feed.</p>}</article>)}</>}
{tab==='Categories' && settings && (
      <div className="commerce-panel">
        <div className="commerce-toolbar" style={{marginBottom: '20px'}}>
          <input 
            placeholder="New category name..." 
            value={query} 
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={async e => {
              if(e.key==='Enter' && query) {
                 e.preventDefault();
                 setBusy(true);
                 try {
                   const newCats = [...new Set([...(settings.categories||[]), query.trim()])].filter(Boolean);
                   await api('/admin/settings',{method:'PUT',body:JSON.stringify({...settings, categories: newCats})});
                   setSettings({...settings, categories: newCats});
                   setQuery('');
                   setNotice('Category added.');
                 } catch (err) { setError(err.message); } finally { setBusy(false); }
              }
            }}
          />
          <button className="store-pill" disabled={busy} onClick={async () => {
              if(query) {
                 setBusy(true);
                 try {
                   const newCats = [...new Set([...(settings.categories||[]), query.trim()])].filter(Boolean);
                   await api('/admin/settings',{method:'PUT',body:JSON.stringify({...settings, categories: newCats})});
                   setSettings({...settings, categories: newCats});
                   setQuery('');
                   setNotice('Category added.');
                 } catch (err) { setError(err.message); } finally { setBusy(false); }
              }
          }}>Add Category</button>
        </div>
        <div className="commerce-table-wrap">
          <table className="commerce-table">
            <thead><tr><th>Category Name</th><th>Products Count</th><th>Action</th></tr></thead>
            <tbody>
              {(settings.categories||[]).map((cat, i) => (
                 <tr key={i}>
                    <td><strong>{cat}</strong></td>
                    <td>{products.filter(p=>p.category===cat).length} products</td>
                    <td>
                      <button disabled={busy} style={{color:'#ea580c', cursor:'pointer', background:'transparent', border:'none'}} onClick={async () => {
                         if (!window.confirm('Remove this category?')) return;
                         setBusy(true);
                         try {
                           const newCats = settings.categories.filter(c => c !== cat);
                           await api('/admin/settings',{method:'PUT',body:JSON.stringify({...settings, categories: newCats})});
                           setSettings({...settings, categories: newCats});
                           setNotice('Category removed.');
                         } catch (err) { setError(err.message); } finally { setBusy(false); }
                      }}>Remove</button>
                    </td>
                 </tr>
              ))}
              {(!settings.categories || settings.categories.length === 0) && (
                 <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>No categories added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
    {tab==='Settings'&&settings&&<form className="commerce-form commerce-panel" onSubmit={saveSettings}>
      <h2>Store Details & Shipping</h2>
      <div className="commerce-fields">{[['businessName','Business name','text'],['siteUrl','Public store URL (HTTPS)','url'],['supportEmail','Support email','email'],['shippingFee','Shipping rate per estimated km (INR)','number'],['freeShippingAbove','Free shipping threshold (0 = disabled)','number']].map(([k,label,type])=><label key={k}>{label}<input type={type} min={0} step={type==='number'?'0.01':undefined} value={settings[k]} onChange={e=>setSettings({...settings,[k]:e.target.value})}/></label>)}</div>
      
      <label className="commerce-checkbox" style={{marginTop: '20px'}}><input type="checkbox" checked={settings.merchantLive} onChange={e=>setSettings({...settings,merchantLive:e.target.checked})}/>Publish Google product feed (live setup required)</label>
      <p className="commerce-note">Cashfree: {settings.paymentMode}. Configure provider keys in the server environment, never in this dashboard or frontend.</p>
      <button className="store-pill" disabled={busy}>{busy?'Saving…':'Save settings'}</button>
    </form>}
    
    {tab==='Policies'&&settings&&<form className="commerce-form commerce-panel" onSubmit={saveSettings}>
      <h2>Store policies</h2>
      {[['shippingPolicy','Shipping & delivery'],['returnsPolicy','Returns & refunds'],['privacyPolicy','Privacy'],['termsPolicy','Terms of service']].map(([k,label])=><label key={k}>{label}<textarea rows={8} value={settings[k]} onChange={e=>setSettings({...settings,[k]:e.target.value})}/></label>)}
      <button className="store-pill" disabled={busy}>{busy?'Saving…':'Save policies'}</button>
    </form>}
</main></div>}
