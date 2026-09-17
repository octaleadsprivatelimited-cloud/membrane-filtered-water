import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../firebase/mockDb';
import { Star, Filter, ChevronDown } from 'lucide-react';

const Products = () => {
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedCapacity, setSelectedCapacity] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    getProducts();
  }, []);
  
  // Filter logic
  const filteredProducts = products.filter(product => {
    // Price filter
    if (selectedPrice === 'Under ₹15,000' && product.price >= 15000) return false;
    if (selectedPrice === '₹15,000 - ₹20,000' && (product.price < 15000 || product.price > 20000)) return false;
    if (selectedPrice === 'Over ₹20,000' && product.price <= 20000) return false;
    
    // Capacity filter
    if (selectedCapacity !== 'All' && product.tankCapacity !== selectedCapacity) return false;
    
    return true;
  });

  return (
    <div className="w-full bg-gradient-to-br from-sky-50 via-slate-50 to-white min-h-screen pt-24 pb-16 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6">
           <h1 className="text-2xl font-bold text-slate-900">Water Purifiers</h1>
           <p className="text-sm text-slate-500 mt-1">(Showing {filteredProducts.length} products)</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar (Filters) */}
          <div className="w-full lg:w-1/4 xl:w-1/5 flex-shrink-0">
             <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 sticky top-24">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                  <Filter className="w-5 h-5 text-slate-600" />
                  <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                </div>
                
                {/* Price Filter */}
                <div className="mb-6">
                   <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">Price</h3>
                   <div className="space-y-2">
                     {['All', 'Under ₹15,000', '₹15,000 - ₹20,000', 'Over ₹20,000'].map(range => (
                       <label key={range} className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="radio" 
                           name="price" 
                           checked={selectedPrice === range}
                           onChange={() => setSelectedPrice(range)}
                           className="w-4 h-4 text-primary"
                         />
                         <span className="text-sm text-slate-700">{range}</span>
                       </label>
                     ))}
                   </div>
                </div>

                {/* Capacity Filter */}
                <div>
                   <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">Capacity</h3>
                   <div className="space-y-2">
                     {['All', '5 Liters', '7 Liters', '8 Liters', '10 Liters', '20 Liters'].map(cap => (
                       <label key={cap} className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="radio" 
                           name="capacity" 
                           checked={selectedCapacity === cap}
                           onChange={() => setSelectedCapacity(cap)}
                           className="w-4 h-4 text-primary"
                         />
                         <span className="text-sm text-slate-700">{cap}</span>
                       </label>
                     ))}
                   </div>
                </div>
                
             </div>
          </div>

          {/* Right Content (Product List) */}
          <div className="w-full lg:w-3/4 xl:w-4/5 flex-grow">
             <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                
                {loading ? (
                  <div className="p-24 text-center">
                    <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-slate-500">Loading products from Database...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    No products found matching your filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                    {filteredProducts.map(product => (
                      <Link to={`/product/${product.id}`} key={product.id} className="bg-white border border-slate-200 rounded-xl hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col">
                        
                        {/* Image */}
                        <div className="w-full aspect-video bg-slate-100 relative overflow-hidden">
                           <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>

                        {/* Middle Content */}
                        <div className="p-4 flex flex-col flex-grow">
                           <h2 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-1.5">{product.name}</h2>
                           
                           <div className="flex items-center gap-2 mb-3">
                             <div className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                               {product.rating} <Star className="w-2.5 h-2.5 fill-current" />
                             </div>
                             <span className="text-xs text-slate-500">({product.reviews.toLocaleString()})</span>
                           </div>

                           <ul className="space-y-1 mb-4 flex-grow">
                             {product.features.slice(0, 2).map((feature, i) => (
                               <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                                 <span className="text-slate-300 mt-0.5">•</span>
                                 <span className="line-clamp-1">{feature}</span>
                               </li>
                             ))}
                           </ul>

                           {/* Bottom Price & Action */}
                           <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                             <div className="flex items-end justify-between">
                               <div>
                                 <div className="text-xl font-bold text-slate-900 mb-0.5">
                                   ₹{product.price.toLocaleString('en-IN')}
                                 </div>
                                 <div className="flex items-center gap-2 text-[11px]">
                                   <span className="text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                   <span className="text-green-600 font-bold">{product.discount}</span>
                                 </div>
                               </div>
                             </div>
                             
                             <button 
                               onClick={(e) => {
                                 e.preventDefault();
                                 window.open(`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'm interested in ordering the ${product.name}`)}`, '_blank');
                               }}
                               className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2 rounded-md font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                             >
                               <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                               Order on WhatsApp
                             </button>
                           </div>
                        </div>
                        
                      </Link>
                    ))}
                  </div>
                )}
                
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Products;
