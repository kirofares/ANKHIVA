import { ArrowLeft, Check, CircleDollarSign, MoonStar, X } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PublicShell from '../components/PublicShell';
import { packages } from '../data';

export default function PackageDetail(){
  const {id}=useParams(); const p=packages.find(x=>x.id===id);
  if(!p) return <Navigate to="/packages" replace/>;
  return <PublicShell><main className="shell section">
    <Link className="back-link" to="/packages"><ArrowLeft size={16}/> All packages</Link>
    <span className="label">INDICATIVE PACKAGE · DEMO</span><h1 className="catalog-title">{p.title}</h1><p className="catalog-lead">{p.provider} · {p.specialty}</p>
    <div className="profile-grid">
      <section className="portal-card">
        <div className="package-summary"><div><CircleDollarSign/><small>Indicative starting price</small><b>{p.currency} {p.fromPrice.toLocaleString()}</b></div><div><MoonStar/><small>Suggested stay</small><b>{p.nights} nights</b></div></div>
        <h2>Included in this example</h2><ul className="included-list">{p.includes.map(x=><li key={x}><Check/>{x}</li>)}</ul>
        <h2>Not automatically included</h2><ul className="included-list excluded"><li><X/>Airfare</li><li><X/>Unexpected investigations or extended admission</li><li><X/>Treatment changes after specialist assessment</li></ul>
      </section>
      <aside className="portal-card"><h3>Final price requires medical review</h3><p>Real quotes depend on diagnosis, clinical complexity, provider availability, tests and travel requirements.</p><Link className="cta full" to="/intake">Get personalized quote</Link></aside>
    </div>
  </main></PublicShell>
}
