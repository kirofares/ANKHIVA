import { useEffect, useState } from 'react';
import { CalendarCheck, CheckCircle2, Clock3, FileText, MessageSquareText, Plane, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import PortalShell from '../components/PortalShell';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth';

type CaseRow={id:string;case_number:string;status:string;created_at:string;specialties:{name:string}|null};

const statusLabel=(status:string)=>({
 submitted:'Submitted',awaiting_documents:'Awaiting documents',medical_review:'Medical review',plan_ready:'Plan ready',
 quote_sent:'Quote sent',travel_confirmed:'Travel confirmed',in_treatment:'In treatment',follow_up:'Follow-up',closed:'Closed'
}[status]||status);

export default function PatientPortal(){
  const {user,profile}=useAuth();
  const [caseRow,setCaseRow]=useState<CaseRow|null>(null);
  const [docs,setDocs]=useState(0);
  const [messages,setMessages]=useState(0);
  const [quoteStatus,setQuoteStatus]=useState('Not issued');
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  useEffect(()=>{
    if(!supabase||!user) return;
    const load=async()=>{
      setLoading(true);setError('');
      const {data,error}=await supabase.from('medical_cases')
        .select('id,case_number,status,created_at,specialties(name)')
        .eq('patient_id',user.id).order('created_at',{ascending:false}).limit(1).maybeSingle();
      if(error){setError(error.message);setLoading(false);return;}
      const latest=(data as unknown as CaseRow|null);
      setCaseRow(latest);
      if(latest){
        const [d,m,q]=await Promise.all([
          supabase.from('case_documents').select('*',{count:'exact',head:true}).eq('case_id',latest.id),
          supabase.from('case_messages').select('*',{count:'exact',head:true}).eq('case_id',latest.id),
          supabase.from('quotes').select('status').eq('case_id',latest.id).order('created_at',{ascending:false}).limit(1).maybeSingle()
        ]);
        setDocs(d.count||0);setMessages(m.count||0);setQuoteStatus(q.data?.status?statusLabel(q.data.status):'Not issued');
      }
      setLoading(false);
    };
    void load();
  },[user]);

  if(loading) return <PortalShell><div className="route-loading">Loading your secure case…</div></PortalShell>;

  const firstName=(profile?.full_name||user?.email||'Patient').split(' ')[0];

  if(!caseRow) return <PortalShell><div className="portal-top"><div><span className="label">PATIENT PORTAL</span><h1>Welcome, {firstName}</h1><p>Your secure account is ready.</p></div></div><section className="portal-card empty-state"><ShieldCheck/><h2>No medical case yet</h2><p>Start a medical review to create your first ANKHIVA case.</p>{error&&<div className="form-error">{error}</div>}<Link className="cta" to="/intake">Start medical review</Link></section></PortalShell>;

  const current=statusLabel(caseRow.status);
  return <PortalShell>
    <div className="portal-top"><div><span className="label">PATIENT PORTAL</span><h1>Welcome, {firstName}</h1><p>Your ANKHIVA case is organized here from medical review through follow-up.</p></div><span className="status-pill">Case {caseRow.case_number}</span></div>
    {error&&<div className="form-error">{error}</div>}
    <div className="portal-kpis">
      <div><Clock3/><span><small>Current stage</small><b>{current}</b></span></div>
      <div><CalendarCheck/><span><small>Treatment</small><b>{caseRow.specialties?.name||'Medical review'}</b></span></div>
      <div><FileText/><span><small>Documents</small><b>{docs} uploaded</b></span></div>
      <div><MessageSquareText/><span><small>Quote</small><b>{quoteStatus}</b></span></div>
    </div>
    <div className="portal-grid">
      <section className="portal-card">
        <div className="card-title"><h2>Your care journey</h2><Link className="text-link" to="/patient/case">View case</Link></div>
        <div className="timeline">
          <div className="done"><CheckCircle2/><span><b>Case submitted</b><small>Your request is securely stored.</small></span></div>
          <div className={caseRow.status==='submitted'?'current':'done'}><FileText/><span><b>Documents & case preparation</b><small>Add reports and imaging when available.</small></span></div>
          <div className={['medical_review'].includes(caseRow.status)?'current':(['plan_ready','quote_sent','travel_confirmed','in_treatment','follow_up','closed'].includes(caseRow.status)?'done':'')}><Clock3/><span><b>Specialist medical review</b><small>Clinical review and treatment planning.</small></span></div>
          <div className={['plan_ready','quote_sent'].includes(caseRow.status)?'current':(['travel_confirmed','in_treatment','follow_up','closed'].includes(caseRow.status)?'done':'')}><FileText/><span><b>Treatment plan & quote</b><small>Issued after adequate medical review.</small></span></div>
          <div className={caseRow.status==='travel_confirmed'?'current':(['in_treatment','follow_up','closed'].includes(caseRow.status)?'done':'')}><Plane/><span><b>Travel planning</b><small>Travel logistics follow clinical clearance.</small></span></div>
        </div>
      </section>
      <aside className="portal-card coordinator">
        <ShieldCheck/>
        <h3>International patient coordination</h3>
        <p>{messages?messages+' case message'+(messages===1?'':'s')+' available':'Your coordinator will appear here when assigned.'}</p>
        <Link className="cta full" to="/patient/case">Open case & documents</Link>
        <Link className="ghost full link-button portal-second-action" to="/patient/quote">View quote</Link>
        <small>For emergencies, contact local emergency services. This portal is not an emergency channel.</small>
      </aside>
    </div>
  </PortalShell>;
}
