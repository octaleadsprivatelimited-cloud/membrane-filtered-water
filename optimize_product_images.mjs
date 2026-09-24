import sharp from 'sharp';
import { db } from './server/firebase.mjs';

const imagePaths = {
  "Industrial Membrane": 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\eacbdf2f-855d-43fb-a8bd-669e253a07a2\\industrial_membrane_1790248703796.jpg',
  "Residential Membrane": 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\eacbdf2f-855d-43fb-a8bd-669e253a07a2\\residential_membrane_1790248724353.jpg',
  "Nano Filtration": 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\eacbdf2f-855d-43fb-a8bd-669e253a07a2\\nano_membrane_1790248765464.jpg',
  "Ultra Filtration": 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\eacbdf2f-855d-43fb-a8bd-669e253a07a2\\ultra_membrane_1790248784410.jpg'
};

async function optimizeImages() {
  const optimizedImages = {};

  for (const [category, path] of Object.entries(imagePaths)) {
    console.log(`Optimizing ${category}...`);
    const buffer = await sharp(path)
      .resize({ width: 300, withoutEnlargement: true })
      .jpeg({ quality: 60 })
      .toBuffer();
    
    optimizedImages[category] = `data:image/jpeg;base64,${buffer.toString('base64')}`;
  }

  console.log('Fetching products...');
  const snap = await db.collection('products').get();
  
  let batch = db.batch();
  let count = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    if (optimizedImages[data.category]) {
      batch.update(doc.ref, { image: optimizedImages[data.category] });
      count++;
      
      if (count === 20) {
        await batch.commit();
        batch = db.batch();
        count = 0;
      }
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log('Finished updating products with optimized images!');
}

optimizeImages().catch(console.error);
