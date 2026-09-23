import {createContext,useContext,useEffect,useState} from 'react';
import {onIdTokenChanged,signOut} from 'firebase/auth';
import {auth} from '../firebase/config';
import {api} from './api';
const Context=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(null);const [ready,setReady]=useState(false);const [profile,setProfile]=useState(null);const [config,setConfig]=useState(null);const [error,setError]=useState('');useEffect(()=>{api('/config').then(setConfig).catch(e=>setError(e.message));return onIdTokenChanged(auth,async u=>{setUser(u);if(u){try{setProfile(await api('/me'));}catch(e){setProfile(null);setError(e.message);}}else setProfile(null);setReady(true);});},[]);const refresh=async()=>setProfile(await api('/me'));return <Context.Provider value={{user,ready,profile,config,error,refresh,logout:()=>signOut(auth)}}>{children}</Context.Provider>}
export const useAuth=()=>useContext(Context);
