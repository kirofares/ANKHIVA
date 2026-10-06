import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { specialties } from '../data';

export default function Intake(){
 const [step,setStep]=useState(1); const [done,setDone]=useState(false);
 if(done) return <div className="intake-page"><div className="intake-box success-page"><CheckCircle2 size={52}/><h1>Request prepared</h1><p>This interface is ready. No health information has been stored yet because ANKHIVA's dedicated Supabase project has not been connected.</p><Link className="cta" to="/patient">Open demo patient portal</Link></div></div>;
 return <div className="intake-page"><div className="intake-box"><Link to="/" className="simple-brand">ANKH<span>IVA</span></Link><div className="intake-progress"><span style={{width:(step/3*100)+'%'}}/></div><div className="step-label">STEP {step} OF 3</div>
 {step===1&&<><h1>What care are you looking for?</h1><p>Select the main specialty. A coordinator can refine your request later.</p><div className="select-cards">{specialties.map(s=><label key={s.slug}><input type="radio" name="specialty"/><span><b>{s.name}</b><small>{s.description}</small></span></label>)}</div></>}
 {step===2&&<><h1>Tell us about you</h1><p>Basic contact information for international patient coordination.</p><div className="form intake-form"><div className="two"><label>Full name<input placeholder="Your full name"/></label><label>Country<input placeholder="Country of residence"/></label></div><div className="two"><label>Email<input type="email" placeholder="you@example.com"/></label><label>WhatsApp<input placeholder="+ country code"/></label></div><label>Preferred language<select><option>English</option><option>Arabic</option><option>German</option><option>French</option></select></label></div></>}
 {step===3&&<><h1>Medical request</h1><p>Give the care team enough context for an initial review. Secure document upload will be enabled with the dedicated backend.</p><div className="form intake-form"><label>Brief medical history<textarea rows={5} placeholder="Diagnosis, symptoms, previous treatment, relevant conditions..."/></label><label>What would you like help with?<textarea rows={4} placeholder="Treatment or procedure you are considering..."/></label><label className="consent"><input type="checkbox"/> <span>I consent to ANKHIVA processing the information I submit for the purpose of coordinating my requested medical care.</span></label><div className="privacy-note"><ShieldCheck/> Do not submit emergency requests here. Medical data will only be enabled after secure backend policies are activated.</div></div></>}
 <div className="intake-actions">{step>1?<button className="ghost" onClick={()=>setStep(s=>s-1)}><ArrowLeft size={17}/> Back</button>:<span/>}<button className="cta" onClick={()=>step<3?setStep(s=>s+1):setDone(true)}>{step<3?'Continue':'Prepare request'} <ArrowRight size={17}/></button></div>
 </div></div>
}
