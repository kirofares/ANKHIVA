import { AlertCircle, ArrowUpRight, BriefcaseMedical, CircleDollarSign, Clock3, UsersRound } from 'lucide-react';
import PortalShell from '../components/PortalShell';
import { demoCases } from '../data';

export default function AdminDashboard(){
  return <PortalShell admin>
    <div className="portal-top"><div><span className="label">OPERATIONS</span><h1>International patient dashboard</h1><p>Track leads, medical reviews, quotes and travel coordination.</p></div><button className="cta">+ New case</button></div>
    <div className="portal-kpis">
      <div><BriefcaseMedical/><span><small>Open cases</small><b>24</b></span></div>
      <div><Clock3/><span><small>Awaiting review</small><b>7</b></span></div>
      <div><UsersRound/><span><small>Travel this month</small><b>6</b></span></div>
      <div><CircleDollarSign/><span><small>Quotes pending</small><b>5</b></span></div>
    </div>
    <section className="portal-card">
      <div className="card-title"><div><h2>Active cases</h2><p>Demo data until Supabase is connected.</p></div><button className="text-btn">View all <ArrowUpRight size={16}/></button></div>
      <div className="case-table">
        <div className="case-row head"><span>Case</span><span>Patient</span><span>Treatment</span><span>Status</span><span>Priority</span></div>
        {demoCases.map(c=><div className="case-row" key={c.id}><b>{c.id}</b><span>{c.patient}<small>{c.country}</small></span><span>{c.treatment}</span><span><em>{c.status}</em></span><span className={c.priority==='High'?'priority high':'priority'}>{c.priority==='High'&&<AlertCircle size={14}/>} {c.priority}</span></div>)}
      </div>
    </section>
  </PortalShell>;
}
