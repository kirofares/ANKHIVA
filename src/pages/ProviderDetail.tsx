import { ArrowLeft, BadgeCheck, Languages, MapPin, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PublicShell from '../components/PublicShell';
import { providers } from '../data';

export default function ProviderDetail(){
  const {id}=useParams(); const p=providers.find(x=>x.id===id);
  if(!p) return <Navigate to="/providers" replace/>;
  return <PublicShell><main className="shell section">
    <Link className="back-link" to="/providers"><ArrowLeft size={16}/> Provider network</Link>
    <div className="profile-hero">
      <div className="large-avatar" aria-hidden="true">𓋹</div>
      <div><span className="label">{p.type.toUpperCase()} PROFILE · DEMO</span><h1 className="catalog-title">{p.name}</h1><p className="catalog-lead">{p.specialty} · {p.city}, Egypt</p></div>
      <span className={p.verified?'verify ok':'verify'}>{p.verified?<><BadgeCheck size={15}/> Demo verified status</>:'Pending verification'}</span>
    </div>
    <div className="profile-grid">
      <section className="portal-card"><h2>Provider overview</h2><p>This is a demonstration profile. Before production publication, credentials, licensure, facility privileges and operational quality checks must be documented.</p><div className="meta"><span><MapPin/> {p.city}, Egypt</span><span><Languages/> {p.languages.join(', ')}</span><span><ShieldCheck/> Verification workflow required before live launch</span></div></section>
      <aside className="portal-card"><h3>Interested in this provider?</h3><p>Submit your medical request first so the team can assess suitability and availability.</p><Link className="cta full" to="/intake">Start medical review</Link></aside>
    </div>
  </main></PublicShell>
}
