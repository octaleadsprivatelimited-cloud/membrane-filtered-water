import fs from 'fs';

let f = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

f = f.replace(/Home purifiers/, 'Industrial Membrane');
f = f.replace(/q=Master/, 'q=Industrial');

f = f.replace(/Compact systems/, 'Residential Membrane');
f = f.replace(/q=Compact/, 'q=Residential');

f = f.replace(/Commercial/, 'Nano Filtration');
f = f.replace(/q=Commercial/, 'q=Nano');

f = f.replace(/Replacement filters/, 'Ultra Filtration');
f = f.replace(/q=Replacement/, 'q=Ultra');

fs.writeFileSync('src/components/Navbar.jsx', f);
console.log('Navbar updated');
