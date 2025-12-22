'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
    }}>
      <div className="spinner"></div>
    </div>
  );
}
