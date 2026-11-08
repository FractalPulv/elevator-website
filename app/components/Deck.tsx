"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type DeckKind = "poker" | "italian";

// The same cards in both decks, slot for slot: the hand is card for card the same game card
// (7 of spades = 7 di Spade, 3 of clubs = 3 di Bastoni, 7 of hearts = 7 di Coppe, ace of
// diamonds = Asso di Denari), so switching decks morphs each card into its twin.
// Poker cards follow the app's default cut (8, 9 and 10 out), so none of them appear.
export const decks = {
  italian: {
    hand: [
      "/cards/37_swords_7.webp",
      "/cards/23_clubs_3.webp",
      "/cards/17_cups_7.webp",
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
      "/cards/poker/seven-spades.svg",
      "/cards/poker/three-clubs.svg",
      "/cards/poker/seven-hearts.svg",
      "/cards/poker/ace-diamonds.svg",
    ],
    trick: [
      "/cards/poker/ace-hearts.svg",
      "/cards/poker/seven-diamonds.svg",
      "/cards/poker/five-spades.svg",
      "/cards/poker/four-clubs.svg",
      "/cards/poker/three-diamonds.svg",
      "/cards/poker/two-hearts.svg",
    ],
  },
} as const;

/** how faces are drawn: the real printed card, drawn like one, or a big rank and suit */
export type Faces = "real" | "classic" | "simple";
/** Which poker cards are in play: the app's three poker decks. */
export type PokerVariant = "no8910" | "noFaces" | "full52";

const DeckContext = createContext<{
  deck: DeckKind;
  setDeck: (d: DeckKind) => void;
  /** how faces are drawn: laid out like a real card, or a big rank and suit */
  faces: Faces;
  setFaces: (f: Faces) => void;
  variant: PokerVariant;
  setVariant: (v: PokerVariant) => void;
}>({
  deck: "poker",
  setDeck: () => {},
  faces: "real",
  setFaces: () => {},
  variant: "no8910",
  setVariant: () => {},
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
  return navigator.languages?.some((l) => l.toLowerCase().startsWith("it"))
    ? "italian"
    : "poker";
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
  const deck = useSyncExternalStore(
    subscribe,
    readDeck,
    () => "poker" as DeckKind,
  );

  function setDeck(d: DeckKind) {
    picked = d;
    try {
      window.localStorage.setItem(KEY, d);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }

  const [faces, setFaces] = useState<Faces>("real");
  const [variant, setVariant] = useState<PokerVariant>("no8910");

  return (
    <DeckContext.Provider
      value={{ deck, setDeck, faces, setFaces, variant, setVariant }}
    >
      {children}
    </DeckContext.Provider>
  );
}

export function useDeck() {
  return useContext(DeckContext);
}

/** Poker / Italian switch, usable anywhere on the page. */
export function DeckPicker({ className }: { className?: string }) {
  const { deck, setDeck } = useDeck();
  return (
    <div
      className={`seg${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Card deck"
    >
      {(
        [
          ["poker", "Poker"],
          ["italian", "Italian"],
        ] as const
      ).map(([d, label]) => (
        <button
          key={d}
          type="button"
          className="seg__btn"
          aria-pressed={deck === d}
          onClick={() => setDeck(d)}
        >
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
      {/* fixed height, cards centred in it: equal space above and below in either deck */}
      <div className="flex h-32 items-center justify-center gap-2.5">
        {decks.poker.hand.map((poker, i) => (
          <span
            key={poker}
            className="deck-card"
            data-deck={deck}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {(["poker", "italian"] as const).map((d) => (
              <span
                key={d}
                className="deck-card__face"
                data-on={deck === d ? "true" : undefined}
                style={{
                  backgroundImage: `url(${decks[d].hand[i]})`,
                  transitionDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </span>
        ))}
      </div>
      <DeckPicker className="self-center" />
    </div>
  );
}
