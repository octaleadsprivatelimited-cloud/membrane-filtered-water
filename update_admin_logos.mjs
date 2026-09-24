import fs from 'fs';

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
  /<link rel="icon" type="image\/svg\+xml" href="\/favicon.svg" \/>/,
  '<link rel="icon" type="image/jpeg" href="/logo.jpg" />'
);
indexHtml = indexHtml.replace(
  /<title>.*?<\/title>/,
  '<title>membraneIQ | Aqua Safe Water Technologies</title>\n    <meta property="og:image" content="/logo.jpg" />'
);
fs.writeFileSync('index.html', indexHtml);


// 2. Update Admin Dashboard
let adminDash = fs.readFileSync('src/pages/admin/Dashboard.jsx', 'utf8');
adminDash = adminDash.replace(
  /<Link to="\/" className="store-logo">Aqua Safe Water Technologies<\/Link>/,
  '<Link to="/" className="store-logo"><img src="/logo.jpg" alt="membraneIQ" style={{ height: "30px", objectFit: "contain" }} /></Link>'
);
fs.writeFileSync('src/pages/admin/Dashboard.jsx', adminDash);


// 3. Update Customer Dashboard
let customerDash = fs.readFileSync('src/pages/CustomerDashboard.jsx', 'utf8');
customerDash = customerDash.replace(
  /<span style={{fontWeight: 700, fontSize: '18px', letterSpacing: '-0\.5px'}}>Aqua Safe Water Technologies<\/span>/,
  '<img src="/logo.jpg" alt="membraneIQ" style={{ height: "30px", objectFit: "contain" }} />'
);
fs.writeFileSync('src/pages/CustomerDashboard.jsx', customerDash);

console.log('Admin panels and index.html updated');
