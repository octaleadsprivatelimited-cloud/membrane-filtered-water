import {createContext,useContext,useEffect,useRef,useState,useCallback} from 'react';
import {onIdTokenChanged,signOut} from 'firebase/auth';
import {auth} from '../firebase/config';
import {api} from './api';
const Context=createContext(null);
export function AuthProvider({children}) {
 const [user,setUser]=useState(null),[ready,setReady]=useState(false),[profile,setProfile]=useState(null);
 const [config,setConfig]=useState(null),[configError,setConfigError]=useState(''),[error,setError]=useState('');
 const generation=useRef(0);
 const refresh=useCallback(async()=>{
  const current=auth.currentUser;
  const request=++generation.current;
  setError('');
  if(!current){setProfile(null);return null;}
  try {
   const next=await api('/me');
   if(request===generation.current&&auth.currentUser?.uid===current.uid){setProfile(next);setError('');}
   return next;
  } catch(e){if(request===generation.current){setError(e.code?`${e.message} (${e.code})`:e.message);setProfile(null);}throw e;}
 },[]);
 useEffect(()=>{
  let active=true;
  api('/config').then(value=>{if(active){setConfig(value);setConfigError('');}}).catch(e=>{if(active)setConfigError(e.message);});
  const unsubscribe=onIdTokenChanged(auth,async current=>{
   if(!active)return;
   setUser(current);setReady(false);setProfile(null);setError('');
   if(current){try{await refresh();}catch{/* refresh exposes the retryable profile error */}}
   else ++generation.current;
   if(active&&auth.currentUser?.uid===current?.uid)setReady(true);
  });
  return ()=>{active=false;++generation.current;unsubscribe();};
 },[refresh]);
 const logout=useCallback(()=>signOut(auth),[]);
 return <Context.Provider value={{user,ready,profile,config,configError,error,refresh,logout}}>{children}</Context.Provider>;
}
export const useAuth=()=>useContext(Context);
