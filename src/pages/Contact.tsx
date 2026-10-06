import { useState } from 'react';
import { CheckCircle2, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import PublicShell from '../components/PublicShell';

export default function Contact(){
 const [sent,setSent]=useState(false);
 return <PublicShell><main className="shell section"><span className="label">CONTACT</span><h1 className="catalog-title">International patient enquiries</h1><p className="catalog-lead">Use this page for general questions. For treatment assessment, use the structured medical review flow.</p>
 <div className="contact-grid"><section className="portal-card"><h2>Patient support</h2><p><Mail/> contact@ankhiva.com</p><p><MessageCircle/> WhatsApp integration planned</p><p><ShieldCheck/> Not an emergency service</p></section>
 <form className="form" onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<div className="success"><CheckCircle2 size={40}/><h3>Message prepared</h3><p>This demo does not send or store messages yet.</p></div>:<><label>Name<input required/></label><label>Email<input required type="email"/></label><label>Message<textarea rows={6} required/></label><button className="cta full">Send enquiry</button><small className="form-note">Demo only — no message is stored.</small></>}</form></div>
 </main></PublicShell>
}
