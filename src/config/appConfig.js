// Public application settings only. Never add service-account or payment secrets.
const appConfig = {
  frontendUrl: 'https://www.membraneiq.com',
  apiBaseUrl: '/api', // Same origin in production and through the Vite proxy locally.
  currency: 'INR',
  country: 'IN',
  environment: 'production',
  firebase: {
    apiKey: 'AIzaSyAQ9WiLj0jyfC-u-zWc0qv8OdkQltUm_sU',
    projectId: 'membrane-7677f',
    authDomain: 'membrane-7677f.firebaseapp.com',
    appId: '1:980039882568:web:ab7cdc40936d977089057d',
    storageBucket: 'membrane-7677f.firebasestorage.app',
    messagingSenderId: '980039882568',
    measurementId: 'G-XRJWN4TPHR',
  },
  local: {
    hostnames: ['localhost','127.0.0.1','[::1]'],
    firebaseProjectId: 'demo-aquapure-store',
    authEmulatorUrl: 'http://127.0.0.1:9199',
    apiTarget: 'http://127.0.0.1:8787',
  },
  cashfree: {
    defaultMode: 'disabled',
    apiVersion: '2025-01-01',
    sdkUrl: 'https://sdk.cashfree.com/js/v3/cashfree.js',
    productionApi: 'https://api.cashfree.com/pg',
    sandboxApi: 'https://sandbox.cashfree.com/pg',
  },
};
export const apiUrl = path => `${appConfig.apiBaseUrl}${path.startsWith('/')?'':'/'}${path}`;
export default appConfig;
