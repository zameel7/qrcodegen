import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { displayFont } from '@/app/fonts';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
  userName?: string | null;
  onSignOut?: () => void;
}

export default function AppShell({ children, userName, onSignOut }: AppShellProps) {
  return (
    <div className={`${styles.shell} ${displayFont.variable}`}>
      <a href="#main" className={styles.skipLink}>Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="QRapid home">
          <Image src="/logo.png" alt="" width={36} height={36} priority />
          <span>
            QRapid<span className={styles.brandDot}>.</span>
          </span>
        </Link>
        <div className={styles.account}>
          {onSignOut ? (
            <>
              <span className={styles.userName} title={userName || undefined}>
                {userName}
              </span>
              <button onClick={onSignOut} className={styles.button}>Sign Out</button>
            </>
          ) : (
            <Link href="/" className={styles.button}>
              Home <i className="ri-arrow-right-up-line" aria-hidden="true" />
            </Link>
          )}
        </div>
      </header>
      <main id="main" className={styles.main}>{children}</main>
    </div>
  );
}

export function LoadingSkeleton({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className={styles.loading} role="status" aria-label={label}>
      <span className={styles.srOnly}>{label}</span>
      <div className={styles.skeletonHeading} aria-hidden="true" />
      <div className={styles.skeletonPanel} aria-hidden="true">
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonButton} />
      </div>
      <div className={styles.skeletonGrid} aria-hidden="true">
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
      </div>
    </div>
  );
}
