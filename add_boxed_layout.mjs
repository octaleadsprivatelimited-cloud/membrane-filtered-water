import fs from 'fs';

let css = fs.readFileSync('src/commerce.css', 'utf8');

const additionalStyles = `
/* --- New Customer Boxed Layout --- */
.customer-dashboard-page {
  padding-top: 40px !important;
  background: #f4f6f8;
  min-height: calc(100vh - 100px);
}

.customer-dashboard-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

@media(max-width: 900px) {
  .customer-dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.customer-sidebar {
  background: white;
  border-radius: 12px;
  border: 1px solid #eaeaea;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.customer-profile-block {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.customer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fff3ed;
  color: #ea580c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}

.customer-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.customer-info strong {
  font-size: 15px;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.customer-info span {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.customer-nav {
  display: flex;
  flex-direction: column;
  padding: 12px 0;
}

.customer-nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 24px;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.customer-nav-item:hover {
  background: #f8fafc;
  color: #ea580c;
}

.customer-nav-item.active {
  background: #ea580c;
  color: white;
}

.customer-logout-wrap {
  border-top: 1px solid #f0f0f0;
  padding: 12px 0;
}

.customer-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.customer-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #eaeaea;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.customer-panel-header {
  margin-bottom: 28px;
}

.customer-panel-header h2 {
  font-size: 22px;
  color: #0f172a;
  margin: 0 0 6px 0;
  font-weight: 600;
}

.customer-panel-header p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}
`;

fs.writeFileSync('src/commerce.css', css + additionalStyles);
console.log('Boxed customer layout CSS appended.');
