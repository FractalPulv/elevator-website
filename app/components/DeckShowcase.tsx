"use client";

import { useDeck } from "@/app/components/DeckContext";
import {
  FrenchClub,
  FrenchDiamond,
  FrenchHeart,
  FrenchSpade,
  ItalianBat,
  ItalianCoin,
  ItalianCup,
  ItalianSword,
} from "@/app/components/SuitIcons";

const decks = {
  italian: {
    label: "Italian",
    power: ["2", "3", "4", "5", "6", "7", "Fante", "Cavallo", "Re", "Asso"],
    suits: [
      { name: "Bats", Icon: ItalianBat, color: "var(--suit-bat)" },
      { name: "Swords", Icon: ItalianSword, color: "var(--suit-sword)" },
      { name: "Cups", Icon: ItalianCup, color: "var(--suit-cup)" },
      { name: "Coins", Icon: ItalianCoin, color: "var(--suit-coin)" },
    ],
    note: "So the Ace of Coins is the single strongest card in the game.",
  },
  poker: {
    label: "Poker",
    power: ["2", "3", "4", "5", "6", "7", "J", "Q", "K", "A"],
    suits: [
      { name: "Clubs", Icon: FrenchClub, color: "#9aa0aa" },
      { name: "Spades", Icon: FrenchSpade, color: "#9aa0aa" },
      { name: "Hearts", Icon: FrenchHeart, color: "#c25450" },
      { name: "Diamonds", Icon: FrenchDiamond, color: "#c25450" },
    ],
    note: "So the Ace of Diamonds is the single strongest card in the game.",
  },
} as const;

export function DeckShowcase() {
  const { deck, setDeck } = useDeck();
  const d = decks[deck];

  return (
    <div>
      <div
        className="inline-flex gap-1 rounded-full border border-[var(--line-soft)] bg-[var(--surface)] p-1"
        role="tablist"
        aria-label="Deck style"
      >
        {(Object.keys(decks) as (keyof typeof decks)[]).map((key) => {
          const { label, suits } = decks[key];
          const active = deck === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active}
              onClick={() => setDeck(key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active ? "bg-[var(--accent)] text-[#0a0a0c]" : "text-[var(--text-2)] hover:text-[var(--text)]"
              }`}
            >
              <span className="flex items-center gap-1">
                {suits.map(({ name, Icon, color }) => (
                  <span key={name} style={{ color: active ? "#15151a" : color }}>
                    <Icon size={14} title={name} />
                  </span>
                ))}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5">
        <div className="card">
          <p className="eyebrow">Card power</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {d.power.map((c, i) => (
              <span
                key={c}
                className={`rounded-lg px-2 py-1.5 text-center text-sm font-semibold ${
                  i === d.power.length - 1
                    ? "bg-[rgba(118,108,245,0.12)] text-[var(--accent)] ring-1 ring-[rgba(118,108,245,0.4)]"
                    : "bg-[var(--surface-2)]"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[var(--text-2)] leading-7">
            Low to high, left to right — the Ace is strongest. Ties are broken by suit.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Suit tiebreak</p>
            <span className="text-xs text-[var(--text-3)]">Low → High</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {d.suits.map(({ name, Icon, color }, i) => (
              <span
                key={name}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-[var(--surface-2)] px-2 py-3 text-center text-sm font-semibold"
              >
                <span style={{ color }}>
                  <Icon size={20} title={name} />
                </span>
                {name}
                <span className="text-[0.62rem] font-medium text-[var(--text-3)]">{i + 1}</span>
              </span>
            ))}
          </div>
          <p className="mt-4 text-[var(--text-2)] leading-7">{d.note}</p>
        </div>
      </div>
    </div>
  );
}
