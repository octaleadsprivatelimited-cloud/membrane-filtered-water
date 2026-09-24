import {useState,useEffect} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../commerce/Auth';
import {api} from '../commerce/api';
import Orders from '../commerce/Orders';
import AddressFields from '../commerce/AddressFields';
import {Package, ShoppingCart, MapPin, UserRound, LogOut} from 'lucide-react';

const menuItems = [
  {name: 'My Orders', icon: Package, tab: 'Orders'},
  {name: 'My Cart', icon: ShoppingCart, tab: 'Cart'},
  {name: 'Addresses', icon: MapPin, tab: 'Addresses'},
  {name: 'Profile', icon: UserRound, tab: 'Profile'}
];

export default function CustomerDashboard() {
  const {user,ready,profile,error:authError,refresh,logout}=useAuth();
  const navigate=useNavigate();
  const [orders,setOrders]=useState([]);
  const [tab,setTab]=useState('Orders');
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
    <div className="commerce-page customer-dashboard-page">
      <div className="customer-dashboard-grid">
        
        {/* Left Sidebar */}
        <aside className="customer-sidebar">
          <div className="customer-profile-block">
            <div className="customer-avatar">
              {profile.name ? profile.name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
            </div>
            <div className="customer-info">
              <strong>{profile.name || 'User'}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <nav className="customer-nav">
            {menuItems.map(({name,icon:Icon,tab:t})=>
              <button 
                key={name} 
                className={`customer-nav-item ${tab===t ? 'active' : ''}`}
                onClick={()=>{
                  if (t === 'Cart') {
                    navigate('/cart');
                  } else {
                    setTab(t);setNotice('');setError('');
                  }
                }}>
                <Icon size={18} /> {name}
              </button>
            )}
          </nav>

          <div className="customer-logout-wrap">
            <button className="customer-nav-item" onClick={async()=>{await logout();navigate('/login');}}>
              <LogOut size={18}/> Logout
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="customer-main">
          {error && <p role="alert" className="commerce-error" style={{marginBottom: '20px'}}>{error}</p>}
          {notice && <p role="status" className="commerce-notice" style={{color: '#ea580c', marginBottom: '20px', fontWeight: 600}}>{notice}</p>}

          {tab === 'Orders' && (
            <div className="customer-panel">
              <header className="customer-panel-header">
                <h2>My Orders</h2>
                <p>Track and manage your orders</p>
              </header>
              <Orders orders={orders} reload={load}/>
            </div>
          )}

          {tab === 'Addresses' && (
            <div className="customer-panel">
              <header className="customer-panel-header">
                <h2>Manage Delivery Addresses</h2>
                <p>Add or remove saved locations</p>
              </header>
              <div className="commerce-addresses" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px'}}>
                {profile.addresses.map((a,i)=>(
                  <article key={i} style={{padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff'}}>
                    <strong style={{fontSize: '15px'}}>{a.name}</strong>
                    <p style={{margin: '12px 0', color: '#64748b', lineHeight: 1.5, fontSize: '14px'}}>
                      {a.line1}<br/>{a.city}, {a.state} {a.pincode}<br/>{a.phone}
                    </p>
                    <button 
                      style={{background: 'transparent', color: '#ea580c', border: '1px solid #ea580c', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500}}
                      onClick={async()=>{
                        try{
                          await api('/me',{method:'PUT',body:JSON.stringify({name:profile.name,addresses:profile.addresses.filter((_,n)=>n!==i)})});
                          await refresh();
                        }catch(e){setError(e.message);}
                      }}>Remove</button>
                  </article>
                ))}
              </div>
              
              {profile.addresses.length < 5 && (
                <form className="commerce-form" onSubmit={saveAddress} style={{maxWidth: '500px', background: '#f8fafc', padding: '24px', borderRadius: '12px'}}>
                  <h3 style={{marginBottom: '16px'}}>Add a New Address</h3>
                  <AddressFields value={address} onChange={setAddress}/>
                  <button className="store-pill" disabled={busy} style={{marginTop: '15px', background: '#ea580c', color: 'white'}}>{busy ? 'Saving...' : 'Save Address'}</button>
                </form>
              )}
            </div>
          )}

          {tab === 'Profile' && (
             <div className="customer-panel">
               <header className="customer-panel-header">
                 <h2>Profile Details</h2>
                 <p>Update your personal information</p>
               </header>
               <form className="commerce-form" onSubmit={saveProfile} style={{maxWidth: '400px'}}>
                 <label>
                   Full Name
                   <input name="name" required defaultValue={profile.name}/>
                 </label>
                 <label>
                   Email Address
                   <input type="email" disabled value={user.email} style={{background: '#f1f5f9', cursor: 'not-allowed', color: '#94a3b8'}} />
                 </label>
                 <button className="store-pill" disabled={busy} style={{marginTop: '15px', background: '#ea580c', color: 'white'}}>{busy ? 'Updating...' : 'Update Profile'}</button>
               </form>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}
