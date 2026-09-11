'use client';

/**
 * TreeWatermark — a lightweight SVG tree silhouette used as a decorative
 * background element on inner pages. Purely visual, aria-hidden.
 *
 * Props:
 *   side   — 'left' | 'right' | 'center'   (default 'right')
 *   opacity — number 0–1                    (default 0.045)
 *   scale   — number                        (default 1)
 */
export default function TreeWatermark({
  side = 'right',
  opacity = 0.045,
  scale = 1,
}: {
  side?: 'left' | 'right' | 'center';
  opacity?: number;
  scale?: number;
}) {
  const posStyle: React.CSSProperties =
    side === 'left'
      ? { left: '-80px', bottom: '-40px' }
      : side === 'center'
      ? { left: '50%', bottom: '-60px', transform: `translateX(-50%) scale(${scale})` }
      : { right: '-80px', bottom: '-40px' };

  if (side !== 'center') {
    (posStyle as Record<string, unknown>).transform = `scale(${scale})`;
    (posStyle as Record<string, unknown>).transformOrigin =
      side === 'left' ? 'bottom left' : 'bottom right';
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        ...posStyle,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
      }}
    >
      <svg
        width={380 * scale}
        height={520 * scale}
        viewBox="0 0 380 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity, display: 'block' }}
      >
        {/* ── TRUNK ── */}
        <path
          d="M190 500 C188 480 184 450 186 410 C188 370 190 330 190 290"
          stroke="var(--accent-amber)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── ROOTS ── */}
        <path d="M190 490 C175 495 155 498 135 502" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <path d="M190 490 C205 496 225 499 248 503" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <path d="M188 495 C178 508 165 515 148 518" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M192 495 C202 508 216 516 232 520" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M190 500 C185 512 180 518 170 520" stroke="var(--accent-amber)" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
        <path d="M190 500 C196 512 200 518 210 520" stroke="var(--accent-amber)" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>

        {/* ── PRIMARY BRANCHES — LEFT ── */}
        <path d="M188 430 C170 415 145 400 115 388" stroke="var(--accent-amber)" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
        <path d="M187 400 C165 380 138 362 105 348" stroke="var(--accent-amber)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
        <path d="M188 365 C168 340 148 320 118 305" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <path d="M189 330 C172 300 155 278 130 260" stroke="var(--accent-amber)" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>

        {/* ── PRIMARY BRANCHES — RIGHT ── */}
        <path d="M192 425 C210 408 236 392 265 380" stroke="var(--accent-amber)" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
        <path d="M192 395 C212 374 240 355 272 342" stroke="var(--accent-amber)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
        <path d="M191 360 C212 334 238 313 268 298" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <path d="M190 325 C208 294 228 272 252 255" stroke="var(--accent-amber)" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>

        {/* ── TOP BRANCHES ── */}
        <path d="M190 295 C180 268 175 248 165 228" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <path d="M190 295 C200 268 205 248 215 228" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <path d="M190 295 C185 258 183 235 178 210" stroke="var(--accent-amber)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        <path d="M190 295 C196 258 198 235 202 210" stroke="var(--accent-amber)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>

        {/* ── SUB-BRANCHES LEFT ── */}
        <path d="M115 388 C95 378 75 370 55 365" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <path d="M115 388 C100 370 90 358 78 348" stroke="var(--accent-amber)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        <path d="M105 348 C82 338 60 332 38 328" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
        <path d="M105 348 C88 330 75 318 60 308" stroke="var(--accent-amber)" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
        <path d="M118 305 C95 295 72 288 48 284" stroke="var(--accent-amber)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        <path d="M118 305 C100 285 85 272 68 262" stroke="var(--accent-amber)" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        <path d="M130 260 C110 248 90 240 68 236" stroke="var(--accent-amber)" strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
        <path d="M130 260 C115 240 102 228 88 218" stroke="var(--accent-amber)" strokeWidth="0.9" strokeLinecap="round" opacity="0.38"/>

        {/* ── SUB-BRANCHES RIGHT ── */}
        <path d="M265 380 C285 370 306 362 328 358" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <path d="M265 380 C278 362 288 350 302 340" stroke="var(--accent-amber)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        <path d="M272 342 C292 332 315 326 340 322" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
        <path d="M272 342 C288 322 302 310 318 300" stroke="var(--accent-amber)" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
        <path d="M268 298 C290 288 314 280 340 276" stroke="var(--accent-amber)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        <path d="M268 298 C286 278 302 265 318 255" stroke="var(--accent-amber)" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        <path d="M252 255 C270 244 292 236 318 232" stroke="var(--accent-amber)" strokeWidth="1" strokeLinecap="round" opacity="0.45"/>
        <path d="M252 255 C268 234 282 222 298 212" stroke="var(--accent-amber)" strokeWidth="0.9" strokeLinecap="round" opacity="0.38"/>

        {/* ── FINE TWIGS ── */}
        <path d="M55 365 C42 358 30 355 18 354" stroke="var(--accent-amber)" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"/>
        <path d="M78 348 C62 338 48 332 35 330" stroke="var(--accent-amber)" strokeWidth="0.8" strokeLinecap="round" opacity="0.32"/>
        <path d="M60 308 C45 300 32 296 20 295" stroke="var(--accent-amber)" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
        <path d="M68 262 C52 254 38 250 25 248" stroke="var(--accent-amber)" strokeWidth="0.7" strokeLinecap="round" opacity="0.28"/>
        <path d="M88 218 C72 210 58 206 44 204" stroke="var(--accent-amber)" strokeWidth="0.7" strokeLinecap="round" opacity="0.28"/>
        <path d="M165 228 C155 210 150 196 144 180" stroke="var(--accent-amber)" strokeWidth="0.9" strokeLinecap="round" opacity="0.38"/>
        <path d="M215 228 C224 210 229 196 236 180" stroke="var(--accent-amber)" strokeWidth="0.9" strokeLinecap="round" opacity="0.38"/>
        <path d="M178 210 C172 190 168 175 164 158" stroke="var(--accent-amber)" strokeWidth="0.8" strokeLinecap="round" opacity="0.32"/>
        <path d="M202 210 C208 190 212 175 216 158" stroke="var(--accent-amber)" strokeWidth="0.8" strokeLinecap="round" opacity="0.32"/>
        <path d="M328 358 C345 350 358 346 370 345" stroke="var(--accent-amber)" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"/>
        <path d="M340 322 C355 314 366 310 375 308" stroke="var(--accent-amber)" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
        <path d="M340 276 C356 268 368 264 376 262" stroke="var(--accent-amber)" strokeWidth="0.7" strokeLinecap="round" opacity="0.28"/>
        <path d="M318 232 C334 222 348 218 360 216" stroke="var(--accent-amber)" strokeWidth="0.7" strokeLinecap="round" opacity="0.28"/>
        <path d="M298 212 C314 200 326 196 338 194" stroke="var(--accent-amber)" strokeWidth="0.7" strokeLinecap="round" opacity="0.28"/>

        {/* ── MEMORY NODES — small circles at branch tips ── */}
        {[
          [55,365],[38,328],[48,284],[68,236],[88,218],
          [165,228],[178,210],[215,228],[202,210],[164,158],[216,158],
          [328,358],[340,322],[340,276],[318,232],[298,212],
          [18,354],[35,330],[20,295],[25,248],[44,204],
          [370,345],[375,308],[376,262],[360,216],[338,194],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill="var(--accent-amber)" opacity={0.45 - (i % 5) * 0.04} />
        ))}
      </svg>
    </div>
  );
}
