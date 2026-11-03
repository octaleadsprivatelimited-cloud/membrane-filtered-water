import {api} from '../commerce/api';
import {useAuth} from '../commerce/Auth';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Headphones, ArrowUpRight, Clock } from 'lucide-react';

const Contact = () => {
  const {config}=useAuth();
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  async function send(event){event.preventDefault();const form=event.currentTarget;setBusy(true);setError('');setSubmitted(false);try{await api('/enquiries',{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(form)))});setSubmitted(true);form.reset();}catch(e){setError(e.message);}finally{setBusy(false);}}
  const [params] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const service = params.get('service') || '';
  return (
    <div className="contact-page">
      <section className="contact-hero"><div className="contact-container"><span className="contact-eyebrow">DEALER &amp; TECHNICIAN NETWORK</span><div className="contact-hero-row"><h1>Partner with India’s<br /><span>RO Membrane Specialists.</span></h1><div><p>Looking to stock high-rejection RO membranes, inquire about bulk carton pricing, or access technician support? Connect with our commercial B2B desk.</p><span className="contact-demo">Pan-India Dealer Support · GST Invoicing</span></div></div></div></section>
      <section className="contact-cards-section" aria-label="Contact options"><div className="contact-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            { icon: Mail, title: 'Dealer Desk', value: config?.supportEmail || 'dealers@aquasafe.com', note: 'Wholesale & carton orders' },
            { icon: Phone, title: 'Commercial Desk', value: '+91 98765 43210', note: 'Dealership & B2B sales' },
            { icon: MapPin, title: 'Central Warehouse', value: 'Bengaluru, Karnataka', note: 'Pan-India dispatch hub' },
            { icon: Headphones, title: 'Technician Helpline', value: '+91 98765 43211', note: 'Field technical assistance' },
          ].map(({ icon: Icon, title, value, note }) => <article className="contact-card" key={title}><span className="contact-card-icon"><Icon size={24} strokeWidth={1.5} /></span><h2>{title}</h2><p>{value}</p><span>{note}</span></article>)}
        </div>
      </div></section>
      <section className="contact-main"><div className="contact-container contact-main-grid">
        <div className="contact-form-panel"><span className="contact-eyebrow">B2B &amp; TRADE REGISTRATION</span><h2>Register Your Dealership / Service Firm.</h2><p className="contact-form-intro">Submit your details below to receive bulk wholesale pricing slabs and technical catalogs.</p>
          <form onSubmit={send} onChange={() => setSubmitted(false)}>
            <div className="contact-form-row"><div><label htmlFor="contact-first">Contact Person / Name *</label><input id="contact-first" name="firstName" autoComplete="given-name" placeholder="Full name" required /></div><div><label htmlFor="contact-last">Business / Shop Name *</label><input id="contact-last" name="lastName" autoComplete="organization" placeholder="Enterprise / RO Service Agency" required /></div></div>
            <div className="contact-form-row"><div><label htmlFor="contact-email">Email Address *</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="business@example.com" required /></div><div><label htmlFor="contact-phone">WhatsApp / Phone *</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 mobile number" required /></div></div>
            <div><label htmlFor="contact-subject">Inquiry Type *</label><input id="contact-subject" name="subject" defaultValue={service} placeholder="e.g. Dealership Inquiry, Carton Price Quote, Technician Spares" required /></div>
            <div><label htmlFor="contact-message">Estimated Requirement / Message *</label><textarea id="contact-message" name="message" rows={4} placeholder="Mention membrane ratings needed (75/80/100/300 GPD), monthly volume, city/state, or technician requirements." required /></div>
            <div className="contact-form-bottom"><p>Our B2B representative will contact you within 24 hours.</p><button type="submit" disabled={busy}>{busy?'Submitting…':'Submit B2B Inquiry'} <Send size={16} /></button></div>
            {error&&<p role="alert" className="commerce-error">{error}</p>}
            {submitted && <p className="contact-success" role="status">Your dealer / technician inquiry has been submitted! Our commercial desk will contact you with wholesale pricing slabs.</p>}
          </form>
        </div>
        <aside className="contact-location"><div className="contact-location-heading"><span className="contact-eyebrow">CENTRAL LOGISTICS HUB</span><h2>Fast Dispatch Nationwide.</h2><p>Bengaluru, Karnataka, India</p><span className="contact-map-note">Serving dealers &amp; service technicians across all Indian states.</span></div>
          <iframe src="https://www.google.com/maps?q=Bengaluru%2C%20Karnataka%2C%20India&output=embed" title="Bengaluru logistics hub map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <a className="contact-map-link" href="https://www.google.com/maps/search/?api=1&query=Bengaluru%2C%20Karnataka%2C%20India" target="_blank" rel="noopener noreferrer">Locate Distribution Hub on Maps <ArrowUpRight size={18} /></a>
          <div className="contact-hours"><Clock size={20} /><div><strong>Commercial Trade Hours</strong><p>Monday–Saturday · 9:30 AM–7:00 PM IST</p></div></div>
        </aside>
      </div></section>
    </div>
  );
};
export default Contact;
