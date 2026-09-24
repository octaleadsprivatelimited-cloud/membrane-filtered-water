import fs from 'fs';

let custDash = fs.readFileSync('src/pages/CustomerDashboard.jsx', 'utf8');
custDash = custDash.replace(
  /<Droplets size=\{24\} \/>/g,
  ''
);
fs.writeFileSync('src/pages/CustomerDashboard.jsx', custDash);
console.log('Droplets removed from Customer Dashboard');
