function invalid(message){throw Object.assign(new Error(message),{code:'DATABASE_CONFIGURATION'});}
export function mysqlOptions(env=process.env){
 const uri=env.MYSQL_URL||env.DATABASE_URL;
 let connection;
 if(uri){
  try{const url=new URL(uri);if(url.protocol!=='mysql:'||!url.hostname||!url.username||!url.pathname.slice(1))throw new Error();
   connection={host:url.hostname,port:Number(url.port||3306),user:decodeURIComponent(url.username),password:decodeURIComponent(url.password),database:decodeURIComponent(url.pathname.slice(1))};
  }catch{invalid('MYSQL_URL or DATABASE_URL must be a valid mysql:// connection string.');}
 }else{
  if(!env.DB_HOST||!env.DB_USER||!env.DB_NAME||!env.DB_PASSWORD)invalid('Configure DB_HOST, DB_USER, DB_PASSWORD and DB_NAME in the server environment.');
  connection={host:env.DB_HOST,port:Number(env.DB_PORT||3306),user:env.DB_USER,password:env.DB_PASSWORD,database:env.DB_NAME};
 }
 if(!Number.isInteger(connection.port)||connection.port<1||connection.port>65535)invalid('DB_PORT must be a valid TCP port.');
 if(env.DB_SSL&&!['true','false'].includes(env.DB_SSL))invalid('DB_SSL must be true or false.');
 if(env.DB_SSL==='true'||env.DB_SSL_CA)connection.ssl={rejectUnauthorized:true,...(env.DB_SSL_CA?{ca:env.DB_SSL_CA.replace(/\\n/g,'\n')}: {})};
 return {...connection,connectionLimit:5,maxIdle:2,idleTimeout:30000,connectTimeout:10000,enableKeepAlive:true};
}
