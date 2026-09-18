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
    <div className="w-full bg-white font-sans">
      
      {/* 1. Short Hero Section */}
      <section className="relative bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">About Us</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">Learn more about our dedication to pure, membrane-filtered water.</p>
      </section>

      {/* 2. Who We Are (Image + Content) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="h-80 lg:h-[500px] rounded-3xl overflow-hidden relative shadow-xl">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${content.image})` }}></div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-primary font-bold tracking-widest uppercase mb-3 text-sm">Who We Are</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">{content.title}</h3>
            <div className="w-16 h-1.5 bg-primary mb-8 rounded-full"></div>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">{content.content}</p>
            
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
      </section>

      {/* 3. Core Values (Mission & Vision) */}
      {(content.missionDescription || content.visionDescription) && (
        <section className="bg-slate-50 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Mission Card */}
              {content.missionDescription && (
                <div className="bg-white rounded-3xl p-10 lg:p-14 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Our Mission</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">{content.missionDescription}</p>
                </div>
              )}

              {/* Vision Card */}
              {content.visionDescription && (
                <div className="bg-white rounded-3xl p-10 lg:p-14 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Our Vision</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">{content.visionDescription}</p>
                </div>
              )}
              
            </div>
          </div>
        </section>
      )}
      
    </div>
  );
};

export default About;
