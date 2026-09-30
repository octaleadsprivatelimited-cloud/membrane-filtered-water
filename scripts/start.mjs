import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
process.env.NODE_ENV='production';
const {default:app}=await import('../server/index.mjs');
const {assertFirebaseReady,emulator}=await import('../server/firebase.mjs');
const {db,assertDatabaseReady}=await import('../server/database.mjs');
if(emulator)throw new Error('Production startup cannot use STORE_MODE=emulator. Set STORE_MODE=live and provide authentication credentials.');
if(!existsSync(fileURLToPath(new URL('../dist/index.html',import.meta.url))))throw new Error('Build the website with npm run build before starting production.');
const port=Number(process.env.PORT||8787);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT must be a valid TCP port.');
assertFirebaseReady();await assertDatabaseReady();
const server=app.listen(port,'0.0.0.0',()=>console.log(`Store production server ready on port ${port}`));
let stopping=false;
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{
 if(stopping)return;stopping=true;
 const timeout=setTimeout(()=>process.exit(1),10000);timeout.unref();
 server.close(async()=>{await db.close?.();clearTimeout(timeout);process.exit(0);});
});
