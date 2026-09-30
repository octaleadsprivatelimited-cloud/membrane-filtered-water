import {auth,emulator} from '../../server/firebase.mjs';

export async function emulatorSignIn(method,body){
 if(!emulator)throw new Error('Authentication test helpers require the local emulator.');
 const response=await fetch(`http://127.0.0.1:9199/identitytoolkit.googleapis.com/v1/accounts:${method}?key=demo-key`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,returnSecureToken:true})});
 const result=await response.json();
 if(!response.ok||!result.idToken)throw new Error(`Emulator sign-in failed: ${result.error?.message||response.status}`);
 return result.idToken;
}

export async function googleToken(user){
 if(!emulator)throw new Error('Google test credentials require the local emulator.');
 const googleId=`test-google-${user.uid}`;
 await auth.updateUser(user.uid,{providerToLink:{providerId:'google.com',uid:googleId,email:user.email,displayName:user.displayName||'Test customer'}});
 // The Auth emulator accepts a literal JSON Google ID token; this is never sent to Google.
 // https://firebase.google.com/docs/emulator-suite/connect_auth#non-interactive_testing_3
 return emulatorSignIn('signInWithIdp',{requestUri:'http://localhost',postBody:new URLSearchParams({providerId:'google.com',id_token:JSON.stringify({sub:googleId,email:user.email,email_verified:true,name:user.displayName||'Test customer'})}).toString()});
}
