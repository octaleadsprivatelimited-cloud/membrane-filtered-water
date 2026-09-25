import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import config,{apiUrl} from '../src/config/appConfig.js';
test('same-origin API routing and known production project',()=>{
 assert.equal(apiUrl('/me'),'/api/me');assert.equal(apiUrl('config'),'/api/config');
 assert.equal(config.frontendUrl,'https://www.membraneiq.com');assert.equal(config.firebase.projectId,'membrane-7677f');
});
test('frontend source has no environment-variable dependencies or private credential fields',async()=>{
 async function scan(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())await scan(p);else if(/\.[jt]sx?$/.test(p)){const s=await readFile(p,'utf8');assert.doesNotMatch(s,/import\.meta\.env|process\.env|VITE_|NEXT_PUBLIC_|REACT_APP_|BEGIN PRIVATE KEY|private_key_id|client_secret/,p);}}}
 await scan('src');
});
