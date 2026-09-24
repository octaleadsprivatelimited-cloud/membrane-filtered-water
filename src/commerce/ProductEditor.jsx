import {useState, useRef} from 'react';
import {api} from './api';
import {compressImage} from '../utils/imageCompressor';

const blank = {
  name: '', sku: '', category: '', description: '', price: 0, originalPrice: 0, stock: 0, image: '', images: [], brand: '', gtin: '', mpn: '', features: [], status: 'draft', condition: 'new', identifiersExist: true, merchantEnabled: false, demo: false
};

export default function ProductEditor({product, onDone, onClose, categories}) {
  const [value, setValue] = useState(product || blank);
  const [features, setFeatures] = useState(value.features.join('\n'));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const change = (key, v) => setValue({ ...value, [key]: v });

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setBusy(true);
    setError('');
    try {
      const uploadedUrls = [];
      for (const file of files) {
        // Compress the image down heavily to keep Firestore document size small (<1MB)
        const compressed = await compressImage(file, 800, 800, 0.6);
        const dataUrl = await new Promise((resolve, reject) => {
           const reader = new FileReader();
           reader.onload = () => resolve(reader.result);
           reader.onerror = reject;
           reader.readAsDataURL(compressed);
        });
        uploadedUrls.push(dataUrl);
      }
      setValue(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls],
        image: prev.image || uploadedUrls[0]
      }));
    } catch (err) {
      setError('Image processing failed: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  function removeImage(index) {
    const newImages = [...value.images];
    newImages.splice(index, 1);
    setValue({ ...value, images: newImages, image: newImages.length ? newImages[0] : '' });
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const toSave = {
        ...value,
        features: features.split('\n').filter(Boolean)
      };
      await api(product ? `/admin/products/${product.id}` : '/admin/products', {
        method: product ? 'PUT' : 'POST',
        body: JSON.stringify(toSave)
      });
      onDone();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="commerce-modal-backdrop">
      <section className="commerce-modal">
        <div className="commerce-heading" style={{borderBottom: '1px solid #e2e8f0', padding: '20px 25px', display: 'flex', justifyContent: 'space-between'}}>
          <h2 style={{fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0}}>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} style={{background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#64748b'}}>✕</button>
        </div>
        <form className="commerce-form" onSubmit={save} style={{padding: '25px'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
            <label>Product Name * <input required placeholder="Enter product name" value={value.name} onChange={e => change('name', e.target.value)} /></label>
            <label>Category * 
              <input list="categories" required placeholder="Select category" value={value.category} onChange={e => change('category', e.target.value)} />
              <datalist id="categories">
                {categories?.map(c => <option key={c} value={c} />)}
              </datalist>
            </label>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginBottom: '20px'}}>
            <label>Price (₹) * <input type="number" required min="0" step="0.01" value={value.price} onChange={e => change('price', parseFloat(e.target.value))} /></label>
            <label>GST (%) <input type="number" min="0" step="1" value={value.gst || 0} onChange={e => change('gst', parseInt(e.target.value)||0)} /></label>
            <label>Original (₹) <input type="number" min="0" step="0.01" value={value.originalPrice} onChange={e => change('originalPrice', parseFloat(e.target.value))} /></label>
            <label>Stock * <input type="number" required min="0" step="1" value={value.stock} onChange={e => change('stock', parseInt(e.target.value))} /></label>
          </div>

          <label style={{marginBottom: '20px'}}>Short Description *<input required placeholder="Brief product description" value={value.features[0] || ''} onChange={e => setFeatures(e.target.value)} /></label>
          <label style={{marginBottom: '20px'}}>Full Description<textarea rows={4} placeholder="Detailed product description" required value={value.description} onChange={e => change('description', e.target.value)} /></label>

          <div className="commerce-images-section">
            <label style={{fontWeight: 600}}>Product Images</label>
            <div className="commerce-image-preview">
              {(value.images || []).map((img, i) => (
                <div key={i} className="commerce-image-thumbnail">
                  <img src={img} alt="Product" />
                  <button type="button" onClick={() => removeImage(i)}>X</button>
                  {value.image === img && <span className="primary-badge">Primary</span>}
                  {value.image !== img && <button type="button" onClick={() => change('image', img)}>Make Primary</button>}
                </div>
              ))}
            </div>
            <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
            <button type="button" className="store-pill secondary" onClick={() => fileInputRef.current.click()} disabled={busy}>+ Upload Images</button>
          </div>

          {error && <p className="commerce-error" role="alert">{error}</p>}
          
          <div className="commerce-modal-actions">
            <button type="button" className="store-pill secondary" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={busy} className="store-pill">{busy ? 'Working...' : (product ? 'Save Changes' : 'Add Product')}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
