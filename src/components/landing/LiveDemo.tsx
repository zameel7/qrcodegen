'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import styles from './LiveDemo.module.css';

const swatches = [
  { name: 'Ink', dark: '#111111', light: '#FFFBF2', chip: '#111111' },
  { name: 'Lime on black', dark: '#C6FF3D', light: '#111111', chip: '#C6FF3D' },
  { name: 'Orange', dark: '#B83216', light: '#FFFBF2', chip: '#B83216' },
  { name: 'Blue', dark: '#1746BB', light: '#FFFBF2', chip: '#1746BB' },
  { name: 'Purple', dark: '#7025A5', light: '#FFFBF2', chip: '#7025A5' },
];
type Level = 'L' | 'M' | 'Q' | 'H';

export default function LiveDemo({ onDynamic }: { onDynamic: (url: string) => void }) {
  const [url, setUrl] = useState('https://qrcode.zameel7.me');
  const [color, setColor] = useState(0);
  const [transparent, setTransparent] = useState(false);
  const [level, setLevel] = useState<Level>('M');
  const [margin, setMargin] = useState(true);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const palette = swatches[color];

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!url.trim()) {
        setSvg('');
        setError('Add a URL to see your QR code.');
        return;
      }
      try {
        const result = await QRCode.toString(url, {
          type: 'svg', errorCorrectionLevel: level, margin: margin ? 4 : 0,
          color: { dark: palette.dark, light: transparent ? '#00000000' : palette.light },
        });
        if (!cancelled) { setSvg(result); setError(''); }
      } catch {
        if (!cancelled) { setSvg(''); setError('This link is too long for a QR code. Try a shorter URL.'); }
      }
    }, 150);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [url, level, margin, palette, transparent]);

  const download = async () => {
    if (!url.trim()) return;
    setDownloading(true);
    setDownloadError('');
    try {
      const data = await QRCode.toDataURL(url, {
        width: 1024, errorCorrectionLevel: level, margin: margin ? 4 : 0,
        color: { dark: palette.dark, light: transparent ? '#00000000' : palette.light },
      });
      const anchor = document.createElement('a');
      anchor.href = data;
      anchor.download = 'qrapid.png';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch { setDownloadError('Could not download this QR code. Try a shorter URL.'); }
    finally { setDownloading(false); }
  };

  return (
    <div className={styles.playground}>
      <div className={styles.controls}>
        <label className={styles.label} htmlFor="demo-url">01 / Your destination</label>
        <input id="demo-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={styles.input} spellCheck={false} />
        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>02 / Pick your ink</legend>
          <div className={styles.swatches}>
            {swatches.map((swatch, index) => (
              <button type="button" key={swatch.name} aria-label={swatch.name} aria-pressed={color === index} onClick={() => setColor(index)} className={styles.swatch} style={{ backgroundColor: swatch.chip }}>
                {color === index && <i className="ri-check-line" aria-hidden="true" style={{ color: index === 1 ? '#111' : '#fff' }} />}
              </button>
            ))}
          </div>
          <p className={styles.hint}>{palette.name}</p>
        </fieldset>
        <div className={styles.options}>
          <label className={styles.selectLabel} htmlFor="demo-level">Error correction
            <select id="demo-level" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
              <option value="L">L · Low</option><option value="M">M · Medium</option><option value="Q">Q · Quartile</option><option value="H">H · High</option>
            </select>
          </label>
          <label className={styles.checkbox}><input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} /> Transparent background</label>
          <label className={styles.checkbox}><input type="checkbox" checked={margin} onChange={(e) => setMargin(e.target.checked)} /> Include quiet-zone margin</label>
        </div>
        <p className={styles.hint}>Keep a clear margin and contrasting background for reliable scans. Test before printing.</p>
      </div>
      <div className={styles.output}>
        <span className={styles.previewLabel}>YOUR LINK, IN PIXELS</span>
        <div className={styles.preview} style={{ backgroundColor: palette.light }}>
          {svg ? <div className={styles.qr} role="img" aria-label={`Static QR code for ${url}`} dangerouslySetInnerHTML={{ __html: svg }} /> : <p>{error || 'Drawing your QR code…'}</p>}
        </div>
        <p className={styles.status} role="status">{error || downloadError || 'Static QR · destination fixed once downloaded'}</p>
        <button className={styles.download} type="button" onClick={download} disabled={!url.trim() || !!error || downloading || !svg}>
          <i className="ri-download-2-line" aria-hidden="true" /> {downloading ? 'Preparing PNG…' : 'Download PNG'}
        </button>
        <button className={styles.dynamic} type="button" onClick={() => onDynamic(url)} disabled={!url.trim()}>Make it dynamic →</button>
        <p className={styles.hint}>Dynamic codes need sign-in & an access code.</p>
      </div>
    </div>
  );
}
