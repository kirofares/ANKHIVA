import { FileText, Plane, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import PortalShell from '../components/PortalShell';

export default function PatientCase(){
 return <PortalShell><div className="portal-top"><div><span className="label">CASE AK-1042</span><h1>Dental Care</h1><p>Demo case details for the international patient journey.</p></div><span className="status-pill">Medical review</span></div>
 <div className="portal-grid"><section className="portal-card"><h2>Case summary</h2><div className="case-detail-list"><p><Stethoscope/><span><b>Requested care</b><small>Dental implant assessment</small></span></p><p><FileText/><span><b>Documents</b><small>3 demo documents listed</small></span></p><p><Plane/><span><b>Preferred travel</b><small>November 2026</small></span></p></div><h2>Next action</h2><p>The demo workflow is waiting for specialist feedback before a treatment plan and quote are issued.</p></section>
 <aside className="portal-card"><h3>Quote</h3><p>No final quote yet.</p><Link className="ghost full" to="/patient/quote">View demo quote layout</Link></aside></div></PortalShell>
}
