"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PhoneMockup } from "@/app/components/PhoneMockup";

type Props = {
  portrait: { src: string; alt: string };
  landscape: { src: string; alt: string };
};

// Same moment, same screen, held two ways. The switch turns the phone itself a quarter
// turn; the screen swaps halfway, while it's edge-on, the way the app re-lays out.
export function RotateShot({ portrait, landscape }: Props) {
  const [sideways, setSideways] = useState(false);
  // what the screen shows lags the turn by half of it
  const [showLandscape, setShowLandscape] = useState(false);

  useEffect(() => {
    if (sideways === showLandscape) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(
      () => setShowLandscape(sideways),
      still ? 0 : 330,
    );
    return () => window.clearTimeout(id);
  }, [sideways, showLandscape]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex h-[19rem] w-full items-center justify-center">
        <div
          className="rotate-shot"
          data-sideways={sideways ? "true" : undefined}
        >
          <PhoneMockup width="8.4rem">
            <div
              className="rotate-shot__screen"
              data-swap={showLandscape ? "true" : undefined}
            >
              <Image
                className="phone__img rotate-shot__p"
                src={portrait.src}
                alt={portrait.alt}
                fill
              />
              {/* the landscape capture, turned back upright inside the turned phone */}
              <span className="rotate-shot__l">
                <Image
                  className="phone__img"
                  src={landscape.src}
                  alt={landscape.alt}
                  fill
                />
              </span>
            </div>
          </PhoneMockup>
        </div>
      </div>
      <div className="seg" role="group" aria-label="Orientation">
        {[
          [false, "Portrait"],
          [true, "Landscape"],
        ].map(([v, label]) => (
          <button
            key={String(label)}
            type="button"
            className="seg__btn"
            aria-pressed={sideways === v}
            onClick={() => setSideways(v as boolean)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
