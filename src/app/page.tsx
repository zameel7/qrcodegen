'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [url, setUrl] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsCreating(true);
    const encodedUrl = encodeURIComponent(url);

    if (user) {
      router.push(`/dashboard?create=${encodedUrl}`);
    } else {
      router.push(`/login?pendingQr=${encodedUrl}`);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="QRapid Logo" width={64} height={64} className={styles.logoImage} />
          <h1 className={styles.logoText}>QRapid</h1>
        </div>
        <div className={styles.authButtons}>
          {user ? (
            <Link href="/dashboard" className={styles.loginButton}>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main className={styles.hero}>
        <h1 className={styles.title}>
          Create Dynamic <span className={styles.gradientText}>QR Codes</span> <br />in Seconds
        </h1>
        <p className={styles.subtitle}>
          Generate, track, and manage dynamic QR codes. Update destination URLs anytime without reprinting.
        </p>

        <form onSubmit={handleCreate} className={styles.inputContainer}>
          <input
            type="url"
            placeholder="Enter your URL here..."
            className={styles.input}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" className={styles.createButton} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create QR Code'}
          </button>
        </form>
      </main>

      <div className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}><i className="ri-flashlight-line"></i></span>
          <h3 className={styles.featureTitle}>Instant Creation</h3>
          <p className={styles.featureDesc}>Create QR codes instantly. No sign-up required for static QRs.</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}><i className="ri-refresh-line"></i></span>
          <h3 className={styles.featureTitle}>Dynamic & Editable</h3>
          <p className={styles.featureDesc}>Change the destination URL anytime without reprinting your QR code.</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}><i className="ri-bar-chart-line"></i></span>
          <h3 className={styles.featureTitle}>Analytics & History</h3>
          <p className={styles.featureDesc}>Track scan counts and access your generation history.</p>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Built with <i className="ri-heart-fill" style={{ color: '#ff4d4f' }}></i> by{' '}
            <a href="https://www.zameel7.me" target="_blank" rel="noopener noreferrer" className={styles.footerLinkInd}>
              zameel7
            </a>
          </p>
          <a 
            href="https://github.com/zameel7/qrcodegen" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.repoLink}
          >
            <i className="ri-github-line"></i> View Source
          </a>
        </div>
      </footer>
    </div>
  );
}
