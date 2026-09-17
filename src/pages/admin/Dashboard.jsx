import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchProducts, 
  fetchServices, 
  addProduct, 
  deleteProduct,
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

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin');
      return;
    }
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

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 font-bold mb-2">Total Products</h3>
            <p className="text-4xl font-black text-slate-900">{stats.products}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 font-bold mb-2">Total Services</h3>
            <p className="text-4xl font-black text-slate-900">{stats.services}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 font-bold mb-2">System Status</h3>
            <p className="text-xl font-bold text-green-600">All Systems Operational</p>
          </div>
        </div>
      );
    }

    if (['home', 'about', 'technology', 'contact'].includes(activeTab)) {
      return <PageEditor pageId={activeTab} title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />;
    }

    // Products / Services table view
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold text-slate-700">Name/Title</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Price</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.name || item.title}</td>
                  <td className="px-6 py-4 text-slate-600">{item.price}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500">No {activeTab} found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-slate-900 text-white min-h-screen flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-blue-400">Aqua CMS</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-4">Dashboard</p>
          <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>Overview</button>
          
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-4">Pages</p>
          {['home', 'about', 'technology', 'contact'].map(page => (
            <button key={page} onClick={() => setActiveTab(page)} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors capitalize ${activeTab === page ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>{page}</button>
          ))}

          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-4">Catalog</p>
          <button onClick={() => setActiveTab('products')} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>Products</button>
          <button onClick={() => setActiveTab('services')} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'services' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>Services</button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Sign out</button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 capitalize">{activeTab}</h2>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
