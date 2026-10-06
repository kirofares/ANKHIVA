import { Link, useLocation } from 'react-router-dom';
import PublicShell from '../components/PublicShell';

const pages:Record<string,{label:string;title:string;lead:string;sections:{title:string;body:string}[]}> = {
  '/about':{label:'ABOUT ANKHIVA',title:'A medical journey, coordinated from Egypt',lead:'ANKHIVA is being built as an international-patient coordination platform connecting medical review, treatment planning and travel logistics.',sections:[
    {title:'What we are building',body:'A single pathway for international enquiries, provider matching, treatment quotes, travel coordination and follow-up.'},
    {title:'What we are not',body:'ANKHIVA is not an emergency service and does not replace the treating clinician. Clinical decisions remain with licensed healthcare professionals.'},
    {title:'Our operating principle',body:'Trust should come from verified providers, transparent information, clear responsibility and careful handling of health data.'}]},
  '/why-egypt':{label:'WHY EGYPT',title:'Healthcare access with a distinctive destination',lead:'Egypt can combine established clinical expertise, international connectivity and varied recovery environments. Medical needs must always take priority over tourism.',sections:[
    {title:'Cairo',body:'A major healthcare hub with broad specialist availability, advanced hospitals, international hotels and air connectivity.'},
    {title:'Giza & Greater Cairo',body:'Proximity to central medical districts plus optional cultural experiences when clinically appropriate.'},
    {title:'Red Sea',body:'Resort environments may suit selected recovery itineraries after a treating clinician confirms travel, sun, swimming and activity restrictions.'}]},
  '/faq':{label:'FREQUENTLY ASKED QUESTIONS',title:'Planning medical travel with fewer unknowns',lead:'These answers describe the intended ANKHIVA workflow. Final medical advice comes from the treating clinician.',sections:[
    {title:'How do I get a quote?',body:'Submit a medical request. A quote should only be issued after enough information is available for a provider to assess the likely treatment plan.'},
    {title:'Can a companion travel with me?',body:'Yes. Accommodation and local transport can be planned around a companion, subject to hotel and facility policies.'},
    {title:'Do you arrange visas?',body:'The platform can provide travel-support information, but visa eligibility and approval remain with the relevant authorities.'},
    {title:'What languages are supported?',body:'The MVP is in English. Arabic, German and French support are planned, with language availability shown per provider.'},
    {title:'How are payments handled?',body:'Payment workflows will show provider charges, coordination charges and refund terms clearly before any live transaction system is enabled.'},
    {title:'What happens after I go home?',body:'The intended workflow includes remote follow-up coordination and escalation back to the treating team when needed.'},
    {title:'Is my health information private?',body:'Real medical data will not be accepted until ANKHIVA has its dedicated secure backend, private storage, access controls and reviewed privacy processes.'},
    {title:'What if I have an emergency?',body:'Do not use ANKHIVA for emergencies. Contact local emergency services or go to the nearest emergency department.'}]},
  '/privacy':{label:'LEGAL',title:'Privacy Policy — pre-launch placeholder',lead:'This page is a product placeholder and requires legal review before ANKHIVA accepts real patient data.',sections:[
    {title:'Intended data use',body:'Health and identity information would be processed only for requested medical coordination, provider review, quotes, travel support and follow-up.'},
    {title:'Security baseline',body:'The technical design calls for a dedicated backend, row-level access control, private document storage and least-privilege staff access.'},
    {title:'Before production',body:'Retention periods, deletion rights, international transfers, lawful bases and jurisdiction-specific notices must be finalized by qualified legal counsel.'}]},
  '/terms':{label:'LEGAL',title:'Terms of Use — pre-launch placeholder',lead:'These terms are not production-ready and require legal review.',sections:[
    {title:'Coordination service',body:'ANKHIVA is intended to coordinate access to independent healthcare providers and related travel services.'},
    {title:'Clinical responsibility',body:'Diagnosis, treatment decisions, consent and clinical outcomes remain the responsibility of the patient and treating healthcare professionals.'},
    {title:'Pricing',body:'Indicative prices are not binding until a case has been reviewed and a formal quote has been issued.'}]},
  '/medical-disclaimer':{label:'MEDICAL DISCLAIMER',title:'Medical information is not individual medical advice',lead:'Website information is educational and organizational. It does not establish a clinician-patient relationship.',sections:[
    {title:'Individual assessment',body:'Treatment suitability, risks, expected outcomes and travel fitness depend on individual medical assessment.'},
    {title:'No outcome guarantees',body:'No surgical, dental or medical result can be guaranteed.'},
    {title:'Emergency care',body:'ANKHIVA is not an emergency service. For urgent or life-threatening symptoms, contact local emergency services immediately.'}]}
};

export default function InfoPage(){
  const p=pages[useLocation().pathname]||pages['/about'];
  return <PublicShell><main className="shell section info-page"><span className="label">{p.label}</span><h1 className="catalog-title">{p.title}</h1><p className="catalog-lead">{p.lead}</p><div className="info-sections">{p.sections.map(s=><section key={s.title}><h2>{s.title}</h2><p>{s.body}</p></section>)}</div><Link className="cta" to="/intake">Start a medical review</Link></main></PublicShell>
}
