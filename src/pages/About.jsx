import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchPageContent } from '../firebase/mockDb';

const About = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchPageContent('about').then(setContent);
  }, []);

  if (!content) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

  return (
    <div className="w-full bg-white font-sans">
      
      {/* 1. About hero */}
      <section className="about-hero" aria-labelledby="about-heading">
        <img className="about-hero-image" src="/our-story-kitchen.png" alt="Pure drinking water in a glass from high rejection membrane" />
        <div className="about-hero-inner">
          <div className="about-hero-copy">
            <span className="about-hero-eyebrow">THE MEMBRANE SPECIALISTS · B2B &amp; FIELD SUPPLY</span>
            <h1 id="about-heading">The Science of Purity.<br />The Supply Chain<br /><em>Dealers Rely On.</em></h1>
            <p>We engineer and distribute high-rejection 0.0001 micron Reverse Osmosis (RO) membranes, filter housings, and replacement components for water purifier dealers, assemblers, and certified service technicians across India.</p>
          </div>
          <div className="about-hero-bottom">
            <Link to="/technology" className="about-tech-link">Explore Membrane Engineering <ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section id="who-we-are" className="about-company" aria-labelledby="company-heading">
        <div className="company-inner">
          <div className="company-intro">
            <span className="company-eyebrow">OUR SPECIALIZATION</span>
            <h2 id="company-heading">Why the Membrane is the Heart of the Purifier</h2>
            <p className="company-description">
              In any water purifier, the RO membrane does 95%+ of the actual purification work. While outer filters trap coarse dust and chlorine, the microscopic 0.0001 micron polyamide membrane sheet physically rejects heavy metals, dissolved toxic salts, nitrates, and waterborne pathogens. Our mission is to ensure every dealer and field technician has access to reliable, high-yield, factory-tested membranes that never fail under high TDS groundwater pressure.
            </p>
            <Link to="/services" className="company-link">View Dealer &amp; Technician Benefits <ArrowUpRight size={18} /></Link>
          </div>
          <div className="company-visual">
            <div className="company-showcase">
              <img src="/membrane-tech.jpg" alt="Thin film composite reverse osmosis membrane sheet rolling" loading="lazy" />
            </div>
            <div className="company-facts" aria-label="Aqua Safe Water Technologies at a glance">
              <div className="company-stat"><strong>500<span>+</span></strong><span>Dealers &amp; Technicians</span></div>
              <div className="company-stat"><strong>98<span>%</span></strong><span>Avg Salt Rejection</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values (Mission & Vision) */}
      {(content.missionDescription || content.visionDescription) && (
        <section className="about-values" aria-labelledby="values-heading">
          <div className="values-inner">
            <div className="values-heading"><span>WHAT DRIVES US</span><h2 id="values-heading">One purpose. A clearer future.</h2></div>
            <div className="values-grid">
              {content.missionDescription && (
                <article className="value-card value-mission">
                  <div className="value-card-top"><ShieldCheck size={28} strokeWidth={1.5} aria-hidden="true" /><span>01</span></div>
                  <span className="value-label">OUR COMMITMENT</span>
                  <h3>Our Mission</h3>
                  <p>{content.missionDescription}</p>
                  <div className="value-card-line" aria-hidden="true" />
                </article>
              )}
              {content.visionDescription && (
                <article className="value-card value-vision">
                  <div className="value-card-top"><CheckCircle size={28} strokeWidth={1.5} aria-hidden="true" /><span>02</span></div>
                  <span className="value-label">OUR AMBITION</span>
                  <h3>Our Vision</h3>
                  <p>{content.visionDescription}</p>
                  <div className="value-card-line" aria-hidden="true" />
                </article>
              )}
            </div>
          </div>
        </section>
      )}
      
    </div>
  );
};

export default About;
