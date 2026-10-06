import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PortalShell from '../components/PortalShell';
import { supabase } from '../lib/supabase';

type AnyRow=Record<string,any>;

export default function AdminSection(){
 const path=useLocation().pathname;
 const key=path.split('/').pop()||'cases';
 const title:Record<string,string>={cases:'Cases',patients:'Patients',providers:'Providers',packages:'Packages',quotes:'Quotes',messages:'Inbox',settings:'Settings'};
 const [rows,setRows]=useState<AnyRow[]>([]);
 const [profiles,setProfiles]=useState<Record<string,AnyRow>>({});
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');

 useEffect(()=>{
   const client=supabase;
   if(!client) return;
   const load=async()=>{
     setLoading(true);setError('');setRows([]);setProfiles({});
     try{
       if(key==='cases'){
         const r=await client.from('medical_cases').select('id,case_number,patient_id,status,urgency,created_at,specialties(name)').order('created_at',{ascending:false}).limit(100);
         if(r.error) throw r.error;
         const list=(r.data||[]) as AnyRow[]; setRows(list);
         const ids=[...new Set(list.map(x=>x.patient_id).filter(Boolean))];
         if(ids.length){
           const p=await client.from('profiles').select('id,full_name,country,phone,preferred_language').in('id',ids);
           if(p.error) throw p.error;
           setProfiles(Object.fromEntries((p.data||[]).map((x:any)=>[x.id,x])));
         }
       }else if(key==='patients'){
         const r=await client.from('profiles').select('id,full_name,country,phone,preferred_language,created_at').eq('role','patient').order('created_at',{ascending:false}).limit(100);
         if(r.error) throw r.error; setRows((r.data||[]) as AnyRow[]);
       }else if(key==='providers'){
         const r=await client.from('providers').select('id,name,type,city,country,verified,published,created_at').order('created_at',{ascending:false});
         if(r.error) throw r.error; setRows((r.data||[]) as AnyRow[]);
       }else if(key==='packages'){
         const r=await client.from('treatment_packages').select('id,title,currency,starting_price,published,created_at,specialties(name),providers(name)').order('created_at',{ascending:false});
         if(r.error) throw r.error; setRows((r.data||[]) as AnyRow[]);
       }else if(key==='quotes'){
         const r=await client.from('quotes').select('id,case_id,currency,total,status,valid_until,created_at,medical_cases(case_number)').order('created_at',{ascending:false}).limit(100);
         if(r.error) throw r.error; setRows((r.data||[]) as AnyRow[]);
       }else if(key==='messages'){
         const r=await client.from('case_messages').select('id,case_id,sender_id,body,created_at,medical_cases(case_number)').order('created_at',{ascending:false}).limit(100);
         if(r.error) throw r.error; setRows((r.data||[]) as AnyRow[]);
       }
     }catch(err){setError(err instanceof Error?err.message:'Could not load data.');}
     finally{setLoading(false);}
   }; void load();
 },[key]);

 return <PortalShell admin><div className="portal-top"><div><span className="label">ADMIN · LIVE BACKEND</span><h1>{title[key]||'Operations'}</h1><p>Data shown here is loaded from the dedicated ANKHIVA Supabase project.</p></div></div>
 {error&&<div className="form-error">{error}</div>}
 <section className="portal-card">
   {loading&&<p className="muted">Loading…</p>}
   {!loading&&key==='cases'&&<div className="case-table"><div className="case-row head"><span>Case</span><span>Patient</span><span>Treatment</span><span>Status</span><span>Action</span></div>{rows.length?rows.map(c=>{const p=profiles[c.patient_id]||{};return <div className="case-row" key={c.id}><b>{c.case_number}</b><span>{p.full_name||'Patient'}<small>{p.country||'—'}</small></span><span>{c.specialties?.name||'—'}</span><span><em>{String(c.status).replace(/_/g,' ')}</em></span><Link className="text-link" to={'/admin/cases/'+c.id}>Open</Link></div>}):<p className="muted">No cases yet.</p>}</div>}
   {!loading&&key==='patients'&&<div className="simple-list">{rows.length?rows.map(p=><div key={p.id}><span><b>{p.full_name||'Unnamed patient'}</b><small>{p.country||'—'} · {p.preferred_language||'English'}</small></span><em>{p.phone||'No phone'}</em></div>):<p className="muted">No patients yet.</p>}</div>}
   {!loading&&key==='providers'&&<div className="simple-list">{rows.length?rows.map(p=><div key={p.id}><span><b>{p.name}</b><small>{p.type} · {p.city||'Egypt'}</small></span><em>{p.verified?'Verified':'Pending'} · {p.published?'Published':'Hidden'}</em></div>):<p className="muted">No live providers yet. Add only after verification.</p>}</div>}
   {!loading&&key==='packages'&&<div className="simple-list">{rows.length?rows.map(p=><div key={p.id}><span><b>{p.title}</b><small>{p.specialties?.name||'—'} · {p.providers?.name||'No provider'}</small></span><em>{p.currency} {Number(p.starting_price||0).toLocaleString()} · {p.published?'Published':'Hidden'}</em></div>):<p className="muted">No live packages yet.</p>}</div>}
   {!loading&&key==='quotes'&&<div className="simple-list">{rows.length?rows.map(q=><div key={q.id}><span><b>{q.medical_cases?.case_number||'Case'}</b><small>{q.status} · {q.valid_until?'Valid to '+new Date(q.valid_until).toLocaleDateString():'No expiry'}</small></span><em>{q.currency} {Number(q.total||0).toLocaleString()}</em></div>):<p className="muted">No quotes yet.</p>}</div>}
   {!loading&&key==='messages'&&<div className="simple-list">{rows.length?rows.map(m=><div key={m.id}><span><b>{m.medical_cases?.case_number||'Case message'}</b><small>{m.body.length>90?m.body.slice(0,90)+'…':m.body}</small></span><em>{new Date(m.created_at).toLocaleString()}</em></div>):<p className="muted">No messages yet.</p>}</div>}
   {key==='settings'&&<p>Planned settings: staff roles, provider verification workflow, currencies, languages, notifications and legal text versions.</p>}
 </section></PortalShell>
}
