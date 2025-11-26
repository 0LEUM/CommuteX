
'use client';

import { useUser } from '@/firebase';
import AuthPage from '@/components/auth-page';
import MainPage from '@/components/main-page';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Skeleton className="h-16 w-16 rounded-full mb-4" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-64" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <MainPage />;
}
