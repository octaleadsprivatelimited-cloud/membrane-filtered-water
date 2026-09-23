import { createContext, useContext, useState } from 'react';
import { api } from '../commerce/api';
export const money = n => `₹${Number(n).toLocaleString('en-IN')}`;
export const getCatalog = () => api('/products');
const ShopContext = createContext(null);
export function ShopProvider({ children }) {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('aquapure-bag') || '[]'); } catch { return []; } });
  const update = next => { setItems(next); try { localStorage.setItem('aquapure-bag', JSON.stringify(next)); } catch {} };
  const add = product => update(items.some(i => i.id === product.id) ? items.map(i => i.id === product.id ? {...i, quantity:i.quantity+1} : i) : [...items, {...product, quantity:1}]);
  const quantity = (id, value) => update(value <= 0 ? items.filter(i => i.id !== id) : items.map(i => i.id === id ? {...i,quantity:value} : i));
  return <ShopContext.Provider value={{items, add, quantity, clear:()=>update([]), count:items.reduce((n,i)=>n+i.quantity,0)}}>{children}</ShopContext.Provider>;
}
export const useShop = () => useContext(ShopContext);
