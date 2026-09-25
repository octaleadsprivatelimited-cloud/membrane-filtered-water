import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
for (const [name,account,code] of [
 ['missing credentials','','FIREBASE_SERVICE_ACCOUNT_MISSING'],
 ['malformed credentials','not-json','FIREBASE_SERVICE_ACCOUNT_JSON'],
 ['missing credential fields','{}','FIREBASE_CREDENTIAL_FIELDS'],
 ['wrong project',JSON.stringify({project_id:'another-project',client_email:'test@example.com',private_key:'invalid'}),'FIREBASE_PROJECT_MISMATCH'],
 ['invalid private key',JSON.stringify({project_id:'membrane-7677f',client_email:'test@example.com',private_key:'invalid'}),'FIREBASE_PRIVATE_KEY_INVALID'],
]) {
 test(`serverless startup returns JSON for ${name}`,()=>{
  const script=`import http from 'node:http';import handler from './api/index.mjs';const server=http.createServer((req,res)=>{res.status=n=>{res.statusCode=n;return res};res.json=v=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(v));};handler(req,res);});server.listen(0,'127.0.0.1',async()=>{try{const r=await fetch('http://127.0.0.1:'+server.address().port+'/api/me');console.log(JSON.stringify({status:r.status,body:await r.json()}));}finally{server.close();}});`;
  const output=execFileSync(process.execPath,['--input-type=module','-e',script],{env:{...process.env,STORE_MODE:'live',VERCEL:'1',FIREBASE_SERVICE_ACCOUNT:account,GOOGLE_APPLICATION_CREDENTIALS:'',FIREBASE_AUTH_EMULATOR_HOST:'',FIRESTORE_EMULATOR_HOST:''},encoding:'utf8',timeout:10000});
  const result=JSON.parse(output.trim());assert.equal(result.status,503);assert.match(result.body.error,/not configured/);assert.equal(result.body.code,code);
 });
}
test('Firebase Admin imports with CommonJS-to-ESM require disabled (Vercel regression)',()=>{
 const output=execFileSync(process.execPath,['--no-experimental-require-module','--input-type=module','-e',"await import('firebase-admin/auth');console.log('ok')"],{encoding:'utf8',timeout:10000});
 assert.equal(output.trim(),'ok');
});
