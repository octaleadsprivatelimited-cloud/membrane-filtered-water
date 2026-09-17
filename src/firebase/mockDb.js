// Mock Database to simulate Firebase Firestore delay and structure

let mockData = {
  products: [
    { 
      id: '1', 
      name: "AquaPure Master Membrane System", 
      rating: 4.9, 
      reviews: 1248, 
      features: ["0.0001 Micron Precision", "High Flow Rate", "100% Water Purity"], 
      price: 24999, 
      originalPrice: 28999, 
      discount: "14% OFF", 
      image: "/membrane-tech.jpg" 
    },
    { 
      id: '2', 
      name: "AquaPure Compact Membrane System", 
      rating: 4.8, 
      reviews: 956, 
      features: ["Space-Saving Design", "Easy Installation", "Smart Alert System"], 
      price: 18999, 
      originalPrice: 21999, 
      discount: "13% OFF", 
      image: "/membrane-pure-water.jpg" 
    },
    { 
      id: '3', 
      name: "AquaPure Commercial Membrane Unit", 
      rating: 4.7, 
      reviews: 432, 
      features: ["Heavy Duty Output", "Dual Membrane Tech", "Low Maintenance"], 
      price: 45999, 
      originalPrice: 52999, 
      discount: "13% OFF", 
      image: "/membrane-tech.jpg" 
    },
    { 
      id: '4', 
      name: "AquaPure Genuine Replacement Core", 
      rating: 4.9, 
      reviews: 2105, 
      features: ["Original Spares", "DIY Replacement", "Extended Lifespan"], 
      price: 4999, 
      originalPrice: 5999, 
      discount: "16% OFF", 
      image: "/membrane-pure-water.jpg" 
    }
  ],
  services: [
    { id: 's1', title: "Standard Install", price: "₹999", img: "/membrane-tech.jpg", desc: "Expert membrane system setup." },
    { id: 's2', title: "Annual AMC", price: "₹2,499", img: "/membrane-pure-water.jpg", desc: "Full year membrane care." },
    { id: 's3', title: "Membrane Swap", price: "₹1,899", img: "/membrane-tech.jpg", desc: "Replace old membrane core." },
    { id: 's4', title: "Flow Tuning", price: "₹499", img: "/membrane-pure-water.jpg", desc: "Optimize water pressure." },
  ],
  pages: {
    home: {
      heroTitle: "The Pinnacle of Membrane Filtration",
      heroSubtitle: "Advanced residential and commercial water purification systems engineered for absolute purity, relying exclusively on state-of-the-art membrane technology.",
      heroImage: "/membrane-pure-water.jpg"
    },
    about: {
      title: "Our Membrane Expertise",
      content: "For over a decade, AquaPure has been at the forefront of membrane filtration technology. We don't rely on chemical additives or gimmicks. Our sole focus is developing the most advanced semi-permeable membranes capable of removing impurities at a microscopic level, ensuring your family or business receives nothing but the purest water.",
      image: "/membrane-tech.jpg"
    },
    technology: {
      title: "How Our Membranes Work",
      content: "Our proprietary membrane cores utilize a 0.0001-micron porous structure. Water is forced through this semi-permeable barrier under pressure. While water molecules pass through freely, dissolved solids, heavy metals, and microscopic contaminants are rejected and flushed away.",
      image: "/membrane-tech.jpg"
    },
    contact: {
      title: "Contact Directory",
      subtitle: "Connect with our membrane filtration specialists. Select the appropriate department below to ensure a prompt and accurate response to your inquiry.",
      email: "support@aquapure-membrane.com",
      phone: "+1 (800) AQUA-PURE"
    }
  }
};

// Simulate network delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchPageContent = async (pageId) => {
  await delay(500);
  return mockData.pages[pageId] || null;
};

export const updatePageContent = async (pageId, updates) => {
  await delay();
  if (mockData.pages[pageId]) {
    mockData.pages[pageId] = { ...mockData.pages[pageId], ...updates };
  }
};

/**
 * Mocks uploading an image to Firebase Storage.
 * @param {File} file - The file to upload.
 * @returns {Promise<string>} - A promise that resolves with a simulated URL.
 */
export const uploadImageToStorage = async (file) => {
  await delay(1200); // Simulate upload time
  // In a real app, this would be a Firebase Storage URL (e.g., https://firebasestorage.googleapis.com/v0/b/...)
  // For the mock, we create a local object URL so it immediately works in the UI.
  return URL.createObjectURL(file);
};

export const fetchProducts = async () => {
  await delay();
  return [...mockData.products];
};

export const fetchServices = async () => {
  await delay();
  return [...mockData.services];
};

export const addProduct = async (product) => {
  await delay();
  const newProduct = { ...product, id: Date.now().toString() };
  mockData.products.push(newProduct);
  return newProduct;
};

export const updateProduct = async (id, updates) => {
  await delay();
  const index = mockData.products.findIndex(p => p.id === id);
  if (index !== -1) {
    mockData.products[index] = { ...mockData.products[index], ...updates };
  }
};

export const deleteProduct = async (id) => {
  await delay();
  mockData.products = mockData.products.filter(p => p.id !== id);
};

export const addService = async (service) => {
  await delay();
  const newService = { ...service, id: Date.now().toString() };
  mockData.services.push(newService);
  return newService;
};

export const deleteService = async (id) => {
  await delay();
  mockData.services = mockData.services.filter(s => s.id !== id);
};
