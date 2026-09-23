import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Droplets, Gauge, FlaskConical, Sparkles, Truck, Smartphone, ArrowRight, Check } from 'lucide-react';
import { fetchServices } from '../firebase/mockDb';

const demoServices = [
  { id: 'demo-quality', title: 'Water Quality Check', desc: 'Understand your water with a basic quality assessment and filtration recommendations.', price: 'Request a quote', category: 'Testing', icon: FlaskConical },
  { id: 'demo-clean', title: 'System Sanitization', desc: 'A thorough cleaning of the storage tank and water lines as part of routine purifier care.', price: 'Request a quote', category: 'Maintenance', icon: Sparkles },
  { id: 'demo-move', title: 'Purifier Relocation', desc: 'Careful disconnection and reinstallation when you move your purifier to a new home.', price: 'Request a quote', category: 'Installation', icon: Truck },
  { id: 'demo-smart', title: 'Smart App Setup', desc: 'Get connected with app pairing, monitoring setup, and a guided walkthrough of your system.', price: 'Request a quote', category: 'Support', icon: Smartphone },
];
const categories = ['All services', 'Installation', 'Maintenance', 'Testing', 'Support'];
const Services = () => {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState('All services');
  useEffect(() => {
    let active = true;
    fetchServices().then(data => { if (active) setServicesList(data); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const services = [...servicesList.map((service, index) => ({ ...service, category: ['Installation', 'Maintenance', 'Maintenance', 'Support'][index % 4], icon: [Wrench, ShieldCheck, Droplets, Gauge][index % 4] })), ...demoServices];
  const visible = services.filter(service => category === 'All services' || service.category === category);
  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-container services-hero-grid">
          <div><span className="services-eyebrow">AQUAPURE CARE</span><h1>Expert care.<br /><span>For every drop.</span></h1><p>From the first installation to everyday maintenance, find the right support to keep your water system working at its best.</p><a href="#service-catalog" className="services-button">Explore services <ArrowRight size={17} /></a></div>
          <aside className="services-care"><Wrench size={30} strokeWidth={1.4} /><h2>Support through the life<br />of your system.</h2>{['Installation & setup', 'Routine maintenance', 'Troubleshooting & guidance'].map(item => <div key={item}><Check size={16} />{item}</div>)}<span>ONE PLACE FOR YOUR WATER CARE</span></aside>
        </div>
      </section>
      <section id="service-catalog" className="services-catalog">
        <div className="services-container">
          <div className="services-section-heading"><div><span className="services-eyebrow">HOW CAN WE HELP?</span><h2>Care that fits your needs.</h2></div><p>Explore installation, maintenance, and support options.<br />Additional services are shown as demo examples.</p></div>
          <div className="service-filters" aria-label="Filter services">{categories.map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
          {loading ? <p role="status">Loading services…</p> : <>
            {error && <p role="status">Existing services could not be loaded. Demo services are available below.</p>}
            <div className="service-grid">{visible.map(({ icon: Icon, ...service }) => <article className="service-card" key={service.id}>
              <div className="service-card-top"><span className="service-icon"><Icon size={24} strokeWidth={1.5} /></span><span>{service.category}</span></div>
              <h3>{service.title}</h3><p>{service.desc}</p>
              {service.id.startsWith('demo-') && <span className="service-demo">Demo service</span>}
              <div className="service-card-bottom"><strong>{service.price}</strong><Link to={`/contact?service=${encodeURIComponent(service.title)}`} aria-label={`Enquire about ${service.title}`}>Enquire <ArrowRight size={16} /></Link></div>
            </article>)}</div>
            {visible.length === 0 && <p>No services in this category yet.</p>}
          </>}
        </div>
      </section>
      <section className="services-process"><div className="services-container"><span className="services-eyebrow">A SIMPLE NEXT STEP</span><h2>From enquiry to everyday confidence.</h2><div className="services-steps">{[
        ['01', 'Tell us what you need', 'Choose a service and get in touch with our team.'],
        ['02', 'Confirm the details', 'Discuss your system, service scope, and a suitable visit time.'],
        ['03', 'Get your system cared for', 'Receive support and practical guidance for ongoing maintenance.'],
      ].map(([number, title, desc]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{desc}</p></article>)}</div><div className="services-help"><div><h3>Not sure which service to choose?</h3><p>Tell us about your purifier. We’ll help you find the next step.</p></div><Link to="/contact" className="services-button">Talk to our team <ArrowRight size={17} /></Link></div></div></section>
    </div>
  );
};
export default Services;
