"use client";

import { Reveal } from "@/app/components/Reveal";
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

// NOTE: this was an interactive Predict→Play→Score demo; reverted to static.
// See docs/how-a-round-works-animation.md for the original animation intent.

const deckSuits = {
  italian: [
    { Icon: ItalianSword, color: "var(--suit-sword)" },
    { Icon: ItalianCup, color: "var(--suit-cup)" },
    { Icon: ItalianBat, color: "var(--suit-bat)" },
    { Icon: ItalianCoin, color: "var(--suit-coin)" },
  ],
  poker: [
    { Icon: FrenchSpade, color: "#384049" },
    { Icon: FrenchHeart, color: "#c2403c" },
    { Icon: FrenchClub, color: "#384049" },
    { Icon: FrenchDiamond, color: "#c2403c" },
  ],
} as const;

const cards = [
  { v: "3", k: "M" },
  { v: "4", k: "D" },
  { v: "5", k: "N" },
  { v: "7", k: "L" },
];
const WINNER = 3;
const scatter = [
  { x: -56, y: 4, rot: -18 },
  { x: -20, y: -7, rot: 8 },
  { x: 18, y: 7, rot: -8 },
  { x: 54, y: -2, rot: 15 },
];

const AVATAR = {
  L: "linear-gradient(160deg, #8b85ff, #5b54d6)",
  M: "linear-gradient(160deg, #e07aa3, #b84e6f)",
  D: "linear-gradient(160deg, #46c3b3, #2c8f86)",
  N: "linear-gradient(160deg, #e6c15f, #c19a30)",
} as const;

const illuBase =
  "relative mb-6 flex h-28 overflow-hidden rounded-2xl bg-[var(--surface)]";
const numBase = "absolute text-[0.68rem] font-extrabold leading-none";
const cardBase =
  "absolute left-1/2 top-1/2 -ml-[1.4rem] -mt-[1.95rem] flex h-[3.9rem] w-[2.8rem] items-center justify-center rounded-[0.55rem] text-[#1a1a1a] bg-[radial-gradient(120%_80%_at_50%_0%,#ffffff,#f3f4f7_70%)] shadow-[0_12px_24px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.9),inset_0_0_0_2px_rgba(0,0,0,0.05)]";

export function RoundDemo() {
  const { deck } = useDeck();
  const suits = deckSuits[deck];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* 1 — Predict */}
      <Reveal as="article" className="card">
        <div className={`${illuBase} flex-col items-start justify-center gap-2 px-[1.1rem]`}>
          <div className="flex items-center gap-[0.55rem]">
            <span
              className="grid h-[2.4rem] w-[2.4rem] place-items-center rounded-full font-bold text-white"
              style={{ background: AVATAR.L }}
            >
              L
            </span>
            <span className="inline-block origin-left whitespace-nowrap rounded-full bg-[var(--surface-2)] px-[0.9rem] py-[0.45rem] text-[0.9rem] font-semibold text-[var(--text)]">
              I&rsquo;ll say&nbsp;<strong className="text-[var(--accent)]">1</strong>
            </span>
          </div>
        </div>
        <span className="text-sm font-semibold text-[var(--accent)]">1</span>
        <h3 className="display mt-3 text-3xl">Predict</h3>
        <p className="mt-3 leading-7 text-[var(--text-2)]">
          Before any card is played, call the exact number of tricks you&rsquo;ll win.
        </p>
      </Reveal>

      {/* 2 — Play */}
      <Reveal as="article" delay={0.25} className="card">
        <div className={`${illuBase} items-center justify-center`}>
          <div className="absolute inset-0">
            {cards.map((c, idx) => {
              const { Icon, color } = suits[idx];
              const s = scatter[idx];
              const isWin = idx === WINNER;
              return (
                <span
                  key={idx}
                  className={`${cardBase}${isWin ? " z-[3] [box-shadow:0_0_0_2px_var(--accent),0_12px_28px_var(--accent-glow)]" : ""}`}
                  style={{ transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)` }}
                >
                  <span className={`${numBase} left-[0.34rem] top-[0.24rem]`} style={{ color }}>
                    {c.v}
                  </span>
                  <span
                    className="inline-flex [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.12))]"
                    style={{ color }}
                  >
                    <Icon size={24} />
                  </span>
                  <span className={`${numBase} bottom-[0.24rem] right-[0.34rem] rotate-180`} style={{ color }}>
                    {c.v}
                  </span>
                  {isWin && (
                    <span
                      className="absolute -bottom-[0.28rem] -right-[0.28rem] z-[5] grid h-4 w-4 place-items-center rounded-full border-[1.5px] border-[#fdfdfd] text-[0.55rem] font-bold text-white shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
                      style={{ background: AVATAR[c.k as keyof typeof AVATAR] }}
                    >
                      {c.k}
                    </span>
                  )}
                </span>
              );
            })}
            <div className="pointer-events-none absolute bottom-[0.35rem] left-1/2 z-[6] inline-flex -translate-x-1/2 items-center gap-[0.35rem] whitespace-nowrap rounded-full border border-[var(--line)] bg-[rgba(12,12,16,0.9)] py-[0.2rem] pl-[0.25rem] pr-[0.6rem] text-[0.66rem] font-semibold text-[var(--text)] shadow-[0_6px_16px_rgba(0,0,0,0.5)] backdrop-blur-[6px]">
              <span
                className="grid h-[1.05rem] w-[1.05rem] place-items-center rounded-full text-[0.56rem] font-bold text-white"
                style={{ background: AVATAR.L }}
              >
                L
              </span>
              wins the trick
            </div>
          </div>
        </div>
        <span className="text-sm font-semibold text-[var(--accent)]">2</span>
        <h3 className="display mt-3 text-3xl">Play</h3>
        <p className="mt-3 leading-7 text-[var(--text-2)]">
          Everyone throws a card into each trick. Highest value takes it — suits break ties.
        </p>
      </Reveal>

      {/* 3 — Score */}
      <Reveal as="article" delay={0.5} className="card">
        <div className={`${illuBase} flex-col items-stretch justify-center px-[0.6rem]`}>
          <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-[0.45rem] rounded-[0.45rem] bg-white/5 px-[0.8rem] py-[0.6rem] text-[0.88rem] ring-1 ring-inset ring-[rgba(118,108,245,0.4)]">
            <span
              className="grid h-[1.5rem] w-[1.5rem] place-items-center rounded-full text-[0.72rem] font-bold text-white"
              style={{ background: AVATAR.L }}
            >
              L
            </span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.74rem] text-[var(--text-3)]">
              Predicted 1 · won 1
            </span>
            <span className="text-[0.74rem] font-bold tabular-nums text-[var(--accent)]">+20</span>
          </div>
        </div>
        <span className="text-sm font-semibold text-[var(--accent)]">3</span>
        <h3 className="display mt-3 text-3xl">Score</h3>
        <p className="mt-3 leading-7 text-[var(--text-2)]">
          Match your prediction exactly and you score — 10 for the call, plus 10 per trick won. Miss
          it and you get nothing.
        </p>
      </Reveal>
    </div>
  );
}
