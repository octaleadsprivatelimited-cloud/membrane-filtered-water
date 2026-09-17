import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative text-slate-300 pt-16 pb-4 bg-slate-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: "url('/membrane-pure-water.jpg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}
      ></div>
      {/* Heavy Dark Overlay for readability */}
      <div className="absolute inset-0 z-0 bg-slate-900/85"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Droplets className="h-8 w-8 text-secondary" />
              <span className="font-bold text-xl text-white">AquaPure</span>
            </Link>
            <p className="text-sm text-slate-300 mb-6">
              Next-generation membrane water filtration systems for homes and businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/product" className="hover:text-secondary transition-colors">Product Details</Link></li>
              <li><Link to="/technology" className="hover:text-secondary transition-colors">Technology</Link></li>
              <li><Link to="/services" className="hover:text-secondary transition-colors">Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-secondary transition-colors">FAQs</Link></li>
              <li><Link to="/warranty" className="hover:text-secondary transition-colors">Warranty</Link></li>
              <li><Link to="/manuals" className="hover:text-secondary transition-colors">User Manuals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-slate-300 mb-4">Subscribe for tips and offers.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="px-4 py-2 w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-l-md focus:outline-none focus:border-secondary text-sm"
              />
              <button type="submit" className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-r-md font-medium text-sm transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-slate-700/50 mt-10 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} AquaPure Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
