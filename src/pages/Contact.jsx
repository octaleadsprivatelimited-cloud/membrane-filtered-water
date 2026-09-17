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
    <div className="w-full min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white font-sans pb-24 pt-24">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600 mb-6 drop-shadow-sm">
          {content.title}
        </h1>
        <p className="text-lg md:text-xl text-blue-900/80 max-w-3xl mx-auto font-medium leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white shadow-xl shadow-blue-900/5 flex flex-col items-center text-center transform transition-transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Email Support</h3>
            <p className="text-blue-800/70 mb-4 font-medium">For general inquiries and commercial quotes.</p>
            <a href={`mailto:${content.email}`} className="text-2xl font-black text-blue-800 hover:text-blue-600 transition-colors drop-shadow-sm">{content.email}</a>
          </div>
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white shadow-xl shadow-blue-900/5 flex flex-col items-center text-center transform transition-transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-cyan-500/30">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Direct Phone</h3>
            <p className="text-blue-800/70 mb-4 font-medium">Available 24/7 for urgent maintenance requests.</p>
            <p className="text-2xl font-black text-blue-800 drop-shadow-sm">{content.phone}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white/60 backdrop-blur-md p-8 border border-white rounded-2xl shadow-xl shadow-blue-900/5">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-600" />
              </span>
              Direct Inquiry
            </h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">First Name *</label>
                  <input type="text" className="w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">Last Name *</label>
                  <input type="text" className="w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">Business Email *</label>
                  <input type="email" className="w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">Company Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Department Route *</label>
                <select className="w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all">
                  <option>Commercial Sales & Partnerships</option>
                  <option>Residential Installation</option>
                  <option>Technical Support & Maintenance</option>
                  <option>Media & Public Relations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">Message Description *</label>
                <textarea rows="6" className="w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" required></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all uppercase tracking-wider text-sm transform hover:-translate-y-0.5">
                  Submit Inquiry
                </button>
                <p className="mt-4 text-xs font-medium text-blue-800/60">By submitting this form, you agree to our privacy policy regarding the handling of your data.</p>
              </div>
            </form>
          </div>

          {/* Right Column: Directory & Map */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            
            {/* Offices */}
            <section>
              <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </span>
                Global Offices
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
                  <h3 className="font-black text-xl mb-4 text-blue-50">North America (HQ)</h3>
                  <div className="space-y-4 text-blue-100 font-medium">
                    <p className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-0.5 text-cyan-400 flex-shrink-0" />
                      123 Membrane Way, Suite 400<br/>San Francisco, CA 94105
                    </p>
                    <p className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      +1 (415) 555-0198
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-600 to-teal-700 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
                  <h3 className="font-black text-xl mb-4 text-cyan-50">Europe Operations</h3>
                  <div className="space-y-4 text-cyan-100 font-medium">
                    <p className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-0.5 text-teal-300 flex-shrink-0" />
                      45 Filtration Boulevard<br/>London, UK E1 6AN
                    </p>
                    <p className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-teal-300 flex-shrink-0" />
                      +44 20 7946 0958
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Map */}
            <section>
              <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Globe2 className="w-5 h-5 text-blue-600" />
                </span>
                HQ Location
              </h2>
              <div className="w-full h-64 bg-slate-200 border-4 border-white shadow-xl rounded-2xl overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100940.1708761408!2d-122.50764005116752!3d37.75767927429188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1695240212345!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HQ Location"
                ></iframe>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
