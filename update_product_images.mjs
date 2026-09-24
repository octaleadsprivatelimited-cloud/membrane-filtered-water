import { readFileSync } from 'fs';
import { db } from './server/firebase.mjs';

const images = {
  "Industrial Membrane": `data:image/jpeg;base64,${readFileSync('C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\eacbdf2f-855d-43fb-a8bd-669e253a07a2\\industrial_membrane_1790248703796.jpg', 'base64')}`,
  "Residential Membrane": `data:image/jpeg;base64,${readFileSync('C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\eacbdf2f-855d-43fb-a8bd-669e253a07a2\\residential_membrane_1790248724353.jpg', 'base64')}`,
  "Nano Filtration": `data:image/jpeg;base64,${readFileSync('C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\eacbdf2f-855d-43fb-a8bd-669e253a07a2\\nano_membrane_1790248765464.jpg', 'base64')}`,
  "Ultra Filtration": `data:image/jpeg;base64,${readFileSync('C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\eacbdf2f-855d-43fb-a8bd-669e253a07a2\\ultra_membrane_1790248784410.jpg', 'base64')}`
};

async function updateImages() {
  console.log('Fetching products...');
  const snap = await db.collection('products').get();
  
  let batch = db.batch();
  let count = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    if (images[data.category]) {
      batch.update(doc.ref, { image: images[data.category] });
      count++;
      
      if (count === 10) {
        await batch.commit();
        batch = db.batch();
        count = 0;
      }
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log('Finished updating images!');
}

updateImages().catch(console.error);
