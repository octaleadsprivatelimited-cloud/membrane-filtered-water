import fs from 'fs';

// 1. Fix CustomerDashboard.jsx by wrapping sidebar buttons in <nav>
let dashboard = fs.readFileSync('src/pages/CustomerDashboard.jsx', 'utf8');
dashboard = dashboard.replace(
  /\{menuItems\.map[^{]*?\{name,icon:Icon,tab:t\}\)=>\s*<button.*?<\/button>\s*\)\}/s,
  `<nav>
          {menuItems.map(({name,icon:Icon,tab:t})=>
            <button key={name} aria-pressed={tab===t} onClick={()=>{setTab(t);setNotice('');setError('');}}>
              <Icon size={18} /> {name}
            </button>
          )}
          <button className="admin-logout-btn" onClick={async()=>{await logout();navigate('/login');}} style={{marginTop: 'auto'}}>
            <LogOut size={16}/> Logout
          </button>
        </nav>`
);
// Remove the original logout button that is now inside the nav
dashboard = dashboard.replace(
  /<button className="admin-logout-btn".*?Logout\s*<\/button>/s,
  ''
);
fs.writeFileSync('src/pages/CustomerDashboard.jsx', dashboard);


// 2. Fix CSS layout issues in commerce.css
let css = fs.readFileSync('src/commerce.css', 'utf8');

const layoutFix = `
/* --- Admin & Customer Dashboard Layout Fixes --- */
.admin-main {
  padding: 32px 40px;
  max-width: 1200px;
  box-sizing: border-box;
}

.admin-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--admin-card-border, #e2e8f0);
  padding-bottom: 24px;
}

.admin-topbar h1 {
  font-size: 28px !important;
  color: #0f172a;
  margin: 0 0 8px 0 !important;
  font-weight: 600 !important;
}

.admin-topbar p {
  color: #64748b;
  margin: 0;
}

.admin-content {
  background: white;
  border: 1px solid var(--admin-card-border, #e2e8f0);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.admin-sidebar nav button[aria-pressed=true] {
  background: var(--admin-primary, #ea580c);
  color: white !important;
}

.admin-sidebar nav button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--admin-sidebar-text, #94a3b8);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
}
`;

fs.writeFileSync('src/commerce.css', css + layoutFix);
console.log('Customer Dashboard layout fixed.');
