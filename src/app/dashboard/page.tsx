'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import QRGenerator from '@/components/QRGenerator';
import QRHistory from '@/components/QRHistory';
import styles from './page.module.css';

function DashboardContent() {
  const { user, loading, signOut, isSubscribed } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('create');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading) {
      if (!user) {
        router.push('/login');
      } else if (!isSubscribed) {
        router.push('/plan');
      }
    }
  }, [user, loading, router, mounted, isSubscribed]);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted || loading) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <Image src="/logo.png" alt="QRapid Logo" width={48} height={48} className={styles.logoImage} />
            <h1 className={styles.logoText}>QRapid</h1>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.displayName}</span>
            <button onClick={signOut} className={styles.signOutButton}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <QRGenerator initialUrl={initialUrl || undefined} />
        <QRHistory />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className={styles.loading}><p>Loading...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
