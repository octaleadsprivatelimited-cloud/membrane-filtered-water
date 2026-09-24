import { db } from './server/firebase.mjs';

const categories = ["Industrial Membrane", "Residential Membrane", "Nano Filtration", "Ultra Filtration"];

const products = [
  // Industrial Brackish Water
  { name: "BW-8040 Brackish Water RO Membrane", sku: "BW-8040", category: "Industrial Membrane", price: 15000, description: "Industrial Brackish Water RO Membrane Series", features: ["Rejection: 99%", "Flow: 10000 GPD"] },
  { name: "BW-4040 Brackish Water RO Membrane", sku: "BW-4040", category: "Industrial Membrane", price: 8000, description: "Industrial Brackish Water RO Membrane Series", features: ["Rejection: 99%", "Flow: 2500 GPD"] },
  { name: "BW-4021 Brackish Water RO Membrane", sku: "BW-4021", category: "Industrial Membrane", price: 5000, description: "Industrial Brackish Water RO Membrane Series", features: ["Rejection: 99%", "Flow: 1000 GPD"] },

  // Industrial Low Pressure
  { name: "LP-8040 Low Pressure RO Membrane", sku: "LP-8040", category: "Industrial Membrane", price: 16000, description: "Industrial Low Pressure RO Membrane Series", features: ["Rejection: 98%", "Flow: 10000 GPD"] },
  { name: "LP-4040 Low Pressure RO Membrane", sku: "LP-4040", category: "Industrial Membrane", price: 8500, description: "Industrial Low Pressure RO Membrane Series", features: ["Rejection: 98%", "Flow: 2500 GPD"] },
  { name: "LP-4021 Low Pressure RO Membrane", sku: "LP-4021", category: "Industrial Membrane", price: 5500, description: "Industrial Low Pressure RO Membrane Series", features: ["Rejection: 98%", "Flow: 1000 GPD"] },

  // Ultra Low Pressure
  { name: "ULP-8040 Ultra Low Pressure RO Membrane", sku: "ULP-8040", category: "Industrial Membrane", price: 16500, description: "Ultra Low Pressure RO Membrane Series", features: ["Rejection: 98%", "Flow: 10000 GPD"] },
  { name: "ULP-4040 Ultra Low Pressure RO Membrane", sku: "ULP-4040", category: "Industrial Membrane", price: 8800, description: "Ultra Low Pressure RO Membrane Series", features: ["Rejection: 98%", "Flow: 2500 GPD"] },
  { name: "ULP-4021 Ultra Low Pressure RO Membrane", sku: "ULP-4021", category: "Industrial Membrane", price: 5800, description: "Ultra Low Pressure RO Membrane Series", features: ["Rejection: 98%", "Flow: 1000 GPD"] },

  // Sea Water
  { name: "SW-8040 Sea Water RO Membrane", sku: "SW-8040", category: "Industrial Membrane", price: 25000, description: "Sea Water RO Membrane Series", features: ["Rejection: 99.7%", "Flow: 5000 GPD"] },
  { name: "SW-4040 Sea Water RO Membrane", sku: "SW-4040", category: "Industrial Membrane", price: 12000, description: "Sea Water RO Membrane Series", features: ["Rejection: 99.7%", "Flow: 1400 GPD"] },
  { name: "SW-4021 Sea Water RO Membrane", sku: "SW-4021", category: "Industrial Membrane", price: 7000, description: "Sea Water RO Membrane Series", features: ["Rejection: 99.7%", "Flow: 500 GPD"] },

  // Residential
  { name: "RO-1812-75 Residential Membrane", sku: "RO-1812-75", category: "Residential Membrane", price: 800, description: "Residential Reverse Osmosis Membrane", features: ["Rejection: 97%", "Flow: 75 GPD"] },
  { name: "RO-1812-80 Residential Membrane", sku: "RO-1812-80", category: "Residential Membrane", price: 850, description: "Residential Reverse Osmosis Membrane", features: ["Rejection: 97%", "Flow: 80 GPD"] },
  { name: "RO-2012-100 Residential Membrane", sku: "RO-2012-100", category: "Residential Membrane", price: 950, description: "Residential Reverse Osmosis Membrane", features: ["Rejection: 97%", "Flow: 100 GPD"] },
  { name: "RO-3012-150 Residential Membrane", sku: "RO-3012-150", category: "Residential Membrane", price: 1200, description: "Residential Reverse Osmosis Membrane", features: ["Rejection: 98%", "Flow: 150 GPD"] },
  { name: "RO-3012-300 Residential Membrane", sku: "RO-3012-300", category: "Residential Membrane", price: 2000, description: "Residential Reverse Osmosis Membrane", features: ["Rejection: 97%", "Flow: 300 GPD"] },

  // Nano Filtration
  { name: "NF-20-2012-100 Nano Filtration Element", sku: "NF-20-2012-100", category: "Nano Filtration", price: 1100, description: "Residential Nano Filtration", features: ["Rejection: 20-30%", "Flow: 150 GPD"] },
  { name: "NF-40-2012-100 Nano Filtration Element", sku: "NF-40-2012-100", category: "Nano Filtration", price: 1200, description: "Residential Nano Filtration", features: ["Rejection: 40-50%", "Flow: 150 GPD"] },
  { name: "NF-60-2012-100 Nano Filtration Element", sku: "NF-60-2012-100", category: "Nano Filtration", price: 1300, description: "Residential Nano Filtration", features: ["Rejection: 60-70%", "Flow: 150 GPD"] },
  { name: "NF-80-2012-100 Nano Filtration Element", sku: "NF-80-2012-100", category: "Nano Filtration", price: 1400, description: "Residential Nano Filtration", features: ["Rejection: 80-85%", "Flow: 150 GPD"] },

  { name: "NF70-8040 Nano Filtration", sku: "NF70-8040", category: "Nano Filtration", price: 15000, description: "Industrial Nano Filtration", features: ["Flow: 10000 GPD"] },
  { name: "NF70-4040 Nano Filtration", sku: "NF70-4040", category: "Nano Filtration", price: 8000, description: "Industrial Nano Filtration", features: ["Flow: 2500 GPD"] },
  { name: "NF70-4021 Nano Filtration", sku: "NF70-4021", category: "Nano Filtration", price: 5000, description: "Industrial Nano Filtration", features: ["Flow: 1000 GPD"] },
  { name: "NF90-8040 Nano Filtration", sku: "NF90-8040", category: "Nano Filtration", price: 15500, description: "Industrial Nano Filtration", features: ["Flow: 8500 GPD"] },
  { name: "NF90-4040 Nano Filtration", sku: "NF90-4040", category: "Nano Filtration", price: 8200, description: "Industrial Nano Filtration", features: ["Flow: 2000 GPD"] },
  { name: "NF90-4021 Nano Filtration", sku: "NF90-4021", category: "Nano Filtration", price: 5200, description: "Industrial Nano Filtration", features: ["Flow: 800 GPD"] },

  // Ultra Filtration
  { name: "UFPE10 Ultra Filtration", sku: "UFPE10", category: "Ultra Filtration", price: 4000, description: "MWCO: 10,000 Da", features: ["Industrial water purification"] },
  { name: "UFPE20 Ultra Filtration", sku: "UFPE20", category: "Ultra Filtration", price: 4200, description: "MWCO: 20,000 Da", features: ["Industrial water purification"] },
  { name: "UFPE30 Ultra Filtration", sku: "UFPE30", category: "Ultra Filtration", price: 4400, description: "MWCO: 30,000 Da", features: ["Industrial water purification"] },
  { name: "UFPE50 Ultra Filtration", sku: "UFPE50", category: "Ultra Filtration", price: 4600, description: "MWCO: 50,000 Da", features: ["Industrial water purification"] },
  { name: "UFPE75 Ultra Filtration", sku: "UFPE75", category: "Ultra Filtration", price: 4800, description: "MWCO: 75,000 Da", features: ["Industrial water purification"] },
  { name: "UFPE100 Ultra Filtration", sku: "UFPE100", category: "Ultra Filtration", price: 5000, description: "MWCO: 1,00,000 Da", features: ["Industrial water purification"] },
];

async function run() {
  console.log("Updating store categories...");
  await db.doc('settings/store').set({ categories: categories }, { merge: true });

  console.log("Injecting catalog...");
  const batch = db.batch();
  for(const p of products) {
    const ref = db.collection('products').doc();
    batch.set(ref, {
      id: ref.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      originalPrice: p.price,
      stock: 100,
      description: p.description,
      features: p.features,
      status: 'active',
      condition: 'new',
      identifiersExist: true,
      merchantEnabled: true,
      demo: false,
      images: [],
      image: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  await batch.commit();
  console.log("Done!");
  process.exit(0);
}
run();
