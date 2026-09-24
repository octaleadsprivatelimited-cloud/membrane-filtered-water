import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight,ArrowRight,Droplets,Building2,Home as HomeIcon,RefreshCw,SlidersHorizontal,Wrench,ShieldCheck,Headphones} from 'lucide-react';
import {getCatalog} from '../store/Shop';
import {useAuth} from '../commerce/Auth';
import ShopCard from '../components/ShopCard';
const categories=[[Building2,'Industrial Membrane','Industrial Membrane','Heavy duty filtration'],[HomeIcon,'Residential Membrane','Residential Membrane','For your family'],[SlidersHorizontal,'Nano Filtration','Nano Filtration','Precision cleaning'],[RefreshCw,'Ultra Filtration','Ultra Filtration','Ultimate purity']];
export default function Home(){const {config}=useAuth();const [products,setProducts]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState(false);useEffect(()=>{getCatalog().then(setProducts).catch(()=>setError(true)).finally(()=>setLoading(false));},[]);
const groupedProducts = products.reduce((acc, p) => { const cat = p.category || 'Other'; if (!acc[cat]) acc[cat] = []; acc[cat].push(p); return acc; }, {});
return <div className="market-home"><section className="market-banner"><div><span className="market-eyebrow">THE EVERYDAY UPGRADE</span><h1 dangerouslySetInnerHTML={{__html: config?.slide1Title || 'Your home.<br/>Your water.<br/><em>Made better.</em>'}} /><p>Discover membrane systems and everyday essentials, all in one place.</p><Link className="store-pill" to="/products">Find your purifier <ArrowRight size={18}/></Link><span className="market-banner-note">Thoughtful design. Precision filtration.</span></div><div className="market-banner-image"><img src={config?.slide1Image || '/our-story-kitchen.png'} alt="Fresh drinking water in a bright kitchen"/><span className="market-image-label"><Droplets size={20}/> A fresh start, every day.</span></div></section><section className="market-categories" aria-label="Shop by category">{categories.map(([Icon,title,q,caption])=><Link to={`/products?q=${q}`} key={q}><span className="category-icon"><Icon size={27} strokeWidth={1.5}/></span><div><h2>{title}</h2><p>{caption}</p></div><ArrowUpRight size={17}/></Link>)}</section>
<section className="market-products" aria-labelledby="everyday-heading">
  <div className="market-section-heading"><div><span className="market-eyebrow">FIND YOUR EVERYDAY ESSENTIAL</span><h2 id="everyday-heading">Shop the collection</h2><p>Find the right fit for your space and routine.</p></div><Link to="/products">View all products <ArrowRight size={17}/></Link></div>
  {loading?<p role="status">Loading products…</p>:error?<p role="alert">Unable to load products. <Link to="/products">Try the shop</Link></p>:products.length?
    Object.entries(groupedProducts).map(([category, items]) => (
      <div key={category} className="market-category-group" style={{marginBottom: '40px'}}>
        <h3 style={{fontSize: '20px', marginBottom: '15px'}}>{category !== 'Other' ? category : 'Featured Products'}</h3>
        <div className="market-product-grid">
          {items.map((p,i)=><ShopCard key={p.id} product={p} index={i}/>)}
        </div>
      </div>
    ))
    :<p>New products are on their way.</p>}
</section><section className="market-promos"><Link to="/products?q=Replacement" className="market-promo"><div><span className="market-eyebrow">CARE THAT GOES FURTHER</span><h2>A fresh filter.<br/>A fresh start.</h2><p>Explore replacement essentials for your system.</p><span className="promo-link">Shop replacement filters <ArrowRight size={18}/></span></div><RefreshCw size={110} strokeWidth={.7}/></Link><Link to="/services" className="market-promo service"><div><span className="market-eyebrow">HERE FOR THE LONG RUN</span><h2>Good water.<br/>Great support.</h2><p>Installation, maintenance and care, made simple.</p><span className="promo-link">Explore our services <ArrowRight size={18}/></span></div><Wrench size={110} strokeWidth={.7}/></Link></section><section className="market-assurance">{[[ShieldCheck,'Thoughtfully engineered','Explore our membrane technology.','/technology'],[Headphones,'A little expert advice','We’ll help you find your fit.','/contact'],[Droplets,'Get to know Aqua Safe Water Technologies','The people behind your water.','/about']].map(([Icon,title,copy,to])=><Link key={to} to={to}><Icon size={28} strokeWidth={1.4}/><div><h3>{title}</h3><p>{copy}</p></div><ArrowUpRight size={18}/></Link>)}</section></div>}
