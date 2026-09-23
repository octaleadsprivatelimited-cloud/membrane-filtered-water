export const xmlEscape = value => String(value ?? '').replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
export function publicHttps(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && u.hostname.includes('.') && !/(localhost|\.local$|\.example$|\.test$|^127\.|^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.)/i.test(u.hostname); } catch { return false; }
}
export function merchantIssues(p, settings) {
  const issues=[];
  if (!publicHttps(settings.siteUrl)) issues.push('Set a public HTTPS store URL');
  if (!p.name?.trim()) issues.push('Title missing');
  if (!p.description?.trim()) issues.push('Description missing');
  if (!Number.isFinite(p.price) || p.price <= 0) issues.push('Positive price required');
  if (!publicHttps(p.image)) issues.push('Public HTTPS product photo required');
  if (!p.brand) issues.push('Brand missing');
  if (p.identifiersExist !== false && !p.gtin && !p.mpn) issues.push('GTIN or manufacturer part number required');
  if (p.gtin && !validGtin(p.gtin)) issues.push('GTIN checksum or length invalid');
  if (p.demo) issues.push('Demo products are excluded');
  if (p.status !== 'active') issues.push('Product is not published');
  if (!p.merchantEnabled) issues.push('Google listing not enabled');
  return issues;
}
export function validGtin(s) { if (!/^([0-9]{8}|[0-9]{12,14})$/.test(s)) return false; const a=[...s].map(Number); const check=a.pop(); return (10-a.reverse().reduce((n,x,i)=>n+x*(i%2?1:3),0)%10)%10===check; }
export function merchantFeed(products,settings) {
 const root=settings.siteUrl.replace(/\/$/,'');
 const field=(k,v)=>`<g:${k}>${xmlEscape(v)}</g:${k}>`;
 return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>AquaPure products</title><link>${xmlEscape(root)}</link><description>Store product feed</description>${products.filter(p=>!merchantIssues(p,settings).length).map(p=>`<item>${field('id',p.id)}${field('title',p.name)}${field('description',p.description)}${field('link',`${root}/product/${encodeURIComponent(p.id)}`)}${field('image_link',p.image)}${field('availability',p.stock>0?'in_stock':'out_of_stock')}${field('price',`${p.price.toFixed(2)} INR`)}${field('condition',p.condition||'new')}${field('brand',p.brand)}${p.gtin?field('gtin',p.gtin):''}${p.mpn?field('mpn',p.mpn):''}${p.identifiersExist===false?field('identifier_exists','no'):''}</item>`).join('')}</channel></rss>`;
}
