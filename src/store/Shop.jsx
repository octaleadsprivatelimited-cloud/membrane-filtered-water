import {normalizeCart} from './cart';
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../commerce/api';
import { demoProducts } from './demoProducts';
export const money = n => `₹${Number(n).toLocaleString('en-IN')}`;
export const getCatalog = async () => {
  try {
    const data = await api('/products');
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // fallback to demo products
  }
  return demoProducts;
};
export const getProductById = async (id) => {
  try {
    const data = await api(`/products/${encodeURIComponent(id)}`);
    if (data && data.id) return data;
  } catch {
    // fallback
  }
  return demoProducts.find(p => p.id === id) || null;
};
const ShopContext = createContext(null);
export function ShopProvider({ children }) {
  const [items, setItems] = useState(() => { try { return normalizeCart(JSON.parse(localStorage.getItem('aquapure-bag') || '[]'));  } catch { return []; } });
  useEffect(()=>{try{localStorage.setItem('aquapure-bag',JSON.stringify(items));}catch{}},[items]);
  const update = next => setItems(previous=>normalizeCart(typeof next==='function'?next(previous):next));
  const add = product => {if(product.stock<=0)return;update(previous=>previous.some(i=>i.id===product.id)?previous.map(i=>i.id===product.id?{...i,quantity:Math.min(99,product.stock,i.quantity+1)}:i):[...previous,{...product,quantity:1}]);};
  const quantity = (id,value) => {if(!Number.isInteger(value))return;update(previous=>value<=0?previous.filter(i=>i.id!==id):previous.map(i=>i.id===id?{...i,quantity:Math.min(99,value)}:i));};
  return <ShopContext.Provider value={{items, add, quantity, clear:()=>update([]), count:items.reduce((n,i)=>n+i.quantity,0)}}>{children}</ShopContext.Provider>;
}
export const useShop = () => useContext(ShopContext);
