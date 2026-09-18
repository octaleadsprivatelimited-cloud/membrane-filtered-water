import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Building2, Globe2 } from 'lucide-react';
import { fetchPageContent } from '../firebase/mockDb';

const Contact = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchPageContent('contact').then(setContent);
  }, []);

  if (!content) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* Page Header (Hero) */}
      <section className="relative bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {content.subtitle}
        </p>
      </section>

      {/* Quick Contact Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        {/* Mobile: 2x2 grid, Desktop: 1 row (4 columns) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 md:mb-6">
              <Mail className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 md:mb-2">Email</h3>
            <a href={`mailto:${content.email}`} className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-800 break-all">{content.email}</a>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 md:mb-6">
              <Phone className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 md:mb-2">Phone</h3>
            <p className="text-xs md:text-sm font-semibold text-slate-700">{content.phone}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 md:mb-6">
              <MapPin className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 md:mb-2">HQ</h3>
            <p className="text-xs md:text-sm font-semibold text-slate-700">San Francisco, CA</p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 md:mb-6">
              <Globe2 className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 md:mb-2">Europe</h3>
            <p className="text-xs md:text-sm font-semibold text-slate-700">London, UK</p>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Form */}
          <div className="bg-white p-8 md:p-10 border border-slate-100 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8">
              Send us a message
            </h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">First Name *</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Name *</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message *</label>
                <textarea rows="5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required></textarea>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all text-sm">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Map */}
          <div className="h-full min-h-[500px] w-full bg-slate-200 border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100940.1708761408!2d-122.50764005116752!3d37.75767927429188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1695240212345!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '100%' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="HQ Location"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
