import { BadgeCheck, Building2, Languages, MapPin, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { providers } from '../data';

export default function Providers(){
 return <div className="catalog-page"><header className="catalog-nav"><Link to="/" className="simple-brand"><span className="mini-ankh" aria-hidden="true">𓋹</span> ANKH<span>IVA</span></Link><Link to="/intake" className="cta small">Request medical review</Link></header>
 <div className="catalog-glyphbar" aria-hidden="true">𓋹 𓂀 𓆣 𓇳 𓄤</div><main className="shell section"><span className="label">PROVIDER NETWORK</span><h1 className="catalog-title">Selected doctors and facilities</h1><p className="catalog-lead">Provider profiles shown in this MVP are placeholders. Production listings will require documented verification before publication.</p>
 <div className="provider-grid">{providers.map(p=><article className="provider-card" key={p.id}><div className="provider-head"><div className="avatar">{p.type==='Doctor'?<UserRound/>:<Building2/>}</div><span className={p.verified?'verify ok':'verify'}>{p.verified&&<BadgeCheck size={15}/>} {p.verified?'Verified':'Pending verification'}</span></div><h3>{p.name}</h3><p>{p.type} · {p.specialty}</p><div className="meta"><span><MapPin/> {p.city}, Egypt</span><span><Languages/> {p.languages.join(', ')}</span></div><button className="ghost full">View profile</button></article>)}</div>
 </main></div>
}
