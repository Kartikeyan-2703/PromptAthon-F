import { AppRouter } from '@/components/AppRouter';

export default async function RoutedPage({ params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  return <AppRouter path={route}/>;
}
