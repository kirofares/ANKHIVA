export type Specialty = { slug:string; name:string; description:string; };
export type Provider = { id:string; name:string; type:'Doctor'|'Hospital'|'Clinic'; specialty:string; city:string; verified:boolean; languages:string[]; };
export type TreatmentPackage = { id:string; title:string; specialty:string; provider:string; fromPrice:number; currency:'USD'|'GBP'|'EUR'; nights:number; includes:string[]; };

export const specialties: Specialty[] = [
  { slug:'cosmetic-surgery', name:'Cosmetic Surgery', description:'Face, breast and body procedures with coordinated pre-op and recovery planning.' },
  { slug:'dental-care', name:'Dental Care', description:'Implants, veneers, full-mouth rehabilitation and smile design.' },
  { slug:'hair-restoration', name:'Hair Restoration', description:'FUE / DHI pathways with structured aftercare.' },
  { slug:'ophthalmology', name:'Ophthalmology', description:'Vision correction and selected ophthalmic procedures.' },
  { slug:'bariatric-surgery', name:'Bariatric Surgery', description:'Surgical weight-loss programs with multidisciplinary assessment.' },
  { slug:'orthopedics', name:'Orthopedics', description:'Joint, spine and selected orthopedic procedures with rehabilitation coordination.' }
];

export const providers: Provider[] = [
  { id:'p1', name:'ANKHIVA Partner Surgical Center', type:'Hospital', specialty:'Cosmetic Surgery', city:'Cairo', verified:true, languages:['English','Arabic'] },
  { id:'p2', name:'Nile Advanced Dental Center', type:'Clinic', specialty:'Dental Care', city:'Cairo', verified:true, languages:['English','Arabic','French'] },
  { id:'p3', name:'Red Sea Vision Institute', type:'Clinic', specialty:'Ophthalmology', city:'Hurghada', verified:true, languages:['English','Arabic','German'] },
  { id:'p4', name:'Dr. Demo Orthopedic Specialist', type:'Doctor', specialty:'Orthopedics', city:'Cairo', verified:false, languages:['English','Arabic'] }
];

export const packages: TreatmentPackage[] = [
  { id:'pkg1', title:'Dental Implant Travel Package', specialty:'Dental Care', provider:'Nile Advanced Dental Center', fromPrice:2200, currency:'USD', nights:6, includes:['Initial specialist review','Procedure plan','Airport transfer','Hotel coordination','Follow-up visit'] },
  { id:'pkg2', title:'Hair Restoration Journey', specialty:'Hair Restoration', provider:'ANKHIVA Partner Surgical Center', fromPrice:1800, currency:'USD', nights:4, includes:['Medical assessment','Procedure','Local transfers','Aftercare kit','Remote follow-up'] },
  { id:'pkg3', title:'Vision Correction Journey', specialty:'Ophthalmology', provider:'Red Sea Vision Institute', fromPrice:1350, currency:'USD', nights:4, includes:['Pre-op testing','Procedure coordination','Hotel coordination','Post-op review'] }
];

export const demoCases = [
  { id:'AK-1042', patient:'Emma R.', country:'United Kingdom', treatment:'Dental Care', status:'Medical review', created:'Today', priority:'Normal' },
  { id:'AK-1041', patient:'Martin K.', country:'Germany', treatment:'Ophthalmology', status:'Quote sent', created:'Yesterday', priority:'Normal' },
  { id:'AK-1039', patient:'Sarah M.', country:'United States', treatment:'Cosmetic Surgery', status:'Awaiting documents', created:'2 days ago', priority:'High' },
  { id:'AK-1037', patient:'Omar A.', country:'UAE', treatment:'Orthopedics', status:'Travel confirmed', created:'3 days ago', priority:'Normal' }
];
