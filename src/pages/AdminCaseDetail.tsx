import { FormEvent, useEffect, useState } from 'react';
import { FileText, Paperclip, Send, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PortalShell from '../components/PortalShell';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth';

type Row=Record<string,any>;

const statuses=['submitted','awaiting_documents','medical_review','plan_ready','quote_sent','travel_confirmed','in_treatment','follow_up','closed'];

export default function AdminCaseDetail(){
 const {id}=useParams();
 const {user,profile}=useAuth();
 const [caseRow,setCaseRow]=useState<Row|null>(null);
 const [patient,setPatient]=useState<Row|null>(null);
 const [documents,setDocuments]=useState<Row[]>([]);
 const [messages,setMessages]=useState<Row[]>([]);
 const [quotes,setQuotes]=useState<Row[]>([]);
 const [status,setStatus]=useState('submitted');
 const [messageBody,setMessageBody]=useState('');
 const [quote,setQuote]=useState({medical_cost:'',accommodation_cost:'',transport_cost:'',coordination_fee:'',currency:'USD',valid_until:'',notes:''});
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 if(!id) return <Navigate to="/admin/cases" replace/>;

 const load=async()=>{
   const client=supabase;if(!client) return;
   setLoading(true);setError('');
   const c=await client.from('medical_cases').select('id,case_number,patient_id,status,urgency,medical_summary,patient_request,created_at,specialties(name)').eq('id',id).maybeSingle();
   if(c.error){setError(c.error.message);setLoading(false);return;}
   if(!c.data){setLoading(false);return;}
   setCaseRow(c.data);setStatus(c.data.status);
   const [p,d,m,q]=await Promise.all([
     client.from('profiles').select('id,full_name,country,phone,preferred_language').eq('id',c.data.patient_id).maybeSingle(),
     client.from('case_documents').select('id,storage_path,original_filename,mime_type,created_at').eq('case_id',id).order('created_at',{ascending:false}),
     client.from('case_messages').select('id,sender_id,body,created_at').eq('case_id',id).order('created_at',{ascending:true}),
     client.from('quotes').select('id,currency,medical_cost,accommodation_cost,transport_cost,coordination_fee,total,status,valid_until,notes,created_at').eq('case_id',id).order('created_at',{ascending:false})
   ]);
   if(p.error) setError(p.error.message); else setPatient(p.data);
   if(d.error) setError(d.error.message); else setDocuments(d.data||[]);
   if(m.error) setError(m.error.message); else setMessages(m.data||[]);
   if(q.error) setError(q.error.message); else setQuotes(q.data||[]);
   setLoading(false);
 };
 useEffect(()=>{void load()},[id]);

 const saveStatus=async()=>{
   const client=supabase;if(!client||!caseRow) return;
   setSaving(true);setError('');
   const r=await client.from('medical_cases').update({status}).eq('id',caseRow.id);
   if(r.error)setError(r.error.message);else await load();
   setSaving(false);
 };

 const sendMessage=async(e:FormEvent)=>{
   e.preventDefault();const client=supabase;
   if(!client||!user||!caseRow||!messageBody.trim())return;
   setSaving(true);const r=await client.from('case_messages').insert({case_id:caseRow.id,sender_id:user.id,body:messageBody.trim()});
   if(r.error)setError(r.error.message);else{setMessageBody('');await load();}setSaving(false);
 };

 const createQuote=async(e:FormEvent)=>{
   e.preventDefault();const client=supabase;if(!client||!caseRow)return;
   setSaving(true);setError('');
   const r=await client.from('quotes').insert({case_id:caseRow.id,currency:quote.currency,medical_cost:Number(quote.medical_cost||0),accommodation_cost:Number(quote.accommodation_cost||0),transport_cost:Number(quote.transport_cost||0),coordination_fee:Number(quote.coordination_fee||0),valid_until:quote.valid_until||null,notes:quote.notes||null,status:'sent'});
   if(r.error)setError(r.error.message);else{await client.from('medical_cases').update({status:'quote_sent'}).eq('id',caseRow.id);setQuote({medical_cost:'',accommodation_cost:'',transport_cost:'',coordination_fee:'',currency:'USD',valid_until:'',notes:''});await load();}setSaving(false);
 };

 const openDocument=async(doc:Row)=>{const client=supabase;if(!client)return;const r=await client.storage.from('medical-documents').createSignedUrl(doc.storage_path,600);if(r.error)setError(r.error.message);else window.open(r.data.signedUrl,'_blank','noopener,noreferrer');};

 if(loading)return <PortalShell admin><div className="route-loading">Loading case…</div></PortalShell>;
 if(!caseRow)return <PortalShell admin><section className="portal-card empty-state"><FileText/><h2>Case not found</h2><Link className="cta" to="/admin/cases">Back to cases</Link></section></PortalShell>;

 return <PortalShell admin>
   <div className="portal-top"><div><span className="label">CASE {caseRow.case_number}</span><h1>{patient?.full_name||'Patient case'}</h1><p>{patient?.country||'—'} · {caseRow.specialties?.name||'—'}</p></div><Link className="ghost link-button" to="/admin/cases">Back to cases</Link></div>
   {error&&<div className="form-error">{error}</div>}
   <div className="admin-case-grid">
     <section className="portal-card"><h2>Clinical request</h2><p><b>Medical history</b></p><p>{caseRow.medical_summary||'—'}</p><p><b>Patient request</b></p><p>{caseRow.patient_request||'—'}</p><div className="case-contact"><span>{patient?.phone||'No phone'}</span><span>{patient?.preferred_language||'English'}</span></div></section>
     <aside className="portal-card"><ShieldCheck/><h3>Case status</h3><select value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}</select><button className="cta full" disabled={saving||status===caseRow.status} onClick={saveStatus}>Save status</button></aside>
   </div>
   <div className="admin-case-grid admin-case-lower">
     <section className="portal-card"><div className="card-title"><div><h2>Documents</h2><p>Private patient uploads.</p></div><span>{documents.length}</span></div><div className="document-list">{documents.length?documents.map(d=><button key={d.id} onClick={()=>openDocument(d)}><Paperclip/><span><b>{d.original_filename||'Document'}</b><small>{new Date(d.created_at).toLocaleString()}</small></span></button>):<p className="muted">No documents.</p>}</div></section>
     <section className="portal-card"><h2>Quotes</h2>{quotes.length?<div className="simple-list">{quotes.map(q=><div key={q.id}><span><b>{q.currency} {Number(q.total||0).toLocaleString()}</b><small>{q.status}</small></span><em>{new Date(q.created_at).toLocaleDateString()}</em></div>)}</div>:<p className="muted">No quotes yet.</p>}</section>
   </div>
   <section className="portal-card message-panel"><div className="card-title"><div><h2>Case messages</h2><p>Secure conversation with the patient.</p></div></div><div className="message-list">{messages.length?messages.map(m=><div className={m.sender_id===user?.id?'message mine':'message'} key={m.id}><b>{m.sender_id===user?.id?'You':'Patient / care team'}</b><p>{m.body}</p><small>{new Date(m.created_at).toLocaleString()}</small></div>):<p className="muted">No messages yet.</p>}</div><form className="message-form" onSubmit={sendMessage}><textarea rows={3} value={messageBody} onChange={e=>setMessageBody(e.target.value)} placeholder="Reply to this case..."/><button className="cta" disabled={saving||!messageBody.trim()}><Send size={16}/>Send</button></form></section>
   {(profile?.role==='admin'||profile?.role==='coordinator')&&<section className="portal-card quote-builder"><h2>Create quote</h2><form className="quote-form" onSubmit={createQuote}><div className="two"><label>Medical cost<input type="number" min="0" step="0.01" value={quote.medical_cost} onChange={e=>setQuote({...quote,medical_cost:e.target.value})}/></label><label>Accommodation<input type="number" min="0" step="0.01" value={quote.accommodation_cost} onChange={e=>setQuote({...quote,accommodation_cost:e.target.value})}/></label></div><div className="two"><label>Transport<input type="number" min="0" step="0.01" value={quote.transport_cost} onChange={e=>setQuote({...quote,transport_cost:e.target.value})}/></label><label>Coordination fee<input type="number" min="0" step="0.01" value={quote.coordination_fee} onChange={e=>setQuote({...quote,coordination_fee:e.target.value})}/></label></div><div className="two"><label>Currency<select value={quote.currency} onChange={e=>setQuote({...quote,currency:e.target.value})}><option>USD</option><option>EUR</option><option>GBP</option></select></label><label>Valid until<input type="date" value={quote.valid_until} onChange={e=>setQuote({...quote,valid_until:e.target.value})}/></label></div><label>Notes<textarea rows={3} value={quote.notes} onChange={e=>setQuote({...quote,notes:e.target.value})}/></label><button className="cta" disabled={saving}>Send quote</button></form></section>}
 </PortalShell>
}
