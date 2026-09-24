import fs from 'fs';

let css = fs.readFileSync('src/commerce.css', 'utf8');

// Append new styles to override the old ones
const newStyles = `
/* --- Enhanced Auth UI --- */
.commerce-auth {
  max-width: 440px !important;
  min-height: auto !important;
  margin: 120px auto 100px !important;
  padding: 48px 40px !important;
  border: 1px solid #f0f0f0 !important;
  border-radius: 24px !important;
  background: white !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  text-align: center;
}

.commerce-auth h1 {
  font-size: 32px !important;
  font-weight: 600 !important;
  margin-bottom: 12px !important;
  color: #111 !important;
  letter-spacing: -0.5px !important;
}

.commerce-auth > p {
  font-size: 14px !important;
  color: #666 !important;
  margin-bottom: 32px !important;
}

.commerce-auth .shop-kicker {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #0056d6;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 16px;
  text-decoration: none;
}

.commerce-auth .commerce-form {
  text-align: left;
  gap: 16px !important;
}

.commerce-auth .commerce-form label {
  font-size: 13px !important;
  color: #333 !important;
}

.commerce-auth .commerce-form input {
  padding: 14px 16px !important;
  border-radius: 12px !important;
  border: 1px solid #e5e5e5 !important;
  background: #fafafa !important;
  transition: all 0.2s ease !important;
}

.commerce-auth .commerce-form input:focus {
  border-color: #0056d6 !important;
  background: white !important;
  box-shadow: 0 0 0 4px rgba(0, 86, 214, 0.1) !important;
  outline: none !important;
}

.commerce-auth .store-pill {
  width: 100% !important;
  padding: 16px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  background: #111 !important;
  color: white !important;
  margin-top: 8px !important;
  border: none !important;
  cursor: pointer !important;
  transition: background 0.2s !important;
  align-self: stretch !important;
}

.commerce-auth .store-pill:hover {
  background: #333 !important;
}

.commerce-auth .commerce-inline {
  justify-content: center !important;
  margin-top: 30px !important;
  border-top: 1px solid #f0f0f0 !important;
  padding-top: 24px !important;
}

.commerce-auth .commerce-inline button {
  border: none !important;
  background: none !important;
  color: #666 !important;
  font-weight: 500 !important;
  padding: 8px 12px !important;
}

.commerce-auth .commerce-inline button:hover {
  color: #111 !important;
  background: #f5f5f5 !important;
  border-radius: 8px !important;
}
`;

fs.writeFileSync('src/commerce.css', css + newStyles);
console.log('Styles appended successfully.');
