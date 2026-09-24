import app from '../server/index.mjs';

// If firebase is in an error state (e.g. bad FIREBASE_SERVICE_ACCOUNT),
// inject a middleware to return that error instead of hitting routes.
import { db } from '../server/firebase.mjs';

export default function(req, res) {
  try {
    // Just touching db will throw if initialization failed
    db.collection('test'); 
    return app(req, res);
  } catch (e) {
    return res.status(500).json({ 
      error: "Server Initialization Error", 
      details: e.message, 
      hint: "Make sure FIREBASE_SERVICE_ACCOUNT is set in Vercel properly." 
    });
  }
}
