'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from './QRHistory.module.css';

interface QRCodeData {
  id: string;
  url: string;
  qrCodeDataUrl: string;
  createdAt: any;
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
    if (!user) {
      setQrCodes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'qrcodes'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const codes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as QRCodeData));
      setQrCodes(codes);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const downloadQRCode = (qrCodeDataUrl: string, url: string) => {
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `qrcode-${url.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    link.click();
  };

  const copyShareLink = async (id: string, isDynamic?: boolean) => {
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

  const formatDate = (timestamp: any) => {
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
        <p className={styles.loading}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your QR Codes</h2>
      
      {qrCodes.length === 0 ? (
        <p className={styles.empty}>No QR codes generated yet. Create your first one above!</p>
      ) : (
        <div className={styles.grid}>
          {qrCodes.map((qrCode) => (
            <div key={qrCode.id} className={styles.card}>
              <div className={styles.cardHeader}>
                {qrCode.isDynamic ? (
                  <div className={styles.badge} title="Dynamic QR Code">
                    <i className="ri-refresh-line"></i> Dynamic
                  </div>
                ) : (
                  <div className={styles.staticBadge} title="Static QR Code">
                    <i className="ri-pushpin-line"></i> Static
                  </div>
                )}
                
                <div className={styles.headerActions}>
                  {qrCode.isDynamic && qrCode.scanCount !== undefined && (
                    <div className={styles.scanCount} title="Total Scans">
                      <i className="ri-eye-line"></i> {qrCode.scanCount}
                    </div>
                  )}
                  {qrCode.isDynamic && (
                    <button 
                      onClick={() => startEditing(qrCode)}
                      className={styles.iconButton}
                      title="Edit Destination URL"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                  )}
                </div>
              </div>

              {qrCode.qrCodeDataUrl ? (
                <img 
                  src={qrCode.qrCodeDataUrl} 
                  alt={`QR code for ${qrCode.url}`}
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
                  >
                    <i className="ri-download-2-line"></i>
                  </button>
                  <button 
                    onClick={() => copyShareLink(qrCode.id, qrCode.isDynamic)}
                    className={styles.actionButton}
                    title="Copy Share Link"
                  >
                    {copiedId === qrCode.id ? (
                      <i className="ri-check-line"></i>
                    ) : (
                      <i className="ri-links-line"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <div className={styles.modal} onClick={cancelEditing}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Edit Destination URL</h3>
            <p className={styles.modalDescription}>
              Update where this QR code redirects to. The QR code image stays the same!
            </p>
            <input
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
