import { Link, useLocation } from 'react-router-dom';
import PortalShell from '../components/PortalShell';
import { demoCases, packages, providers } from '../data';

export default function AdminSection(){
 const path=useLocation().pathname;
 const key=path.split('/').pop()||'cases';
 const title:Record<string,string>={cases:'Cases',patients:'Patients',providers:'Providers',packages:'Packages',quotes:'Quotes',messages:'Inbox',settings:'Settings'};
 return <PortalShell admin><div className="portal-top"><div><span className="label">ADMIN · DEMO</span><h1>{title[key]||'Operations'}</h1><p>Management UI using demonstration data only.</p></div><button className="cta">+ Add</button></div>
 <section className="portal-card">{key==='cases'&&<div className="case-table"><div className="case-row head"><span>Case</span><span>Patient</span><span>Treatment</span><span>Status</span><span>Action</span></div>{demoCases.map(c=><div className="case-row" key={c.id}><b>{c.id}</b><span>{c.patient}<small>{c.country}</small></span><span>{c.treatment}</span><span><em>{c.status}</em></span><Link className="text-link" to="/admin/cases">Open</Link></div>)}</div>}
 {key==='providers'&&<div className="simple-list">{providers.map(p=><div key={p.id}><span><b>{p.name}</b><small>{p.type} · {p.specialty}</small></span><em>{p.verified?'Verified demo':'Pending'}</em></div>)}</div>}
 {key==='packages'&&<div className="simple-list">{packages.map(p=><div key={p.id}><span><b>{p.title}</b><small>{p.specialty}</small></span><em>{p.currency} {p.fromPrice}</em></div>)}</div>}
 {key==='patients'&&<div className="simple-list">{demoCases.map(c=><div key={c.patient}><span><b>{c.patient}</b><small>{c.country}</small></span><em>{c.treatment}</em></div>)}</div>}
 {key==='quotes'&&<p>Quote pipeline UI is ready for backend connection: draft → sent → accepted / declined / expired.</p>}
 {key==='messages'&&<p>Coordinator inbox and case-based messaging will appear here when authentication and the ANKHIVA backend are activated.</p>}
 {key==='settings'&&<p>Planned settings: staff roles, provider verification workflow, currencies, languages, notifications and legal text versions.</p>}</section></PortalShell>
}
