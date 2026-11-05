"use client";

import { useState } from "react";
import { PhoneMockup } from "@/app/components/PhoneMockup";

type Option = { label: string; src: string; alt: string; landscape?: boolean };

// One moment of a game, captured two ways (language, orientation), with a switch between them.
// With `peek`, the phone is shown big and cut off by the tile's bottom edge, so the
// text on screen is readable; the switch sits above it.
export function ToggleShot({ options, label, peek }: { options: Option[]; label: string; peek?: boolean }) {
  const [active, setActive] = useState(0);
  const shot = options[active];
  const seg = (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o, i) => (
        <button key={o.label} type="button" className="seg__btn" aria-pressed={active === i} onClick={() => setActive(i)}>
          {o.label}
        </button>
      ))}
    </div>
  );

  if (peek) {
    return (
      <>
        <div className="mt-5">{seg}</div>
        <div className="pointer-events-none absolute inset-x-6 top-[12.5rem]">
          {/* both captures stay mounted, so switching is instant */}
          {options.map((o, i) => (
            <div key={o.src} className={i === active ? "" : "absolute inset-0 opacity-0"}>
              <PhoneMockup src={o.src} alt={o.alt} width="100%" />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="mt-auto flex flex-col items-center gap-5 pt-6">
      {/* fixed stage so the tile doesn't jump when the phone turns */}
      <div className="flex h-[19rem] w-full items-center justify-center">
        <PhoneMockup
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          landscape={shot.landscape}
          width={shot.landscape ? "min(100%, 17rem)" : "8.7rem"}
        />
      </div>
      {seg}
    </div>
  );
}
