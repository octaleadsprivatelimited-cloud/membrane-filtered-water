export function totals(items,address={},settings={}){
 const subtotalPaise=items.reduce((n,i)=>n+Math.round(Number(i.price)*100)*i.quantity,0);
 const gstPaise=items.reduce((n,i)=>n+Math.round(Number(i.price)*i.quantity*(Number(i.gst)||0)),0);
 const pin=String(address.pincode||''),city=String(address.city||'').toLowerCase();
 const local=city.includes('vizag')||city.includes('visakha')||pin.startsWith('530')||pin.startsWith('531');
 const zone=pin.slice(0,2);let km=1500;
 for(const [prefixes,distance] of [[['51','52','53'],300],[['50'],600],[['75','76','77'],400],[['60','61','62','63','64'],800],[['56','57','58','59'],1000],[['40','41','42','43','44'],1200]])if(prefixes.includes(zone))km=distance;
 let shippingPaise=local?0:Math.round(km*Number(settings.shippingFee??2)*100);
 if(settings.freeShippingAbove>0&&subtotalPaise>=settings.freeShippingAbove*100)shippingPaise=0;
 return {subtotalPaise,gstPaise,shippingPaise,totalPaise:subtotalPaise+gstPaise+shippingPaise};
}
