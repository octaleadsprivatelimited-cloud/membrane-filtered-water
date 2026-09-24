import fs from 'fs';

let navbar = fs.readFileSync('src/components/Navbar.jsx', 'utf8');
navbar = navbar.replace(
  /<Droplets\/><span>Aqua Safe <span>Water Technologies<\/span><\/span>/,
  '<img src="/logo.jpg" alt="membraneIQ" style={{ height: "40px", objectFit: "contain" }} />'
);
fs.writeFileSync('src/components/Navbar.jsx', navbar);

let footer = fs.readFileSync('src/components/Footer.jsx', 'utf8');
footer = footer.replace(
  /<Droplets\/> Aqua Safe Water Technologies/,
  '<img src="/logo.jpg" alt="membraneIQ" style={{ height: "40px", objectFit: "contain", marginBottom: "8px" }} />'
);
fs.writeFileSync('src/components/Footer.jsx', footer);

console.log('Logos replaced!');
