import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchProducts, 
  fetchServices, 
  addProduct, 
  deleteProduct,
  addService,
  deleteService,
  fetchPageContent,
  updatePageContent,
  uploadImageToStorage
} from '../../firebase/mockDb';
import { compressImage } from '../../utils/imageCompressor';

const PageEditor = ({ pageId, title }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadContent();
  }, [pageId]);

  const loadContent = async () => {
    setLoading(true);
    const data = await fetchPageContent(pageId);
    setContent(data);
    setLoading(false);
  };

  const handleChange = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      // Auto-compress image before upload
      const compressedFile = await compressImage(file, 1200, 800, 0.7);
      // Upload to Firebase Storage (mocked)
      const downloadURL = await uploadImageToStorage(compressedFile);
      handleChange(key, downloadURL);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to compress and upload image.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await updatePageContent(pageId, content);
    setSaving(false);
    alert("Saved successfully!");
  };

  if (loading) return <div className="p-8">Loading content...</div>;
  if (!content) return <div className="p-8">Page not found.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h3 className="text-2xl font-bold mb-6">{title} Content</h3>
      <div className="space-y-6">
        {Object.entries(content).map(([key, value]) => {
          if (key.toLowerCase().includes('image')) {
            return (
              <div key={key} className="border p-4 rounded-lg bg-slate-50">
                <label className="block text-sm font-bold text-slate-700 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <div className="flex items-center gap-6">
                  {value && <img src={value} alt="Preview" className="h-24 w-auto rounded object-cover shadow" />}
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, key)}
                      className="text-sm"
                      ref={fileInputRef}
                    />
                    <p className="text-xs text-slate-500 mt-2">Images are auto-compressed before upload.</p>
                  </div>
                </div>
              </div>
            );
          }
          
          return (
            <div key={key}>
              <label className="block text-sm font-bold text-slate-700 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
              {value.length > 60 ? (
                <textarea 
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                  rows="4"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : (
                <input 
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
      <button 
        onClick={handleSave} 
        disabled={saving}
        className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, services: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', title: '', price: '', description: '', image: '' });

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin');
      return;
    }
    setShowAddForm(false);
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    if (activeTab === 'overview') {
      const p = await fetchProducts();
      const s = await fetchServices();
      setStats({ products: p.length, services: s.length });
    } else if (activeTab === 'products') {
      const data = await fetchProducts();
      setItems(data);
    } else if (activeTab === 'services') {
      const data = await fetchServices();
      setItems(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    if (activeTab === 'products') {
      await deleteProduct(id);
    } else if (activeTab === 'services') {
      await deleteService(id);
    }
    loadData();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'products') {
      await addProduct({ 
        name: formData.name, 
        price: formData.price, 
        description: formData.description,
        image: formData.image || 'https://via.placeholder.com/400x300'
      });
    } else if (activeTab === 'services') {
      await addService({ 
        title: formData.title || formData.name, 
        description: formData.description,
        icon: 'Wrench'
      });
    }
    setShowAddForm(false);
    setFormData({ name: '', title: '', price: '', description: '', image: '' });
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-slate-500 font-semibold mb-2">Total Products</h3>
                <p className="text-3xl font-bold text-slate-800">{stats.products}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-slate-500 font-semibold mb-2">Total Services</h3>
                <p className="text-3xl font-bold text-slate-800">{stats.services}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-slate-500 font-semibold mb-2">Partnerships</h3>
                <p className="text-3xl font-bold text-slate-800">14</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-slate-500 font-semibold mb-2">Total Earned</h3>
                <p className="text-3xl font-bold text-slate-800">$149.00</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Followers by Gender */}
            <div className="bg-white p-6 rounded shadow-sm border border-slate-100 flex flex-col items-center">
              <h3 className="text-slate-500 font-semibold mb-6 self-start text-sm">Followers by Gender</h3>
              <div className="relative w-48 h-48 rounded-full border-[16px] border-blue-500 border-l-pink-500 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-blue-500 font-bold text-xl">Female</p>
                  <p className="text-slate-500">60%</p>
                </div>
              </div>
            </div>

            {/* Followers by Age */}
            <div className="bg-white p-6 rounded shadow-sm border border-slate-100">
               <h3 className="text-slate-500 font-semibold mb-6 text-sm">Followers by Age</h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-4 text-sm text-slate-600"><span className="w-12">15-20</span><div className="flex-1 h-2 bg-slate-100 rounded overflow-hidden"><div className="h-full bg-pink-500 w-[70%]"></div></div></div>
                 <div className="flex items-center gap-4 text-sm text-slate-600"><span className="w-12">20-25</span><div className="flex-1 h-2 bg-slate-100 rounded overflow-hidden"><div className="h-full bg-pink-500 w-[50%]"></div></div></div>
                 <div className="flex items-center gap-4 text-sm text-slate-600"><span className="w-12">25-30</span><div className="flex-1 h-2 bg-slate-100 rounded overflow-hidden"><div className="h-full bg-pink-500 w-[80%]"></div></div></div>
                 <div className="flex items-center gap-4 text-sm text-slate-600"><span className="w-12">30-35</span><div className="flex-1 h-2 bg-slate-100 rounded overflow-hidden"><div className="h-full bg-pink-500 w-[40%]"></div></div></div>
               </div>
            </div>

            {/* Top Followers by Location */}
            <div className="bg-white p-6 rounded shadow-sm border border-slate-100">
               <h3 className="text-slate-500 font-semibold mb-6 text-sm">Top Followers by Locations</h3>
               <div className="space-y-3">
                 <div className="flex items-center gap-2 text-xs text-slate-600"><span className="w-16 text-right">US</span><div className="h-4 bg-blue-500 w-[10%]"></div></div>
                 <div className="flex items-center gap-2 text-xs text-slate-600"><span className="w-16 text-right">Brazil</span><div className="h-4 bg-blue-500 w-[90%]"></div></div>
                 <div className="flex items-center gap-2 text-xs text-slate-600"><span className="w-16 text-right">Canada</span><div className="h-4 bg-blue-500 w-[80%]"></div></div>
                 <div className="flex items-center gap-2 text-xs text-slate-600"><span className="w-16 text-right">UK</span><div className="h-4 bg-blue-500 w-[70%]"></div></div>
                 <div className="flex items-center gap-2 text-xs text-slate-600"><span className="w-16 text-right">Australia</span><div className="h-4 bg-blue-500 w-[60%]"></div></div>
                 <div className="flex items-center gap-2 text-xs text-slate-600"><span className="w-16 text-right">India</span><div className="h-4 bg-blue-500 w-[50%]"></div></div>
                 <div className="flex items-center gap-2 text-xs text-slate-600"><span className="w-16 text-right">China</span><div className="h-4 bg-blue-500 w-[40%]"></div></div>
               </div>
            </div>
          </div>
        </div>
      );
    }

    if (['home', 'about', 'technology', 'contact'].includes(activeTab)) {
      return <PageEditor pageId={activeTab} title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <h3 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h3>
           <button 
             onClick={() => setShowAddForm(!showAddForm)}
             className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
           >
             + Add New
           </button>
        </div>

        {showAddForm && (
          <div className="bg-white p-6 rounded shadow-sm border border-slate-100">
             <h4 className="font-bold mb-4">Add New {activeTab === 'products' ? 'Product' : 'Service'}</h4>
             <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name / Title</label>
                  <input required type="text" className="w-full border border-slate-200 rounded px-3 py-2" value={formData.name || formData.title} onChange={e => setFormData({...formData, name: e.target.value, title: e.target.value})} />
                </div>
                {activeTab === 'products' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                    <input required type="text" className="w-full border border-slate-200 rounded px-3 py-2" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea required className="w-full border border-slate-200 rounded px-3 py-2" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold text-sm">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700">Save</button>
                </div>
             </form>
          </div>
        )}

        <div className="bg-white rounded shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading data...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Name/Title</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Price</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-700">{item.name || item.title}</td>
                    <td className="px-6 py-4 text-slate-500">{item.price || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-400">No {activeTab} found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  const NavItem = ({ tab, label, icon }) => (
    <button 
      onClick={() => setActiveTab(tab)} 
      className={`w-full flex items-center justify-between px-6 py-3 font-medium transition-colors border-l-4 ${
        activeTab === tab 
          ? 'bg-[#2b2845] border-blue-500 text-white' 
          : 'border-transparent text-[#a5a5b5] hover:bg-[#201d3a] hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </button>
  );

  return (
    <div className="h-screen bg-[#f3f4f7] flex flex-col font-sans overflow-hidden">
      
      {/* Top Navbar */}
      <header className="h-16 bg-white shadow-sm flex items-center z-20 flex-shrink-0">
        {/* Logo Area */}
        <div className="w-64 h-full bg-white flex items-center px-6">
          <span className="font-bold text-2xl text-blue-600 tracking-wide uppercase">CONCEPT</span>
        </div>
        {/* Topbar Content */}
        <div className="flex-1 flex justify-between items-center px-6 h-full border-b border-slate-100">
          <div className="w-full max-w-md">
             <input type="text" placeholder="Search.." className="w-full border border-slate-200 rounded px-4 py-2 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-6">
             <button className="text-slate-400 hover:text-slate-600 relative">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <button className="text-slate-400 hover:text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
             </button>
             <button onClick={handleLogout} className="text-sm font-semibold text-slate-500 hover:text-slate-800">Logout</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1a1736] text-[#a5a5b5] flex flex-col overflow-y-auto">
          <div className="py-6 space-y-1">
            <p className="px-6 text-xs font-bold text-[#626273] uppercase tracking-widest mb-3">Menu</p>
            <NavItem 
              tab="overview" 
              label="Dashboard" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} 
            />
            
            <p className="px-6 text-xs font-bold text-[#626273] uppercase tracking-widest mb-3 mt-8">Features</p>
            <NavItem 
              tab="home" 
              label="Home Page" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
            />
            <NavItem 
              tab="about" 
              label="About Page" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
            />
            <NavItem 
              tab="technology" 
              label="Tech Page" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>} 
            />
            <NavItem 
              tab="contact" 
              label="Contact Page" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} 
            />
            
            <p className="px-6 text-xs font-bold text-[#626273] uppercase tracking-widest mb-3 mt-8">Catalog</p>
            <NavItem 
              tab="products" 
              label="Products" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} 
            />
            <NavItem 
              tab="services" 
              label="Services" 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} 
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
