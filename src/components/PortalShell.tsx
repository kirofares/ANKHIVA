import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Activity, BriefcaseMedical, FileText, House, LogOut, MessageSquareText, Stethoscope, UsersRound } from 'lucide-react';

export default function PortalShell({children, admin=false}:{children:ReactNode; admin?:boolean}) {
  const items: [string,string,LucideIcon][] = admin
    ? [['/admin','Overview',Activity],['/admin/cases','Cases',BriefcaseMedical],['/providers','Providers',Stethoscope],['/packages','Packages',FileText],['/admin','Patients',UsersRound]]
    : [['/patient','Overview',House],['/patient','My case',BriefcaseMedical],['/patient','Documents',FileText],['/patient','Messages',MessageSquareText]];
  return <div className="portal-layout">
    <aside className="portal-sidebar">
      <Link to="/" className="portal-brand"><b>ANKH<span>IVA</span></b><small>{admin?'ADMIN CONSOLE':'PATIENT PORTAL'}</small></Link>
      <nav>{items.map(([to,label,Icon])=><NavLink key={label} to={to} className={({isActive})=>isActive?'active':''}><Icon size={18}/>{label}</NavLink>)}</nav>
      <Link className="portal-signout" to="/"><LogOut size={17}/> Back to website</Link>
    </aside>
    <div className="portal-main">{children}</div>
  </div>;
}
