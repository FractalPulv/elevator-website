"use client";

import { useEffect, useRef, useState } from "react";

// Seat order and colours match the app screenshots: Luca deals from the front seat.
const players = [
  { name: "Luca", color: "#d946ef" },
  { name: "Giulia", color: "#3b82f6" },
  { name: "Marco", color: "#f97316" },
  { name: "Sofia", color: "#22c55e" },
  { name: "Elena", color: "#eab308" },
  { name: "Paolo", color: "#06b6d4" },
];

// The trick on the felt: each player's card, tossed down in front of their seat.
const played = [
  "/cards/01_coins_ace.webp",
  "/cards/20_cups_king.webp",
  "/cards/39_swords_knight.webp",
  "/cards/30_clubs_king.webp",
  "/cards/31_swords_ace.webp",
  "/cards/19_cups_knight.webp",
];
// Fixed "random" tilt and nudge per card, so it looks thrown but never jitters between renders.
const toss = [
  { r: -17, dx: 0.4, dy: -0.3 },
  { r: 23, dx: -0.5, dy: 0.2 },
  { r: -6, dx: 0.3, dy: 0.5 },
  { r: 31, dx: -0.2, dy: -0.4 },
  { r: -28, dx: 0.5, dy: 0.1 },
  { r: 12, dx: -0.4, dy: -0.2 },
];

const ROUND_MS = 2200;

const notes: Record<number, string> = {
  3: "Works with three.",
  4: "The sweet spot.",
  5: "Just as good. Pro.",
  6: "A full table. Pro.",
};

/** The elevator: 1 card each up to the top floor, the top floor twice, then back down. */
function floorsFor(count: number) {
  const top = Math.min(10, Math.floor(40 / count));
  const up = Array.from({ length: top }, (_, i) => i + 1);
  return [...up, ...up.slice().reverse()];
}

// Seat i of n on the table's ellipse, starting at the front (bottom) and going clockwise.
function seat(i: number, n: number) {
  const a = Math.PI / 2 + (i * 2 * Math.PI) / n;
  const x = Math.cos(a);
  const y = Math.sin(a);
  return { x, y, depth: (y + 1) / 2 }; // depth 0 = far side, 1 = nearest
}

export function TableSeats() {
  const [count, setCount] = useState(4);
  const [round, setRound] = useState(4);
  const [paused, setPaused] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const floors = floorsFor(count);
  const r = Math.min(round, floors.length - 1);
  const cards = floors[r];

  // Ride the elevator on its own while the tile is on screen.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setRound((v) => (v + 1) % floorsFor(count).length), ROUND_MS);
    return () => window.clearInterval(id);
  }, [paused, visible, count]);

  return (
    <div className="flex h-full flex-col" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div ref={sceneRef} className="table-scene" aria-label={`${count} players, ${cards} cards each`} role="img">
        <div className="table-scene__felt" />
        {players.slice(0, count).map((p, i) => {
          const s = seat(i, count);
          const t = toss[i];
          return (
            <span
              key={p.name}
              className="table-card table-card--played"
              style={{
                left: `calc(${50 + s.x * 15}% + ${t.dx}rem)`,
                top: `calc(${50 + s.y * 14}% + ${t.dy}rem)`,
                backgroundImage: `url(${played[i]})`,
                transform: `translate(-50%, -50%) rotate(${t.r}deg)`,
              }}
            />
          );
        })}

        {players.slice(0, count).map((p, i) => {
          const s = seat(i, count);
          const scale = 0.9 + s.depth * 0.35;
          return (
            <div
              key={p.name}
              className="pawn"
              style={{
                left: `${50 + s.x * 43}%`,
                top: `${50 + s.y * 40}%`,
                zIndex: Math.round(s.depth * 10) + 2,
                transform: `translate(-50%, -78%) scale(${scale})`,
                ["--pawn" as string]: p.color,
              }}
            >
              <span className="pawn__head" />
              <span className="pawn__body" />
              {/* the hand, held up and fanned, backs out — everyone except the player
                  sitting right in front, whose back is to the camera */}
              {s.y < 0.9 && (
              <span className="pawn__hand" aria-hidden="true">
                {Array.from({ length: cards }).map((_, c) => {
                  const spread = Math.min(9, 60 / cards);
                  const angle = (c - (cards - 1) / 2) * spread;
                  return (
                    <span
                      key={c}
                      className="table-card table-card--held"
                      style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                    />
                  );
                })}
              </span>
              )}
              <span className="pawn__name">{p.name}</span>
            </div>
          );
        })}
      </div>

      {/* the elevator: one bar per round, current floor lit */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 font-semibold tabular-nums">
            {/* restarts each round (keyed), so it reads as "next deal in…" */}
            <svg
              key={`${r}-${count}-${paused || !visible}`} // restart with the interval after a pause
              className="round-timer"
              data-paused={paused || !visible ? "true" : undefined}
              viewBox="0 0 20 20"
              aria-hidden="true"
              style={{ animationDuration: `${ROUND_MS}ms` }}
            >
              <circle cx="10" cy="10" r="8" className="round-timer__track" />
              <circle cx="10" cy="10" r="8" className="round-timer__fill" style={{ animationDuration: `${ROUND_MS}ms` }} />
            </svg>
            Round {r + 1} <span className="font-normal text-[var(--text-3)]">of {floors.length}</span>
          </span>
          <span className="tabular-nums text-[var(--text-2)]">
            {cards} {cards === 1 ? "card" : "cards"} each
          </span>
        </div>
        <div className="floors" role="group" aria-label="Rounds">
          {floors.map((f, i) => (
            <button
              key={i}
              type="button"
              className="floors__bar"
              aria-label={`Round ${i + 1}, ${f} cards`}
              aria-current={i === r ? "step" : undefined}
              style={{ height: `${(f / floors[floors.length / 2 - 1]) * 100}%` }}
              onClick={() => setRound(i)}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="seg" role="group" aria-label="Players at the table">
          {[3, 4, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              className="seg__btn"
              aria-pressed={count === n}
              onClick={() => setCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="text-sm text-[var(--text-2)]">{notes[count]}</span>
      </div>
    </div>
  );
}
