"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";

type Tilt = "left" | "right" | "none";

type PhoneMockupProps = {
  /** Real screenshot path under /public, e.g. "/screenshots/score-dark.webp". */
  src: string;
  alt: string;
  /** Which way the phone turns in 3D. "left" faces the screen towards the left. */
  tilt?: Tilt;
  glow?: boolean;
  /** Frame width, any CSS length. Default ~16rem. */
  width?: string;
  /** Phone on its side; pass a landscape screenshot. */
  landscape?: boolean;
  /** Load eagerly — only for the hero. */
  priority?: boolean;
  className?: string;
};

// Custom iPhone 17 Pro–style frame: uniform thin bezel, Dynamic Island, titanium rails.
// The stacked layers behind the face give it real thickness, which shows once it's tilted.
const EXTRUDE_LAYERS = 18;
const EXTRUDE_STEP = 1.2; // px per layer → ~22px of body depth

export function PhoneMockup({
  src,
  alt,
  tilt = "none",
  glow,
  landscape,
  width = "16rem",
  priority,
  className,
}: PhoneMockupProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  // Mouse only: the phone leans towards the pointer and lifts off the page.
  // Touch keeps the static pose so scrolling never fights the tilt.
  function onMove(e: PointerEvent<HTMLDivElement>) {
    const body = bodyRef.current;
    if (!body || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    body.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    body.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    body.dataset.active = "true";
  }

  function onLeave() {
    const body = bodyRef.current;
    if (!body) return;
    body.style.setProperty("--px", "0");
    body.style.setProperty("--py", "0");
    delete body.dataset.active;
  }

  return (
    <div
      className={`phone-stage${className ? ` ${className}` : ""}`}
      style={{ width }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div
        ref={bodyRef}
        className={`phone3d phone3d--${tilt}${landscape ? " phone3d--landscape" : ""}${glow ? " phone3d--glow" : ""}`}
      >
        {Array.from({ length: EXTRUDE_LAYERS }).map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="phone3d__layer"
            style={{ transform: `translateZ(${-(i + 1) * EXTRUDE_STEP}px)` }}
          />
        ))}
        <div className="phone">
          <span className="phone__btn phone__btn--action" />
          <span className="phone__btn phone__btn--volup" />
          <span className="phone__btn phone__btn--voldn" />
          <span className="phone__btn phone__btn--power" />
          <div className="phone__screen">
            <span className="phone__island" aria-hidden="true" />
            <Image
              className="phone__img"
              src={src}
              alt={alt}
              fill
              priority={priority}
            />
            <span className="phone__glare" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
