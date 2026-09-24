import fs from 'fs';

let adminDash = fs.readFileSync('src/pages/admin/Dashboard.jsx', 'utf8');
adminDash = adminDash.replace(
  /<div className="store-logo-icon"><Leaf size=\{20\} \/><\/div>/g,
  ''
);
fs.writeFileSync('src/pages/admin/Dashboard.jsx', adminDash);
console.log('Leaf removed from Admin Dashboard');
