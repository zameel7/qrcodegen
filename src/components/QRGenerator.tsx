'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from './QRGenerator.module.css';

interface Props {
  initialUrl?: string;
}

export default function QRGenerator(props: Props) {
  // Initialize with initialUrl if provided
  const [url, setUrl] = useState(props.initialUrl || '');
  
  useEffect(() => {
    if (props.initialUrl) {
      setUrl(props.initialUrl);
    }
  }, [props.initialUrl]);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDynamic, setIsDynamic] = useState(true);
  const [generatedId, setGeneratedId] = useState('');
  const { user } = useAuth();
  
  // Initialize with initialUrl if provided


  const generateQRCode = async () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      // First, save to Firestore to get the document ID
      let qrTargetUrl = url;
      let docId = '';

      if (user) {
        const docRef = await addDoc(collection(db, 'qrcodes'), {
          userId: user.uid,
          url: url,
          isDynamic: isDynamic,
          qrCodeDataUrl: '', // Will update after generating
          createdAt: serverTimestamp(),
          scanCount: 0,
        });
        docId = docRef.id;
        setGeneratedId(docId);

        // If dynamic, the QR code points to our redirect URL
        if (isDynamic) {
          qrTargetUrl = `${window.location.origin}/go/${docId}`;
        }
      }

      // Generate QR code with the appropriate URL
      const qrDataUrl = await QRCode.toDataURL(qrTargetUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrCodeUrl(qrDataUrl);

      // Update Firestore with the QR code image
      if (user && docId) {
        const { doc, updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'qrcodes', docId), {
          qrCodeDataUrl: qrDataUrl,
        });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${isDynamic ? 'dynamic' : 'static'}-${Date.now()}.png`;
    link.click();
  };

  const copyDynamicLink = () => {
    if (!generatedId) return;
    const dynamicUrl = `${window.location.origin}/go/${generatedId}`;
    navigator.clipboard.writeText(dynamicUrl);
    alert('Dynamic link copied to clipboard!');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Generate QR Code</h2>
      
      <div className={styles.toggleContainer}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={isDynamic}
            onChange={(e) => setIsDynamic(e.target.checked)}
            className={styles.toggleInput}
          />
          <span className={styles.toggleSlider}></span>
          <span className={styles.toggleText}>
            {isDynamic ? (
              <span className={styles.iconText}><i className="ri-refresh-line"></i> Dynamic QR</span>
            ) : (
              <span className={styles.iconText}><i className="ri-pushpin-line"></i> Static QR</span>
            )}
          </span>
        </label>
        <p className={styles.toggleDescription}>
          {isDynamic 
            ? 'QR code can be updated later - scans redirect through your link' 
            : 'QR code points directly to URL - cannot be changed'}
        </p>
      </div>

      <div className={styles.inputGroup}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., https://example.com)"
          className={styles.input}
          onKeyPress={(e) => e.key === 'Enter' && generateQRCode()}
        />
        <button 
          onClick={generateQRCode} 
          disabled={loading}
          className={styles.generateButton}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {qrCodeUrl && (
        <div className={styles.qrDisplay}>
          <Image src={qrCodeUrl} alt="QR Code" width={300} height={300} className={styles.qrImage} />
          <div className={styles.buttonGroup}>
            <button onClick={downloadQRCode} className={styles.downloadButton}>
              <i className="ri-download-2-line"></i> Download QR Code
            </button>
            {isDynamic && generatedId && (
              <button onClick={copyDynamicLink} className={styles.dynamicButton}>
                <i className="ri-link"></i> Copy Dynamic Link
              </button>
            )}
          </div>
          {isDynamic && (
            <p className={styles.dynamicInfo}>
              <i className="ri-information-line"></i> This is a dynamic QR code. You can update the destination URL later from your history.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
