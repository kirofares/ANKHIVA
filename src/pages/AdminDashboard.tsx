import { useEffect, useState } from 'react';
import { AlertCircle, ArrowUpRight, BriefcaseMedical, CircleDollarSign, Clock3, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import PortalShell from '../components/PortalShell';
import { supabase } from '../lib/supabase';

type Row=Record<string,any>;

export default function AdminDashboard(){
  const [kpis,setKpis]=useState({open:0,review:0,travel:0,quotes:0});
  const [cases,setCases]=useState<Row[]>([]);
  const [profiles,setProfiles]=useState<Record<string,Row>>({});
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{
    const client=supabase;if(!client)return;
    const load=async()=>{
      setLoading(true);setError('');
      try{
        const [open,review,travel,quotes,list]=await Promise.all([
          client.from('medical_cases').select('*',{count:'exact',head:true}).neq('status','closed'),
          client.from('medical_cases').select('*',{count:'exact',head:true}).eq('status','medical_review'),
          client.from('medical_cases').select('*',{count:'exact',head:true}).eq('status','travel_confirmed'),
          client.from('quotes').select('*',{count:'exact',head:true}).eq('status','sent'),
          client.from('medical_cases').select('id,case_number,patient_id,status,urgency,created_at,specialties(name)').order('created_at',{ascending:false}).limit(10)
        ]);
        for(const result of [open,review,travel,quotes,list]) if(result.error) throw result.error;
        setKpis({open:open.count||0,review:review.count||0,travel:travel.count||0,quotes:quotes.count||0});
        const rows=(list.data||[]) as Row[];setCases(rows);
        const ids=[...new Set(rows.map(x=>x.patient_id).filter(Boolean))];
        if(ids.length){
          const p=await client.from('profiles').select('id,full_name,country').in('id',ids);
          if(p.error) throw p.error;
          setProfiles(Object.fromEntries((p.data||[]).map((x:any)=>[x.id,x])));
        }
      }catch(err){setError(err instanceof Error?err.message:'Could not load dashboard.');}
      finally{setLoading(false);}
    };void load();
  },[]);

  return <PortalShell admin>
    <div className="portal-top"><div><span className="label">OPERATIONS · LIVE</span><h1>International patient dashboard</h1><p>Secure case activity from the dedicated ANKHIVA backend.</p></div><Link className="cta" to="/admin/cases">Open cases</Link></div>
    {error&&<div className="form-error">{error}</div>}
    <div className="portal-kpis">
      <div><BriefcaseMedical/><span><small>Open cases</small><b>{loading?'—':kpis.open}</b></span></div>
      <div><Clock3/><span><small>Medical review</small><b>{loading?'—':kpis.review}</b></span></div>
      <div><UsersRound/><span><small>Travel confirmed</small><b>{loading?'—':kpis.travel}</b></span></div>
      <div><CircleDollarSign/><span><small>Quotes sent</small><b>{loading?'—':kpis.quotes}</b></span></div>
    </div>
    <section className="portal-card">
      <div className="card-title"><div><h2>Recent cases</h2><p>Real case rows visible to your staff role.</p></div><Link className="text-btn link-button" to="/admin/cases">View all <ArrowUpRight size={16}/></Link></div>
      <div className="case-table">
        <div className="case-row head"><span>Case</span><span>Patient</span><span>Treatment</span><span>Status</span><span>Priority</span></div>
        {!loading&&cases.length===0&&<p className="muted">No cases yet.</p>}
        {cases.map(c=>{const p=profiles[c.patient_id]||{};return <Link className="case-row case-row-link" key={c.id} to={'/admin/cases/'+c.id}><b>{c.case_number}</b><span>{p.full_name||'Patient'}<small>{p.country||'—'}</small></span><span>{c.specialties?.name||'—'}</span><span><em>{String(c.status).replace(/_/g,' ')}</em></span><span className={c.urgency==='high'?'priority high':'priority'}>{c.urgency==='high'&&<AlertCircle size={14}/>} {c.urgency}</span></Link>})}
      </div>
    </section>
  </PortalShell>;
}
