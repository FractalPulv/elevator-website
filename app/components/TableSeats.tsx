"use client";

import { useEffect, useRef, useState } from "react";
import { decks, useDeck } from "@/app/components/Deck";

// Seat order and colours match the app screenshots: Luca deals from the front seat.
const players = [
  { name: "Luca", color: "#d946ef" },
  { name: "Giulia", color: "#3b82f6" },
  { name: "Marco", color: "#f97316" },
  { name: "Sofia", color: "#22c55e" },
  { name: "Elena", color: "#eab308" },
  { name: "Paolo", color: "#06b6d4" },
];

const ROUND_MS = 2800; // one deal, then a moment to look at it
const COLLECT_MS = 280; // the old hands fade before the next deal

const notes: Record<number, string> = {
  3: "Works with three.",
  4: "The sweet spot.",
  5: "Just as good. Pro.",
  6: "A full table. Pro.",
};

/** The elevator: 1 card each up to the top floor, the top floor twice, then back down. */
function floorsFor(count: number) {
  // as the app counts it: the cards shared out evenly (13 each for three players), no cap
  const top = Math.floor(40 / count);
  const up = Array.from({ length: top }, (_, i) => i + 1);
  return [...up, ...up.slice().reverse()];
}

/** Same hand size and direction of travel when the table grows or shrinks. */
function sameFloor(round: number, from: number, to: number) {
  const before = floorsFor(from);
  const after = floorsFor(to);
  const r = Math.min(round, before.length - 1);
  const cards = Math.min(before[r], after.length / 2);
  return r < before.length / 2 ? cards - 1 : after.length - cards;
}

// Seat i of n around the table, starting at the front (bottom) and going clockwise.
function seat(i: number, n: number) {
  const a = Math.PI / 2 + (i * 2 * Math.PI) / n;
  return {
    x: Math.cos(a),
    y: Math.sin(a),
    // the hand lies on the felt in front of its player, tops towards the middle
    turn: (a * 180) / Math.PI - 90,
  };
}

export function TableSeats() {
  const { deck } = useDeck();
  const faceUp = [...decks[deck].hand, ...decks[deck].trick]; // the near player's own hand
  const poker = deck === "poker" ? " table-card--poker" : "";
  const [count, setCount] = useState(4);
  const [round, setRound] = useState(4);
  const [collecting, setCollecting] = useState(false);
  const [paused, setPaused] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const floors = floorsFor(count);
  const r = Math.min(round, floors.length - 1);
  const cards = floors[r];
  const running = visible && !paused;

  // Ride the elevator on its own while the tile is on screen.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let collect = 0;
    const id = window.setInterval(() => {
      setCollecting(true);
      collect = window.setTimeout(() => {
        setRound((v) => (v + 1) % floorsFor(count).length);
        setCollecting(false);
      }, COLLECT_MS);
    }, ROUND_MS);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(collect);
      setCollecting(false);
    };
  }, [running, count]);

  const pickCount = (n: number) => {
    if (n === count) return;
    setRound(sameFloor(r, count, n));
    setCount(n);
  };

  return (
    <div
      className="flex h-full flex-col"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        ref={sceneRef}
        className="table-scene"
        data-deck={deck}
        data-collecting={collecting ? "true" : undefined}
        aria-label={`${count} players, ${cards} cards each`}
        role="img"
      >
        <div className="table-scene__felt" />

        {/* the deck, in the middle: every hand is dealt from here */}
        <span className={`table-deck card-back${poker}`} aria-hidden="true" />

        {players.slice(0, count).map((p, i) => {
          const s = seat(i, count);
          const near = i === 0;
          // dealt clockwise from the dealer's left, the dealer last
          const delay = ((i + count - 1) % count) * 90;
          const spread = Math.min(near ? 8 : 7, (near ? 64 : 56) / cards);
          return (
            <span
              // a fresh hand each round (and when the tile comes into view), dealt from the deck
              key={`hand-${p.name}-${r}-${count}-${deck}-${visible ? 1 : 0}`}
              className={`table-hand${near ? " table-hand--near" : ""}`}
              aria-hidden="true"
              style={{
                left: `${50 + s.x * 26}%`,
                top: `${50 + s.y * 24}%`,
                transform: `rotate(${s.turn.toFixed(1)}deg)`,
                animationDelay: `${delay}ms`,
              }}
            >
              {Array.from({ length: cards }).map((_, c) => (
                <span
                  key={c}
                  className={`table-card${near ? " table-card--face" : " card-back"}${poker}`}
                  style={{
                    ["--a" as string]: `${((c - (cards - 1) / 2) * spread).toFixed(2)}deg`,
                    animationDelay: `${delay + 420}ms`,
                    backgroundImage: near
                      ? `url(${faceUp[c % faceUp.length]})`
                      : undefined,
                  }}
                />
              ))}
            </span>
          );
        })}

        {players.slice(0, count).map((p, i) => {
          const s = seat(i, count);
          return (
            <div
              key={p.name}
              className={`table-seat${s.y < -0.3 ? " table-seat--far" : ""}`}
              style={{
                left: `${50 + s.x * 42}%`,
                top: `${50 + s.y * 40}%`,
                ["--seat" as string]: p.color,
              }}
            >
              <span className="table-seat__chip">{p.name[0]}</span>
              <span className="table-seat__name">{p.name}</span>
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
              key={`${r}-${count}-${running}`} // restart with the interval after a pause
              className="round-timer"
              data-paused={running ? undefined : "true"}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="8" className="round-timer__track" />
              <circle
                cx="10"
                cy="10"
                r="8"
                className="round-timer__fill"
                style={{ animationDuration: `${ROUND_MS - COLLECT_MS}ms` }}
              />
            </svg>
            Round {r + 1}{" "}
            <span className="font-normal text-[var(--text-3)]">
              of {floors.length}
            </span>
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
              style={{
                height: `${(f / floors[floors.length / 2 - 1]) * 100}%`,
              }}
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
              onClick={() => pickCount(n)}
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
