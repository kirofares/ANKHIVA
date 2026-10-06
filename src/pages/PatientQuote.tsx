import { CircleDollarSign, Info } from 'lucide-react';
import PortalShell from '../components/PortalShell';

export default function PatientQuote(){
 return <PortalShell><div className="portal-top"><div><span className="label">DEMO QUOTE</span><h1>Treatment quotation</h1><p>Example layout only. This is not a real medical or financial offer.</p></div></div>
 <section className="portal-card quote-card"><div className="quote-line"><span>Medical care</span><b>USD 2,200</b></div><div className="quote-line"><span>Hotel coordination estimate</span><b>USD 420</b></div><div className="quote-line"><span>Local transfers</span><b>USD 120</b></div><div className="quote-line total"><span>Total indicative estimate</span><b>USD 2,740</b></div><div className="privacy-note"><Info/>Final treatment and pricing depend on specialist review, diagnosis, tests and provider confirmation.</div><button className="cta"><CircleDollarSign/> Accept quote — demo</button></section></PortalShell>
}
