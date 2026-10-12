import {useState} from 'react';
import {Link,NavLink,useNavigate} from 'react-router-dom';
import {ShoppingBag,Search,UserRound,Menu,X} from 'lucide-react';
import {useShop} from '../store/Shop';

export default function Navbar(){
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('');
  const [open,setOpen]=useState(false);
  const navigate=useNavigate();
  const {count}=useShop();

  const handleSearch = (e) => {
    e.preventDefault();
    const parts = [];
    if (category) parts.push(category);
    if (query.trim()) parts.push(query.trim());
    const searchQuery = parts.join(' ').trim();
    navigate(`/products${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
    setOpen(false);
  };

  return (
    <header className="smart-header">
      <div className="smart-navigation">
        <Link to="/" className="smart-logo" onClick={()=>setOpen(false)}>
          <img src="/logo.jpg" alt="membraneIQ"/>
        </Link>
        <nav className={open?'smart-links is-open':'smart-links'} aria-label="Main navigation">
          {[['/','Home'],['/products','Water systems'],['/technology','Technology'],['/services','Services'],['/about','About us']].map(([to,label])=>(
            <NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)}>{label}</NavLink>
          ))}
          <Link className="smart-enquire" to="/contact" onClick={()=>setOpen(false)}>Enquire now</Link>
        </nav>
        <div className="smart-nav-actions">
          <Link to="/account" aria-label="Your account"><UserRound size={20}/><span>Account</span></Link>
          <Link to="/bag" aria-label={`Shopping cart, ${count} items`}><ShoppingBag size={20}/><b>{count}</b></Link>
          <button className="smart-menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)}>
            {open?<X/>:<Menu/>}
          </button>
        </div>
      </div>

      <div className="smart-search-row">
        {/* Categories on the side of the search bar */}
        <div className="smart-search-categories" aria-label="Product categories">
          <Link to="/products" onClick={()=>setOpen(false)}>All Systems</Link>
          <Link to="/products?q=Home" onClick={()=>setOpen(false)}>Home Purifiers</Link>
          <Link to="/products?q=Under+Sink" onClick={()=>setOpen(false)}>Under Sink</Link>
          <Link to="/products?q=Commercial" onClick={()=>setOpen(false)}>Commercial</Link>
          <Link to="/products?q=Filter" onClick={()=>setOpen(false)}>Spare Filters</Link>
        </div>

        {/* Search bar moved to the right side */}
        <div className="smart-search-right">
          <form onSubmit={handleSearch} className="smart-search-form">
            <select
              aria-label="Filter by category"
              value={category}
              onChange={e=>setCategory(e.target.value)}
              className="smart-search-category-select"
            >
              <option value="">All Categories</option>
              <option value="Home">Home</option>
              <option value="Under Sink">Under Sink</option>
              <option value="Commercial">Commercial</option>
              <option value="Filter">Filters</option>
            </select>
            <input
              aria-label="Search the store"
              placeholder="Search systems, filters, spares…"
              value={query}
              onChange={e=>setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search"><Search size={16}/></button>
          </form>
          <Link to="/services" className="smart-search-service-link" onClick={()=>setOpen(false)}>
            Aftercare <span>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

