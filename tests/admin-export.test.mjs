import test from 'node:test';
import assert from 'node:assert/strict';
import {ordersCsv} from '../src/commerce/admin-export.js';
test('admin CSV exports real amounts, escapes cells and excludes unpaid payment rows',()=>{
 const rows=[{id:'paid-order',address:{name:'=HYPERLINK("test")'},totalPaise:12345,paymentStatus:'paid'},{id:'unpaid-order',totalPaise:100,paymentStatus:'pending'}];
 const csv=ordersCsv(rows,true);
 assert.match(csv,/123.45/);assert.match(csv,/'=HYPERLINK/);assert.doesNotMatch(csv,/unpaid-order/);assert.match(ordersCsv(rows),/unpaid-order/);
});
