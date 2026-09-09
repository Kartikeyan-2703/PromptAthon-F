import { AppRouter } from '@/components/AppRouter';
import { redirect } from 'next/navigation';

const publicSectionRedirects: Record<string,string> = {
  about: '/#about',
  rounds: '/#challenge',
  rules: '/#rules',
  prizes: '/#prizes',
  contact: '/#contact',
};

export default async function RoutedPage({ params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  if(route.length===1 && publicSectionRedirects[route[0]]) redirect(publicSectionRedirects[route[0]]);
  return <AppRouter path={route}/>;
}
