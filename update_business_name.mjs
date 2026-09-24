import { db } from './server/firebase.mjs';

async function updateBusinessName() {
  await db.collection('config').doc('store').set({
    businessName: 'Aqua Safe Water Technologies'
  }, { merge: true });
  console.log('Business name updated in DB');
}

updateBusinessName().catch(console.error);
