import {useState,useEffect} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../commerce/Auth';
import {api} from '../commerce/api';
import Orders from '../commerce/Orders';
import AddressFields from '../commerce/AddressFields';
import {LayoutDashboard, ShoppingCart, MapPin, UserRound, LogOut, Droplets} from 'lucide-react';

const menuItems = [
  {name: 'Overview', icon: LayoutDashboard, tab: 'Overview'},
  {name: 'My Orders', icon: ShoppingCart, tab: 'Orders'},
  {name: 'Saved Addresses', icon: MapPin, tab: 'Addresses'},
  {name: 'Profile', icon: UserRound, tab: 'Profile'}
];

export default function CustomerDashboard() {
  const {user,ready,profile,error:authError,refresh,logout}=useAuth();
  const navigate=useNavigate();
  const [orders,setOrders]=useState([]);
  const [tab,setTab]=useState('Overview');
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [address,setAddress]=useState({});
  const [busy,setBusy]=useState(false);
  
  const load=async()=>setOrders(await api('/orders'));
  
  useEffect(()=>{
    if(ready&&!user)navigate('/login');
    if(user)load().catch(e=>setError(e.message));
  },[user,ready,navigate]);
  
  if(authError) return <div className="commerce-page" role="alert">{authError} <button onClick={()=>window.location.reload()}>Retry</button></div>;
  if(!user||!profile) return null;
  
  async function saveAddress(e){
    e.preventDefault();
    setBusy(true);setError('');
    try{
      if(profile.addresses.length>=5)throw new Error('You can save up to five addresses.');
      await api('/me',{method:'PUT',body:JSON.stringify({name:profile.name,addresses:[...profile.addresses,address]})});
      await refresh();
      setAddress({});
      setNotice('Address saved successfully.');
    }catch(e){setError(e.message);}finally{setBusy(false);}
  }

  async function saveProfile(e){
    e.preventDefault();
    setBusy(true);
    try{
      await api('/me',{method:'PUT',body:JSON.stringify({name:new FormData(e.currentTarget).get('name'),addresses:profile.addresses})});
      await refresh();
      setNotice('Profile updated successfully.');
    }catch(e){setError(e.message);}finally{setBusy(false);}
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="store-logo-icon" style={{color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Droplets size={24} />
            <span style={{fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px'}}>aquapure.</span>
          </Link>
        </div>
        
        {menuItems.map(({name,icon:Icon,tab:t})=>
          <button key={name} aria-pressed={tab===t} onClick={()=>{setTab(t);setNotice('');setError('');}}>
            <Icon size={18} /> {name}
          </button>
        )}
        
        <button className="admin-logout-btn" onClick={async()=>{await logout();navigate('/login');}}>
          <LogOut size={16}/> Logout
        </button>
      </aside>
      
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Customer Portal</h1>
            <p>Welcome back, {profile.name || 'valued customer'}</p>
          </div>
          <Link to="/products" className="store-pill" style={{textDecoration: 'none'}}>Continue Shopping</Link>
        </header>

        <div className="admin-content">
          {error && <p role="alert" className="commerce-error" style={{marginBottom: '20px'}}>{error}</p>}
          {notice && <p role="status" style={{color: 'green', marginBottom: '20px', fontWeight: 600}}>{notice}</p>}

          {tab === 'Overview' && (
            <div className="commerce-panel">
              <h2>Account Overview</h2>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
                <div style={{padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                  <h3>Total Orders</h3>
                  <p style={{fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: '10px 0'}}>{orders.length}</p>
                  <button onClick={() => setTab('Orders')} style={{color: '#2563eb', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline'}}>View all orders</button>
                </div>
                <div style={{padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                  <h3>Saved Addresses</h3>
                  <p style={{fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: '10px 0'}}>{profile.addresses.length}</p>
                  <button onClick={() => setTab('Addresses')} style={{color: '#2563eb', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline'}}>Manage addresses</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'Orders' && (
            <div className="commerce-panel">
              <h2>Order History</h2>
              <Orders orders={orders} reload={load}/>
            </div>
          )}

          {tab === 'Addresses' && (
            <div className="commerce-panel">
              <h2>Manage Delivery Addresses</h2>
              <div className="commerce-addresses" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px'}}>
                {profile.addresses.map((a,i)=>(
                  <article key={i} style={{padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px'}}>
                    <strong>{a.name}</strong>
                    <p style={{margin: '10px 0', color: '#475569', lineHeight: 1.5}}>
                      {a.line1}<br/>{a.city}, {a.state} {a.pincode}<br/>{a.phone}
                    </p>
                    <button 
                      style={{background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'}}
                      onClick={async()=>{
                        try{
                          await api('/me',{method:'PUT',body:JSON.stringify({name:profile.name,addresses:profile.addresses.filter((_,n)=>n!==i)})});
                          await refresh();
                        }catch(e){setError(e.message);}
                      }}>Remove Address</button>
                  </article>
                ))}
              </div>
              
              {profile.addresses.length < 5 && (
                <form className="commerce-form" onSubmit={saveAddress} style={{maxWidth: '500px'}}>
                  <h3>Add a New Address</h3>
                  <AddressFields value={address} onChange={setAddress}/>
                  <button className="store-pill" disabled={busy} style={{marginTop: '15px'}}>{busy ? 'Saving...' : 'Save Address'}</button>
                </form>
              )}
            </div>
          )}

          {tab === 'Profile' && (
             <div className="commerce-panel" style={{maxWidth: '400px'}}>
               <h2>Profile Details</h2>
               <form className="commerce-form" onSubmit={saveProfile}>
                 <label>
                   Full Name
                   <input name="name" required defaultValue={profile.name}/>
                 </label>
                 <label>
                   Email Address
                   <input type="email" disabled value={user.email} style={{background: '#f1f5f9', cursor: 'not-allowed'}} />
                 </label>
                 <button className="store-pill" disabled={busy} style={{marginTop: '15px'}}>{busy ? 'Updating...' : 'Update Profile'}</button>
               </form>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
