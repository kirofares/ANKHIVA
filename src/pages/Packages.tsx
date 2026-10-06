import { Check, MoonStar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { packages } from '../data';

export default function Packages(){
 return <div className="catalog-page"><header className="catalog-nav"><Link to="/" className="simple-brand"><span className="mini-ankh" aria-hidden="true">𓋹</span> ANKH<span>IVA</span></Link><Link to="/intake" className="cta small">Get a personalized quote</Link></header>
 <div className="catalog-glyphbar" aria-hidden="true">𓋹 𓆸 𓇳 𓄤 𓋹</div><main className="shell section"><span className="label">TREATMENT PACKAGES</span><h1 className="catalog-title">Indicative medical travel packages</h1><p className="catalog-lead">These are example starting prices for the MVP. Final quotes must follow medical review and provider confirmation.</p>
 <div className="package-grid">{packages.map(p=><article className="package-card" key={p.id}><span className="package-specialty">{p.specialty}</span><h3>{p.title}</h3><p className="provider-line">{p.provider}</p><div className="price"><small>From</small><b>{p.currency} {p.fromPrice.toLocaleString()}</b></div><div className="night"><MoonStar size={17}/>{p.nights} nights suggested stay</div><ul>{p.includes.map(x=><li key={x}><Check size={16}/>{x}</li>)}</ul><Link className="cta full" to="/intake">Request this treatment</Link></article>)}</div>
 </main></div>
}
