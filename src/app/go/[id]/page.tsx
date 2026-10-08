'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AppShell from '@/components/ui/AppShell';
import styles from './go.module.css';

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const docRef = doc(db, 'qrcodes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Track scan count (optional analytics)
          try {
            await updateDoc(docRef, {
              scanCount: increment(1),
              lastScanned: new Date()
            });
          } catch (err) {
            console.error('Failed to update scan count:', err);
          }

          // Redirect to the target URL
          window.location.href = data.url;
        } else {
          // QR code not found, redirect to home
          router.push('/');
        }
      } catch (err) {
        console.error('Error fetching redirect:', err);
        router.push('/');
      }
    };

    if (id) {
      handleRedirect();
    }
  }, [id, router]);

  return (
    <AppShell>
      <div className={styles.container}>
        <div className={styles.card} role="status">
          <p className={styles.eyebrow}>ONE SCAN. NEXT STOP.</p>
          <div className={styles.pixels} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <h1>Taking you there.</h1>
          <p>Opening your QR code’s destination…</p>
        </div>
      </div>
    </AppShell>
  );
}
