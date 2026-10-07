import { ImageResponse } from 'next/og';

export const alt = 'QRapid: dynamic QR codes you can edit after printing';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Deterministic faux QR pattern so the image stays stable between builds.
const N = 21;
function isFinder(r: number, c: number) {
  const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
  return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
}
function finderOn(r: number, c: number) {
  const lr = r >= N - 7 ? r - (N - 7) : r;
  const lc = c >= N - 7 ? c - (N - 7) : c;
  const edge = lr === 0 || lr === 6 || lc === 0 || lc === 6;
  const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
  return edge || core;
}
const cells: boolean[] = [];
for (let r = 0; r < N; r++) {
  for (let c = 0; c < N; c++) {
    cells.push(isFinder(r, c) ? finderOn(r, c) : ((r * 7 + c * 13 + r * c) % 5) < 2);
  }
}

export default function OpengraphImage() {
  const cell = 18;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '72px 88px',
          background: '#FFFBF2',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 620 }}>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              padding: '8px 18px',
              border: '4px solid #111',
              borderRadius: 12,
              background: '#C6FF3D',
              fontSize: 34,
              fontWeight: 800,
              color: '#111',
            }}
          >
            QRapid
          </div>
          <div style={{ display: 'flex', marginTop: 36, fontSize: 76, fontWeight: 900, lineHeight: 1.02, color: '#111' }}>
            QR codes that don&apos;t go stale.
          </div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 32, color: '#333' }}>
            Edit the link after printing. Track every scan.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: N * cell + 48,
            padding: 24,
            background: '#fff',
            border: '6px solid #111',
            borderRadius: 18,
            boxShadow: '14px 14px 0 #111',
          }}
        >
          {cells.map((on, i) => (
            <div key={i} style={{ width: cell, height: cell, background: on ? '#111' : '#fff' }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
