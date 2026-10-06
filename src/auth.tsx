import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { Navigate } from 'react-router-dom';
import { supabase, supabaseEnabled } from './lib/supabase';

export type AppProfile = {
  id: string;
  full_name: string | null;
  country: string | null;
  phone: string | null;
  preferred_language: string | null;
  role: 'patient' | 'coordinator' | 'clinician' | 'admin';
};

type AuthState = {
  user: User | null;
  profile: AppProfile | null;
  loading: boolean;
  backendReady: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<User|null>(null);
  const [profile,setProfile]=useState<AppProfile|null>(null);
  const [loading,setLoading]=useState(true);

  const loadProfile=async(userId:string)=>{
    if(!supabase) return null;
    const {data,error}=await supabase.from('profiles').select('id,full_name,country,phone,preferred_language,role').eq('id',userId).maybeSingle();
    if(error){ console.error('Profile load failed',error.message); return null; }
    const next=(data as AppProfile|null) ?? null;
    setProfile(next);
    return next;
  };

  const refreshProfile=async()=>{ if(user) await loadProfile(user.id); };

  useEffect(()=>{
    if(!supabase){ setLoading(false); return; }
    let active=true;
    const bootstrap=async()=>{
      const {data}=await supabase.auth.getSession();
      if(!active) return;
      const nextUser=data.session?.user ?? null;
      setUser(nextUser);
      if(nextUser) await loadProfile(nextUser.id); else setProfile(null);
      if(active) setLoading(false);
    };
    bootstrap();
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      const nextUser=session?.user ?? null;
      setUser(nextUser);
      if(nextUser) void loadProfile(nextUser.id); else setProfile(null);
      setLoading(false);
    });
    return ()=>{active=false;subscription.unsubscribe();};
  },[]);

  const signOut=async()=>{ if(supabase) await supabase.auth.signOut(); setUser(null); setProfile(null); };

  return <AuthContext.Provider value={{user,profile,loading,backendReady:supabaseEnabled,refreshProfile,signOut}}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const value=useContext(AuthContext);
  if(!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}

export function RequireAuth({children}:{children:ReactNode}){
  const {user,loading,backendReady}=useAuth();
  if(loading) return <div className="route-loading">Loading secure session…</div>;
  if(!backendReady) return <Navigate to="/login" replace/>;
  if(!user) return <Navigate to="/login" replace/>;
  return <>{children}</>;
}

export function RequireRoles({roles,children}:{roles:AppProfile['role'][];children:ReactNode}){
  const {user,profile,loading}=useAuth();
  if(loading) return <div className="route-loading">Checking access…</div>;
  if(!user) return <Navigate to="/login" replace/>;
  if(!profile || !roles.includes(profile.role)) return <Navigate to="/patient" replace/>;
  return <>{children}</>;
}
