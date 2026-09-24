import fs from 'fs';

let css = fs.readFileSync('src/commerce.css', 'utf8');

const additionalStyles = `
/* --- Social Login Additions --- */
.auth-social {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 14px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}

.google-btn:hover {
  background: #f8f9fa;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #999;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #eaeaea;
}

.auth-divider span {
  padding: 0 12px;
}
`;

fs.writeFileSync('src/commerce.css', css + additionalStyles);
console.log('Google Auth styles added');
