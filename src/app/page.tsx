'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import LiveDemo from '@/components/landing/LiveDemo';
import { displayFont } from './fonts';
import { faqs } from './faq';
import JsonLd from "@/components/seo/JsonLd";
import styles from './page.module.css';

const features = [
  ['ri-bar-chart-box-line', 'Every scan counts.', 'See scan counts for each dynamic code in your dashboard.'],
  ['ri-history-line', 'A home for every code.', 'Your full generation history, all together in the dashboard.'],
  ['ri-refresh-line', 'New link. Same print.', 'Edit a dynamic destination anytime. Your printed code stays the same.'],
  ['ri-download-2-line', 'Ready for the real world.', 'Download high-resolution PNGs for your next print or project.'],
];
const useCases = [
  ['ri-restaurant-line', 'Restaurant menus', 'Fresh specials. Same table card.'],
  ['ri-calendar-event-line', 'Event posters', 'Put the next stop on the poster.'],
  ['ri-contacts-line', 'Business cards', 'A little square. A big introduction.'],
  ['ri-box-3-line', 'Product packaging', 'Link the box to the whole story.'],
  ['ri-book-open-line', 'Classroom handouts', 'Give your lesson a useful link.'],
  ['ri-wifi-line', 'Wi-Fi / landing links', 'Point to access info or a welcome page.'],
];
const projects = [
  ['trim.it', 'https://trimit.zameel7.me'], ['CalSync', 'https://calsync.zameel7.me'],
  ['Photo Frame', 'https://photoframe.zameel7.me'], ['Sight Moon', 'https://moon.zameel7.me'],
  ['Slice of Shame', 'https://slice.zameel7.me'], ['Adkar Champ', 'https://adkar.zameel7.me'],
  ['zameel7.me', 'https://www.zameel7.me'],
];

function PixelCode() {
  return <div className={styles.pixelCode} aria-hidden="true">{Array.from({ length: 441 }, (_, index) => {
    const x = index % 21; const y = Math.floor(index / 21);
    const finder = [[0, 0], [14, 0], [0, 14]].find(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
    const on = finder ? (() => { const dx = x - finder[0]; const dy = y - finder[1]; return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4); })() : (x * 7 + y * 11 + x * y) % 5 < 2;
    return <span key={index} className={on ? styles.pixelOn : undefined} />;
  })}</div>;
}

