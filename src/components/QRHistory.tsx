'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from './ui/AppShell';
import styles from './QRHistory.module.css';

interface QRCodeData {
  id: string;
  url: string;
  qrCodeDataUrl: string;
  createdAt: Timestamp;
  isDynamic?: boolean;
  scanCount?: number;
}

export default function QRHistory() {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQrCodes([]);
      setLoading(false);
    } else {
      const q = query(
        collection(db, 'qrcodes'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const codes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as QRCodeData));
        setQrCodes(codes);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const downloadQRCode = (qrCodeDataUrl: string, url: string) => {
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `qrcode-${url.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    link.click();
  };

  const copyShareLink = async (id: string) => {
    // isDynamic is unused but kept for interface consistency or future checks
    const shareUrl = `${window.location.origin}/qr/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const startEditing = (qrCode: QRCodeData) => {
    setEditingId(qrCode.id);
    setNewUrl(qrCode.url);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewUrl('');
  };

  const saveNewUrl = async (id: string) => {
    if (!newUrl.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    try {
      const docRef = doc(db, 'qrcodes', id);
      await updateDoc(docRef, {
        url: newUrl,
        updatedAt: new Date()
      });
      setEditingId(null);
      setNewUrl('');
    } catch (err) {
      console.error('Failed to update URL:', err);
      alert('Failed to update URL');
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Your QR Codes</h2>
        <LoadingSkeleton label="Loading your QR codes…" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={styles.eyebrow}>A HOME FOR EVERY CODE</p>
      <h2 className={styles.title}>Your QR Codes</h2>

      {qrCodes.length === 0 ? (
        <div className={styles.empty}>
          <i className="ri-qr-code-line" aria-hidden="true" />
          <h3>Your next big idea starts small.</h3>
          <p>No QR codes generated yet. Create your first one above!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {qrCodes.map((qrCode) => (
            <div key={qrCode.id} className={styles.card}>
              <div className={styles.cardHeader}>
                {qrCode.isDynamic ? (
                  <div className={styles.badge} title="Dynamic QR Code">
                    <i className="ri-refresh-line my-2"></i> Dynamic
                  </div>
                ) : (
                  <div className={styles.staticBadge} title="Static QR Code">
                    <i className="ri-pushpin-line my-2"></i> Static
                  </div>
                )}
              </div>

              {qrCode.qrCodeDataUrl ? (
                <Image
                  src={qrCode.qrCodeDataUrl}
                  alt={`QR code for ${qrCode.url}`}
                  width={200}
                  height={200}
                  className={styles.qrImage}
                />
              ) : (
                <div className={styles.qrPlaceholder}>
                  Generating...
                </div>
              )}

              <div className={styles.info}>
                <p className={styles.url} title={qrCode.url}>
                  {qrCode.url}
                </p>
                <p className={styles.date}>{formatDate(qrCode.createdAt)}</p>

                <div className={styles.actions}>
                  <button
                    onClick={() => downloadQRCode(qrCode.qrCodeDataUrl, qrCode.url)}
                    className={styles.actionButton}
                    disabled={!qrCode.qrCodeDataUrl}
                    title="Download QR Code"
                    aria-label="Download QR Code"
                  >
                    <i className="ri-download-2-line"></i>
                  </button>
                  <button
                    onClick={() => copyShareLink(qrCode.id)}
                    className={styles.actionButton}
                    title="Copy Share Link"
                    aria-label={copiedId === qrCode.id ? "Share link copied" : "Copy Share Link"}
                  >
                    {copiedId === qrCode.id ? (
                      <i className="ri-check-line"></i>
                    ) : (
                      <i className="ri-links-line"></i>
                    )}
                  </button>
                  {qrCode.isDynamic && (
                    <button
                      onClick={() => startEditing(qrCode)}
                      className={styles.actionButton}
                      title="Edit Destination URL"
                      aria-label="Edit Destination URL"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                  )}
                </div>
                {qrCode.isDynamic && qrCode.scanCount !== undefined && (
                  <div className={styles.scanCountLarge} title="Total Scans">
                    <i className="ri-eye-line" aria-hidden="true" />
                    <strong>{qrCode.scanCount}</strong>
                    <span>scans</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <div className={styles.modal} onClick={cancelEditing}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-destination-title"
            aria-describedby="edit-destination-description"
          >
            <h3 id="edit-destination-title" className={styles.modalTitle}>Edit Destination URL</h3>
            <p id="edit-destination-description" className={styles.modalDescription}>
              Update where this QR code redirects to. The QR code image stays the same!
            </p>
            <label htmlFor="edit-destination-url" className={styles.modalLabel}>Destination URL</label>
            <input
              id="edit-destination-url"
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter new URL"
              className={styles.modalInput}
              autoFocus
            />
            <div className={styles.modalButtons}>
              <button onClick={cancelEditing} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={() => saveNewUrl(editingId)} className={styles.saveButton}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
