import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { specialties } from '../data';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth';

export default function Intake(){
 const {user,profile,loading:authLoading,refreshProfile}=useAuth();
 const [step,setStep]=useState(1);
 const [done,setDone]=useState(false);
 const [caseNumber,setCaseNumber]=useState('');
 const [selected,setSelected]=useState('');
 const [fullName,setFullName]=useState('');
 const [country,setCountry]=useState('');
 const [phone,setPhone]=useState('');
 const [language,setLanguage]=useState('English');
 const [medicalSummary,setMedicalSummary]=useState('');
 const [patientRequest,setPatientRequest]=useState('');
 const [consent,setConsent]=useState(false);
 const [error,setError]=useState('');
 const [saving,setSaving]=useState(false);

 useEffect(()=>{
   if(profile){
     setFullName(profile.full_name||'');
     setCountry(profile.country||'');
     setPhone(profile.phone||'');
     setLanguage(profile.preferred_language||'English');
   }
 },[profile]);

 if(authLoading) return <div className="intake-page"><div className="intake-box">Loading secure session…</div></div>;

 if(!user){
   return <div className="intake-page"><div className="intake-box auth-required">
     <Link to="/" className="simple-brand"><span className="mini-ankh" aria-hidden="true">𓋹</span> ANKH<span>IVA</span></Link>
     <div className="intake-glyphs" aria-hidden="true">𓆸 𓋹 𓆸</div>
     <LockKeyhole size={42}/>
     <h1>Sign in before sharing medical information</h1>
     <p>ANKHIVA requires a secure patient account before a medical request can be stored.</p>
     <div className="auth-required-actions"><Link className="cta" to="/login">Sign in</Link><Link className="ghost link-button" to="/login?mode=register">Create patient account</Link></div>
     <div className="privacy-note"><ShieldCheck/> Do not use this service for emergencies.</div>
   </div></div>;
 }

 const validateStep=()=>{
   setError('');
   if(step===1 && !selected){setError('Select a treatment category to continue.');return false;}
   if(step===2 && (!fullName.trim() || !country.trim())){setError('Full name and country are required.');return false;}
   if(step===3 && (!medicalSummary.trim() || !patientRequest.trim())){setError('Please add a brief medical history and what you would like help with.');return false;}
   if(step===3 && !consent){setError('Consent is required before the request can be submitted.');return false;}
   return true;
 };

 const next=()=>{
   if(!validateStep()) return;
   setStep(s=>Math.min(3,s+1));
 };

 const submit=async()=>{
   if(!validateStep() || !supabase || !user) return;
   setSaving(true); setError('');
   try{
     const {error:profileError}=await supabase.from('profiles').update({
       full_name:fullName.trim(),
       country:country.trim(),
       phone:phone.trim()||null,
       preferred_language:language
     }).eq('id',user.id);
     if(profileError) throw profileError;

     const {data:specialty,error:specialtyError}=await supabase.from('specialties').select('id').eq('slug',selected).single();
     if(specialtyError) throw specialtyError;

     const {data:created,error:caseError}=await supabase.from('medical_cases').insert({
       patient_id:user.id,
       specialty_id:specialty.id,
       medical_summary:medicalSummary.trim(),
       patient_request:patientRequest.trim(),
       status:'submitted'
     }).select('id,case_number').single();
     if(caseError) throw caseError;

     const policyVersion='2026-10-06-v1';
     const {error:consentError}=await supabase.from('consent_events').insert([
       {user_id:user.id,case_id:created.id,consent_type:'medical_coordination',policy_version:policyVersion},
       {user_id:user.id,case_id:created.id,consent_type:'privacy',policy_version:policyVersion},
       {user_id:user.id,case_id:created.id,consent_type:'terms',policy_version:policyVersion}
     ]);
     if(consentError) throw consentError;

     await refreshProfile();
     setCaseNumber(created.case_number);
     setDone(true);
   }catch(err){
     setError(err instanceof Error?err.message:'Could not submit your request.');
   }finally{setSaving(false);}
 };

 if(done) return <div className="intake-page"><div className="intake-box success-page"><CheckCircle2 size={52}/><h1>Medical request submitted</h1><p>Your case <b>{caseNumber}</b> is now stored in ANKHIVA's dedicated secure backend. You can add supporting documents from your patient portal.</p><Link className="cta" to="/patient">Open patient portal</Link></div></div>;

 return <div className="intake-page"><div className="intake-box">
   <Link to="/" className="simple-brand"><span className="mini-ankh" aria-hidden="true">𓋹</span> ANKH<span>IVA</span></Link>
   <div className="intake-glyphs" aria-hidden="true">𓆸 𓋹 𓆸</div>
   <div className="intake-progress"><span style={{width:(step/3*100)+'%'}}/></div><div className="step-label">STEP {step} OF 3</div>
   {step===1&&<><h1>What care are you looking for?</h1><p>Select the main specialty. A coordinator can refine your request later.</p><div className="select-cards">{specialties.map(s=><label key={s.slug}><input type="radio" name="specialty" checked={selected===s.slug} onChange={()=>setSelected(s.slug)}/><span><b>{s.name}</b><small>{s.description}</small></span></label>)}</div></>}
   {step===2&&<><h1>Confirm your details</h1><p>These details are saved to your secure ANKHIVA patient profile.</p><div className="form intake-form"><div className="two"><label>Full name<input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your full name"/></label><label>Country<input value={country} onChange={e=>setCountry(e.target.value)} placeholder="Country of residence"/></label></div><div className="two"><label>Email<input value={user.email||''} disabled/></label><label>WhatsApp / phone<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+ country code"/></label></div><label>Preferred language<select value={language} onChange={e=>setLanguage(e.target.value)}><option>English</option><option>Arabic</option><option>German</option><option>French</option></select></label></div></>}
   {step===3&&<><h1>Medical request</h1><p>Give the care team enough context for an initial review. You can upload PDF or image documents securely after submission.</p><div className="form intake-form"><label>Brief medical history<textarea rows={5} value={medicalSummary} onChange={e=>setMedicalSummary(e.target.value)} placeholder="Diagnosis, symptoms, previous treatment, relevant conditions..."/></label><label>What would you like help with?<textarea rows={4} value={patientRequest} onChange={e=>setPatientRequest(e.target.value)} placeholder="Treatment or procedure you are considering..."/></label><label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> <span>I consent to ANKHIVA processing the information I submit for medical coordination and acknowledge the Privacy Policy and Terms.</span></label><div className="privacy-note"><ShieldCheck/> Do not submit emergency requests here. Access to your case is restricted by row-level security.</div></div></>}
   {error&&<div className="form-error intake-error">{error}</div>}
   <div className="intake-actions">{step>1?<button className="ghost" onClick={()=>{setError('');setStep(s=>s-1)}}><ArrowLeft size={17}/> Back</button>:<span/>}{step<3?<button className="cta" onClick={next}>Continue <ArrowRight size={17}/></button>:<button className="cta" disabled={saving} onClick={submit}>{saving?'Submitting…':'Submit medical request'} <ArrowRight size={17}/></button>}</div>
 </div></div>
}
