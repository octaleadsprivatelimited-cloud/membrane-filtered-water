import test from 'node:test';
import assert from 'node:assert/strict';
import {readApiResponse} from '../src/commerce/response.js';
test('JSON success remains usable',async()=>assert.deepEqual(await readApiResponse(new Response('{"uid":"customer"}')),{uid:'customer'}));
test('Vercel plaintext failure has actionable message, not JSON SyntaxError',async()=>{
 await assert.rejects(readApiResponse(new Response('A server error has occurred\nFUNCTION_INVOCATION_FAILED',{status:500})),e=>e.status===500&&!(e instanceof SyntaxError)&&e.message.includes('server is unavailable'));
});
test('HTML fallback cannot be treated as a signed-in profile',async()=>{
 await assert.rejects(readApiResponse(new Response('<!doctype html><html></html>')),/server is unavailable/);
});
test('API errors preserve status and safe server message',async()=>{
 await assert.rejects(readApiResponse(new Response('{"error":"Store account services are not configured.","code":"STORE_CONFIGURATION"}',{status:503})),e=>e.status===503&&e.code==='STORE_CONFIGURATION');
});
test('empty response is rejected rather than becoming a missing profile',async()=>{
 await assert.rejects(readApiResponse(new Response('')),/invalid response/);
});
