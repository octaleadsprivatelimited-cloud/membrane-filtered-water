import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Droplets,ShieldCheck,Headphones,Wrench,ShoppingBag,MapPin,PackageCheck,Check,SlidersHorizontal} from 'lucide-react';
import {getCatalog} from '../store/Shop';
import {useAuth} from '../commerce/Auth';
import ShopCard from '../components/ShopCard';
const benefits=[[ShieldCheck,'Made for better water','Membrane systems designed around your everyday needs.'],[Headphones,'Guidance that helps','Find the right system with help from our team.'],[Wrench,'Care beyond checkout','Explore installation, maintenance and replacement services.'],[Droplets,'A solution for every space','Water care for homes, businesses and industry.']];
const careCards=[
  {num:'01',image:'/our-story-kitchen.png',tag:'Advisory',title:'System Selection',desc:'Expert guidance matching your water source and TDS levels to the ideal membrane purifier.',features:['Source & TDS check','Capacity planning'],to:'/products',linkText:'Explore Systems'},
  {num:'02',image:'/membrane-tech.jpg',tag:'Setup',title:'Certified Installation',desc:'Doorstep setup by verified technicians with pressure calibration and leak-proof fitting.',features:['Doorstep setup','Flow tuning'],to:'/services',linkText:'Book Setup'},
  {num:'03',image:'/membrane-pure-water.jpg',tag:'AMC Care',title:'Annual Maintenance',desc:'Comprehensive year-round coverage with routine inspections and storage tank sanitization.',features:['Annual AMC plan','Tank sanitization'],to:'/services',linkText:'View AMC'},
  {num:'04',image:'/membrane-tech.jpg',tag:'Spares',title:'Filter Replacements',desc:'Genuine replacement membrane cores and multi-stage cartridges for dependable purity.',features:['Original cores','Fast dispatch'],to:'/products?q=Filter',linkText:'Order Spares'},
  {num:'05',image:'/smart-app.jpg',tag:'Support',title:'Customer Portal',desc:'Track deliveries in real time, save five addresses, and initiate doorstep service tickets.',features:['Live tracking','Instant tickets'],to:'/account',linkText:'Open Portal'}
];
const stepsData = [
  { num: '01', stepTitle: 'Step 01 · Selection', title: 'Choose your system', copy: 'Explore membrane purifiers engineered for your water source, household size, and TDS levels with zero guesswork.', image: '/our-story-kitchen.png', highlights: ['Tailored to tap or borewell TDS', 'Certified capacity recommendations', 'Sleek under-sink & counter designs'], tag: '1. Selection', Icon: ShoppingBag, link: '/products', linkText: 'Explore Water Systems' },
  { num: '02', stepTitle: 'Step 02 · Scheduling', title: 'Schedule setup', copy: 'Provide your delivery location and select a preferred time slot for seamless doorstep dispatch with verified technicians.', image: '/membrane-tech.jpg', highlights: ['Convenient doorstep delivery slots', 'Multi-address checkout support', 'Real-time booking confirmations'], tag: '2. Scheduling', Icon: MapPin, link: '/contact', linkText: 'Check Service Area' },
  { num: '03', stepTitle: 'Step 03 · Installation', title: 'Certified installation', copy: 'Trained water specialists calibrate membrane pressure, test output TDS on-site, and ensure zero-leak plumbing fitting.', image: '/membrane-pure-water.jpg', highlights: ['On-site input/output TDS report', 'High-pressure leak-proof brass fittings', 'Complete guided care walkthrough'], tag: '3. Setup & Test', Icon: PackageCheck, link: '/services', linkText: 'View Setup Standards' },
  { num: '04', stepTitle: 'Step 04 · Pure Living', title: 'Continuous care & AMC', copy: 'Enjoy complete peace of mind with live order tracking, scheduled routine servicing, and genuine replacement filter supply.', image: '/smart-app.jpg', highlights: ['All-inclusive annual AMC plans', '100% genuine replacement filters', '24/7 dedicated support desk'], tag: '4. Pure Living', Icon: Headphones, link: '/account', linkText: 'Access Customer Portal' }
];
const questions=[['How do I choose the right water system?','The right system depends on your water source, usage and available space. Browse the collection or contact our team for guidance before ordering.'],['Can I manage my orders online?','Yes. Sign in to your customer account to view orders, saved addresses and available order updates.'],['Where can I find replacement filters?','Explore the replacement products in our store. Check compatibility with your existing system, or ask our team before purchasing.'],['Do you offer installation and maintenance?','Our services page covers installation and ongoing care. Contact the team to confirm availability and charges for your location.']];
export default function Home(){const {config}=useAuth();const [products,setProducts]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState(false);const [category,setCategory]=useState('All products');
useEffect(()=>{getCatalog().then(setProducts).catch(()=>setError(true)).finally(()=>setLoading(false));},[]);
useEffect(()=>{
  const elements = document.querySelectorAll('.smart-home section, .smart-home .smart-benefit-band');
  if(!elements.length)return;
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-revealed');
      }
    });
  },{threshold:0.06,rootMargin:'0px 0px -20px 0px'});
  elements.forEach(el=>observer.observe(el));
  return ()=>observer.disconnect();
},[loading,products]);
const categories=['All products',...new Set(products.map(p=>p.category).filter(Boolean))];
const shown=category==='All products'?products:products.filter(p=>p.category===category);
return <div className="smart-home">
<section className="smart-hero"><div className="smart-hero-inner"><div className="smart-hero-copy"><span className="smart-eyebrow">WATER CARE, MADE SIMPLE</span><h1>Good water.<br/>Great living.<br/><em>Every single day.</em></h1><p>Discover the right water purification system for your home, your business and everything in between.</p><div className="smart-hero-actions"><Link to="/products" className="smart-button">Explore water systems <ArrowRight size={18}/></Link><Link to="/contact">Help me choose <ArrowRight size={16}/></Link></div><div className="smart-hero-check"><ShieldCheck size={20}/> Precision filtration. Thoughtful care.</div></div><div className="smart-hero-visual"><img src={config?.slide1Image||'/our-story-kitchen.png'} alt="Fresh drinking water in a modern home kitchen"/><div className="smart-visual-label"><span><Droplets size={25}/></span><div><strong>A little more purity.</strong><p>A lot more peace of mind.</p></div></div><span className="smart-hero-stamp">DESIGNED FOR<br/><b>everyday life</b></span></div></div></section>
<div className="smart-benefit-band">{[[Droplets,'Precision filtration'],[SlidersHorizontal,'Systems for every space'],[Wrench,'Installation & care'],[Headphones,'Expert guidance']].map(([Icon,label])=><div key={label}><Icon size={25}/><span>{label}</span></div>)}</div>
<section className="smart-section smart-why"><div className="smart-heading"><span className="smart-eyebrow">THE MEMBRANEIQ DIFFERENCE</span><h2>Better water. Less to worry about.</h2><p>From choosing your first system to keeping it running beautifully, we’re here to help.</p></div><div className="smart-benefits">{benefits.map(([Icon,title,copy])=><article key={title}><span className="smart-icon"><Icon size={32} strokeWidth={1.5}/></span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
<section className="smart-collection"><div className="smart-section"><div className="smart-heading"><span className="smart-eyebrow">FIND YOUR EVERYDAY ESSENTIAL</span><h2>Your water. Your perfect fit.</h2><p>Explore our water systems and genuine replacement essentials.</p></div><div className="smart-filter-tabs" aria-label="Product categories">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} aria-pressed={category===c}>{c}</button>)}</div>{loading?<p role="status">Loading products…</p>:error?<p role="alert">Unable to load products. <Link to="/products">Try the shop</Link></p>:shown.length?<div className="market-product-grid">{shown.map(p=><ShopCard key={p.id} product={p}/>)}</div>:<p>New products are on their way.</p>}<div className="smart-center"><Link className="smart-button outline" to="/products">Explore the full collection <ArrowRight size={18}/></Link></div></div></section>
<section className="smart-section smart-care"><div className="smart-heading"><span className="smart-eyebrow">MORE THAN A WATER SYSTEM</span><h2>Purity engineered with complete care.</h2><p>From finding the right filtration technology to doorstep installation and lifetime maintenance, experience a higher standard of water care.</p></div><div className="smart-care-grid">{careCards.map(({num,image,tag,title,desc,features,to,linkText})=><article key={title} className="smart-care-card"><div className="smart-care-media"><img src={image} alt={title} loading="lazy"/><div className="smart-care-media-overlay"/><div className="smart-care-badge-row"><span className="smart-care-num">{num}</span><span className="smart-care-badge">{tag}</span></div></div><div className="smart-care-body"><h3>{title}</h3><p>{desc}</p><div className="smart-care-chips">{features.map(f=><span key={f} className="smart-care-chip"><Check size={13} strokeWidth={2.5}/>{f}</span>)}</div><div className="smart-care-footer"><Link to={to} className="smart-care-btn"><span>{linkText}</span><span className="smart-care-btn-arrow"><ArrowRight size={15}/></span></Link></div></div></article>)}</div><div className="smart-center"><Link to="/services" className="smart-button">Explore our services & AMC <ArrowRight size={18}/></Link></div></section>
<section className="smart-steps-sharp-section"><div className="smart-section"><div className="smart-heading"><span className="smart-eyebrow">HOW IT WORKS</span><h2>A simpler way to better water.</h2><p>Four disciplined steps engineered from initial water source assessment to certified doorstep fitting and lifetime care.</p></div><div className="smart-sharp-grid">{stepsData.map(({num,title,copy,tag,Icon,image,link,linkText})=><article key={title} className="smart-sharp-card"><div className="smart-sharp-media"><img src={image} alt={title} loading="lazy"/><div className="smart-sharp-media-overlay"/><div className="smart-sharp-badge">STEP {num}</div><span className="smart-sharp-tag">{tag}</span></div><div className="smart-sharp-body"><div className="smart-sharp-icon-row"><span className="smart-sharp-icon-box"><Icon size={20} strokeWidth={1.7}/></span><span className="smart-sharp-index">STAGE {num}</span></div><h3>{title}</h3><p>{copy}</p><div className="smart-sharp-footer"><Link to={link} className="smart-sharp-btn"><span>{linkText}</span><ArrowRight size={15}/></Link></div></div></article>)}</div><div className="smart-center"><Link to="/services" className="smart-sharp-more-btn"><span>View more</span><ArrowRight size={16}/></Link></div></div></section>
<section className="smart-section smart-faq-combined">
  <div className="smart-faq-lead">
    <span className="smart-eyebrow">LET’S CLEAR THINGS UP</span>
    <h2>Ready for your everyday upgrade?</h2>
    <p>Find the ideal filtration system with membraneIQ, or get quick answers to common questions about selection, delivery, and filter care.</p>
    <div className="smart-faq-cta-group">
      <Link to="/products" className="smart-button">
        Find my water system <ArrowRight size={17}/>
      </Link>
      <Link to="/contact" className="smart-faq-secondary-btn">
        Talk to our team <ArrowRight size={16}/>
      </Link>
    </div>
  </div>
  <div className="smart-faq-accordion">
    {questions.map(([q,a])=><details key={q}><summary><span>{q}</span><span className="smart-faq-toggle">+</span></summary><p>{a}</p></details>)}
  </div>
</section>
</div>}
