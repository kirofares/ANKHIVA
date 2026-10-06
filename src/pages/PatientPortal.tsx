import { CalendarCheck, CheckCircle2, Clock3, FileText, MessageSquareText, Plane, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import PortalShell from '../components/PortalShell';

export default function PatientPortal(){
  return <PortalShell>
    <div className="portal-top"><div><span className="label">PATIENT PORTAL</span><h1>Welcome, Emma</h1><p>Your ANKHIVA case is organized here from medical review through follow-up.</p></div><span className="status-pill">Case AK-1042</span></div>
    <div className="portal-kpis">
      <div><Clock3/><span><small>Current stage</small><b>Medical review</b></span></div>
      <div><CalendarCheck/><span><small>Next milestone</small><b>Specialist feedback</b></span></div>
      <div><FileText/><span><small>Documents</small><b>3 uploaded</b></span></div>
      <div><MessageSquareText/><span><small>Coordinator</small><b>1 new message</b></span></div>
    </div>
    <div className="portal-grid">
      <section className="portal-card">
        <div className="card-title"><h2>Your care journey</h2><Link className="text-link" to="/patient/case">View case</Link></div>
        <div className="timeline">
          <div className="done"><CheckCircle2/><span><b>Case submitted</b><small>Medical history and request received.</small></span></div>
          <div className="done"><CheckCircle2/><span><b>Documents received</b><small>Reports are ready for review.</small></span></div>
          <div className="current"><Clock3/><span><b>Specialist medical review</b><small>Your case is being reviewed.</small></span></div>
          <div><FileText/><span><b>Treatment plan & quote</b><small>Pending medical review.</small></span></div>
          <div><Plane/><span><b>Travel planning</b><small>Flights, stay and local coordination.</small></span></div>
        </div>
      </section>
      <aside className="portal-card coordinator">
        <ShieldCheck/>
        <h3>Your patient coordinator</h3>
        <p>ANKHIVA International Care Team</p>
        <Link className="cta full" to="/patient/case">Open case & documents</Link><Link className="ghost full link-button portal-second-action" to="/patient/quote">View quote layout</Link>
        <small>For emergencies, contact local emergency services. This portal is not an emergency channel.</small>
      </aside>
    </div>
  </PortalShell>;
}
