import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createMysqlStore} from '../server/mysql.mjs';
test('MySQL persists across connections, rolls back all writes, and preserves merge fields', {skip:process.env.DATABASE_DRIVER!=='mysql'}, async()=>{
 const first=createMysqlStore(process.env.MYSQL_URL), second=createMysqlStore(process.env.MYSQL_URL);
 const path=`products/test-${randomUUID()}`, other=`orders/test-${randomUUID()}`;
 try {
  await first.doc(path).set({stock:2,name:'Persisted'});
  assert.equal((await second.doc(path).get()).data().stock,2);
  await assert.rejects(first.runTransaction(async tx=>{tx.update(first.doc(path),{stock:0});tx.create(first.doc(other),{id:'rollback'});tx.create(first.doc(path),{stock:100});}));
  assert.equal((await second.doc(path).get()).data().stock,2);
  assert.equal((await second.doc(other).get()).exists,false);
  await first.doc(path).set({stock:1},{merge:true});
  assert.deepEqual((await second.doc(path).get()).data(),{stock:1,name:'Persisted'});
 }finally{await first.doc(path).delete();await first.doc(other).delete();await first.close();await second.close();}
});
