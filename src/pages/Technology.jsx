import React, { useState, useEffect } from 'react';
import { Beaker, Shield, Activity, Droplets, ArrowRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <div className="technology-page">
      <section className="tech-hero" aria-labelledby="tech-heading">
        <div className="tech-container">
          <div className="tech-hero-top"><span className="tech-eyebrow">THE SCIENCE BEHIND EVERY DROP</span><span className="tech-edition">AQUAPURE / TECHNOLOGY</span></div>
          <div className="tech-hero-grid">
            <div className="tech-hero-copy"><h1 id="tech-heading">{content.title}</h1><p>{content.content}</p><a className="tech-primary" href="#purification">See how it works <ArrowDown size={17} /></a></div>
            <figure className="tech-diagram"><img src="/membrane-tech.jpg" alt="Cutaway illustration showing membrane filtration layers" /><figcaption><span>ENGINEERED FOR PURITY</span><span>Membrane filtration</span></figcaption></figure>
          </div>
          <div className="tech-hero-foot"><span><Shield size={17} /> Precision filtration</span><span><Droplets size={17} /> Thoughtful water care</span><span><Beaker size={17} /> Material science</span></div>
        </div>
      </section>
      <section id="purification" className="tech-process" aria-labelledby="process-heading">
        <div className="tech-container">
          <div className="tech-section-heading"><div><span className="tech-eyebrow">HOW IT WORKS</span><h2 id="process-heading">Four stages.<br />One clear purpose.</h2></div><p>Follow the water from its first filter to its final polishing stage. Each layer has a specific job in the purification process.</p></div>
          <ol className="tech-stages">{stages.map(({ step, title, desc, icon: Icon }) => <li key={step} className="tech-stage"><div className="tech-stage-top"><span>{step}</span><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></div><h3>{title}</h3><p>{desc}</p><div className="tech-stage-rule" aria-hidden="true" /></li>)}</ol>
        </div>
      </section>
      <section className="tech-advantage" aria-labelledby="advantage-heading">
        <div className="tech-container">
          <div className="tech-section-heading"><div><span className="tech-eyebrow">THE MEMBRANE ADVANTAGE</span><h2 id="advantage-heading">Small pores.<br />A meaningful difference.</h2></div><p>Modern material science brings precision to everyday water care through a carefully engineered physical filtration process.</p></div>
          <div className="tech-advantage-grid">
            <figure className="tech-water-image"><img src="/our-story-kitchen.png" alt="A carafe and glasses of fresh water in a sunlit kitchen" loading="lazy" /><figcaption>Better water starts with better engineering.</figcaption></figure>
            <div className="tech-benefit-list">{[
              { title: 'Precision by design', desc: 'Microscopic membrane pores create a physical barrier that separates water from contaminants.' },
              { title: 'Engineered for consistency', desc: 'A carefully controlled filtration process supports dependable performance with proper care and maintenance.' },
              { title: 'Physical filtration', desc: 'Pressure and membrane materials work together to filter water without adding purification chemicals.' },
            ].map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.desc}</p></div></article>)}</div>
          </div>
          <div className="tech-next"><div><span className="tech-eyebrow">FROM SCIENCE TO YOUR HOME</span><h3>Find the right system for your everyday.</h3></div><Link to="/products" className="tech-primary">Explore our systems <ArrowRight size={17} /></Link></div>
        </div>
      </section>
    </div>
  );
};

export default Technology;
