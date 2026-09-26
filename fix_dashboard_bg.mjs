import fs from 'fs';

let jsx = fs.readFileSync('src/pages/CustomerDashboard.jsx', 'utf8');

jsx = jsx.replace(
  /<div className="commerce-page customer-dashboard-page">/g,
  `<div className="customer-dashboard-wrapper" style={{ background: '#f8fafc', minHeight: '100vh', width: '100%', paddingTop: '130px', paddingBottom: '60px' }}>
      <div className="commerce-page customer-dashboard-page" style={{ paddingTop: '0 !important', background: 'transparent', minHeight: 'auto', margin: '0 auto' }}>`
);

// We need to add the closing div for the wrapper before the final closing tag.
// It's right before `);` at the end of the return statement.
jsx = jsx.replace(
  /<\/div>\s*\);\s*\}\s*$/s,
  `    </div>
    </div>
  );
}
`
);

fs.writeFileSync('src/pages/CustomerDashboard.jsx', jsx);

// Now fix CSS
let css = fs.readFileSync('src/commerce.css', 'utf8');
css = css.replace('padding-top: 130px !important;', 'padding-top: 0 !important;');
css = css.replace('background: #f4f6f8;', 'background: transparent;');
fs.writeFileSync('src/commerce.css', css);

console.log("Layout wrapper added");
