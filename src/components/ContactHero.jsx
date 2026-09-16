import React from 'react';

const ContactHero = () => (
  <section className="bg-white relative overflow-hidden border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top padding accounts for navbar, matching the rest of the site's hero sections */}
      <div className="flex flex-col lg:flex-row items-center pt-28 pb-10 lg:pt-32 lg:pb-14 gap-8 lg:gap-16">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left z-10">
          <div className="inline-flex items-center justify-center lg:justify-start gap-3 mb-4">
            <span className="w-10 h-0.5 bg-blue-600"></span>
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Get In Touch</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            We're Here to Help With <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Your Membrane System</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Have questions about our proprietary membrane technology or need support for your current water purifier? Reach out to our dedicated experts today.
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 relative z-10">
          <div className="relative aspect-[16/9] lg:aspect-[5/3] rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&auto=format&fit=crop" 
              alt="Contact Support Team" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Abstract decorative background blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full -z-10 blur-3xl opacity-50"></div>
        </div>

      </div>
    </div>
  </section>
);

export default ContactHero;
