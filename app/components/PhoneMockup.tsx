import Image from "next/image";
import type { ReactNode } from "react";

type PhoneMockupProps = {
  /** Real screenshot path under /public, e.g. "/screenshots/scoreboard-dark.png". */
  src?: string;
  alt?: string;
  glow?: boolean;
  /** Frame width, any CSS length. Default ~16rem. */
  width?: string;
  className?: string;
  /** Placeholder screen content, shown when no `src` is provided. */
  children?: ReactNode;
};

// Custom iPhone 16 Pro–style frame: uniform thin bezel, Dynamic Island, titanium rails.
// Drops in a screenshot via `src`, or a styled placeholder via `children`.
const EXTRUDE_LAYERS = 18;
const EXTRUDE_STEP = 1.2; // px per layer → ~22px of real body depth

export function PhoneMockup({ src, alt = "", glow, width = "16rem", className, children }: PhoneMockupProps) {
  return (
    <div className={`phone3d${glow ? " phone3d--glow" : ""}${className ? ` ${className}` : ""}`} style={{ width }}>
      {/* extruded side walls — real thickness, only visible when tilted in 3D */}
      {Array.from({ length: EXTRUDE_LAYERS }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="phone3d__layer"
          style={{ transform: `translateZ(${-(i + 1) * EXTRUDE_STEP}px)` }}
        />
      ))}
      <div className="phone">
        {/* titanium side buttons */}
        <span className="phone__btn phone__btn--action" />
        <span className="phone__btn phone__btn--volup" />
        <span className="phone__btn phone__btn--voldn" />
        <span className="phone__btn phone__btn--power" />
        <div className="phone__screen">
          <span className="phone__island" aria-hidden="true" />
          {src ? <Image className="phone__img" src={src} alt={alt} fill sizes="375px" /> : children}
        </div>
      </div>
    </div>
  );
}

// ---- Placeholder screens (swap for real screenshots) ----

const sampleScores = [
  { name: "Luca", call: "Call 2", score: "18", lead: true },
  { name: "Marta", call: "Call 1", score: "13" },
  { name: "Dario", call: "Call 3", score: "16" },
  { name: "Nina", call: "Call 2", score: "14" },
];

export function ScoreScreen({ mode = "dark" }: { mode?: "light" | "dark" }) {
  return (
    <div className={`screen-ph screen-ph--${mode}`}>
      <div className="screen-ph__bar">
        <span>Round 12</span>
        <span>{mode === "dark" ? "Italiano" : "English"}</span>
      </div>
      <div className="mt-1 flex flex-col gap-2">
        {sampleScores.map((p) => (
          <div key={p.name} className="screen-ph__row" data-lead={p.lead ? "true" : undefined}>
            <span className="screen-ph__name">{p.name}</span>
            <span className="opacity-60">{p.call}</span>
            <span className="screen-ph__score">{p.score}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[0.7] rounded-md"
            style={{
              background:
                i === 0
                  ? "var(--accent)"
                  : mode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.07)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
