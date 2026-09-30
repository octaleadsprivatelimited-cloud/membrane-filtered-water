export function normalizeCart(value){
 if(!Array.isArray(value))return [];
 const seen=new Set();return value.filter(i=>i&&typeof i.id==='string'&&/^[\w-]{1,100}$/.test(i.id)&&typeof i.name==='string'&&Number.isFinite(Number(i.price))&&Number(i.price)>0&&Number.isInteger(i.quantity)&&i.quantity>0&&!seen.has(i.id)&&seen.add(i.id)).slice(0,50).map(i=>({...i,quantity:Math.min(99,i.quantity)}));
}
