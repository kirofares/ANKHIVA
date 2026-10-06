import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  HeartPulse,
  Hotel,
  Landmark,
  Mail,
  Menu,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRoundCheck,
  X
} from 'lucide-react';
import './styles.css';

const specialties = [
  ['Cosmetic Surgery', 'Face, breast and body procedures with coordinated pre-op and recovery planning.'],
  ['Dental Care', 'Implants, veneers, full-mouth rehabilitation and smile design.'],
  ['Hair Restoration', 'FUE / DHI treatment pathways and follow-up support.'],
  ['Ophthalmology', 'Vision correction and selected ophthalmic procedures with specialist review.'],
  ['Bariatric Surgery', 'Structured surgical weight-loss programs with multidisciplinary assessment.'],
  ['Orthopedics', 'Joint, spine and selected orthopedic procedures with rehabilitation coordination.']
];

const steps = [
  ['1', 'Send your medical request', 'Tell us what you need and upload available reports or photos securely.'],
  ['2', 'Medical review', 'We coordinate an initial review with a suitable specialist and care team.'],
  ['3', 'Receive your plan', 'You receive a transparent treatment pathway, estimated cost and expected stay.'],
  ['4', 'Travel to Egypt', 'We coordinate appointments, airport pickup, accommodation and local support.'],
  ['5', 'Treatment & recovery', 'Your care is coordinated from admission through discharge and recovery.'],
  ['6', 'Follow-up at home', 'We keep your medical follow-up organized after you return home.']
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div>
      <header className="nav-wrap">
        <nav className="nav shell">
          <button className="brand" onClick={() => go('home')} aria-label="ANKHIVA home">
            <span className="ankh">ANKH</span><span className="iva">IVA</span>
            <small>INTERNATIONAL MEDICAL CARE</small>
          </button>
          <div className="desktop-nav">
            <button onClick={() => go('services')}>Treatments</button>
            <button onClick={() => go('journey')}>Patient Journey</button>
            <button onClick={() => go('why-egypt')}>Why Egypt</button>
            <button onClick={() => go('about')}>About</button>
          </div>
          <button className="cta small" onClick={() => go('consultation')}>Free Consultation</button>
          <button className="menu-btn" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X /> : <Menu />}</button>
        </nav>
        {menuOpen && <div className="mobile-nav">
          <button onClick={() => go('services')}>Treatments</button>
          <button onClick={() => go('journey')}>Patient Journey</button>
          <button onClick={() => go('why-egypt')}>Why Egypt</button>
          <button onClick={() => go('about')}>About</button>
          <button onClick={() => go('consultation')}>Free Consultation</button>
        </div>}
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-art" aria-hidden="true"><div className="sun"/><div className="pyramid one"/><div className="pyramid two"/><div className="desert"/></div>
          <div className="shell hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={16}/> International Medical Care in Egypt</div>
              <h1>World-class care.<br/><span>Egyptian hospitality.</span></h1>
              <p>ANKHIVA coordinates your medical journey in Egypt — from specialist review and treatment planning to travel, accommodation, recovery and follow-up.</p>
              <div className="hero-actions">
                <button className="cta" onClick={() => go('consultation')}>Get a Free Medical Review <ArrowRight size={18}/></button>
                <button className="ghost" onClick={() => go('services')}>Explore Treatments</button>
              </div>
              <div className="trust-row">
                <span><ShieldCheck/> Carefully selected providers</span>
                <span><CircleDollarSign/> Transparent planning</span>
                <span><MessageCircle/> International patient support</span>
              </div>
            </div>
            <div className="hero-card">
              <div className="card-kicker">THE ANKHIVA PROMISE</div>
              <h3>One coordinator. One clear journey.</h3>
              <ul>
                <li><CheckCircle2/> Specialist matching and initial case review</li>
                <li><CheckCircle2/> Treatment plan and estimated package cost</li>
                <li><CheckCircle2/> Airport, hotel and appointment coordination</li>
                <li><CheckCircle2/> Recovery logistics and post-travel follow-up</li>
              </ul>
              <div className="response"><HeartPulse/><span><b>Patient-first coordination</b><small>Designed for international patients</small></span></div>
            </div>
          </div>
        </section>

        <section className="section shell" id="services">
          <div className="section-head">
            <div><span className="label">TREATMENTS</span><h2>Focused specialties for medical travelers</h2></div>
            <p>Start with high-demand treatment categories where Egypt can combine experienced specialists, modern facilities and strong value.</p>
          </div>
          <div className="service-grid">
            {specialties.map(([name, text], i) => <article className="service-card" key={name}>
              <div className="service-icon">{[<Sparkles/>,<BadgeCheck/>,<UserRoundCheck/>,<Stethoscope/>,<HeartPulse/>,<ShieldCheck/>][i]}</div>
              <h3>{name}</h3><p>{text}</p><button onClick={() => go('consultation')}>Request assessment <ArrowRight size={16}/></button>
            </article>)}
          </div>
        </section>

        <section className="dark-section" id="journey">
          <div className="shell">
            <div className="section-head light">
              <div><span className="label gold">PATIENT JOURNEY</span><h2>From first message to follow-up at home</h2></div>
              <p>Medical travel becomes easier when clinical and travel logistics are handled as one coordinated pathway.</p>
            </div>
            <div className="steps">
              {steps.map(([n,title,text]) => <div className="step" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="section shell" id="why-egypt">
          <div className="why-grid">
            <div>
              <span className="label">WHY EGYPT</span>
              <h2>Premium care with a destination experience</h2>
              <p className="lead">ANKHIVA positions Egypt not only as a treatment destination, but as a complete medical journey built around safety, convenience and recovery.</p>
              <div className="why-points">
                <div><Stethoscope/><span><b>Experienced specialists</b><small>Access to established doctors across selected high-demand specialties.</small></span></div>
                <div><CircleDollarSign/><span><b>Competitive treatment value</b><small>Potentially attractive total-care pricing for international self-pay patients.</small></span></div>
                <div><Plane/><span><b>Accessible destination</b><small>Strong flight connectivity between Egypt, Europe, the Gulf and regional markets.</small></span></div>
                <div><Landmark/><span><b>Recovery with culture</b><small>Optional leisure and companion experiences can be coordinated around medical needs.</small></span></div>
              </div>
            </div>
            <div className="experience-card">
              <div className="experience-top"><Landmark size={30}/><span>EGYPTIAN HERITAGE<br/><b>MODERN MEDICAL CARE</b></span></div>
              <div className="mini-grid">
                <div><Plane/><b>Airport</b><span>VIP pickup</span></div>
                <div><Hotel/><b>Stay</b><span>Hotel options</span></div>
                <div><CalendarCheck/><b>Care</b><span>Appointments</span></div>
                <div><MessageCircle/><b>Support</b><span>Patient coordinator</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section tinted" id="about">
          <div className="shell trust-panel">
            <div><span className="label">WHY ANKHIVA</span><h2>Built around trust, clarity and continuity</h2></div>
            <div className="trust-cards">
              <div><ShieldCheck/><h3>Provider screening</h3><p>We build a curated network and define documented standards before promoting care partners.</p></div>
              <div><BadgeCheck/><h3>Clear patient information</h3><p>Patients receive structured treatment information, estimated costs and expected travel requirements before booking.</p></div>
              <div><UserRoundCheck/><h3>Human coordination</h3><p>A dedicated international-patient workflow helps reduce fragmented communication between clinic, hotel and traveler.</p></div>
            </div>
          </div>
        </section>

        <section className="consult" id="consultation">
          <div className="shell consult-grid">
            <div>
              <span className="label gold">FREE INITIAL CONSULTATION</span>
              <h2>Tell us what treatment you are considering.</h2>
              <p>Share your basic details and our team can organize the next step for an initial medical review.</p>
              <div className="privacy"><ShieldCheck/> Your medical information should be handled privately and only shared with the relevant care team.</div>
            </div>
            <form className="form" onSubmit={(e) => {e.preventDefault(); setSubmitted(true)}}>
              {submitted ? <div className="success"><CheckCircle2 size={42}/><h3>Request received</h3><p>This MVP currently stores no personal or medical data. The next development step is connecting the form to a secure backend and patient-coordination dashboard.</p></div> : <>
                <div className="two"><label>Full name<input required placeholder="Your name" /></label><label>Country<input required placeholder="Country of residence" /></label></div>
                <div className="two"><label>Email<input required type="email" placeholder="name@example.com" /></label><label>WhatsApp<input placeholder="+ country code" /></label></div>
                <label>Treatment of interest<select required defaultValue=""><option value="" disabled>Select a specialty</option>{specialties.map(s => <option key={s[0]}>{s[0]}</option>)}</select></label>
                <label>Tell us briefly about your request<textarea rows={4} placeholder="Procedure, diagnosis, preferred travel period, or questions..." /></label>
                <button className="cta full" type="submit">Request Medical Review <ArrowRight size={18}/></button>
                <small className="form-note">Do not use this form for emergencies. This prototype is not yet connected to a clinical service.</small>
              </>}
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <div className="footer-brand"><div><span className="ankh">ANKH</span><span className="iva">IVA</span></div><p>International Medical Care in Egypt</p></div>
          <div><b>Platform</b><button onClick={() => go('services')}>Treatments</button><button onClick={() => go('journey')}>Patient Journey</button><button onClick={() => go('why-egypt')}>Why Egypt</button></div>
          <div><b>Patient Support</b><button onClick={() => go('consultation')}>Free Consultation</button><span><Mail size={15}/> contact@ankhiva.com</span></div>
        </div>
        <div className="shell legal">© 2026 ANKHIVA. Medical information on this website is informational and does not replace an individual medical consultation.</div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
