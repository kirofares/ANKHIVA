import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth';

export default function Auth(){
 const [params]=useSearchParams();
 const [register,setRegister]=useState(params.get('mode')==='register');
 const [fullName,setFullName]=useState('');
 const [country,setCountry]=useState('');
 const [phone,setPhone]=useState('');
 const [language,setLanguage]=useState('English');
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [message,setMessage]=useState('');
 const navigate=useNavigate();
 const {user,profile,refreshProfile,backendReady}=useAuth();

 const submit=async(e:FormEvent)=>{
   e.preventDefault();
   setError(''); setMessage('');
   if(!supabase || !backendReady){setError('Secure backend is not available yet.');return;}
   if(password.length<8){setError('Use a password with at least 8 characters.');return;}
   setLoading(true);
   try{
     if(register){
       if(!fullName.trim() || !country.trim()){throw new Error('Full name and country are required.');}
       const {data,error}=await supabase.auth.signUp({
         email:email.trim(),
         password,
         options:{data:{full_name:fullName.trim(),country:country.trim(),phone:phone.trim(),preferred_language:language}}
       });
       if(error) throw error;
       if(data.session){
         await refreshProfile();
         navigate('/patient');
       }else{
         setMessage('Account created. Check your email to confirm the account, then return here to sign in.');
       }
     }else{
       const {data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
       if(error) throw error;
       const {data:profileRow}=await supabase.from('profiles').select('role').eq('id',data.user.id).maybeSingle();
       await refreshProfile();
       navigate(profileRow && profileRow.role!=='patient'?'/admin':'/patient');
     }
   }catch(err){
     setError(err instanceof Error?err.message:'Authentication failed.');
   }finally{setLoading(false);}
 };

 if(user){
   return <div className="auth-page"><div className="auth-card"><Link to="/" className="simple-brand"><span className="mini-ankh">𓋹</span> ANKH<span>IVA</span></Link><div className="intake-glyphs">𓆸 𓋹 𓆸</div><CheckCircle2 size={38} className="auth-ok"/><h1>You are signed in</h1><p>{profile?.full_name||user.email}</p><Link className="cta full" to={profile?.role==='patient'?'/patient':'/admin'}>Open your dashboard</Link></div></div>;
 }

 return <div className="auth-page"><div className="auth-card">
   <Link to="/" className="simple-brand"><span className="mini-ankh">𓋹</span> ANKH<span>IVA</span></Link>
   <div className="intake-glyphs">𓆸 𓋹 𓆸</div>
   <span className="label">{register?'CREATE PATIENT ACCOUNT':'PATIENT LOGIN'}</span>
   <h1>{register?'Start your ANKHIVA account':'Welcome back'}</h1>
   <p>{register?'Create a secure patient account before submitting health information.':'Sign in to access your cases, documents, quotes and messages.'}</p>
   <form className="form auth-form" onSubmit={submit}>
     {register&&<>
       <label>Full name<input required value={fullName} onChange={e=>setFullName(e.target.value)} autoComplete="name"/></label>
       <div className="two"><label>Country<input required value={country} onChange={e=>setCountry(e.target.value)} autoComplete="country-name"/></label><label>WhatsApp / phone<input value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel"/></label></div>
       <label>Preferred language<select value={language} onChange={e=>setLanguage(e.target.value)}><option>English</option><option>Arabic</option><option>German</option><option>French</option></select></label>
     </>}
     <label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>
     <label>Password<input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={register?'new-password':'current-password'}/></label>
     {error&&<div className="form-error">{error}</div>}
     {message&&<div className="form-success">{message}</div>}
     <button className="cta full" disabled={loading}><LockKeyhole size={17}/>{loading?'Please wait…':register?'Create secure account':'Sign in'}</button>
     <div className="privacy-note"><ShieldCheck/> Never use ANKHIVA for emergencies. Authentication is handled by the dedicated ANKHIVA Supabase project.</div>
   </form>
   <button className="switch-auth" onClick={()=>{setRegister(v=>!v);setError('');setMessage('')}}>{register?'Already have an account? Sign in':'New patient? Create account'}</button>
 </div></div>
}
