"use client";

import { useId } from "react";

type MoonGlyphProps = {
  fraction: number;
  waxing: boolean;
  size?: number;
  className?: string;
};

/** Two-disc overlap model; unique SVG ids so many moons can render on one page. */
export function MoonGlyph({
  fraction,
  waxing,
  size = 140,
  className = "",
}: MoonGlyphProps) {
  const f = Math.min(1, Math.max(0, fraction));
  const r = 1;
  const shadowCx = waxing ? -2 * r * (1 - f) : 2 * r * (1 - f);
  const uid = useId().replace(/:/g, "");
  const ids = {
    face: `moon-face-${uid}`,
    clip: `moon-clip-${uid}`,
    glow: `moon-glow-${uid}`,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="-1.25 -1.25 2.5 2.5"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id={ids.face} cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor="var(--moon-highlight)" />
          <stop offset="52%" stopColor="var(--moon-base)" />
          <stop offset="100%" stopColor="var(--moon-edge)" />
        </radialGradient>
        <clipPath id={ids.clip}>
          <circle r={r} cx={0} cy={0} />
        </clipPath>
        <filter id={ids.glow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="0.07" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle r={1.1} fill="var(--moon-aura)" opacity={0.4} filter={`url(#${ids.glow})`} />
      <g clipPath={`url(#${ids.clip})`}>
        <circle r={r} cx={0} cy={0} fill={`url(#${ids.face})`} />
        <circle r={r} cx={shadowCx} cy={0} fill="var(--moon-shadow)" opacity={0.9} />
      </g>
      <circle
        r={r}
        cx={0}
        cy={0}
        fill="none"
        stroke="var(--moon-ring)"
        strokeWidth={0.018}
        opacity={0.45}
      />
    </svg>
  );
}
