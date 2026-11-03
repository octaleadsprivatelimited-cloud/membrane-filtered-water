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
      title: "Pre-Filtration (Sediment & Carbon)",
      desc: "5-micron spun polypropylene and high-iodine carbon blocks trap silt, rust, and chlorine to safeguard the delicate polyamide membrane sheet from fouling and chlorine oxidation.",
      icon: Droplets,
    },
    {
      step: "02",
      title: "Booster Pump & Pressure Dynamics",
      desc: "RO technicians know that membranes need 60-100 PSI operating pressure to overcome natural osmotic pressure and achieve optimal flux and salt rejection.",
      icon: Beaker,
    },
    {
      step: "03",
      title: "0.0001 Micron TFC Membrane Core",
      desc: "Spiral-wound thin film composite (polyamide) layer rejects 95-98% of dissolved minerals, heavy metals, arsenic, nitrates, and microorganisms into the reject stream.",
      icon: Shield,
    },
    {
      step: "04",
      title: "Flow Restrictor & Reject Balancing",
      desc: "Calibrated FR tubes (FR-450 / FR-550) maintain internal cross-flow velocity, flushing rejected brine and preventing premature scale formation on the membrane surface.",
      icon: Activity,
    },
  ];

  return (
    <div className="technology-page">
      <section className="tech-hero" aria-labelledby="tech-heading">
        <div className="tech-container">
          <div className="tech-hero-top">
            <span className="tech-eyebrow">THE SCIENCE OF WATER FILTRATION</span>
            <span className="tech-edition">MEMBRANEIQ / TECHNICAL BRIEF</span>
          </div>
          <div className="tech-hero-grid">
            <div className="tech-hero-copy">
              <h1 id="tech-heading">The Heart of Water Purification: The RO Membrane</h1>
              <p>In every reverse osmosis water purifier, the membrane is the single most critical component. Engineered with a microscopic pore size of 0.0001 microns—over 500,000 times smaller than a strand of human hair—our spiral-wound Thin Film Composite (TFC) membranes physically separate pure H2O molecules from dissolved inorganic salts, heavy metals, pesticides, and bacterial contaminants.</p>
              <a className="tech-primary" href="#purification">
                Explore Membrane Architecture <ArrowDown size={17} />
              </a>
            </div>
            <figure className="tech-diagram">
              <img src="/membrane-tech.jpg" alt="Cutaway illustration showing membrane filtration layers and cross flow reverse osmosis" />
              <figcaption>
                <span>ENGINEERED FOR DEALERS &amp; TECHNICIANS</span>
                <span>0.0001µm Spiral-Wound Polyamide</span>
              </figcaption>
            </figure>
          </div>
          <div className="tech-hero-foot">
            <span><Shield size={16} /> 95-98% Salt Rejection</span>
            <span><Droplets size={16} /> 75 / 80 / 100 / 300 GPD Flux</span>
            <span><Beaker size={16} /> High TDS Borewell Tolerance</span>
          </div>
        </div>
      </section>
      <section id="purification" className="tech-process" aria-labelledby="process-heading">
        <div className="tech-container">
          <div className="tech-section-heading"><div><span className="tech-eyebrow">ENGINEERING SPECIFICATIONS</span><h2 id="process-heading">How the RO Membrane System Works</h2></div><p>A comprehensive technical breakdown for RO service technicians, dealers, and assembly engineers.</p></div>
          <ol className="tech-stages">{stages.map(({ step, title, desc, icon: Icon }) => <li key={step} className="tech-stage"><div className="tech-stage-top"><span>{step}</span><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></div><h3>{title}</h3><p>{desc}</p><div className="tech-stage-rule" aria-hidden="true" /></li>)}</ol>
        </div>
      </section>
      <section className="tech-advantage" aria-labelledby="advantage-heading">
        <div className="tech-container">
          <div className="tech-section-heading"><div><span className="tech-eyebrow">THE DEALER &amp; TECHNICIAN ADVANTAGE</span><h2 id="advantage-heading">Built for High TDS.<br />Zero Repeat Complaints.</h2></div><p>Technicians choose our replacement membrane cores because they maintain stable permeate flow and consistent TDS reduction even in challenging Indian groundwater conditions.</p></div>
          <div className="tech-advantage-grid">
            <figure className="tech-water-image"><img src="/our-story-kitchen.png" alt="Pure glass of water tested by water purifier technician" loading="lazy" /><figcaption>Stable TDS reduction across borewell and tanker supply.</figcaption></figure>
            <div className="tech-benefit-list">{[
              { title: 'Consistent 95-98% Salt Rejection', desc: 'Maintains steady permeate TDS across borewell water containing up to 2500+ ppm dissolved solids, ensuring sweet and safe drinking water.' },
              { title: 'Standard 1812 & 2012 Sizing', desc: 'Universal fit for all residential RO membrane housings. Technicians can replace old filters in minutes without plumbing modifications.' },
              { title: 'Fouling-Resistant Polyamide Layers', desc: 'Smooth sheet morphology resists colloidal fouling and scaling, prolonging operating life and protecting your dealer reputation.' },
            ].map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.desc}</p></div></article>)}</div>
          </div>
          <div className="tech-next"><div><span className="tech-eyebrow">B2B SUPPLY &amp; SPARES</span><h3>Stock high-performance membranes for your service fleet.</h3></div><Link to="/contact?service=Wholesale+Quote" className="tech-primary">Request Wholesale Pricing <ArrowRight size={17} /></Link></div>
        </div>
      </section>
    </div>
  );
};

export default Technology;
