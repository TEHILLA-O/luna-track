"use client";

type MoonGlyphProps = {
  fraction: number;
  waxing: boolean;
  size?: number;
  className?: string;
};

/** Two-disc overlap model: good enough for a calm UI glyph. */
export function MoonGlyph({
  fraction,
  waxing,
  size = 140,
  className = "",
}: MoonGlyphProps) {
  const f = Math.min(1, Math.max(0, fraction));
  const r = 1;
  const shadowCx = waxing ? -2 * r * (1 - f) : 2 * r * (1 - f);

  return (
    <svg
      width={size}
      height={size}
      viewBox="-1.25 -1.25 2.5 2.5"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="moonFace" cx="35%" cy="35%" r="75%">
          <stop offset="0%" stopColor="var(--moon-highlight)" />
          <stop offset="55%" stopColor="var(--moon-base)" />
          <stop offset="100%" stopColor="var(--moon-edge)" />
        </radialGradient>
        <clipPath id="moonDisc">
          <circle r={r} cx={0} cy={0} />
        </clipPath>
        <filter id="moonGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="0.08" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle r={1.12} fill="var(--moon-aura)" opacity={0.35} filter="url(#moonGlow)" />
      <g clipPath="url(#moonDisc)">
        <circle r={r} cx={0} cy={0} fill="url(#moonFace)" />
        <circle
          r={r}
          cx={shadowCx}
          cy={0}
          fill="var(--moon-shadow)"
          opacity={0.92}
        />
      </g>
      <circle
        r={r}
        cx={0}
        cy={0}
        fill="none"
        stroke="var(--moon-ring)"
        strokeWidth={0.02}
        opacity={0.5}
      />
    </svg>
  );
}
