import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Headphones, ArrowUpRight, Clock } from 'lucide-react';

const Contact = () => {
  const [params] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const service = params.get('service') || '';
  return (
    <div className="contact-page">
      <section className="contact-hero"><div className="contact-container"><span className="contact-eyebrow">LET’S TALK WATER</span><div className="contact-hero-row"><h1>A question today.<br /><span>A clearer tomorrow.</span></h1><div><p>Choosing a purifier, planning a service, or just looking for advice? Start a conversation with AquaPure.</p><span className="contact-demo">Demo contact details · India</span></div></div></div></section>
      <section className="contact-cards-section" aria-label="Contact options"><div className="contact-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            { icon: Mail, title: 'Email us', value: 'care@aquapure.example', note: 'Product & service enquiries' },
            { icon: Phone, title: 'Call our team', value: '+91 00000 00000', note: 'Demo sales number' },
            { icon: MapPin, title: 'Visit us', value: 'Bengaluru, Karnataka', note: 'Demo city location' },
            { icon: Headphones, title: 'Service support', value: '+91 00000 00001', note: 'Demo support number' },
          ].map(({ icon: Icon, title, value, note }) => <article className="contact-card" key={title}><span className="contact-card-icon"><Icon size={24} strokeWidth={1.5} /></span><h2>{title}</h2><p>{value}</p><span>{note}</span></article>)}
        </div>
      </div></section>
      <section className="contact-main"><div className="contact-container contact-main-grid">
        <div className="contact-form-panel"><span className="contact-eyebrow">HOW CAN WE HELP?</span><h2>Tell us what you need.</h2><p className="contact-form-intro">Share a few details to preview your enquiry.</p>
          <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }} onChange={() => setSubmitted(false)}>
            <div className="contact-form-row"><div><label htmlFor="contact-first">First name *</label><input id="contact-first" name="firstName" autoComplete="given-name" placeholder="First name" required /></div><div><label htmlFor="contact-last">Last name *</label><input id="contact-last" name="lastName" autoComplete="family-name" placeholder="Last name" required /></div></div>
            <div className="contact-form-row"><div><label htmlFor="contact-email">Email *</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></div><div><label htmlFor="contact-phone">Phone number</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 mobile number" /></div></div>
            <div><label htmlFor="contact-subject">Enquiry subject *</label><input id="contact-subject" name="subject" defaultValue={service} placeholder="Product advice, installation, service…" required /></div>
            <div><label htmlFor="contact-message">How can we help? *</label><textarea id="contact-message" name="message" rows={4} placeholder="Tell us about your water system or service needs." required /></div>
            <div className="contact-form-bottom"><p>Demo form only. No message will be sent.</p><button type="submit">Preview enquiry <Send size={16} /></button></div>
            {submitted && <p className="contact-success" role="status">Your demo enquiry is complete. This preview has not sent or stored your details.</p>}
          </form>
        </div>
        <aside className="contact-location"><div className="contact-location-heading"><span className="contact-eyebrow">FIND US IN INDIA</span><h2>Closer to your home.</h2><p>Bengaluru, Karnataka, India</p><span className="contact-map-note">Illustrative city location for this demo.</span></div>
          <iframe src="https://www.google.com/maps?q=Bengaluru%2C%20Karnataka%2C%20India&output=embed" title="Bengaluru demo city map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <a className="contact-map-link" href="https://www.google.com/maps/search/?api=1&query=Bengaluru%2C%20Karnataka%2C%20India" target="_blank" rel="noopener noreferrer">Explore Bengaluru on Maps <ArrowUpRight size={18} /></a>
          <div className="contact-hours"><Clock size={20} /><div><strong>Demo support hours</strong><p>Monday–Saturday · 9:00 AM–6:00 PM IST</p></div></div>
        </aside>
      </div></section>
    </div>
  );
};
export default Contact;
