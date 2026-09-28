import {db as firestore} from './firebase.mjs';
import {createMysqlStore} from './mysql.mjs';
export const databaseDriver=process.env.DATABASE_DRIVER||'firestore';
if(!['mysql','firestore'].includes(databaseDriver))throw new Error('Unsupported DATABASE_DRIVER');
if(databaseDriver==='mysql'&&!process.env.MYSQL_URL)throw new Error('MYSQL_URL is required for the MySQL database');
export const db=databaseDriver==='mysql'?createMysqlStore(process.env.MYSQL_URL):firestore;
export async function assertDatabaseReady(){
 if(databaseDriver==='mysql')try{await db.initialize();}catch{const error=new Error('Store database is unavailable. Check the MySQL server and connection settings.');error.status=503;error.code='DATABASE_UNAVAILABLE';throw error;}
}
