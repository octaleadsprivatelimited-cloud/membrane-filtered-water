import React, { useState, useEffect } from 'react';
import { Beaker, Shield, Activity, Droplets } from 'lucide-react';
import { fetchPageContent } from '../firebase/mockDb';

const Technology = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchPageContent('technology').then(setContent);
  }, []);

  const stages = [
    {
      step: "01",
      title: "Sediment Filter",
      desc: "Removes visible particles like dust, dirt, and sand before they reach the core membrane.",
      icon: Droplets,
    },
    {
      step: "02",
      title: "Activated Carbon",
      desc: "Absorbs chlorine and removes bad tastes and odors, ensuring the water tastes fresh.",
      icon: Beaker,
    },
    {
      step: "03",
      title: "Advanced Membrane",
      desc: "Forces water through microscopic pores, blocking heavy metals, viruses and bacteria.",
      icon: Shield,
    },
    {
      step: "04",
      title: "Polishing Stage",
      desc: "Final chamber eliminates any remaining microscopic impurities for absolute purity.",
      icon: Activity,
    },
  ];

  if (!content) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* Dynamic Hero Section */}
      <section className="bg-gradient-to-br from-sky-50 via-white to-blue-50 relative overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center pt-28 pb-10 lg:pt-32 lg:pb-14 gap-8 lg:gap-16">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left z-10">
              <div className="inline-flex items-center justify-center lg:justify-start gap-3 mb-4">
                <span className="w-10 h-0.5 bg-blue-600"></span>
                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Our Core Technology</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                {content.title}
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {content.content}
              </p>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 relative z-10">
              <div className="relative aspect-[16/9] lg:aspect-[5/3] rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={content.image} 
                  alt="Advanced Membrane Filtration" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full -z-10 blur-3xl opacity-50"></div>
            </div>

          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The 4-Stage Purification Process</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our industry-leading membrane technology ensures every drop of water is meticulously purified to the highest safety standards.
          </p>
        </div>

        {/* 4 Cards Layout: 2x2 on Mobile, 1x4 on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stages.map((stage) => (
            <div 
              key={stage.step} 
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <stage.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-3xl md:text-4xl font-black text-slate-100 group-hover:text-blue-50 transition-colors duration-300">
                  {stage.step}
                </span>
              </div>
              
              <h3 className="text-base md:text-xl font-bold text-slate-900 mb-3 leading-tight">{stage.title}</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed flex-grow">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>

        {/* The Membrane Advantage Section */}
        <div className="mt-32 pt-20 border-t border-slate-200">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] lg:aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=1000&auto=format&fit=crop" 
                  alt="Pure Membrane Water" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">The Membrane Advantage</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Why rely on outdated methods? Our advanced membrane is built on modern material science, offering unparalleled protection and consistency.
              </p>

              <div className="space-y-8">
                {[
                  {
                    title: "Absolute Precision",
                    desc: "Our membrane pores are engineered to exacting microscopic standards, creating an impassable physical barrier for contaminants.",
                  },
                  {
                    title: "Unmatched Consistency",
                    desc: "Unlike standard filters that degrade quickly, our membrane delivers the exact same level of high-grade purity from the first drop to the last.",
                  },
                  {
                    title: "100% Chemical-Free",
                    desc: "A purely physical filtration process that relies entirely on advanced pressure and material science, ensuring no harmful additives touch your water.",
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mt-1">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Technology;
