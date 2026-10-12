import {db as firestore} from './firebase.mjs';
import {createMysqlStore} from './mysql.mjs';
import {mysqlOptions} from './mysql-config.mjs';
export function resolveDatabaseDriver(env = process.env) {
  if (env.DATABASE_DRIVER) return env.DATABASE_DRIVER;
  const hasMysql = Boolean(env.MYSQL_URL || env.DATABASE_URL || (env.DB_HOST && env.DB_USER && env.DB_NAME && env.DB_PASSWORD));
  return hasMysql ? 'mysql' : 'firestore';
}
export const databaseDriver = resolveDatabaseDriver();
let store,configurationError;
try{
 if(!['mysql','firestore'].includes(databaseDriver))throw new Error('Unsupported DATABASE_DRIVER. Use mysql or firestore.');
 store=databaseDriver==='mysql'?createMysqlStore(mysqlOptions()):firestore;
}catch(error){configurationError=error;}
export const db=store;
export async function assertDatabaseReady(){
 if(configurationError)throw Object.assign(new Error(configurationError.message),{status:503,code:'DATABASE_CONFIGURATION'});
 if(databaseDriver==='mysql')try{await db.initialize();}catch(error){console.error('MySQL connection failed:',error.code||'DATABASE_ERROR');throw Object.assign(new Error('Store database is unavailable. Check the MySQL server and connection settings.'),{status:503,code:'DATABASE_UNAVAILABLE'});}
}
