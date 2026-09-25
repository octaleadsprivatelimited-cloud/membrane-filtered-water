// Credentials remain server-side. Normalize only known copy/paste formatting;
// never evaluate configuration text or log its contents.
export function parseServiceAccount(raw) {
  if (typeof raw !== 'string') throw new Error('Service account must be JSON text.');
  const normalized = raw.trim().replace(/^\uFEFF/, '').replace(/\\_/g, '_');
  const account = JSON.parse(normalized);
  if (!account || typeof account !== 'object' || Array.isArray(account)) throw new Error('Service account must be a JSON object.');
  for (const field of ['client_email','auth_uri','token_uri','auth_provider_x509_cert_url','client_x509_cert_url']) {
    const value=account[field];
    if(typeof value!=='string')continue;
    const link=value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if(link) {
      const target=link[2].replace(/^mailto:/,'');
      if(link[1]!==target)throw new Error('Service account contains inconsistent formatted links.');
      account[field]=target;
    }
  }
  if(typeof account.private_key==='string')account.private_key=account.private_key.replace(/\\n/g,'\n');
  return account;
}
