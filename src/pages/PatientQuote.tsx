import { useEffect, useState } from 'react';
import { CircleDollarSign, Info } from 'lucide-react';
import PortalShell from '../components/PortalShell';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth';

type Quote={currency:string;medical_cost:number;accommodation_cost:number;transport_cost:number;coordination_fee:number;total:number|null;status:string;valid_until:string|null;notes:string|null};

export default function PatientQuote(){
 const {user}=useAuth();
 const [quote,setQuote]=useState<Quote|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{
   if(!supabase||!user) return;
   const load=async()=>{
     setLoading(true);
     const c=await supabase.from('medical_cases').select('id').eq('patient_id',user.id).order('created_at',{ascending:false}).limit(1).maybeSingle();
     if(c.error){setError(c.error.message);setLoading(false);return;}
     if(c.data){
       const q=await supabase.from('quotes').select('currency,medical_cost,accommodation_cost,transport_cost,coordination_fee,total,status,valid_until,notes').eq('case_id',c.data.id).order('created_at',{ascending:false}).limit(1).maybeSingle();
       if(q.error) setError(q.error.message); else setQuote(q.data as Quote|null);
     }
     setLoading(false);
   }; void load();
 },[user]);

 if(loading) return <PortalShell><div className="route-loading">Loading quote…</div></PortalShell>;
 return <PortalShell><div className="portal-top"><div><span className="label">TREATMENT QUOTE</span><h1>Your quotation</h1><p>Quotes appear here after clinical review and provider confirmation.</p></div></div>
 {error&&<div className="form-error">{error}</div>}
 {!quote?<section className="portal-card empty-state"><CircleDollarSign/><h2>No quote issued yet</h2><p>Your care team will publish a quote here when the medical plan is ready.</p></section>:
 <section className="portal-card quote-card"><div className="quote-status-row"><span className="status-pill">{quote.status}</span>{quote.valid_until&&<small>Valid until {new Date(quote.valid_until).toLocaleDateString()}</small>}</div><div className="quote-line"><span>Medical care</span><b>{quote.currency} {Number(quote.medical_cost).toLocaleString()}</b></div><div className="quote-line"><span>Accommodation</span><b>{quote.currency} {Number(quote.accommodation_cost).toLocaleString()}</b></div><div className="quote-line"><span>Local transport</span><b>{quote.currency} {Number(quote.transport_cost).toLocaleString()}</b></div><div className="quote-line"><span>Coordination fee</span><b>{quote.currency} {Number(quote.coordination_fee).toLocaleString()}</b></div><div className="quote-line total"><span>Total</span><b>{quote.currency} {Number(quote.total||0).toLocaleString()}</b></div>{quote.notes&&<p>{quote.notes}</p>}<div className="privacy-note"><Info/>A quote is not a guarantee of treatment suitability or outcome. Clinical details may change after examination or additional testing.</div></section>}
 </PortalShell>
}
