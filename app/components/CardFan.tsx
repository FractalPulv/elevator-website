"use client";

import { decks, useDeck } from "@/app/components/Deck";

// A hand of real cards, fanned like they've just been dealt. Same art the app ships.
// Click the hand and every card turns over, in 3D, to the other deck; the rest of the
// page (the table, the deck tile) switches with it.
const layout = [
  { rotate: -34, x: -6.2, y: 1.4 }, // the face-down card
  { rotate: -20, x: -3.6, y: 0.3 },
  { rotate: -6, x: -0.9, y: -0.2 },
  { rotate: 8, x: 1.9, y: 0.2 },
  { rotate: 22, x: 4.6, y: 1.2 },
];

export function CardFan({ className }: { className?: string }) {
  const { deck, setDeck } = useDeck();
  const poker_ = deck === "poker";

  return (
    <button
      type="button"
      onClick={() => setDeck(poker_ ? "italian" : "poker")}
      aria-label={
        poker_ ? "Switch to the Italian deck" : "Switch to a poker deck"
      }
      className={`card-fan${className ? ` ${className}` : ""}`}
    >
      {layout.map((c, i) => (
        <span
          key={i}
          className="card-fan__card"
          style={{
            transform: `translate(${c.x}rem, ${c.y}rem) rotate(${c.rotate}deg)`,
            animationDelay: `${450 + i * 110}ms`, // dealt onto the page one by one
          }}
        >
          {i === 0 ? (
            // the face-down card turns too: Italian back, poker back
            <span
              className="card-fan__flip"
              data-turned={poker_ ? "true" : undefined}
            >
              <span
                className="card-fan__face"
                style={{ backgroundImage: 'url("/cards/back.webp")' }}
              />
              <span className="card-fan__face card-fan__face--poker card-back" />
            </span>
          ) : (
            // both decks are always there, back to back; the card turns to show the other side
            <span
              className="card-fan__flip"
              data-turned={poker_ ? "true" : undefined}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span
                className="card-fan__face"
                style={{
                  backgroundImage: `url("${decks.italian.hand[i - 1]}")`,
                }}
              />
              <span
                className="card-fan__face card-fan__face--poker"
                style={{ backgroundImage: `url("${decks.poker.hand[i - 1]}")` }}
              />
            </span>
          )}
        </span>
      ))}
    </button>
  );
}
