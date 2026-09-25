import test from 'node:test';
import assert from 'node:assert/strict';
import {parseServiceAccount} from '../server/service-account.mjs';
const sample={type:'service_account',project_id:'example-test',client_email:'test@example.test',token_uri:'https://oauth2.googleapis.com/token',private_key:'FAKE TEST KEY\n'};
test('standard downloaded JSON remains unchanged',()=>assert.deepEqual(parseServiceAccount(JSON.stringify(sample)),sample));
test('chat formatting is normalized without embedding credentials',()=>{
 const copy={...sample,client_email:'[test@example.test](mailto:test@example.test)',token_uri:'[https://oauth2.googleapis.com/token](https://oauth2.googleapis.com/token)'};
 const formatted=JSON.stringify(copy).replaceAll('_','\\_');
 assert.deepEqual(parseServiceAccount(formatted),sample);
});
test('malformed JSON and non-objects are rejected',()=>{
 for(const input of ['invalid','null','[]','"text"'])assert.throws(()=>parseServiceAccount(input));
});
test('mismatched Markdown link is rejected',()=>assert.throws(()=>parseServiceAccount(JSON.stringify({...sample,client_email:'[a@example.test](mailto:b@example.test)'}))));
