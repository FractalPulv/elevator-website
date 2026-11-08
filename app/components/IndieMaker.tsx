// One person at a laptop, lit only by the screen: the whole studio. A plain silhouette
// on purpose, so it reads as "a person" rather than a portrait.
export function IndieMaker() {
  return (
    <div className="indie mt-auto pt-6" aria-hidden="true">
      <svg viewBox="0 0 240 170" className="w-full">
        <defs>
          <radialGradient id="indie-glow" cx="0.5" cy="0.62" r="0.55">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.38" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="indie-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--text-3)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--text-3)" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* the screen's light on the wall */}
        <ellipse cx="120" cy="105" rx="120" ry="70" fill="url(#indie-glow)" />

        {/* the person: head, then shoulders and arms reaching for the keyboard */}
        <circle cx="120" cy="52" r="21" fill="url(#indie-body)" />
        <path
          d="M72 150 C74 108 92 86 120 86 C148 86 166 108 168 150 Z"
          fill="url(#indie-body)"
        />

        {/* the laptop, back towards us, screen glowing at the edges */}
        <path
          d="M84 112 L156 112 L162 150 L78 150 Z"
          fill="var(--surface)"
          stroke="var(--accent)"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <rect
          x="113"
          y="125"
          width="14"
          height="14"
          rx="4"
          fill="var(--accent)"
          fillOpacity="0.5"
        />

        {/* the desk */}
        <rect x="30" y="150" width="180" height="4" rx="2" fill="var(--line)" />
        {/* a couple of cards on it */}
        <rect
          x="178"
          y="138"
          width="14"
          height="12"
          rx="2"
          fill="var(--text-3)"
          fillOpacity="0.35"
          transform="rotate(-12 185 144)"
        />
        <rect
          x="190"
          y="139"
          width="14"
          height="11"
          rx="2"
          fill="var(--text-3)"
          fillOpacity="0.25"
          transform="rotate(9 197 144)"
        />
      </svg>
    </div>
  );
}
