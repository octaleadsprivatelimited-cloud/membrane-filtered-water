export function ordersCsv(orders,payments=false){
 const cell=value=>'"'+String(value??'').replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"';
 const rows=[['Order ID','Customer','Email','Amount INR','Order status','Payment status','Payment method','Transaction ID','Created at'],...orders.filter(o=>!payments||o.paymentStatus==='paid').map(o=>[o.id,o.address?.name,o.email,(o.totalPaise/100).toFixed(2),o.status,o.paymentStatus,o.paymentMethod,o.transactionId||'',o.createdAt])];
 return '\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n');
}
export function downloadOrders(orders,payments=false){const url=URL.createObjectURL(new Blob([ordersCsv(orders,payments)],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=payments?'payments.csv':'orders.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
