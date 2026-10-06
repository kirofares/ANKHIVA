import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicShell from '../components/PublicShell';
import { specialties } from '../data';

export default function Treatments(){
  return <PublicShell><main className="shell section">
    <span className="label">TREATMENTS</span>
    <h1 className="catalog-title">Medical journeys built around specialist review</h1>
    <p className="catalog-lead">Explore ANKHIVA's core treatment categories. Every real case should be assessed individually before treatment, price or travel plans are confirmed.</p>
    <div className="service-grid detail-grid">
      {specialties.map(s=><article className="service-card" key={s.slug}><div className="glyph-chip" aria-hidden="true">𓋹</div><h3>{s.name}</h3><p>{s.description}</p><Link className="text-link" to={'/treatments/'+s.slug}>View treatment journey <ArrowRight size={16}/></Link></article>)}
    </div>
  </main></PublicShell>
}
