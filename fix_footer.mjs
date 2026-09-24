import fs from 'fs';

let f = fs.readFileSync('src/components/Footer.jsx', 'utf8');

f = f.replace(/Designed for everyday living\./, 'Developed by <a href="https://octaleads.com" target="_blank" rel="noreferrer" style={{textDecoration: "underline", color: "inherit"}}>Octaleads</a>');
f = f.replace(/Home purifiers/g, 'Industrial Membrane');
f = f.replace(/q=Master/g, 'q=Industrial');
f = f.replace(/Compact systems/g, 'Residential Membrane');
f = f.replace(/q=Compact/g, 'q=Residential');
f = f.replace(/Replacement filters/g, 'Nano Filtration');
f = f.replace(/q=Replacement/g, 'q=Nano');

fs.writeFileSync('src/components/Footer.jsx', f);
console.log('Footer updated');
