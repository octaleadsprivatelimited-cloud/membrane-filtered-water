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
        <img className="about-hero-image" src="/our-story-kitchen.png" alt="Fresh drinking water on a sunlit kitchen counter" />
        <div className="about-hero-inner">
          <div className="about-hero-copy">
            <span className="about-hero-eyebrow">THE PEOPLE. THE PURPOSE. THE PROMISE.</span>
            <h1 id="about-heading">Better water.<br />A purpose that<br /><em>runs deeper.</em></h1>
            <p>We believe pure water belongs in every home. Discover the care and membrane technology behind Aqua Safe Water Technologies</p>
          </div>
          <div className="about-hero-bottom">
            <Link to="/technology" className="about-tech-link">Built on membrane technology <ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section id="who-we-are" className="about-company" aria-labelledby="company-heading">
        <div className="company-inner">
          <div className="company-intro">
            <span className="company-eyebrow">WHO WE ARE</span>
            <h2 id="company-heading">{content.title}</h2>
            <p className="company-description">{content.content}</p>
            <Link to="/technology" className="company-link">Explore our technology <ArrowUpRight size={18} /></Link>
          </div>
          <div className="company-visual">
            <div className="company-showcase">
              <img src="/our-story-kitchen.png" alt="Fresh drinking water in a sunlit home kitchen" loading="lazy" />
            </div>
            <div className="company-facts" aria-label="Aqua Safe Water Technologies at a glance">
              <div className="company-stat"><strong>10k<span>+</span></strong><span>Homes purified</span></div>
              <div className="company-stat"><strong>5</strong><span>Years of research</span></div>
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
