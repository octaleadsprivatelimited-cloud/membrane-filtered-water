import {db} from '../server/database.mjs';
import { auth, emulator } from '../server/firebase.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
if(!emulator)throw new Error('Seed is only permitted in emulator mode.');
const email='admin@aquapure.test';
let admin;
try { admin=await auth.getUserByEmail(email); } catch(e) {
 if(e.code!=='auth/user-not-found')throw e;
 try {admin=await auth.getUserByProviderUid('google.com','local-google-store-admin');}catch(providerError){
  if(providerError.code!=='auth/user-not-found')throw providerError;
  admin=await auth.createUser({email,displayName:'Store administrator',emailVerified:true});
 }
}
const googleId=admin.providerData.find(provider=>provider.providerId==='google.com')?.uid||'local-google-store-admin';
if(admin.providerData.some(provider=>provider.providerId==='password'))await auth.updateUser(admin.uid,{providersToUnlink:['password']});
// Unlinking the emulator's password provider clears the primary email; restore it afterward.
await auth.updateUser(admin.uid,{email,emailVerified:true,providerToLink:{providerId:'google.com',uid:googleId,email,displayName:'Store administrator'}});
await auth.setCustomUserClaims(admin.uid,{...admin.customClaims,admin:true});
await mkdir('.local',{recursive:true});
await writeFile('.local/admin-access.txt',`Local Firebase emulator only\nChoose Continue with Google, then select ${email} in the emulator Google chooser.\nNo password is required. This is not a live Google account.\n`,{mode:0o600});
console.log(`Local admin Google identity ready: ${email}. Existing UID and records preserved.`);
const { fetchProducts }=await import('../src/firebase/mockDb.js');
if((await db.collection('products').limit(1).get()).empty){for(const p of await fetchProducts())await db.doc(`products/${p.id}`).set({...p,description:p.features.join('. '),stock:20,status:'active',brand:'AquaPure',condition:'new',identifiersExist:true,gtin:'',mpn:'',merchantEnabled:false,demo:true,createdAt:new Date().toISOString()});}
console.log('Emulator seed ready. Existing data preserved.');

await db.close?.();
