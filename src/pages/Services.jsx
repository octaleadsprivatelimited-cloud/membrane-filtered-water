import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Droplets, Gauge, FlaskConical, Sparkles, Truck, Smartphone, ArrowRight, Check } from 'lucide-react';
import { fetchServices } from '../firebase/mockDb';

const demoServices = [
  { id: 'demo-dealer', title: 'Authorized Dealership Onboarding', desc: 'Partner with us as an authorized distributor or stockist. Access wholesale bulk price slabs and credit lines.', price: 'Free Registration', category: 'Dealership', icon: ShieldCheck },
  { id: 'demo-bulk', title: 'Carton & Bulk Membrane Dispatch', desc: 'Order 25, 50, or 100-piece cartons of 75/80/100 GPD membranes with rapid 24-48 hr pan-India freight delivery.', price: 'Custom B2B Rates', category: 'Wholesale', icon: Truck },
  { id: 'demo-spare', title: 'Technician Spare Parts Kits', desc: 'Complete servicing bundle including universal RO membrane housings, FR-450 tubes, elbow fittings, and Teflon rolls.', price: '₹1,499 / kit', category: 'Spares', icon: Wrench },
  { id: 'demo-tds', title: 'Membrane Testing & TDS Certification', desc: 'Factory testing reports and salt rejection verification for commercial clients, institutions, and builders.', price: 'On Request', category: 'Testing', icon: FlaskConical },
  { id: 'demo-pump', title: 'Booster Pump & Membrane Calibration', desc: 'Field diagnostic support for water purifier technicians to balance pump pressure (PSI) with membrane flux.', price: 'Technician Support', category: 'Technical Support', icon: Gauge },
  { id: 'demo-b2b', title: 'B2B GST Billing & Order Portal', desc: 'Setup your dealer portal to track purchase orders, download input tax credit GST invoices, and manage stores.', price: 'Instant Access', category: 'Dealership', icon: Smartphone },
];
const categories = ['All services', 'Dealership', 'Wholesale', 'Spares', 'Testing', 'Technical Support'];
const Services = () => {
  const [category, setCategory] = useState('All services');
  const visible = demoServices.filter(service => category === 'All services' || service.category === category);
  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-container services-hero-grid">
          <div><span className="services-eyebrow">AQUA SAFE WATER TECHNOLOGIES · B2B &amp; FIELD HUB</span><h1>Empowering Dealers &amp;<br /><span>RO Technicians.</span></h1><p>From carton-level membrane supplies to technician spare bundles and priority field assistance, we equip water purification professionals across India.</p><a href="#service-catalog" className="services-button">Explore B2B Services <ArrowRight size={17} /></a></div>
          <aside className="services-care"><Wrench size={30} strokeWidth={1.4} /><h2>Dedicated trade support<br />for your business.</h2>{['Authorized dealer pricing', 'Carton dispatch & transit insurance', 'Dedicated technician support desk'].map(item => <div key={item}><Check size={16} />{item}</div>)}<span>SUPPLYING PURIFIER PROFESSIONALS NATIONWIDE</span></aside>
        </div>
      </section>
      <section id="service-catalog" className="services-catalog">
        <div className="services-container">
          <div className="services-section-heading"><div><span className="services-eyebrow">TRADE SERVICES &amp; SOLUTIONS</span><h2>Tailored for Dealerships &amp; Service Crews</h2></div><p>Select a business service below or submit an inquiry to join our dealer network.</p></div>
          <div className="service-filters" aria-label="Filter services">{categories.map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="service-grid">{visible.map(({ icon: Icon, ...service }) => <article className="service-card" key={service.id}>
            <div className="service-card-top"><span className="service-icon"><Icon size={24} strokeWidth={1.5} /></span><span>{service.category}</span></div>
            <h3>{service.title}</h3><p>{service.desc}</p>
            <div className="service-card-bottom"><strong>{service.price}</strong><Link to={`/contact?service=${encodeURIComponent(service.title)}`} aria-label={`Enquire about ${service.title}`}>Enquire / Order <ArrowRight size={16} /></Link></div>
          </article>)}</div>
        </div>
      </section>
      <section className="services-process"><div className="services-container"><span className="services-eyebrow">HOW TO COMMENCE TRADE</span><h2>From First Order to Seamless Supply</h2><div className="services-steps">{[
        ['01', 'Share Your Business Profile', 'Tell us about your dealership, retail shop, or RO service technician team.'],
        ['02', 'Receive Wholesale Slab Rates', 'Access tiered volume pricing, GST quotation, and sample testing options.'],
        ['03', 'Fast Dispatch & Ongoing Support', 'Get reliable doorstep freight delivery and direct technical hotline access.'],
      ].map(([number, title, desc]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{desc}</p></article>)}</div><div className="services-help"><div><h3>Want to place a custom bulk order?</h3><p>Speak with our B2B commercial desk for custom membrane specifications, private labeling, or bulk carton dispatch.</p></div><Link to="/contact?service=Bulk+Quote" className="services-button">Talk to B2B Desk <ArrowRight size={17} /></Link></div></div></section>
    </div>
  );
};
export default Services;
