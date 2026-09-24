import fs from 'fs';

let css = fs.readFileSync('src/commerce.css', 'utf8');

// Append new styles to override the previous ones
const newStyles = `
/* --- Compact Auth UI --- */
.commerce-auth {
  max-width: 380px !important;
  margin: 60px auto 60px !important;
  padding: 32px 28px !important;
}

.commerce-auth h1 {
  font-size: 26px !important;
  margin-bottom: 8px !important;
}

.commerce-auth > p {
  margin-bottom: 24px !important;
}

.auth-social {
  margin-bottom: 16px !important;
}

.google-btn {
  padding: 10px !important;
  font-size: 14px !important;
}

.commerce-auth .commerce-form {
  gap: 12px !important;
}

.commerce-auth .commerce-form input {
  padding: 10px 14px !important;
}

.commerce-auth .store-pill {
  padding: 12px !important;
  font-size: 14px !important;
  margin-top: 4px !important;
}

.commerce-auth .commerce-inline {
  margin-top: 20px !important;
  padding-top: 16px !important;
}
`;

fs.writeFileSync('src/commerce.css', css + newStyles);
console.log('Compact styles appended successfully.');
