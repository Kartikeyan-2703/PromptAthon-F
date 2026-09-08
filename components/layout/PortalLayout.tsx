'use client';

import Link from 'next/link';
import { Activity, BookOpen, ChevronRight, FileText, LayoutDashboard, LogOut, Menu, Settings2, Shield, Upload, Users, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const participantLinks = [
  ['/dashboard','Dashboard',LayoutDashboard], ['/team','My team',Users], ['/round/1','Round 01',BookOpen], ['/round/2','Round 02',BookOpen], ['/round/3','Round 03',BookOpen], ['/submissions','Submissions',FileText], ['/profile','Profile',Settings2],
] as const;
const adminLinks = [
  ['/admin','Overview',LayoutDashboard], ['/admin/participants','Participants',Users], ['/admin/submissions','Submissions',FileText], ['/admin/rounds','Round control',Activity], ['/admin/import','Excel import',Upload], ['/admin/audit','Audit log',Shield],
] as const;

export function PortalLayout({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const pathname = usePathname(); const [open,setOpen] = useState(false); const links = admin ? adminLinks : participantLinks;
  const active = (href:string) => href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(href + '/');
  return <div className={`portal-shell ${admin ? 'admin-shell' : ''}`}>
    <aside className={`portal-sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-head"><Link className="wordmark" href={admin?'/admin':'/dashboard'}><span className="brand-mark">P</span><span>PROMPTHON</span></Link><button className="sidebar-close" onClick={()=>setOpen(false)} aria-label="Close navigation"><X size={18}/></button></div>
      <p className="sidebar-label">{admin ? 'CONTROL CENTER' : 'PARTICIPANT SYSTEM'}</p>
      <nav>{links.map(([href,label,Icon])=><Link className={active(href)?'active':''} href={href} key={href} onClick={()=>setOpen(false)}><Icon size={16}/><span>{label}</span>{active(href)&&<ChevronRight size={13}/>}</Link>)}</nav>
      <div className="sidebar-bottom"><span className="live-pill"><i/>EVENT LIVE</span><Link href={admin?'/admin/login':'/login'}><LogOut size={15}/>Log out</Link></div>
    </aside>
    {open && <button className="sidebar-scrim" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}
    <main className="portal-main"><header className="portal-mobile-head"><button onClick={()=>setOpen(true)} aria-label="Open navigation"><Menu size={20}/></button><span>PROMPTHON</span><span className="live-dot"/></header>{children}</main>
  </div>;
}
