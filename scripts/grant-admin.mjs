import {auth} from '../server/firebase.mjs';
const email=process.argv[2];if(!email)throw new Error('Usage: npm run grant-admin -- email@example.com');
const user=await auth.getUserByEmail(email);await auth.setCustomUserClaims(user.uid,{...user.customClaims,admin:true});console.log('Administrator role assigned. Sign out and sign in again.');
