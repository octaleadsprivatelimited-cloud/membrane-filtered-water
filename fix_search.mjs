import fs from 'fs';

let f = fs.readFileSync('src/pages/Products.jsx', 'utf8');

// Replace the specific filter logic
f = f.replace(
  /p=>p\.name\.toLowerCase\(\)\.includes\(query\.toLowerCase\(\)\)/,
  'p=>(p.name.toLowerCase().includes(query.toLowerCase()) || (p.category && p.category.toLowerCase().includes(query.toLowerCase())))'
);

fs.writeFileSync('src/pages/Products.jsx', f);
console.log('Products.jsx updated');
