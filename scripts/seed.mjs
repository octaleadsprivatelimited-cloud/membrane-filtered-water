import { auth, db, emulator } from '../server/firebase.mjs';
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
if(!emulator)throw new Error('Seed is only permitted in emulator mode.');
const email='admin@aquapure.test';
try { await auth.getUserByEmail(email); } catch(e) {
 if(e.code!=='auth/user-not-found')throw e;
 const password=randomBytes(18).toString('base64url');const user=await auth.createUser({email,password,displayName:'Store administrator',emailVerified:true});await auth.setCustomUserClaims(user.uid,{admin:true});await mkdir('.local',{recursive:true});await writeFile('.local/admin-access.txt',`Local Firebase emulator only\nEmail: ${email}\nPassword: ${password}\n`,{mode:0o600});console.log('Local admin credentials saved in .local/admin-access.txt');
}
const { fetchProducts }=await import('../src/firebase/mockDb.js');
if((await db.collection('products').limit(1).get()).empty){for(const p of await fetchProducts())await db.doc(`products/${p.id}`).set({...p,description:p.features.join('. '),stock:20,status:'active',brand:'AquaPure',condition:'new',identifiersExist:true,gtin:'',mpn:'',merchantEnabled:false,demo:true,createdAt:new Date().toISOString()});}
console.log('Emulator seed ready. Existing data preserved.');
