import { ArrowLeft, CheckCircle2, Clock3, CircleDollarSign, ShieldAlert } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PublicShell from '../components/PublicShell';
import { specialties } from '../data';

const detail:Record<string,{stay:string;overview:string;fit:string[];journey:string[];pricing:string[];recovery:string}> = {
  'cosmetic-surgery':{stay:'5–14 days depending on procedure',overview:'Coordinated access to selected aesthetic surgical pathways in Egypt with pre-operative assessment, procedure planning and recovery logistics.',fit:['Patients seeking elective aesthetic procedures','Patients medically suitable for planned surgery','Travelers able to remain in Egypt for appropriate follow-up'],journey:['Remote case review','Surgeon consultation and tests','Procedure and monitored recovery','In-person follow-up before travel','Remote follow-up after return'],pricing:['Procedure complexity','Hospital/facility fees','Anaesthesia and investigations','Length of stay and recovery support'],recovery:'Recovery varies substantially by procedure. Travel timing should be confirmed by the treating surgeon.'},
  'dental-care':{stay:'3–10 days; some implant cases require staged visits',overview:'Dental travel coordination for implants, veneers, restorative dentistry and full-mouth rehabilitation after clinical evaluation.',fit:['Patients seeking restorative or cosmetic dental care','Travelers who can complete imaging and treatment planning','Patients able to return for staged care when necessary'],journey:['Dental records and imaging review','Dentist consultation','Procedure plan','Treatment visit(s)','Remote aftercare'],pricing:['Number and type of restorations','Implant system/materials','Imaging and laboratory work','Need for grafting or staged procedures'],recovery:'Most dental recovery is outpatient, but swelling, discomfort and follow-up requirements depend on the procedure.'},
  'hair-restoration':{stay:'3–5 days commonly',overview:'Structured coordination for hair-restoration assessment and selected transplant techniques such as FUE or DHI.',fit:['Patients with suitable donor areas','Patients with realistic expectations','Travelers prepared for aftercare instructions'],journey:['Photo/history review','Specialist assessment','Procedure day','Early aftercare review','Remote progress checks'],pricing:['Graft estimate','Technique selected','Procedure duration','Aftercare package'],recovery:'Scalp redness, crusting and temporary shedding may occur. Final cosmetic assessment takes months, not days.'},
  'ophthalmology':{stay:'3–7 days for many elective pathways',overview:'Coordination for selected ophthalmic assessment and procedures, including vision-correction pathways where clinically appropriate.',fit:['Patients with stable eye measurements','Patients suitable after formal eye examination','Travelers able to attend post-procedure checks'],journey:['Records review','Full eye examination','Procedure decision','Treatment','Post-procedure review'],pricing:['Procedure type','Diagnostic testing','Lens/technology choices when applicable','Follow-up requirements'],recovery:'Visual recovery depends on the specific procedure and individual eye health. Driving and flying advice must come from the treating ophthalmologist.'},
  'bariatric-surgery':{stay:'7–14 days often recommended',overview:'Medical-travel coordination for bariatric surgical pathways with multidisciplinary assessment and post-operative planning.',fit:['Patients who meet accepted clinical criteria','Patients prepared for long-term dietary follow-up','Patients medically cleared for surgery'],journey:['History and records review','Surgeon + medical assessment','Pre-op testing','Surgery and inpatient care','Dietary/follow-up plan'],pricing:['Procedure selected','Hospital stay','Pre-op investigations','Post-operative support'],recovery:'Bariatric surgery requires staged diet progression, activity guidance and longer-term nutritional monitoring.'},
  'orthopedics':{stay:'Varies widely; often 7–21+ days',overview:'Coordination for selected orthopedic procedures involving joints, spine and musculoskeletal care, with rehabilitation planning when needed.',fit:['Patients with imaging and established diagnosis','Patients seeking elective orthopedic opinion or surgery','Travelers able to complete rehabilitation planning'],journey:['Imaging/records review','Orthopedic consultation','Procedure decision','Surgery or intervention','Rehabilitation and follow-up'],pricing:['Procedure complexity','Implants/devices','Hospital stay','Physiotherapy needs'],recovery:'Recovery varies greatly. Mobility, thrombosis prevention and fitness to fly require individual clinical guidance.'}
};

export default function TreatmentDetail(){
  const {slug}=useParams();
  const s=specialties.find(x=>x.slug===slug);
  const d=slug?detail[slug]:undefined;
  if(!s||!d) return <Navigate to="/treatments" replace/>;
  return <PublicShell><main>
    <section className="detail-hero"><div className="shell"><Link className="back-link" to="/treatments"><ArrowLeft size={16}/> All treatments</Link><span className="label">TREATMENT JOURNEY</span><h1>{s.name}</h1><p>{d.overview}</p><div className="detail-actions"><Link className="cta" to="/intake">Request medical review</Link><span><Clock3/> Typical stay: {d.stay}</span></div></div></section>
    <section className="shell section detail-layout">
      <div className="detail-main">
        <div className="info-block"><h2>Who this pathway may suit</h2>{d.fit.map(x=><p key={x}><CheckCircle2/>{x}</p>)}</div>
        <div className="info-block"><h2>Typical ANKHIVA journey</h2><ol>{d.journey.map(x=><li key={x}>{x}</li>)}</ol></div>
        <div className="info-block"><h2>Recovery overview</h2><p>{d.recovery}</p></div>
      </div>
      <aside>
        <div className="side-card"><CircleDollarSign/><h3>What affects pricing</h3><ul>{d.pricing.map(x=><li key={x}>{x}</li>)}</ul></div>
        <div className="side-card warning"><ShieldAlert/><h3>Clinical limits</h3><p>Suitability, risks, expected recovery and fitness to travel can only be confirmed by the treating clinician after individual assessment. ANKHIVA does not guarantee outcomes.</p></div>
      </aside>
    </section>
  </main></PublicShell>
}
