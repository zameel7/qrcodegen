'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './qr.module.css';

export default function DynamicQRPage() {
  const params = useParams();
  const id = params.id as string;
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const docRef = doc(db, 'qrcodes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setQrData(docSnap.data());
        } else {
          setError('QR code not found');
        }
      } catch (err) {
        console.error('Error fetching QR code:', err);
        setError('Failed to load QR code');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQRCode();
    }
  }, [id]);

  const downloadQRCode = () => {
    if (!qrData?.qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = qrData.qrCodeDataUrl;
    link.download = `qrcode-${id}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading QR code...</div>
      </div>
    );
  }

  if (error || !qrData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>❌ {error || 'QR code not found'}</h1>
          <a href="/" className={styles.homeLink}>Go to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>QRapid</h1>
        <div className={styles.qrDisplay}>
          <img 
            src={qrData.qrCodeDataUrl} 
            alt="QR Code" 
            className={styles.qrImage}
          />
        </div>
        <div className={styles.info}>
          <p className={styles.label}>Original URL:</p>
          <a 
            href={qrData.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.url}
          >
            {qrData.url}
          </a>
        </div>
        <div className={styles.actions}>
          <button onClick={downloadQRCode} className={styles.downloadButton}>
            Download QR Code
          </button>
          <a href="/" className={styles.createButton}>
            Create Your Own
          </a>
        </div>
      </div>
    </div>
  );
}
