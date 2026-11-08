"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PhoneVideo, type Cue } from "@/app/components/PhoneVideo";

export type Step = {
  title: string;
  body: string;
  src: string;
  label: string;
  tilt: "left" | "right" | "none";
  cues: Cue[];
};

const MOTION = "(prefers-reduced-motion: reduce)";
const prefersStill = () => window.matchMedia(MOTION).matches;
function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// The three steps of a round, played one after another and round again: only one phone
// moves at a time, so the eye knows where to look. On a phone the steps stack, so the
// turn skips to whichever step is actually on screen.
export function StepClips({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  // bumped on every turn, so a step that plays twice in a row (the only one on screen) restarts
  const [take, setTake] = useState(0);
  const still = useSyncExternalStore(
    subscribeMotion,
    prefersStill,
    () => false,
  );
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [seen, setSeen] = useState<boolean[]>(() => steps.map(() => false));

  useEffect(() => {
    const els = itemRefs.current;
    const io = new IntersectionObserver(
      (entries) => {
        setSeen((prev) => {
          const next = [...prev];
          for (const e of entries) {
            const i = els.indexOf(e.target as HTMLDivElement);
            if (i >= 0) next[i] = e.isIntersecting;
          }
          return next;
        });
      },
      { threshold: 0.55 },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // The playing step scrolled away but another one is in view: hand the turn over.
  const anySeen = seen.some(Boolean);
  const current = !seen[active] && anySeen ? seen.findIndex(Boolean) : active;

  function next() {
    const n = steps.length;
    for (let k = 1; k <= n; k++) {
      const i = (current + k) % n;
      if (seen[i] || !anySeen) {
        setActive(i);
        setTake((v) => v + 1);
        return;
      }
    }
  }

  return (
    <div className="steps mx-auto mt-16 grid max-w-3xl gap-16 md:grid-cols-2 md:gap-8">
      {steps.map((step, i) => {
        const on = !still && anySeen && i === current;
        return (
          <div
            key={step.title}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="step flex flex-col items-center text-center"
            data-active={still || i === current ? "true" : undefined}
          >
            <PhoneVideo
              src={step.src}
              poster={step.src.replace(".mp4", ".jpg")}
              label={step.label}
              cues={step.cues}
              tilt={step.tilt}
              width="13.5rem"
              playing={on}
              take={take}
              onEnded={next}
            />
            <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em]">
              <button
                type="button"
                className="step__head"
                onClick={() => {
                  setActive(i);
                  setTake((v) => v + 1);
                }}
              >
                <span className="step-num">{i + 1}</span>
                {step.title}
              </button>
            </h3>
            <p className="mt-3 max-w-[18rem] leading-6 text-[var(--text-2)]">
              {step.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}
