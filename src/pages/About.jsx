import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, Factory, Award, Droplet, Smartphone, PhoneCall } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const About = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Modern Split Hero Section */}
      <section className="relative bg-white pt-24 pb-12 lg:pt-32 lg:pb-20 border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
               
               <div className="z-10">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-bold px-3 py-1 text-xs mb-6 uppercase tracking-widest border border-blue-100">
                    Our Mission
                  </div>
                  <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                    Pioneering the future of <span className="text-primary">pure water.</span>
                  </motion.h1>
                  <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                    Our goal is to bring pristine, healthy, and perfectly balanced water into every home through innovative membrane technology.
                  </motion.p>
               </div>
               
               <div className="relative mt-8 lg:mt-0">
                  {/* Using inline style for bg image to avoid Tailwind parsing issues and using a verified image ID */}
                  <div className="aspect-[4/3] w-full shadow-2xl relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl border border-slate-100">
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Trusted globally by</p>
                     <p className="text-3xl font-extrabold text-slate-900">500k+ <span className="text-primary">Families</span></p>
                  </div>
               </div>
               
            </div>
         </div>
      </section>

      <div className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
              
              {/* Left Side: Images Grid */}
              <div className="w-full lg:w-1/2 relative">
                 <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl transform hover:-translate-y-2 transition-transform duration-300">
                       <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600&auto=format&fit=crop')" }}></div>
                    </div>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl mt-12 transform hover:-translate-y-2 transition-transform duration-300">
                       <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600&auto=format&fit=crop')" }}></div>
                    </div>
                 </div>
                 
                 {/* Floating Experience Badge */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-2xl flex items-center justify-center z-10">
                    <div className="border-2 border-dashed border-primary rounded-full w-28 h-28 flex flex-col items-center justify-center bg-blue-50">
                       <span className="text-3xl font-extrabold text-primary">15+</span>
                       <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center mt-1">Years<br/>R&D</span>
                    </div>
                 </div>
              </div>

              {/* Right Side: Text */}
              <div className="w-full lg:w-1/2">
                 <h2 className="text-primary font-bold tracking-widest uppercase mb-3 text-sm">Our Genesis</h2>
                 <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">The AquaPure Story</h3>
                 
                 <div className="w-20 h-1.5 bg-primary mb-8 rounded-full"></div>

                 <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                   Founded by a team of environmental engineers and water quality specialists, AquaPure was born out of a simple observation: most home water filters either leave harmful contaminants behind, or they use outdated technology.
                 </p>
                 <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                   We spent five years developing our proprietary high-density membrane. This next-generation filtration system intelligently targets and removes 99.9% of harmful pathogens, heavy metals, and microplastics, providing the purest water possible.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                    <div>
                      <h4 className="text-4xl font-extrabold text-slate-900 mb-2">10k+</h4>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Homes Purified</p>
                    </div>
                    <div>
                      <h4 className="text-4xl font-extrabold text-slate-900 mb-2">5</h4>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Years Research</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Why Choose Us Section - Compact Split Layout */}
      <div className="bg-white py-12 lg:py-16 border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
             
             {/* Left side: Sleek Landscape Image */}
             <div className="w-full lg:w-1/2">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                   <div className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop')" }}></div>
                </div>
             </div>

             {/* Right side: Compact Content */}
             <div className="w-full lg:w-1/2">
                <h2 className="text-primary font-bold tracking-widest uppercase mb-2 text-xs">The AquaPure Advantage</h2>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">Why Choose AquaPure?</h3>
                
                <p className="text-base text-slate-600 mb-6 leading-relaxed max-w-lg">
                   Experience the future of home water purification. We engineer comprehensive health solutions for your family.
                </p>

                <div className="space-y-4">
                   {[
                     { title: "100% Membrane Purity", desc: "Absolute filtration catching what ordinary filters miss." },
                     { title: "Zero Water Wastage", desc: "Our advanced recovery tech saves up to 20,000 liters annually." },
                     { title: "Smart App Control", desc: "Monitor purity levels and track filter life from your smartphone." },
                     { title: "24/7 Expert Support", desc: "Dedicated water specialists always ready to help you." }
                   ].map((feature, i) => (
                     <div key={i} className="flex items-start gap-4">
                        <div className="mt-0.5 bg-blue-50 border border-blue-100 p-1 rounded-full text-primary">
                           <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                           <h4 className="text-base font-bold text-slate-900">{feature.title}</h4>
                           <p className="text-sm text-slate-600">{feature.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             
          </div>
        </div>
      </div>

      <div className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             
             {/* Left side: Header and List */}
             <div>
                <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Excellence Guaranteed</h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Our Commitments & Standards</h3>
                
                <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                   We refuse to compromise on quality. Every AquaPure membrane system is built to rigorous international standards, ensuring your family receives nothing but the best.
                </p>

                <div className="space-y-8">
                   {[
                     { icon: ShieldCheck, title: "NSF/ANSI Certified", desc: "Our products undergo rigorous independent testing to meet and exceed global water quality standards for membrane systems." },
                     { icon: Factory, title: "Sustainable Manufacturing", desc: "We use 100% recyclable materials in our filter housings and maintain a zero-waste production facility to protect the environment." },
                     { icon: Award, title: "Quality Guarantee", desc: "Every unit is pressure-tested and quality-verified before it leaves our facility. Backed by a comprehensive 5-year warranty." }
                   ].map((feature, i) => (
                     <div key={i} className="flex gap-6 items-start group">
                       <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm border border-blue-100">
                         <feature.icon className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h4>
                         <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                       </div>
                     </div>
                   ))}
                </div>
             </div>
             
             {/* Right side: Large Image with floating card */}
             <div className="relative mt-8 lg:mt-0">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
                   <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=800&auto=format&fit=crop')" }}></div>
                </div>
                {/* Floating highlight box */}
                <div className="absolute top-10 -left-6 md:-left-12 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden sm:block max-w-[280px]">
                   <div className="flex items-center gap-4 mb-3">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                       <CheckCircle className="w-5 h-5" />
                     </div>
                     <span className="font-bold text-slate-900 text-lg">100% Verified</span>
                   </div>
                   <p className="text-sm text-slate-500 leading-relaxed">Every single unit passes 40+ rigorous quality checks before shipping.</p>
                </div>
             </div>
             
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default About;
