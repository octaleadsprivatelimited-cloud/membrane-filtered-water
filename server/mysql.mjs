import mysql from 'mysql2/promise';
import {randomUUID} from 'node:crypto';

// Preserve the store's document data shape in dedicated MySQL tables.
// Every write uses the same InnoDB lock, including stock changes and order creation.
const tables = new Set(['products', 'customers', 'orders', 'settings']);
export function createMysqlStore(url) {
 const pool = mysql.createPool({uri:url, connectionLimit:8, maxIdle:0, idleTimeout:1000});
 let ready;
 const initialize = () => ready ||= (async () => {
  for (const table of tables) await pool.query(`CREATE TABLE IF NOT EXISTS \`${table}\` (id VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin PRIMARY KEY, data JSON NOT NULL) ENGINE=InnoDB`);
  await pool.query('CREATE TABLE IF NOT EXISTS store_write_lock (id INT PRIMARY KEY) ENGINE=InnoDB');
  await pool.query('INSERT IGNORE INTO store_write_lock (id) VALUES (1)');
 })().catch(error => { ready=undefined; throw error; });
 const snapshot = (ref, rows) => ({id:ref.id,ref,exists:rows.length>0,data:()=>rows.length ? (typeof rows[0].data==='string'?JSON.parse(rows[0].data):rows[0].data) : undefined});
 const read = async (connection, ref) => {
  const [rows] = await connection.execute(`SELECT data FROM \`${ref.table}\` WHERE id=?`,[ref.id]);
  return snapshot(ref, rows);
 };
 const doc = path => {
  const [table,id,...extra]=path.split('/');
  if(!tables.has(table)||!id||id.length>128||extra.length)throw new Error('Invalid store document path');
  const ref={table,id,get:async()=>{await initialize();return read(pool,ref);},
   set:(data,options)=>runTransaction(tx=>tx.set(ref,data,options)),
   update:data=>runTransaction(tx=>tx.update(ref,data)),
   delete:()=>runTransaction(tx=>tx.delete(ref))};
  return ref;
 };
 async function runTransaction(callback) {
  await initialize();
  for(let attempt=0;attempt<3;attempt++){
   const connection=await pool.getConnection();
   try {
    await connection.beginTransaction();
    await connection.query('SELECT id FROM store_write_lock WHERE id=1 FOR UPDATE');
    const writes=[];
    const tx={get:ref=>read(connection,ref),getAll:async(...refs)=>{const result=[];for(const ref of refs)result.push(await read(connection,ref));return result;},
     set:(ref,data,options)=>{writes.push({kind:'set',ref,data,merge:options?.merge});},
     create:(ref,data)=>{writes.push({kind:'create',ref,data});},
     update:(ref,data)=>{writes.push({kind:'update',ref,data});},
     delete:ref=>{writes.push({kind:'delete',ref});}};
    const result=await callback(tx);
    for(const write of writes){
     const {ref,kind}=write;
     if(kind==='delete'){await connection.execute(`DELETE FROM \`${ref.table}\` WHERE id=?`,[ref.id]);continue;}
     let data=write.data;
     if(write.merge||kind==='update'){
      const old=await read(connection,ref);
      if(kind==='update'&&!old.exists)throw new Error('Cannot update missing document');
      data={...old.data(),...data};
     }
     await connection.execute(`INSERT INTO \`${ref.table}\` (id,data) VALUES (?,?)${kind==='create'?'':' ON DUPLICATE KEY UPDATE data=VALUES(data)'}`,[ref.id,JSON.stringify(data)]);
    }
    await connection.commit();return result;
   }catch(error){await connection.rollback();if(error.code==='ER_LOCK_DEADLOCK'&&attempt<2)continue;throw error;}
   finally{connection.release();}
  }
 }
 const collection=(table,filter=null,limit=null)=>{
  if(!tables.has(table))throw new Error('Invalid store collection');
  return {doc:(id=randomUUID())=>doc(`${table}/${id}`),
   where:(field,operator,value)=>{if(field!=='uid'||operator!=='==')throw new Error('Unsupported store query');return collection(table,{field,value},limit);},
   limit:n=>{if(!Number.isInteger(n)||n<1)throw new Error('Invalid limit');return collection(table,filter,n);},
   get:async()=>{await initialize();const [rows]=await pool.execute(`SELECT id,data FROM \`${table}\`${filter?" WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.uid'))=?":''}${limit?` LIMIT ${limit}`:''}`,filter?[filter.value]:[]);return {empty:rows.length===0,docs:rows.map(row=>snapshot(doc(`${table}/${row.id}`),[row]))};}};
 };
 return {doc,collection,runTransaction,initialize,close:()=>pool.end()};
}
