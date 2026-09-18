import React, { useState, useEffect } from 'react';
import { ShieldCheck, Factory, Award, CheckCircle } from 'lucide-react';
import { fetchPageContent } from '../firebase/mockDb';

const About = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchPageContent('about').then(setContent);
  }, []);

  if (!content) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

  return (
    <div className="w-full bg-slate-50 font-sans pb-24">
      
      {/* 1. Split Intro Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
           <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Image side */}
              <div className="h-64 sm:h-96 lg:h-auto relative">
                <div className="absolute inset-0 bg-slate-900/10 z-10"></div>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${content.image})` }}></div>
              </div>

              {/* Content side */}
              <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
                 <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Who We Are</h2>
                 
                 <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">{content.title}</h3>
                 
                 <div className="w-20 h-1.5 bg-primary mb-8 rounded-full"></div>

                 <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                   {content.content}
                 </p>
                 
                 {content.missionDescription && (
                   <div className="mb-6">
                     <h4 className="font-bold text-slate-900 mb-2">Our Mission</h4>
                     <p className="text-slate-600 leading-relaxed">{content.missionDescription}</p>
                   </div>
                 )}
                 
                 {content.visionDescription && (
                   <div className="mb-8">
                     <h4 className="font-bold text-slate-900 mb-2">Our Vision</h4>
                     <p className="text-slate-600 leading-relaxed">{content.visionDescription}</p>
                   </div>
                 )}
                 
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
    </div>
  );
};

export default About;
