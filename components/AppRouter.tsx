'use client';

import { motion } from 'framer-motion';
import Link from '@/components/ui/DocumentLink';
import { CertificatePage, LeaderboardPage, ParticipantLogin, ParticipantSubmissions, ProfilePage } from '@/components/participant/ParticipantPages';
import { ParticipantDashboard, ParticipantRulesPage } from '@/components/participant/ParticipantFlow';
import { ParticipantRoundsFlow } from '@/components/participant/ParticipantRounds';
import { AdminAudit, AdminDashboard, AdminImport, AdminParticipantDetail, AdminParticipants, AdminRounds, AdminSubmissionDetail } from '@/components/admin/AdminPages';
import { AdminSubmissions } from '@/components/admin/AdminSubmissions';
import { AdminManualEntry } from '@/components/admin/AdminManualEntry';
import { AdminQuestions } from '@/components/admin/AdminQuestions';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { TeamSetup } from '@/components/participant/TeamOnboarding';

export function AppRouter({ path }: { path: string[] }) {
  const route = '/' + path.join('/');
  let page: React.ReactNode;
  if (route === '/login') page = <ParticipantLogin/>;
  else if (route === '/team-setup') page = <TeamSetup/>;
  else if (route === '/dashboard') page = <ParticipantDashboard/>;
  else if (route === '/rounds') page = <ParticipantRoundsFlow/>;
  else if (route === '/leaderboard') page = <LeaderboardPage/>;
  else if (route === '/rules') page = <ParticipantRulesPage/>;
  else if (route === '/round/1') page = <ParticipantRoundsFlow initialRound={1}/>;
  else if (route === '/round/2') page = <ParticipantRoundsFlow initialRound={2}/>;
  else if (route === '/round/3') page = <ParticipantRoundsFlow initialRound={3}/>;
  else if (route === '/submissions') page = <ParticipantSubmissions/>;
  else if (route === '/profile') page = <ProfilePage/>;
  else if (route === '/certificates') page = <CertificatePage/>;
  else if (route === '/admin/login') page = <AdminLogin/>;
  else if (route === '/admin') page = <AdminDashboard/>;
  else if (route === '/admin/participants') page = <AdminParticipants/>;
  else if (route.startsWith('/admin/participants/')) page = <AdminParticipantDetail id={path[2]}/>;
  else if (route === '/admin/submissions') page = <AdminSubmissions/>;
  else if (route.startsWith('/admin/submissions/')) page = <AdminSubmissionDetail id={path[2]}/>;
  else if (route === '/admin/rounds') page = <AdminRounds/>;
  else if (route === '/admin/questions') page = <AdminQuestions/>;
  else if (route === '/admin/import') page = <AdminImport/>;
  else if (route === '/admin/manual-entry') page = <AdminManualEntry/>;
  else if (route === '/admin/audit') page = <AdminAudit/>;
  else page = <NotFound/>;
  return <motion.div key={route} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.35,ease:[.16,1,.3,1]}}>{page}</motion.div>;
}

function NotFound(){return <main className="not-found"><p className="eyebrow">SYSTEM / 404</p><h1>Route not found.</h1><p>The requested interface does not exist in this build.</p><Link className="button primary" href="/">Return home</Link></main>}
