'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import QRGenerator from '@/components/QRGenerator';
import QRHistory from '@/components/QRHistory';
import styles from './page.module.css';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, mounted]);

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
            <img src="/logo.png" alt="QRapid Logo" className={styles.logoImage} />
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
        <QRGenerator />
        <QRHistory />
      </main>
    </div>
  );
}
