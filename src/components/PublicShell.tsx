import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function PublicShell({children}:{children:ReactNode}){
  return <div className="catalog-page">
    <header className="catalog-nav">
      <Link to="/" className="simple-brand"><span className="mini-ankh" aria-hidden="true">𓋹</span> ANKH<span>IVA</span></Link>
      <nav className="subnav">
        <Link to="/treatments">Treatments</Link>
        <Link to="/providers">Providers</Link>
        <Link to="/packages">Packages</Link>
        <Link to="/why-egypt">Why Egypt</Link>
        <Link to="/faq">FAQ</Link>
      </nav>
      <Link to="/intake" className="cta small">Free medical review</Link>
    </header>
    <div className="catalog-glyphbar" aria-hidden="true">𓋹 𓂀 𓆣 𓇳 𓄤</div>
    {children}
    <footer className="public-footer">
      <div className="footer-hieroglyphs" aria-hidden="true">𓋹 𓆸 𓇳 𓄤 𓋹</div>
      <div className="shell footer-grid">
        <div className="footer-brand"><div><span className="ankh">ANKH</span><span className="iva">IVA</span></div><p>Egyptian Heritage. Modern Medical Care.</p></div>
        <div><b>Explore</b><Link to="/about">About</Link><Link to="/why-egypt">Why Egypt</Link><Link to="/contact">Contact</Link><Link to="/faq">FAQ</Link></div>
        <div><b>Legal</b><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/medical-disclaimer">Medical Disclaimer</Link><span><ShieldCheck size={15}/> Not an emergency service</span></div>
      </div>
    </footer>
  </div>
}
