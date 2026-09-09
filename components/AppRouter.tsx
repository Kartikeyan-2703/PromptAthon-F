'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { DashboardPage, ParticipantLogin, ParticipantSubmissions, ProfilePage, RoundPage, RoundThreePage, TeamPage } from '@/components/participant/ParticipantPages';
import { AdminAudit, AdminDashboard, AdminImport, AdminLogin, AdminParticipantDetail, AdminParticipants, AdminRounds, AdminSubmissions } from '@/components/admin/AdminPages';

export function AppRouter({ path }: { path: string[] }) {
  const route = '/' + path.join('/');
  let page: React.ReactNode;
  if (route === '/login') page = <ParticipantLogin/>;
  else if (route === '/dashboard') page = <DashboardPage/>;
  else if (route === '/team') page = <TeamPage/>;
  else if (route === '/round/1') page = <RoundPage roundId={1}/>;
  else if (route === '/round/2') page = <RoundPage roundId={2}/>;
  else if (route === '/round/3') page = <RoundThreePage/>;
  else if (route === '/submissions') page = <ParticipantSubmissions/>;
  else if (route === '/profile') page = <ProfilePage/>;
  else if (route === '/admin/login') page = <AdminLogin/>;
  else if (route === '/admin') page = <AdminDashboard/>;
  else if (route === '/admin/participants') page = <AdminParticipants/>;
  else if (route.startsWith('/admin/participants/')) page = <AdminParticipantDetail id={path[2]}/>;
  else if (route === '/admin/submissions') page = <AdminSubmissions/>;
  else if (route === '/admin/rounds') page = <AdminRounds/>;
  else if (route === '/admin/import') page = <AdminImport/>;
  else if (route === '/admin/audit') page = <AdminAudit/>;
  else page = <NotFound/>;
  return <motion.div key={route} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:[.16,1,.3,1]}}>{page}</motion.div>;
}

function NotFound(){return <main className="not-found"><p className="eyebrow">SYSTEM / 404</p><h1>Route not found.</h1><p>The requested interface does not exist in this build.</p><Link className="button primary" href="/">Return home</Link></main>}