export default function LandingPage() {
  const [url, setUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const createCode = (destination: string) => {
    if (!destination.trim()) return;
    const encodedUrl = encodeURIComponent(destination);
    if (user) router.push(`/dashboard?create=${encodedUrl}`);
    else router.push(`/login?pendingQr=${encodedUrl}`);
  };
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsCreating(true);
    createCode(url);
  };

  return (
    <div className={`${styles.container} ${displayFont.variable}`} id="top">
      <JsonLd />
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="QRapid home"><Image src="/logo.png" alt="QRapid logo" width={36} height={36} priority /><span>QRapid<span className={styles.brandDot}>.</span></span></Link>
        <nav className={styles.nav} aria-label="Main navigation"><a href="#how">How it works</a><a href="#features">Features</a><a href="#faq">FAQ</a></nav>
        <Link href={user ? '/dashboard' : '/login'} className={styles.headerButton}>{user ? 'Dashboard' : 'Sign in'} <i className="ri-arrow-right-up-line" aria-hidden="true" /></Link>
      </header>

      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.tinyFinder} aria-hidden="true" /> SMALL SQUARE. BIG POSSIBILITIES.</p>
            <h1 id="hero-title">QR codes that<br />don’t go <span className={styles.highlight}>stale.</span></h1>
            <p className={styles.heroText}>Print it once. Change the link whenever.<br />Make dynamic QR codes with editable destinations and scan analytics built in.</p>
            <form onSubmit={handleCreate} className={styles.ctaForm}>
              <label htmlFor="hero-url" className={styles.srOnly}>Your destination URL</label>
              <input id="hero-url" type="url" placeholder="https://your-next-big-thing.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
              <button className={styles.button} type="submit" disabled={isCreating}>{isCreating ? 'Creating…' : 'Create QR code'} <i className="ri-arrow-right-line" aria-hidden="true" /></button>
            </form>
            <p className={styles.heroNote}>Google sign-in + access code for the dashboard.<br /><a href="#demo">Just experimenting? Try the free static demo ↓</a></p>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.artTag}>LINKS CHANGE. PIXELS STAY.</div>
            <div className={styles.qrCard}><div className={styles.cardTop}><span>QR / 001</span><i className="ri-arrow-right-up-line" /></div><PixelCode /><div className={styles.cardBottom}><span>PRINT. SCAN. REPEAT.</span><i className="ri-qr-code-line" /></div></div>
            <div className={styles.editSticker}><i className="ri-refresh-line" /> New destination?<br /><strong>Same QR.</strong></div>
            <span className={styles.artCaption}>A tiny square with room to grow.</span>
          </div>
        </section>

        <section className={`${styles.section} ${styles.demoSection}`} id="demo" aria-labelledby="demo-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}><span className={styles.tinyFinder} aria-hidden="true" /> THE PIXEL PLAYGROUND</p><h2 id="demo-title">Go on. Give it a spin.</h2><p>Paste a link, pick your ink, and download. No account needed.</p></div>
          <LiveDemo onDynamic={createCode} />
        </section>

        <section className={styles.section} id="how" aria-labelledby="how-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}><span className={styles.tinyFinder} aria-hidden="true" /> FROM LINK TO LIFE</p><h2 id="how-title">Three steps. Endless next stops.</h2></div>
          <ol className={styles.steps}>
            <li><span className={styles.stepNumber}>01</span><h3>Paste a link</h3><p>Your menu, event, or next big idea. Start with its URL.</p></li>
            <li><span className={styles.stepNumber}>02</span><h3>Style & download</h3><p>Try colors in the static demo and download a PNG. Create dynamic codes in the dashboard.</p></li>
            <li><span className={styles.stepNumber}>03</span><h3>Edit & watch scans</h3><p>With a dynamic code, update the destination and check scan counts in your dashboard.</p></li>
          </ol>
        </section>

        <section className={styles.section} id="features" aria-labelledby="features-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}><span className={styles.tinyFinder} aria-hidden="true" /> BUILT FOR WHAT’S NEXT</p><h2 id="features-title">Small code. Useful superpowers.</h2></div>
          <div className={styles.featureGrid}>
            <article className={styles.comparison}><i className="ri-qr-code-line" aria-hidden="true" /><h3>Two ways to make your mark.</h3><div className={styles.compareColumns}><div><span className={styles.badge}>STATIC</span><p>Your URL, encoded directly. A fixed destination. Free in the demo.</p></div><div><span className={styles.badge}>DYNAMIC</span><p>A QRapid redirect link. Editable destination + scan counts. Dashboard access required.</p></div></div></article>
            {features.map(([icon, title, description]) => <article className={styles.feature} key={title}><i className={icon} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="uses-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}><span className={styles.tinyFinder} aria-hidden="true" /> OUT IN THE WILD</p><h2 id="uses-title">Put a link on it.</h2><p>From the café counter to the classroom. Where will yours go?</p></div>
          <div className={styles.useGrid}>{useCases.map(([icon, title, description]) => <article className={styles.useCard} key={title}><i className={icon} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}</div>
        </section>

        <section className={`${styles.section} ${styles.access}`} aria-labelledby="access-title">
          <div><p className={styles.eyebrow}>YOU’RE EARLY. COME ON IN.</p><h2 id="access-title">Your next link<br />starts here.</h2><p>Static codes are free in the demo. Unlock dynamic codes, scan analytics, and your full history with an access code during early access.</p></div>
          <div className={styles.accessActions}><span className={styles.accessStamp}><i className="ri-key-2-line" aria-hidden="true" /> INVITE / EARLY ACCESS</span><a href="mailto:zameelhassan7@gmail.com?subject=QRapid%20access" className={styles.button}>Get an access code ↗</a><Link href="/plan" className={styles.secondaryButton}>I have a code →</Link><p>Built by Zameel. A small tool for your big ideas.</p></div>
        </section>

        <section className={`${styles.section} ${styles.faqSection}`} id="faq" aria-labelledby="faq-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}><span className={styles.tinyFinder} aria-hidden="true" /> A FEW GOOD QUESTIONS</p><h2 id="faq-title">Let’s connect the dots.</h2></div>
          <div className={styles.faqList}>{faqs.map(({ q, a }) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>
        </section>

        <section className={styles.finalCta} aria-labelledby="final-title"><p className={styles.eyebrow}>ONE LINK. A WORLD OF POSSIBILITIES.</p><h2 id="final-title">Make your next<br />move a square one.</h2><a href="#hero-url" className={styles.button}>Let’s make a QR code <i className="ri-arrow-right-up-line" aria-hidden="true" /></a><div className={styles.finalPixels} aria-hidden="true"><span /><span /><span /><span /><span /></div></section>
      </main>

      <footer className={styles.footer}><div className={styles.footerTop}><Link href="/" className={styles.brand}>QRapid<span className={styles.brandDot}>.</span></Link><p>Made with curiosity by <a href="https://www.zameel7.me" target="_blank" rel="noopener noreferrer">Zameel ↗</a></p></div><div className={styles.projectLinks}><h2>More by Zameel</h2>{projects.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{name} ↗</a>)}</div><div className={styles.footerBottom}><span>© {new Date().getFullYear()} QRapid</span><a href="https://github.com/zameel7/qrcodegen" target="_blank" rel="noopener noreferrer"><i className="ri-github-line" aria-hidden="true" /> Open the source ↗</a><span>GOOD LINKS DESERVE GOOD QR CODES.</span></div></footer>
    </div>
  );
}
