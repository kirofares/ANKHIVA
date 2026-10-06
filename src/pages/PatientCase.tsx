import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FileText, MessageSquareText, Paperclip, Send, ShieldCheck, Stethoscope, Upload } from 'lucide-react';
import PortalShell from '../components/PortalShell';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth';

type CaseRow={id:string;case_number:string;status:string;medical_summary:string|null;patient_request:string|null;specialties:{name:string}|null};
type Doc={id:string;storage_path:string;original_filename:string|null;mime_type:string|null;created_at:string};
type Msg={id:string;sender_id:string;body:string;created_at:string};

export default function PatientCase(){
 const {user}=useAuth();
 const [caseRow,setCaseRow]=useState<CaseRow|null>(null);
 const [documents,setDocuments]=useState<Doc[]>([]);
 const [messages,setMessages]=useState<Msg[]>([]);
 const [messageBody,setMessageBody]=useState('');
 const [loading,setLoading]=useState(true);
 const [uploading,setUploading]=useState(false);
 const [sending,setSending]=useState(false);
 const [error,setError]=useState('');

 const load=async()=>{
   const client=supabase;
   if(!client||!user) return;
   setLoading(true);setError('');
   const {data,error}=await client.from('medical_cases').select('id,case_number,status,medical_summary,patient_request,specialties(name)').eq('patient_id',user.id).order('created_at',{ascending:false}).limit(1).maybeSingle();
   if(error){setError(error.message);setLoading(false);return;}
   const latest=data as unknown as CaseRow|null; setCaseRow(latest);
   if(latest){
     const [docs,msgs]=await Promise.all([
       client.from('case_documents').select('id,storage_path,original_filename,mime_type,created_at').eq('case_id',latest.id).order('created_at',{ascending:false}),
       client.from('case_messages').select('id,sender_id,body,created_at').eq('case_id',latest.id).order('created_at',{ascending:true})
     ]);
     if(docs.error) setError(docs.error.message); else setDocuments((docs.data||[]) as Doc[]);
     if(msgs.error) setError(msgs.error.message); else setMessages((msgs.data||[]) as Msg[]);
   }
   setLoading(false);
 };
 useEffect(()=>{void load()},[user]);

 const upload=async(e:ChangeEvent<HTMLInputElement>)=>{
   const file=e.target.files?.[0]; e.target.value='';
   const client=supabase;
   if(!file||!client||!user||!caseRow) return;
   setError('');
   if(file.size>25*1024*1024){setError('Maximum file size is 25 MB.');return;}
   if(!['application/pdf','image/jpeg','image/png'].includes(file.type)){setError('Upload PDF, JPEG or PNG files only.');return;}
   setUploading(true);
   const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
   const path=user.id+'/'+caseRow.id+'/'+crypto.randomUUID()+'-'+safe;
   try{
     const storage=await client.storage.from('medical-documents').upload(path,file,{upsert:false,contentType:file.type});
     if(storage.error) throw storage.error;
     const row=await client.from('case_documents').insert({case_id:caseRow.id,patient_id:user.id,storage_path:path,original_filename:file.name,mime_type:file.type,document_type:'patient_upload'});
     if(row.error){await client.storage.from('medical-documents').remove([path]);throw row.error;}
     await load();
   }catch(err){setError(err instanceof Error?err.message:'Upload failed.');}
   finally{setUploading(false);}
 };

 const openDocument=async(doc:Doc)=>{
   const client=supabase;
   if(!client) return;
   const {data,error}=await client.storage.from('medical-documents').createSignedUrl(doc.storage_path,600);
   if(error){setError(error.message);return;}
   window.open(data.signedUrl,'_blank','noopener,noreferrer');
 };

 const sendMessage=async(e:FormEvent)=>{
   e.preventDefault();
   const client=supabase;
   if(!client||!user||!caseRow||!messageBody.trim()) return;
   setSending(true);setError('');
   const {error}=await client.from('case_messages').insert({case_id:caseRow.id,sender_id:user.id,body:messageBody.trim()});
   if(error) setError(error.message); else {setMessageBody('');await load();}
   setSending(false);
 };

 if(loading) return <PortalShell><div className="route-loading">Loading case…</div></PortalShell>;
 if(!caseRow) return <PortalShell><section className="portal-card empty-state"><Stethoscope/><h2>No case found</h2><p>Submit a medical request first.</p></section></PortalShell>;

 return <PortalShell>
   <div className="portal-top"><div><span className="label">CASE {caseRow.case_number}</span><h1>{caseRow.specialties?.name||'Medical case'}</h1><p>Your latest secure ANKHIVA case.</p></div><span className="status-pill">{caseRow.status.replace(/_/g,' ')}</span></div>
   {error&&<div className="form-error">{error}</div>}
   <div className="portal-grid">
     <section className="portal-card"><h2>Case summary</h2><div className="case-detail-list"><p><Stethoscope/><span><b>Medical history</b><small>{caseRow.medical_summary||'Not provided'}</small></span></p><p><FileText/><span><b>Your request</b><small>{caseRow.patient_request||'Not provided'}</small></span></p></div>
       <div className="card-title"><div><h2>Medical documents</h2><p>Private PDF/JPEG/PNG files, maximum 25 MB each.</p></div><label className="cta upload-label"><Upload size={16}/>{uploading?'Uploading…':'Upload'}<input type="file" disabled={uploading} accept=".pdf,image/jpeg,image/png" onChange={upload}/></label></div>
       <div className="document-list">{documents.length?documents.map(d=><button key={d.id} onClick={()=>openDocument(d)}><Paperclip/><span><b>{d.original_filename||'Medical document'}</b><small>{new Date(d.created_at).toLocaleDateString()}</small></span></button>):<p className="muted">No documents uploaded yet.</p>}</div>
     </section>
     <aside className="portal-card"><ShieldCheck/><h3>Private document storage</h3><p>Files are stored in a private Supabase bucket. Access is restricted to the patient and authorized case staff by row-level policies.</p><small>Signed document links expire automatically.</small></aside>
   </div>
   <section className="portal-card message-panel"><div className="card-title"><div><h2>Case messages</h2><p>Secure messages linked to this medical case.</p></div><MessageSquareText/></div><div className="message-list">{messages.length?messages.map(m=><div className={m.sender_id===user?.id?'message mine':'message'} key={m.id}><b>{m.sender_id===user?.id?'You':'ANKHIVA care team'}</b><p>{m.body}</p><small>{new Date(m.created_at).toLocaleString()}</small></div>):<p className="muted">No messages yet.</p>}</div><form className="message-form" onSubmit={sendMessage}><textarea rows={3} value={messageBody} onChange={e=>setMessageBody(e.target.value)} placeholder="Write a message to your care team..."/><button className="cta" disabled={sending||!messageBody.trim()}><Send size={16}/>{sending?'Sending…':'Send'}</button></form></section>
 </PortalShell>
}
