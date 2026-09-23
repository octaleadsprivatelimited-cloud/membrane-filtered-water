import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { money, useShop } from '../store/Shop';
import { useState } from 'react';
export default function ShopCard({product, index=0}) {
 const {add}=useShop(); const reduced=useReducedMotion(); const [added,setAdded]=useState(false);
 return <motion.article className={`shop-card tone-${index%4}`} whileHover={reduced?{}:{y:-6}} transition={{type:'spring',stiffness:250,damping:22}}>
 <Link className="shop-card-image" to={`/product/${product.id}`}><span className="shop-discount">{product.discount}</span><img src={product.image} alt={product.name} loading="lazy"/><span className="shop-view"><ArrowUpRight size={20}/></span></Link>
 <div className="shop-card-body"><span className="shop-kicker">MEMBRANE COLLECTION</span><Link to={`/product/${product.id}`}><h3>{product.name.replace('AquaPure ', '')}</h3></Link><p>{product.features?.[0]}</p><div className="shop-price"><div><strong>{money(product.price)}</strong> <del>{money(product.originalPrice)}</del></div><button disabled={product.stock===0} aria-label={`Add ${product.name} to bag`} onClick={()=>{add(product);setAdded(true);}}><Plus size={18}/></button></div><span className="shop-added" role="status">{product.stock===0?'Out of stock':added?'Added to your bag':''}</span></div></motion.article>;
}
