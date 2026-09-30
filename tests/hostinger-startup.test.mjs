import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn, execFileSync} from 'node:child_process';
import {generateKeyPairSync} from 'node:crypto';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {once} from 'node:events';
import {createServer} from 'node:net';
import {mysqlOptions} from '../server/mysql-config.mjs';

const entry=fileURLToPath(new URL('../app.mjs',import.meta.url));
const firebaseModule=new URL('../server/firebase.mjs',import.meta.url).href;
const liveEnv={...process.env,NODE_ENV:'production',STORE_MODE:'live',VERCEL:'',FIREBASE_PROJECT_ID:'membrane-7677f',FIREBASE_SERVICE_ACCOUNT:'',GOOGLE_APPLICATION_CREDENTIALS:'',FIREBASE_AUTH_EMULATOR_HOST:'',FIRESTORE_EMULATOR_HOST:''};

test('Hostinger rejects missing authentication credentials before accepting requests',async()=>{
 const cwd=await mkdtemp(join(tmpdir(),'store-startup-'));
 try{
  const script=`const {assertFirebaseReady}=await import(${JSON.stringify(firebaseModule)});try{assertFirebaseReady();console.log('unexpected-ready')}catch(e){console.log(e.code)}`;
  const output=execFileSync(process.execPath,['--input-type=module','-e',script],{cwd,env:liveEnv,encoding:'utf8',stdio:['ignore','pipe','pipe']});
  assert.equal(output.trim(),'FIREBASE_SERVICE_ACCOUNT_MISSING');
 }finally{await rm(cwd,{recursive:true,force:true});}
});

test('production entry serves API and SPA from a different working directory using Hostinger DB fields',{skip:process.env.DATABASE_DRIVER!=='mysql',timeout:25000},async()=>{
 const connection=mysqlOptions();
 assert.ok(['localhost','127.0.0.1','::1'].includes(connection.host),'Startup tests must use a local MySQL database');
 const cwd=await mkdtemp(join(tmpdir(),'store-startup-'));
 const probe=createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');
 const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
 // Synthetic credential validates startup wiring only; no real Firebase API call is made.
 const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048,privateKeyEncoding:{format:'pem',type:'pkcs8'},publicKeyEncoding:{format:'pem',type:'spki'}});
 const credential=JSON.stringify({project_id:'membrane-7677f',client_email:'startup-test@membrane-7677f.iam.gserviceaccount.com',private_key:privateKey});
 const child=spawn(process.execPath,[entry],{cwd,env:{...liveEnv,PORT:String(port),DATABASE_DRIVER:'',MYSQL_URL:'',DATABASE_URL:'',DB_HOST:connection.host,DB_PORT:String(connection.port),DB_USER:connection.user,DB_PASSWORD:connection.password,DB_NAME:connection.database,FIREBASE_SERVICE_ACCOUNT:credential,CASHFREE_MODE:'disabled'},stdio:['ignore','pipe','pipe']});
 const exited=once(child,'exit');
 let log='';child.stderr.on('data',chunk=>{log+=chunk;});
 try{
  await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(new Error('Production server readiness timed out')),15000);
   child.stdout.on('data',chunk=>{if(String(chunk).includes('production server ready')){clearTimeout(timer);resolve();}});
   child.once('error',error=>{clearTimeout(timer);reject(error);});
   child.once('exit',code=>{clearTimeout(timer);reject(new Error(`Production server exited before readiness (${code}): ${log}`));});
  });
  const base=`http://127.0.0.1:${port}`;
  const health=await fetch(base+'/api/health');assert.equal(health.status,200);assert.deepEqual(await health.json(),{status:'ok',database:'mysql'});
  const config=await fetch(base+'/api/config');assert.equal(config.status,200);const settings=await config.json();assert.equal(settings.emulator,false);assert.equal(settings.database,'mysql');assert.equal(settings.paymentMode,'disabled');
  const me=await fetch(base+'/api/me');assert.equal(me.status,401);assert.match((await me.json()).error,/sign in/i);
  for(const route of ['/','/admin','/account','/bag']){const page=await fetch(base+route);assert.equal(page.status,200);assert.match(page.headers.get('content-type'),/text\/html/);assert.match(await page.text(),/id="root"/);}
 }finally{
  if(child.exitCode===null)child.kill('SIGTERM');
  const force=setTimeout(()=>child.kill('SIGKILL'),3000);force.unref();
  await exited;clearTimeout(force);await rm(cwd,{recursive:true,force:true});
 }
});
