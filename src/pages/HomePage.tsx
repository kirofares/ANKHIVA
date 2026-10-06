import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, CalendarCheck, CheckCircle2, CircleDollarSign,
  HeartPulse, Hotel, Landmark, Mail, Menu, MessageCircle, Plane,
  ShieldCheck, Sparkles, Stethoscope, UserRoundCheck, X
} from 'lucide-react';
import { packages, providers, specialties } from '../data';

const steps = [
  ['1','Send your medical request','Tell us what you need and share available reports securely.'],
  ['2','Medical review','We coordinate review with a suitable specialist and care team.'],
  ['3','Receive your plan','Receive a treatment pathway, estimated cost and expected stay.'],
  ['4','Travel to Egypt','Appointments, airport pickup, accommodation and local support are coordinated.'],
  ['5','Treatment & recovery','Care is coordinated from admission through discharge and recovery.'],
  ['6','Follow-up at home','Your follow-up stays organized after you return home.']
];

export default function HomePage(){
  const [menuOpen,setMenuOpen]=useState(false);
  const navigate=useNavigate();
  const go=(id:string)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenuOpen(false)};
  return <div>
    <header className="nav-wrap">
      <nav className="nav shell">
        <button className="brand" onClick={()=>go('home')}><span className="brand-emblem" aria-hidden="true">𓋹</span><span className="brand-copy"><span className="ankh">ANKH</span><span className="iva">IVA</span><small>INTERNATIONAL MEDICAL CARE</small></span></button>
        <div className="desktop-nav">
          <Link className="nav-link" to="/treatments">Treatments</Link><button onClick={()=>go('journey')}>Patient Journey</button><Link className="nav-link" to="/why-egypt">Why Egypt</Link><Link className="nav-link" to="/providers">Providers</Link>
        </div>
        <button className="cta small" onClick={()=>navigate('/intake')}>Free Medical Review</button>
        <button className="menu-btn" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X/>:<Menu/>}</button>
      </nav>
      {menuOpen&&<div className="mobile-nav"><button onClick={()=>navigate('/treatments')}>Treatments</button><button onClick={()=>go('journey')}>Patient Journey</button><button onClick={()=>navigate('/why-egypt')}>Why Egypt</button><button onClick={()=>navigate('/providers')}>Providers</button><button onClick={()=>navigate('/intake')}>Free Medical Review</button></div>}
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-art" aria-hidden="true"><div className="sun"/><div className="pyramid one"/><div className="pyramid two"/><div className="desert"/></div>
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={16}/> International Medical Care in Egypt</div><div className="hieroglyph-band" aria-label="Decorative ancient Egyptian symbols">𓋹 𓂀 𓆣 𓇳 𓄤</div>
            <h1>World-class care.<br/><span>Egyptian hospitality.</span></h1>
            <p>ANKHIVA coordinates your medical journey in Egypt — from specialist review and treatment planning to travel, accommodation, recovery and follow-up.</p>
            <div className="hero-actions"><button className="cta" onClick={()=>navigate('/intake')}>Get a Free Medical Review <ArrowRight size={18}/></button><button className="ghost" onClick={()=>go('services')}>Explore Treatments</button></div>
            <div className="trust-row"><span><ShieldCheck/> Carefully selected providers</span><span><CircleDollarSign/> Transparent planning</span><span><MessageCircle/> International patient support</span></div>
          </div>
          <div className="hero-card"><div className="card-kicker">THE ANKHIVA PROMISE</div><h3>One coordinator. One clear journey.</h3><ul><li><CheckCircle2/> Specialist matching and initial case review</li><li><CheckCircle2/> Treatment plan and estimated package cost</li><li><CheckCircle2/> Airport, hotel and appointment coordination</li><li><CheckCircle2/> Recovery logistics and post-travel follow-up</li></ul><div className="response"><HeartPulse/><span><b>Patient-first coordination</b><small>Designed for international patients</small></span></div></div>
        </div>
      </section>

      <div className="egyptian-divider" aria-hidden="true"><span>𓆸</span><i></i><span>𓋹</span><i></i><span>𓆸</span></div><section className="section shell" id="services">
        <div className="section-head"><div><span className="label">TREATMENTS</span><h2>Focused specialties for medical travelers</h2></div><p>High-demand categories where international patients need clear clinical review, trusted providers and travel coordination.</p></div>
        <div className="service-grid">{specialties.map((s,i)=><article className="service-card" key={s.slug}><div className="service-icon">{[<Sparkles/>,<BadgeCheck/>,<UserRoundCheck/>,<Stethoscope/>,<HeartPulse/>,<ShieldCheck/>][i]}</div><h3>{s.name}</h3><p>{s.description}</p><button onClick={()=>navigate('/treatments/'+s.slug)}>Explore treatment <ArrowRight size={16}/></button></article>)}</div>
      </section>

      <section className="dark-section" id="journey"><div className="shell"><div className="section-head light"><div><span className="label gold">PATIENT JOURNEY</span><h2>From first message to follow-up at home</h2></div><p>Medical and travel logistics are managed as one coordinated pathway.</p></div><div className="steps">{steps.map(([n,t,d])=><div className="step" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>

      <section className="section shell" id="why-egypt"><div className="why-grid"><div><span className="label">WHY EGYPT</span><h2>Premium care with a destination experience</h2><p className="lead">ANKHIVA positions Egypt as a complete medical journey built around clinical coordination, convenience and recovery.</p><div className="why-points"><div><Stethoscope/><span><b>Experienced specialists</b><small>Access to selected clinicians in high-demand specialties.</small></span></div><div><CircleDollarSign/><span><b>Competitive treatment value</b><small>Attractive total-care economics for international self-pay patients.</small></span></div><div><Plane/><span><b>Accessible destination</b><small>Strong connectivity with Europe, the Gulf and regional markets.</small></span></div><div><Landmark/><span><b>Recovery with culture</b><small>Optional companion and leisure coordination around medical needs.</small></span></div></div></div>
        <div className="experience-card"><div className="experience-top"><Landmark size={30}/><span>EGYPTIAN HERITAGE<br/><b>MODERN MEDICAL CARE</b></span></div><div className="mini-grid"><div><Plane/><b>Airport</b><span>Pickup</span></div><div><Hotel/><b>Stay</b><span>Hotel options</span></div><div><CalendarCheck/><b>Care</b><span>Appointments</span></div><div><MessageCircle/><b>Support</b><span>Coordinator</span></div></div></div></div></section>

      <section className="section tinted"><div className="shell trust-panel"><div><span className="label">WHY ANKHIVA</span><h2>Built around trust, clarity and continuity</h2></div><div className="trust-cards"><div><ShieldCheck/><h3>Provider screening</h3><p>Clinical partners are intended to be published only after documented verification.</p></div><div><BadgeCheck/><h3>Clear patient information</h3><p>Structured plans, estimated costs and travel requirements before booking.</p></div><div><UserRoundCheck/><h3>Human coordination</h3><p>A dedicated workflow connects the patient, provider and travel plan.</p></div></div></div></section>

      <section className="section shell featured-section">
        <div className="section-head"><div><span className="label">EXPLORE ANKHIVA</span><h2>Providers and treatment packages</h2></div><p>Browse the demonstration network and indicative package structure before starting your individual medical review.</p></div>
        <div className="featured-columns">
          <div><div className="card-title"><h2>Featured providers</h2><Link className="text-link" to="/providers">View all <ArrowRight size={16}/></Link></div><div className="home-list">{providers.slice(0,3).map(p=><Link to={'/providers/'+p.id} key={p.id}><span><b>{p.name}</b><small>{p.specialty} · {p.city}</small></span><ArrowRight size={17}/></Link>)}</div></div>
          <div><div className="card-title"><h2>Popular package examples</h2><Link className="text-link" to="/packages">View all <ArrowRight size={16}/></Link></div><div className="home-list">{packages.slice(0,3).map(p=><Link to={'/packages/'+p.id} key={p.id}><span><b>{p.title}</b><small>From {p.currency} {p.fromPrice.toLocaleString()} · {p.nights} nights</small></span><ArrowRight size={17}/></Link>)}</div></div>
        </div>
        <div className="home-info-links"><Link to="/about">About ANKHIVA</Link><Link to="/faq">Frequently asked questions</Link><Link to="/contact">Contact international patient support</Link></div>
      </section>

      <section className="consult"><div className="shell consult-grid"><div><span className="label gold">START YOUR CASE</span><h2>Tell us what treatment you are considering.</h2><p>The new intake flow is structured for international medical review and can later accept secure documents.</p><div className="privacy"><ShieldCheck/> Health data will only be stored after the dedicated secure backend is connected.</div></div><div className="form"><h3>Start in under 3 minutes</h3><p className="catalog-lead">Choose a specialty, add your contact details and summarize the medical request.</p><button className="cta full" onClick={()=>navigate('/intake')}>Start free medical review <ArrowRight size={18}/></button><div className="demo-links"><Link to="/patient">View patient portal demo</Link><Link to="/admin">View admin demo</Link></div></div></div></section>
    </main>

    <footer><div className="footer-hieroglyphs" aria-hidden="true">𓋹 𓂀 𓆣 𓇳 𓄤 𓆸 𓋹</div><div className="shell footer-grid"><div className="footer-brand"><div><span className="ankh">ANKH</span><span className="iva">IVA</span></div><p>International Medical Care in Egypt</p></div><div><b>Platform</b><Link to="/treatments">Treatments</Link><Link to="/packages">Packages</Link><Link to="/providers">Providers</Link><Link to="/login">Patient login</Link></div><div><b>Patient Support</b><Link to="/intake">Free medical review</Link><Link to="/faq">FAQ</Link><Link to="/contact">Contact</Link><span><Mail size={15}/> contact@ankhiva.com</span></div></div><div className="shell legal">© 2026 ANKHIVA. Medical information is informational and does not replace individual medical consultation.</div></footer>
  </div>;
}
