import { AppRouter } from '@/components/AppRouter';
import { redirect } from 'next/navigation';

const publicSectionRedirects: Record<string,string> = {
  about: '/#about',
  prizes: '/#prizes',
  contact: '/#contact',
};

const legacyPortalRedirects: Record<string,string> = {
  resources: '/rules',
  team: '/dashboard',
};

export default async function RoutedPage({ params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  if(route.length===1 && publicSectionRedirects[route[0]]) redirect(publicSectionRedirects[route[0]]);
  if(route.length===1 && legacyPortalRedirects[route[0]]) redirect(legacyPortalRedirects[route[0]]);
  return <AppRouter path={route}/>;
}
