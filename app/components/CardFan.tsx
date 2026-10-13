"use client";

import { useState } from "react";

// A hand of real cards, fanned like they've just been dealt. Same scans the app ships.
// Easter egg: click the hand and every card turns over, in 3D, to a poker deck (the app
// supports both); click again and they turn back to the Italian one.
const italian = [
  "/cards/30_clubs_king.webp",
  "/cards/39_swords_knight.webp",
  "/cards/20_cups_king.webp",
  "/cards/01_coins_ace.webp",
];
const poker = [
  "/cards/poker/jack-clubs.svg",
  "/cards/poker/king-spades.svg",
  "/cards/poker/queen-hearts.svg",
  "/cards/poker/ace-diamonds.svg",
];

const layout = [
  { rotate: -34, x: -6.2, y: 1.4 }, // the face-down card, never turns
  { rotate: -20, x: -3.6, y: 0.3 },
  { rotate: -6, x: -0.9, y: -0.2 },
  { rotate: 8, x: 1.9, y: 0.2 },
  { rotate: 22, x: 4.6, y: 1.2 },
];

export function CardFan({ className }: { className?: string }) {
  const [poker_, setPoker] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setPoker((p) => !p)}
      aria-label={poker_ ? "Switch to the Italian deck" : "Switch to a poker deck"}
      className={`card-fan${className ? ` ${className}` : ""}`}
    >
      {layout.map((c, i) => (
        <span
          key={i}
          className="card-fan__card"
          style={{ transform: `translate(${c.x}rem, ${c.y}rem) rotate(${c.rotate}deg)` }}
        >
          {i === 0 ? (
            <span className="card-fan__face" style={{ backgroundImage: 'url("/cards/back.webp")' }} />
          ) : (
            // both decks are always there, back to back; the card turns to show the other side
            <span
              className="card-fan__flip"
              data-turned={poker_ ? "true" : undefined}
              style={{ transitionDelay: `${(i - 1) * 70}ms` }}
            >
              <span className="card-fan__face" style={{ backgroundImage: `url("${italian[i - 1]}")` }} />
              <span
                className="card-fan__face card-fan__face--poker"
                style={{ backgroundImage: `url("${poker[i - 1]}")` }}
              />
            </span>
          )}
        </span>
      ))}
    </button>
  );
}
