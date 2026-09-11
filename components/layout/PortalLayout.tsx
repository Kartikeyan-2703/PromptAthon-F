'use client';

import Link from '@/components/ui/DocumentLink';
import { Activity, Award, BookOpen, ChevronRight, FileQuestion, FileText, Gauge, LayoutDashboard, LogOut, Menu, Settings2, Shield, Trophy, Upload, UserPlus, Users, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { participantApi } from '@/services/api-client';

const participantLinks = [
  ['/dashboard','Overview',LayoutDashboard], ['/rounds','Rounds',Gauge], ['/leaderboard','Leaderboard',Trophy], ['/rules','Rules & Regulations',BookOpen], ['/certificates','Certificates',Award], ['/profile','Profile',Settings2],
] as const;
const adminLinks = [
  ['/admin','Overview',LayoutDashboard], ['/admin/participants','Participants',Users], ['/admin/submissions','Submissions',FileText], ['/admin/rounds','Round control',Activity], ['/admin/questions','Round 1 questions',FileQuestion], ['/admin/import','Excel import',Upload], ['/admin/manual-entry','Manual entry',UserPlus], ['/admin/audit','Audit log',Shield],
] as const;

export function PortalLayout({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const pathname = usePathname(); const [open,setOpen] = useState(false); const links = admin ? adminLinks : participantLinks;
  const logout = async () => { try { await participantApi.logout(); } finally { window.location.replace(admin ? '/admin/login' : '/login'); } };
  const active = (href:string) => href === '/admin' ? pathname === href : href === '/rounds' ? pathname === href || pathname.startsWith('/round/') : pathname === href || pathname.startsWith(href + '/');
  return <div className={`portal-shell ${admin ? 'admin-shell' : 'participant-shell'}`}>
    <div className="portal-atmosphere" aria-hidden="true"><i/><i/><i/></div>
    <aside className={`portal-sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-head"><Link className="wordmark portal-wordmark" href={admin?'/admin':'/dashboard'}><span className="brand-mark">P</span><span><strong>PROMPTHON</strong><small>SYSTEM / 2026</small></span></Link><button className="sidebar-close" onClick={()=>setOpen(false)} aria-label="Close navigation"><X size={18}/></button></div>
      <p className="sidebar-label">{admin ? 'CONTROL CENTER' : 'PARTICIPANT PORTAL'}</p>
      <nav>{links.map(([href,label,Icon])=><Link className={active(href)?'active':''} href={href} key={href} onClick={()=>setOpen(false)}><Icon size={16}/><span>{label}</span>{active(href)&&<ChevronRight size={13}/>}</Link>)}</nav>
      <div className="sidebar-bottom"><span className="live-pill"><i/>EVENT LIVE</span><small>12 SEP 2026 · CHENNAI</small><button type="button" onClick={logout}><LogOut size={15}/>Log out</button></div>
    </aside>
    {open && <button className="sidebar-scrim" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}
    <main className="portal-main"><header className="portal-mobile-head"><button onClick={()=>setOpen(true)} aria-label="Open navigation"><Menu size={20}/></button><span>PROMPTHON / {admin?'CONTROL':'PORTAL'}</span><span className="live-dot"/></header>{children}</main>
  </div>;
}
