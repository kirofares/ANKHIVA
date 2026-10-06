import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole, ShieldCheck } from 'lucide-react';

export default function Auth(){
 const [register,setRegister]=useState(false);
 return <div className="auth-page"><div className="auth-card"><Link to="/" className="simple-brand"><span className="mini-ankh">𓋹</span> ANKH<span>IVA</span></Link><div className="intake-glyphs">𓆸 𓋹 𓆸</div><span className="label">{register?'CREATE PATIENT ACCOUNT':'PATIENT LOGIN'}</span><h1>{register?'Start your ANKHIVA account':'Welcome back'}</h1><p>This is a UI demo. Authentication will be activated with the dedicated ANKHIVA backend.</p>
 <div className="form auth-form">{register&&<label>Full name<input placeholder="Your full name"/></label>}<label>Email<input type="email" placeholder="you@example.com"/></label><label>Password<input type="password" placeholder="••••••••"/></label><button className="cta full" onClick={()=>{}}><LockKeyhole size={17}/>{register?'Create account':'Sign in'}</button><div className="privacy-note"><ShieldCheck/> Demo only — credentials are not submitted.</div></div>
 <button className="switch-auth" onClick={()=>setRegister(v=>!v)}>{register?'Already have an account? Sign in':'New patient? Create account'}</button>
 <Link className="text-link auth-demo-link" to="/patient">Open patient portal demo</Link></div></div>
}
