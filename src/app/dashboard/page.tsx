'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppShell, { LoadingSkeleton } from '@/components/ui/AppShell';
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
  const [showPendingNotification, setShowPendingNotification] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Show pending link notification when there's an initialUrl
  useEffect(() => {
    if (mounted && initialUrl && user && isSubscribed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPendingNotification(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => setShowPendingNotification(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [mounted, initialUrl, user, isSubscribed]);

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
      <AppShell>
        <LoadingSkeleton label="Loading your dashboard…" />
      </AppShell>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell userName={user.displayName} onSignOut={signOut}>
      <div className={styles.main}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>YOUR PIXEL WORKSPACE</p>
          <h1>Good links start here.</h1>
          <p>Create a code, make it yours, and keep every link in one place.</p>
        </div>
        {showPendingNotification && initialUrl && (
          <div className={styles.pendingNotification} role="status">
            <div className={styles.notificationContent}>
              <i className="ri-information-line"></i>
              <div className={styles.notificationText}>
                <strong>Link ready to convert!</strong>
                <p>Your URL has been pre-filled below. Click the <strong>Generate</strong> button to create your QR code.</p>
              </div>
              <button
                className={styles.notificationClose}
                onClick={() => setShowPendingNotification(false)}
                aria-label="Close notification"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>
        )}
        <QRGenerator initialUrl={initialUrl || undefined} />
        <QRHistory />
      </div>
    </AppShell>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <LoadingSkeleton label="Loading your dashboard…" />
        </AppShell>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
