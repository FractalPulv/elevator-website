"use client";

import { useState } from "react";
import { PhoneMockup } from "@/app/components/PhoneMockup";

type Option = { label: string; src: string; alt: string; landscape?: boolean };

// One moment of a game, captured two ways (language, orientation), with a switch between them.
export function ToggleShot({ options, label }: { options: Option[]; label: string }) {
  const [active, setActive] = useState(0);
  const shot = options[active];

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
      <div className="seg" role="group" aria-label={label}>
        {options.map((o, i) => (
          <button key={o.label} type="button" className="seg__btn" aria-pressed={active === i} onClick={() => setActive(i)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
