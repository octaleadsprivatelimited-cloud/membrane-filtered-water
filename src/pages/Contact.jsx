import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactHero from '../components/ContactHero';

const Contact = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      <ContactHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Side: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-none">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Send us a message</h2>
            <p className="text-slate-600 mb-8">Fill out the form below and our membrane specialists will get back to you shortly.</p>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-none border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-none border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-none border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Interested In</label>
                <select className="w-full px-4 py-3 rounded-none border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors bg-white">
                  <option>New Membrane System</option>
                  <option>Membrane Replacement Service</option>
                  <option>Annual Maintenance (AMC)</option>
                  <option>General Support</option>
                  <option>Partnership Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Message</label>
                <textarea rows="5" className="w-full px-4 py-3 rounded-none border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none transition-colors uppercase tracking-widest">
                Send Message
              </button>
            </form>
          </div>

          {/* Right Side: Contact Info & Map */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Professional Contact Card */}
            <div className="bg-slate-900 text-white p-8 md:p-10 shadow-sm border-t-4 border-blue-600 rounded-none">
              <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-blue-400">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-none mr-4 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold mb-1">Headquarters</p>
                    <p className="text-slate-400 leading-relaxed">123 Innovation Drive,<br/>Tech Park, CA 90210</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-none mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold mb-1">Phone Support</p>
                    <p className="text-slate-400">+1 (800) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-none mr-4 flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold mb-1">Email Us</p>
                    <p className="text-slate-400">support@aquapure.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-none mr-4 flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold mb-1">Working Hours</p>
                    <p className="text-slate-400">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="w-full h-64 md:h-80 bg-slate-200 border border-slate-300 rounded-none overflow-hidden relative shadow-sm">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100940.1708761408!2d-122.50764005116752!3d37.75767927429188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1695240212345!5m2!1sen!2sus" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen="" 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Location Map"
               ></iframe>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
