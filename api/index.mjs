// A literal import keeps the server in Vercel's dependency trace while allowing
// initialization failures to produce JSON instead of a platform error page.
let appPromise;
export default async function handler(req,res){
 try {
  appPromise ||= import('../server/index.mjs').then(module=>module.default).catch(error=>{appPromise=null;throw error;});
  const app=await appPromise;
  return app(req,res);
 }catch(error){
  console.error('Store API startup failed:',error.message);
  return res.status(503).json({error:'Store services are temporarily unavailable. Please try again shortly.',code:'STORE_STARTUP'});
 }
}
