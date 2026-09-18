import React, { useRef, useState, useEffect } from 'react';
import { Play, CheckCircle, Shield, Droplets, ArrowRight, Smartphone, Droplet, Star, ChevronLeft, ChevronRight, Truck, PenTool, PhoneCall, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchPageContent } from '../firebase/mockDb';

const Home = () => {
  const scrollContainerRef = useRef(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchPageContent('home').then(setContent);
  }, []);



  // Auto-scroll logic
  useEffect(() => {
    let interval;
    if (!isCarouselPaused && scrollContainerRef.current) {
      interval = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
          }
        }
      }, 3000); // Scroll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const reviews = [
    { name: "Rahul Sharma", text: "The membrane filter is incredibly effective. Our water tastes absolutely pure and clean.", rating: 5, date: "2 days ago" },
    { name: "Priya Desai", text: "Customer service is top notch. They installed the new membrane system within 24 hours.", rating: 5, date: "1 week ago" },
    { name: "Amit Kumar", text: "Best decision I made. The app tells me exactly when the membrane needs to be checked.", rating: 5, date: "3 weeks ago" },
    { name: "Neha Singh", text: "Completely solved our water issues. The high-density membrane is no joke.", rating: 4, date: "1 month ago" },
    { name: "Vikas Reddy", text: "Super clean design and it fits perfectly under the sink. The purity is unmatched.", rating: 5, date: "2 months ago" },
    { name: "Sneha Patil", text: "I love the 100% chemical-free purification process. Safe for my baby.", rating: 5, date: "3 months ago" },
    { name: "Anand Verma", text: "Zero water wastage tech is amazing. So happy I upgraded to this membrane purifier.", rating: 5, date: "4 months ago" }
  ];

  return (
    <div className="w-full bg-white font-sans pt-16">
      
      {/* 1. Full-Bleed Nature/Membrane Hero Banner */}
      <section className="relative w-full min-h-[90vh] h-auto flex items-center overflow-hidden py-24 lg:py-32 bg-gradient-to-r from-[#384152] via-[#6e7787] to-slate-50">
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="w-full lg:w-[55%] text-white">
              <div className="flex items-center gap-2 mb-4 mt-8 lg:mt-0">
                <MapPin className="w-4 h-4 text-white/80" />
                <span className="text-white/80 text-xs tracking-widest uppercase font-semibold">Membrane Tech, USA</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.2] mb-6">
                The Purity Beyond <br className="hidden md:block" /> Your Imagination
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-md leading-relaxed font-light">
                Discover thousands of liters of absolutely pure, membrane-filtered water with experiences you can trust.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 lg:mb-0">
                <Link to="/products" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-full font-bold transition-all text-center text-sm">
                  Explore Now
                </Link>
                <button className="flex items-center gap-3 text-white hover:text-white/80 transition-colors group">
                  <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center group-hover:scale-105 transition-transform bg-white/5 backdrop-blur-sm">
                    <svg className="w-4 h-4 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <span className="font-medium text-sm">Play the video</span>
                </button>
              </div>

              {/* Bottom Glass Cards */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-12 pb-10 lg:pb-0 z-20 relative">
                <div className="bg-slate-900/60 backdrop-blur-md border border-white/20 rounded-xl p-5 max-w-[280px] shadow-2xl">
                  <h4 className="font-bold text-white text-sm mb-1">Excellence</h4>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">Striving for exceptional quality in every aspect of our membrane service.</p>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-md border border-white/20 rounded-xl p-5 max-w-[280px] shadow-2xl">
                  <h4 className="font-bold text-white text-sm mb-1">Sustainable</h4>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">Promoting responsible zero-wastage practices for a greater future.</p>
                </div>
              </div>
            </div>

            {/* Right Images (Concept Style) */}
            <div className="w-full lg:w-[45%] flex justify-center lg:justify-end mt-8 lg:mt-0 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
              <div className="relative flex items-center my-auto w-[300px] sm:w-[450px]">
                
                {/* Image 1 (Front) */}
                <div className="w-[180px] h-[240px] sm:w-[280px] sm:h-[360px] rounded-3xl overflow-hidden relative shadow-2xl z-20 border-2 border-white/10 absolute left-0 sm:left-4 z-20">
                  <img src="/membrane-pure-water.jpg" className="w-full h-full object-cover" alt="Card 1" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 mt-0.5 text-blue-400" />
                      <div>
                        <p className="font-bold text-xs sm:text-sm leading-tight">Advanced Filter</p>
                        <p className="text-[10px] sm:text-xs text-white/70">System Model</p>
                      </div>
                    </div>
                  </div>
                  {/* Action button */}
                  <div className="absolute top-1/2 -right-3 sm:-right-4 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-black shadow-lg cursor-pointer hover:bg-slate-100 z-30">
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" />
                  </div>
                </div>

                {/* Image 2 (Behind) */}
                <div className="w-[150px] h-[200px] sm:w-[220px] sm:h-[300px] rounded-3xl overflow-hidden relative shadow-xl z-10 opacity-85 absolute right-0 sm:right-4 z-10 top-1/2 -translate-y-1/2">
                  <img src="/membrane-tech.jpg" className="w-full h-full object-cover" alt="Card 2" />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white/70">
                    <div className="flex items-start gap-1">
                      <Shield className="w-3 h-3 mt-0.5" />
                      <div>
                        <p className="font-bold text-[10px] sm:text-xs leading-tight text-white">Zero Waste</p>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Trust / Service Strip (Auto-scrolling) */}
      <section className="bg-slate-900 border-b-2 border-primary overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-scroll items-center w-max">
           {/* We render the same block twice to create a seamless infinite scroll loop */}
           {[...Array(2)].map((_, blockIdx) => (
             <div key={blockIdx} className="flex items-center justify-around w-max">
                {[...Array(3)].map((_, setIdx) => (
                  <React.Fragment key={setIdx}>
                    <div className="flex items-center gap-2 px-6 md:px-10">
                       <div className="text-yellow-400"><Truck className="w-4 h-4 md:w-5 md:h-5" /></div>
                       <span className="font-bold text-white text-[10px] md:text-xs uppercase tracking-wider">Free Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 px-6 md:px-10">
                       <div className="text-yellow-400"><PenTool className="w-4 h-4 md:w-5 md:h-5" /></div>
                       <span className="font-bold text-white text-[10px] md:text-xs uppercase tracking-wider">Free Install</span>
                    </div>
                    <div className="flex items-center gap-2 px-6 md:px-10">
                       <div className="text-yellow-400"><Shield className="w-4 h-4 md:w-5 md:h-5" /></div>
                       <span className="font-bold text-white text-[10px] md:text-xs uppercase tracking-wider">1 Yr Warranty</span>
                    </div>
                    <div className="flex items-center gap-2 px-6 md:px-10">
                       <div className="text-yellow-400"><PhoneCall className="w-4 h-4 md:w-5 md:h-5" /></div>
                       <span className="font-bold text-white text-[10px] md:text-xs uppercase tracking-wider">24/7 Support</span>
                    </div>
                  </React.Fragment>
                ))}
             </div>
           ))}
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}} />
      </section>

      {/* 3. About Us Snippet */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50/30 border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
               <div className="w-full lg:w-1/2 relative">
                  <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl relative" style={{ backgroundImage: "url('/membrane-pure-water.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  </div>
                  <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
                     <p className="text-4xl font-extrabold text-primary mb-2">15+</p>
                     <p className="font-bold text-slate-800">Years of Purity</p>
                     <p className="text-sm text-slate-500 mt-1">Perfecting membrane technology for millions of homes.</p>
                  </div>
               </div>
               
               <div className="w-full lg:w-1/2 lg:pl-10 mt-12 lg:mt-0">
                  <h3 className="text-primary font-bold tracking-wider uppercase mb-3">Our Story</h3>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">We believe every family deserves pure, healthy water.</h2>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Founded on the principle that clean drinking water is a fundamental right, AquaPure has been at the forefront of membrane filtration technology for over a decade.
                  </p>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                     Our award-winning research and development team constantly innovates to build advanced membrane systems that remove the harshest contaminants with precision.
                  </p>
                  
                  <Link to="/about" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold transition-all group shadow-md hover:shadow-xl">
                     Read Our Full Story 
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* 4. Why Choose Us / Sharp Cards Grid */}
      <section className="py-12 bg-slate-900 relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-tight">Why Choose AquaPure?</h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-slate-300 text-base leading-relaxed">
              We don't just filter water; we engineer absolute purity. Discover how our proprietary membrane technology outperforms standard purifiers.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            
            <div className="bg-white p-5 md:p-6 border-b-4 border-blue-600 rounded-none shadow-lg hover:-translate-y-1 transition-transform duration-300 group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center mb-4 rounded-none group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-100">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">100% Pure</h3>
              <p className="text-xs text-slate-600 leading-relaxed">High-density membrane ensures absolute safety with zero mixing of unpurified water.</p>
            </div>
            
            <div className="bg-white p-5 md:p-6 border-b-4 border-teal-500 rounded-none shadow-lg hover:-translate-y-1 transition-transform duration-300 group">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 flex items-center justify-center mb-4 rounded-none group-hover:bg-teal-500 group-hover:text-white transition-colors border border-teal-100">
                <Droplet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">Advanced Tech</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Precision pores filter out heavy metals, microplastics, and microscopic impurities.</p>
            </div>
            
            <div className="bg-white p-5 md:p-6 border-b-4 border-sky-500 rounded-none shadow-lg hover:-translate-y-1 transition-transform duration-300 group">
              <div className="w-12 h-12 bg-sky-50 text-sky-600 flex items-center justify-center mb-4 rounded-none group-hover:bg-sky-500 group-hover:text-white transition-colors border border-sky-100">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">Zero Wastage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Advanced recovery technology saves up to 20,000 liters of water annually.</p>
            </div>

            <div className="bg-white p-5 md:p-6 border-b-4 border-green-500 rounded-none shadow-lg hover:-translate-y-1 transition-transform duration-300 group">
              <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center mb-4 rounded-none group-hover:bg-green-500 group-hover:text-white transition-colors border border-green-100">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">Chemical-Free</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Pure physical membrane filtration without the use of any harmful chemical additives.</p>
            </div>

          </div>

          <div className="text-center">
            <Link to="/technology" className="inline-flex items-center gap-2 text-white font-bold tracking-widest uppercase text-xs border-b-2 border-primary pb-1 hover:text-primary transition-colors">
              Explore Our Technology <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Smart App Section (Clean Livpure Style) */}
      <section className="py-20 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              
              <div className="order-2 lg:order-1 relative">
                 <div className="w-full aspect-square md:aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-200 relative">
                    <img src="/smart-app.jpg" alt="Smart App Lifestyle" className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-2xl font-bold text-slate-900">4.8/5</p>
                          <p className="text-sm text-slate-500">App Store Rating</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="order-1 lg:order-2">
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Smart water for a smart home.</h2>
                 <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                   Take complete control of your water purifier with the official smartphone app. Monitor water quality, track usage, and never miss a filter change again.
                 </p>
                 
                 <div className="space-y-6 mb-10">
                    <div className="flex items-start">
                       <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center">
                             <Smartphone className="w-5 h-5" />
                          </div>
                       </div>
                       <div className="ml-4">
                          <h4 className="text-lg font-bold text-slate-900">Real-time Purity Monitoring</h4>
                          <p className="text-slate-600">Check the purity of your water anytime, anywhere.</p>
                       </div>
                    </div>
                    
                    <div className="flex items-start">
                       <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center">
                             <Droplet className="w-5 h-5" />
                          </div>
                       </div>
                       <div className="ml-4">
                          <h4 className="text-lg font-bold text-slate-900">Filter Life Indicator</h4>
                          <p className="text-slate-600">Get automatic alerts when it's time to replace your filters.</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex gap-4">
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                      App Store
                    </button>
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                      Google Play
                    </button>
                 </div>
              </div>

            </div>
         </div>
      </section>

      {/* NEW: Reviews Carousel Section */}
      <section 
        className="py-12 bg-slate-100 overflow-hidden border-y border-slate-200"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        onTouchStart={() => setIsCarouselPaused(true)}
        onTouchEnd={() => setIsCarouselPaused(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Loved by Families</h2>
              <p className="text-slate-600 text-base max-w-xl">See what our customers have to say about the pure taste and reliability of our membrane technology.</p>
            </div>
            
            {/* Desktop Navigation Buttons */}
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviews.map((review, idx) => (
              <div 
                key={idx} 
                className="snap-center shrink-0 w-[85%] sm:w-[320px] md:w-[380px] bg-white p-6 rounded-xl shadow-md border border-slate-100 flex flex-col h-full transform transition-transform hover:-translate-y-1"
              >
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 flex-grow mb-5 text-base leading-relaxed">"{review.text}"</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                  <span className="font-bold text-slate-900 text-sm">{review.name}</span>
                  <span className="text-xs font-semibold text-primary">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
          
        </div>
        
        {/* CSS to hide scrollbar */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
      </section>

      {/* 6. Bottom CTA Banner */}
      <section className="py-12 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl">
               
               <div className="flex flex-col md:flex-row items-stretch">
                  <div className="w-full md:w-3/5 p-8 md:p-12 relative z-10">
                     <div className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-3 py-1 rounded-full text-xs mb-4 uppercase tracking-widest border border-white/10">
                        Limited Time Offer
                     </div>
                     <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                        Ready to upgrade your home's water?
                     </h2>
                     <p className="text-lg text-slate-300 mb-8 max-w-md">
                        Join 500,000+ families. Get free installation and a 100-day money-back guarantee today.
                     </p>
                     
                     <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/products" className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-center transition-colors shadow-lg flex items-center justify-center gap-2">
                          Shop Now <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/contact" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3 rounded-lg font-bold text-center transition-colors">
                          Contact Sales
                        </Link>
                     </div>
                  </div>
                  
                  <div className="w-full md:w-2/5 relative h-48 md:h-auto hidden sm:block">
                     <img src="/membrane-pure-water.jpg" alt="Pouring fresh water" className="absolute inset-0 w-full h-full object-cover" />
                     <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-900 to-transparent"></div>
                  </div>
               </div>
               
            </div>
         </div>
      </section>
      
    </div>
  );
};

export default Home;
