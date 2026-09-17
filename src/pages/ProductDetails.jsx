import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { CheckCircle, Droplets, Shield, Zap, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('specs');
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = products.find(p => p.id === id);
    setProduct(found);
  }, [id]);

  if (!product) {
    return (
      <div className="w-full min-h-screen pt-32 pb-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h2>
        <Link to="/products" className="text-primary font-bold hover:underline">
          Return to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-sky-50 via-slate-50 to-white min-h-screen pt-24 pb-16 font-sans">
      
      {/* Product Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        
        <Link to="/products" className="inline-flex items-center text-slate-500 hover:text-primary transition-colors font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left: Image Gallery (Sticky on desktop) */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-28 space-y-4">
              <div className="bg-slate-50 w-full aspect-square md:aspect-video lg:aspect-square rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden relative">
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right: Product Info & CTA */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center py-6">
            <div className="inline-block bg-green-100 text-green-800 font-bold px-3 py-1 rounded-md text-xs mb-4 uppercase tracking-wide w-max">
              In Stock
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
              <p className="text-lg text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
              <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-sm">{product.discount}</span>
            </div>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4 mb-10">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-200 pt-8">
              <a 
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'm interested in ordering the ${product.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-8 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-[#25D366]/30 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order on WhatsApp
              </a>
              <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-4 px-8 rounded-xl font-bold text-lg transition-colors border border-slate-200">
                Book a Demo
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-4 text-center sm:text-left">Includes free delivery & standard installation.</p>
          </div>
        </div>
      </div>

      {/* Tabs Section for Specs, What's in the box, FAQ */}
      <div className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto no-scrollbar border-b border-slate-200">
            {[
              { id: 'specs', label: 'Specifications' },
              { id: 'box', label: "What's in the Box" },
              { id: 'faq', label: 'FAQs' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-6 text-lg font-bold whitespace-nowrap border-b-4 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-12 min-h-[400px]">
             <AnimatePresence mode="wait">
               {activeTab === 'specs' && (
                 <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {product.specs.map((spec, i) => (
                            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                              <th className="py-5 px-6 font-semibold text-slate-700 w-1/3 bg-slate-50/50">{spec.label}</th>
                              <td className="py-5 px-6 text-slate-600">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </motion.div>
               )}
               {activeTab === 'box' && (
                 <motion.div key="box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                      <ul className="space-y-6">
                        <li className="flex items-center text-slate-700 text-lg"><CheckCircle className="w-6 h-6 text-green-500 mr-4"/> 1x AquaPure Genesis Unit</li>
                        <li className="flex items-center text-slate-700 text-lg"><CheckCircle className="w-6 h-6 text-green-500 mr-4"/> 1x Pre-filter housing & cartridge</li>
                        <li className="flex items-center text-slate-700 text-lg"><CheckCircle className="w-6 h-6 text-green-500 mr-4"/> 1x Premium Stainless Steel Faucet</li>
                        <li className="flex items-center text-slate-700 text-lg"><CheckCircle className="w-6 h-6 text-green-500 mr-4"/> Installation Kit (Pipes, Connectors, Valves)</li>
                        <li className="flex items-center text-slate-700 text-lg"><CheckCircle className="w-6 h-6 text-green-500 mr-4"/> User Manual & Warranty Card</li>
                      </ul>
                    </div>
                 </motion.div>
               )}
               {activeTab === 'faq' && (
                 <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl">
                    <div className="space-y-4">
                      {[
                        { q: "How often do I need to replace the filters?", a: "The pre-filter and carbon filters should be replaced every 6-12 months. The main membrane typically lasts 24 months depending on your water quality." },
                        { q: "Does it require electricity?", a: "Yes, the system requires a standard electrical outlet to power the booster pump and the smart LED indicators." },
                        { q: "Can I install it myself?", a: "While possible for experienced DIYers, we strongly recommend using our free professional installation service to ensure warranty validity." }
                      ].map((faq, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                           <h4 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h4>
                           <p className="text-slate-600">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
