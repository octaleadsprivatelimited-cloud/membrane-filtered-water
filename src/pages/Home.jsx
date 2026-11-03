import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Droplets,ShieldCheck,Headphones,Wrench,ShoppingBag,MapPin,PackageCheck,Check,SlidersHorizontal} from 'lucide-react';
import {getCatalog} from '../store/Shop';
import {useAuth} from '../commerce/Auth';
import ShopCard from '../components/ShopCard';
const benefits=[
  [ShieldCheck,'0.0001 Micron RO Technology','Genuine high-rejection Thin Film Composite (TFC) membrane sheets delivering up to 98% TDS cut-off.'],
  [SlidersHorizontal,'Bulk & Wholesale Supply','Direct factory pricing, carton lots, and tiered discounts tailored for authorized dealers & distributors.'],
  [Wrench,'Technician & Spare Support','Universal size 75, 80, 100 & 300 GPD membrane elements, housings, booster pumps, and complete spares kit.'],
  [Headphones,'Dealer Onboarding & Logistics','Fast pan-India dispatch, prompt technical data sheets, and verified GST billing for service businesses.']
];
const careCards=[
  {num:'01',image:'/membrane-tech.jpg',tag:'Wholesale',title:'Dealer & Distributor Supply',desc:'Stock high-demand 75 to 3000 GPD reverse osmosis membranes with high profit margins and carton dispatch.',features:['Carton & Bulk Rates','GST Tax Invoices'],to:'/contact?service=Dealer+Network',linkText:'Become a Dealer'},
  {num:'02',image:'/our-story-kitchen.png',tag:'Technicians',title:'Technician Spares & Kits',desc:'Reliable replacement membrane elements, flow restrictors, and booster pump combos for field service engineers.',features:['Universal 1812 / 2012 Fits','High TDS Tolerance'],to:'/products?q=Membrane',linkText:'Order Service Spares'},
  {num:'03',image:'/membrane-pure-water.jpg',tag:'Testing',title:'TDS & Membrane Calibration',desc:'Detailed technical specifications, salt rejection benchmarks, and flow rate calibration charts for technicians.',features:['Up to 3,000 ppm TDS Rejection','Stable Flux Rates'],to:'/technology',linkText:'View Tech Specs'},
  {num:'04',image:'/smart-app.jpg',tag:'B2B Portal',title:'Online Ordering & Tracking',desc:'Place bulk orders directly online, manage multiple store or service branch addresses, and track consignments.',features:['Instant Order Confirmation','Real-time Consignment Tracking'],to:'/account',linkText:'Dealer Dashboard'}
];
const stepsData = [
  { num: '01', stepTitle: 'Step 01 · Catalog & Specs', title: 'Select Membrane Ratings', copy: 'Choose from 75 GPD, 80 GPD, 100 GPD domestic membranes or commercial 300 to 3000 GPD modules built for high TDS groundwater.', image: '/membrane-tech.jpg', highlights: ['Detailed GPD & TDS Rejection Specs', 'Thin Film Composite (TFC) Tech', 'Dry & Wet Membrane Options'], tag: '1. Specification', Icon: ShoppingBag, link: '/products', linkText: 'Browse Membrane Catalog' },
  { num: '02', stepTitle: 'Step 02 · Dealer Pricing', title: 'Wholesale & B2B Inquiries', copy: 'Register your dealership, service shop, or water purification business to unlock bulk carton discounts and priority allocations.', image: '/our-story-kitchen.png', highlights: ['Transparent Bulk Price Slabs', 'Official Tax & GST Invoicing', 'Dedicated Account Managers'], tag: '2. Dealership', Icon: MapPin, link: '/contact?service=Dealer+Inquiry', linkText: 'Request Wholesale Quote' },
  { num: '03', stepTitle: 'Step 03 · Dispatch & Delivery', title: 'Fast Pan-India Delivery', copy: 'Orders are securely packed and dispatched via trusted logistics partners to keep your field technician inventories always stocked.', image: '/membrane-pure-water.jpg', highlights: ['Dispatched within 24-48 hours', 'Transit Insurance on Bulk Shipments', 'Real-time Consignment Tracking'], tag: '3. Rapid Dispatch', Icon: PackageCheck, link: '/services', linkText: 'View Service Support' },
  { num: '04', stepTitle: 'Step 04 · Technician Support', title: 'Installation & Field Assistance', copy: 'Access troubleshooting resources, input pressure guidelines, and compatibility tables to resolve customer service tickets faster.', image: '/smart-app.jpg', highlights: ['Technician Hotline & Data Sheets', '100% Guaranteed Genuine Cores', 'Field Tested across 2500+ PPM'], tag: '4. Field Support', Icon: Headphones, link: '/contact', linkText: 'Connect with Technical Desk' }
];
const questions=[
  ['What is the role of an RO membrane in a water purifier?','The RO (Reverse Osmosis) membrane is the core heart of any water purifier. With a microscopic pore size of 0.0001 microns, it physically blocks dissolved salts, heavy metals (lead, arsenic, mercury), fluoride, bacteria, and micro-pollutants while allowing only pure water molecules through.'],
  ['Do you supply in wholesale bulk to water purifier dealers and distributors?','Yes! We specialize in direct supply to RO dealers, hardware retailers, and water purification distributors. We offer tiered volume pricing, carton packing, and pan-India dispatch.'],
  ['Are your membranes compatible with all domestic and commercial RO models?','Our standard residential membranes use universal 1812 and 2012 sizing (75 GPD, 80 GPD, 100 GPD), which fit into all standard RO membrane housings used by major water purifier brands.'],
  ['What TDS levels can your RO membranes handle?','Our high-rejection membranes are engineered for tough Indian water conditions, effectively treating borewell, tanker, and tap water with TDS levels up to 2,500 - 3,000 ppm while maintaining 95%+ salt rejection.']
];
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
<section className="smart-hero"><div className="smart-hero-inner"><div className="smart-hero-copy"><span className="smart-eyebrow">INDIA’S TRUSTED RO MEMBRANE SUPPLIER</span><h1>Precision RO Membranes.<br/>Built for Dealers &amp;<br/><em>RO Technicians.</em></h1><p>Source high-rejection, genuine 0.0001 micron reverse osmosis membranes and purifier spares at wholesale prices. Engineered for tough water conditions and reliable service life.</p><div className="smart-hero-actions"><Link to="/products" className="smart-button">Explore Membrane Catalog <ArrowRight size={18}/></Link><Link to="/contact?service=Dealer+Onboarding">Join as Dealer / Technician <ArrowRight size={16}/></Link></div><div className="smart-hero-check"><ShieldCheck size={20}/> 0.0001 Micron Pore Size · Up to 98% TDS Rejection · Wholesale Slabs</div></div><div className="smart-hero-visual"><img src={config?.slide1Image||'/membrane-tech.jpg'} alt="Water purifier reverse osmosis membrane cross section technology"/><div className="smart-visual-label"><span><Droplets size={25}/></span><div><strong>The Heart of Water Purification</strong><p>0.0001 Micron TFC Filtration Sheets</p></div></div><span className="smart-hero-stamp">B2B WHOLESALE &amp;<br/><b>Technician Hub</b></span></div></div></section>
<div className="smart-benefit-band">{[[Droplets,'0.0001µm RO Membrane Cores'],[SlidersHorizontal,'Wholesale & Carton Supply'],[Wrench,'Field Spares for Technicians'],[Headphones,'Dealer Priority Support']].map(([Icon,label])=><div key={label}><Icon size={25}/><span>{label}</span></div>)}</div>
<section className="smart-section smart-why"><div className="smart-heading"><span className="smart-eyebrow">WHY DEALERS &amp; TECHNICIANS CHOOSE US</span><h2>Reliable performance in every installation.</h2><p>As water purifier professionals know, the membrane determines the water quality, customer satisfaction, and service calls. Here is how our membrane technology supports your business.</p></div><div className="smart-benefits">{benefits.map(([Icon,title,copy])=><article key={title}><span className="smart-icon"><Icon size={32} strokeWidth={1.5}/></span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
<section className="smart-collection"><div className="smart-section"><div className="smart-heading"><span className="smart-eyebrow">SPARE CORES &amp; MEMBRANE PURIFIERS</span><h2>RO Membranes &amp; Technician Essentials</h2><p>Order individual replacement cores, bulk lots, or complete reverse osmosis systems directly.</p></div><div className="smart-filter-tabs" aria-label="Product categories">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} aria-pressed={category===c}>{c}</button>)}</div>{loading?<p role="status">Loading products…</p>:error?<p role="alert">Unable to load products. <Link to="/products">Try the shop</Link></p>:shown.length?<div className="market-product-grid">{shown.map(p=><ShopCard key={p.id} product={p}/>)}</div>:<p>New products are on their way.</p>}<div className="smart-center"><Link className="smart-button outline" to="/products">View Complete Spares &amp; Systems Catalog <ArrowRight size={18}/></Link></div></div></section>
<section className="smart-section smart-care"><div className="smart-heading"><span className="smart-eyebrow">B2B TRADE &amp; FIELD SERVICES</span><h2>Empowering Water Purifier Businesses</h2><p>Whether running an established dealership, retail spares counter, or independent service route, we provide the supply chain and technical backing you need.</p></div><div className="smart-care-grid">{careCards.map(({num,image,tag,title,desc,features,to,linkText})=><article key={title} className="smart-care-card"><div className="smart-care-media"><img src={image} alt={title} loading="lazy"/><div className="smart-care-media-overlay"/><div className="smart-care-badge-row"><span className="smart-care-num">{num}</span><span className="smart-care-badge">{tag}</span></div></div><div className="smart-care-body"><h3>{title}</h3><p>{desc}</p><div className="smart-care-chips">{features.map(f=><span key={f} className="smart-care-chip"><Check size={13} strokeWidth={2.5}/>{f}</span>)}</div><div className="smart-care-footer"><Link to={to} className="smart-care-btn"><span>{linkText}</span><span className="smart-care-btn-arrow"><ArrowRight size={15}/></span></Link></div></div></article>)}</div><div className="smart-center"><Link to="/services" className="smart-button">Explore Technician Services &amp; Spares <ArrowRight size={18}/></Link></div></section>
<section className="smart-steps-sharp-section"><div className="smart-section"><div className="smart-heading"><span className="smart-eyebrow">DEALER ONBOARDING</span><h2>How to partner with us in 4 steps</h2><p>From sample testing to scheduled bulk replenishments, we make it effortless for dealers and technicians to maintain high margins and zero stockouts.</p></div><div className="smart-sharp-grid">{stepsData.map(({num,title,copy,tag,Icon,image,link,linkText})=><article key={title} className="smart-sharp-card"><div className="smart-sharp-media"><img src={image} alt={title} loading="lazy"/><div className="smart-sharp-media-overlay"/><div className="smart-sharp-badge">STEP {num}</div><span className="smart-sharp-tag">{tag}</span></div><div className="smart-sharp-body"><div className="smart-sharp-icon-row"><span className="smart-sharp-icon-box"><Icon size={20} strokeWidth={1.7}/></span><span className="smart-sharp-index">STAGE {num}</span></div><h3>{title}</h3><p>{copy}</p><div className="smart-sharp-footer"><Link to={link} className="smart-sharp-btn"><span>{linkText}</span><ArrowRight size={15}/></Link></div></div></article>)}</div><div className="smart-center"><Link to="/contact" className="smart-sharp-more-btn"><span>Register as a Dealer / Technician</span><ArrowRight size={16}/></Link></div></div></section>
<section className="smart-section smart-faq-combined">
  <div className="smart-faq-lead">
    <span className="smart-eyebrow">TECHNICAL &amp; DEALERSHIP FAQ</span>
    <h2>Partner with the membrane specialists.</h2>
    <p>Everything dealers and RO service technicians need to know about our membrane pore technology, wholesale quantities, and delivery timelines.</p>
    <div className="smart-faq-cta-group">
      <Link to="/contact?service=Wholesale+Quote" className="smart-button">
        Request Dealer Quote <ArrowRight size={17}/>
      </Link>
      <Link to="/contact" className="smart-faq-secondary-btn">
        Speak with Technical Support <ArrowRight size={16}/>
      </Link>
    </div>
  </div>
  <div className="smart-faq-accordion">
    {questions.map(([q,a])=><details key={q}><summary><span>{q}</span><span className="smart-faq-toggle">+</span></summary><p>{a}</p></details>)}
  </div>
</section>
</div>}
