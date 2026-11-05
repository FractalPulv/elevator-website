"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export type DeckKind = "poker" | "italian";

// The same cards in both decks, slot for slot: the hero hand, then the trick on the table.
// Poker cards follow the app's default cut (J, Q and K out).
export const decks = {
  italian: {
    hand: [
      "/cards/30_clubs_king.webp",
      "/cards/40_swords_king.webp",
      "/cards/20_cups_king.webp",
      "/cards/01_coins_ace.webp",
    ],
    trick: [
      "/cards/01_coins_ace.webp",
      "/cards/20_cups_king.webp",
      "/cards/40_swords_king.webp",
      "/cards/30_clubs_king.webp",
      "/cards/21_clubs_ace.webp",
      "/cards/19_cups_knight.webp",
    ],
  },
  poker: {
    hand: [
      "/cards/poker/ten-clubs.svg",
      "/cards/poker/seven-spades.svg",
      "/cards/poker/nine-hearts.svg",
      "/cards/poker/ace-diamonds.svg",
    ],
    trick: [
      "/cards/poker/ace-hearts.svg",
      "/cards/poker/seven-diamonds.svg",
      "/cards/poker/ten-spades.svg",
      "/cards/poker/four-clubs.svg",
      "/cards/poker/nine-diamonds.svg",
      "/cards/poker/two-hearts.svg",
    ],
  },
} as const;

const DeckContext = createContext<{ deck: DeckKind; setDeck: (d: DeckKind) => void }>({
  deck: "poker",
  setDeck: () => {},
});

const KEY = "elevator-deck";
const EVENT = "elevator-deck-change";

// The visitor's pick if they made one; otherwise the Italian deck in Italy (by browser
// language) and a poker deck everywhere else.
// Also kept in memory, so the switch works even where storage is blocked.
let picked: DeckKind | null = null;

function readDeck(): DeckKind {
  if (picked) return picked;
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "poker" || saved === "italian") return saved;
  } catch {}
  return navigator.languages?.some((l) => l.toLowerCase().startsWith("it")) ? "italian" : "poker";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** One deck for the whole page: the hero hand, the table and the deck tile all follow it. */
export function DeckProvider({ children }: { children: ReactNode }) {
  // The server renders poker; the browser's choice takes over on hydration.
  const deck = useSyncExternalStore(subscribe, readDeck, () => "poker" as DeckKind);

  function setDeck(d: DeckKind) {
    picked = d;
    try {
      window.localStorage.setItem(KEY, d);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }

  return <DeckContext.Provider value={{ deck, setDeck }}>{children}</DeckContext.Provider>;
}

export function useDeck() {
  return useContext(DeckContext);
}

/** Poker / Italian switch, usable anywhere on the page. */
export function DeckPicker({ className }: { className?: string }) {
  const { deck, setDeck } = useDeck();
  return (
    <div className={`seg${className ? ` ${className}` : ""}`} role="group" aria-label="Card deck">
      {(
        [
          ["poker", "Poker"],
          ["italian", "Italian"],
        ] as const
      ).map(([d, label]) => (
        <button key={d} type="button" className="seg__btn" aria-pressed={deck === d} onClick={() => setDeck(d)}>
          {label}
        </button>
      ))}
    </div>
  );
}

/** The current deck's hand, laid out flat, with the switch under it. */
export function DeckCards() {
  const { deck } = useDeck();
  return (
    <div className="mt-auto flex flex-col gap-5 pt-7">
      <div className="flex justify-center gap-2.5">
        {decks[deck].hand.map((src) => (
          <span
            key={src}
            className={`deck-card${deck === "poker" ? " deck-card--poker" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <DeckPicker className="self-center" />
    </div>
  );
}
