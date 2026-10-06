import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Activity, BriefcaseMedical, FileText, House, LogOut, MessageSquareText, Stethoscope, UsersRound } from 'lucide-react';
import { useAuth } from '../auth';

export default function PortalShell({children, admin=false}:{children:ReactNode; admin?:boolean}) {
  const {signOut}=useAuth();
  const navigate=useNavigate();
  const items: [string,string,LucideIcon][] = admin
    ? [['/admin','Overview',Activity],['/admin/cases','Cases',BriefcaseMedical],['/admin/patients','Patients',UsersRound],['/admin/providers','Providers',Stethoscope],['/admin/packages','Packages',FileText],['/admin/quotes','Quotes',FileText],['/admin/messages','Inbox',MessageSquareText]]
    : [['/patient','Overview',House],['/patient/case','My case',BriefcaseMedical],['/patient/case','Documents',FileText],['/patient/quote','Quote',FileText],['/patient','Messages',MessageSquareText]];
  return <div className="portal-layout">
    <aside className="portal-sidebar">
      <Link to="/" className="portal-brand"><span className="portal-emblem" aria-hidden="true">𓋹</span><b>ANKH<span>IVA</span></b><small>{admin?'ADMIN CONSOLE':'PATIENT PORTAL'}</small><span className="portal-glyphs" aria-hidden="true">𓆸 𓋹 𓆸</span></Link>
      <nav>{items.map(([to,label,Icon])=><NavLink key={label} to={to} className={({isActive})=>isActive?'active':''}><Icon size={18}/>{label}</NavLink>)}</nav>
      <button className="portal-signout" onClick={async()=>{await signOut();navigate('/')}}><LogOut size={17}/> Sign out</button>
    </aside>
    <div className="portal-main">{children}</div>
  </div>;
}
