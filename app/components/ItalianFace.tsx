"use client";

// The Italian card face, ported from the app's Rules tab (elevator-scoreboard
// src/components/rules/ItalianCard.tsx): the real number of suit symbols in the
// traditional arrangements (swords and clubs crossed and angled, coins and cups in a
// grid), a big symbol for the ace (a dashed ring on the coins), and figure badges for
// Fante, Cavallo and Re. Sized in container units, so it follows the card it sits in.
import type { ReactNode } from "react";
import {
  ItalianBat,
  ItalianCoin,
  ItalianCup,
  ItalianSword,
} from "@/app/components/SuitIcons";

export type ItSuit = "coins" | "cups" | "swords" | "bats";
/** 1 = Asso, 2-7, 8 = Fante, 9 = Cavallo, 10 = Re (the app's numbering). */
export type ItRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const IT_COLORS: Record<ItSuit, string> = {
  coins: "#D4AF37",
  cups: "#C0392B",
  swords: "#2980B9",
  bats: "#2E7D32",
};

type Pos = { x: number; y: number; r: number };
const STANDARD: Record<number, Pos[]> = {
  2: [
    { x: 50, y: 20, r: 0 },
    { x: 50, y: 80, r: 0 },
  ],
  3: [
    { x: 35, y: 20, r: 0 },
    { x: 65, y: 50, r: 0 },
    { x: 35, y: 80, r: 0 },
  ],
  4: [
    { x: 25, y: 20, r: 0 },
    { x: 75, y: 20, r: 0 },
    { x: 25, y: 80, r: 0 },
    { x: 75, y: 80, r: 0 },
  ],
  5: [
    { x: 25, y: 20, r: 0 },
    { x: 75, y: 20, r: 0 },
    { x: 50, y: 50, r: 0 },
    { x: 25, y: 80, r: 0 },
    { x: 75, y: 80, r: 0 },
  ],
  6: [
    { x: 25, y: 20, r: 0 },
    { x: 75, y: 20, r: 0 },
    { x: 25, y: 50, r: 0 },
    { x: 75, y: 50, r: 0 },
    { x: 25, y: 80, r: 0 },
    { x: 75, y: 80, r: 0 },
  ],
  7: [
    { x: 22, y: 20, r: 0 },
    { x: 78, y: 20, r: 0 },
    { x: 22, y: 50, r: 0 },
    { x: 78, y: 50, r: 0 },
    { x: 22, y: 80, r: 0 },
    { x: 78, y: 80, r: 0 },
    { x: 50, y: 35, r: 0 },
  ],
};
// swords and clubs point north-east in the icon, hence the -45 offsets
const LINEAR: Record<number, Pos[]> = {
  2: [
    { x: 38, y: 50, r: -45 },
    { x: 62, y: 50, r: -45 },
  ],
  3: [
    { x: 30, y: 50, r: -45 },
    { x: 50, y: 50, r: -45 },
    { x: 70, y: 50, r: -45 },
  ],
  4: [
    { x: 25, y: 25, r: 105 },
    { x: 75, y: 25, r: 165 },
    { x: 25, y: 75, r: -15 },
    { x: 75, y: 75, r: -75 },
  ],
  5: [
    { x: 25, y: 25, r: 135 },
    { x: 75, y: 25, r: 135 },
    { x: 50, y: 50, r: 45 },
    { x: 25, y: 75, r: -45 },
    { x: 75, y: 75, r: -45 },
  ],
  6: [
    { x: 25, y: 30, r: -45 },
    { x: 50, y: 30, r: 135 },
    { x: 75, y: 30, r: -45 },
    { x: 25, y: 70, r: 135 },
    { x: 50, y: 70, r: -45 },
    { x: 75, y: 70, r: 135 },
  ],
  7: [
    { x: 25, y: 25, r: -45 },
    { x: 50, y: 25, r: -45 },
    { x: 75, y: 25, r: -45 },
    { x: 25, y: 75, r: 135 },
    { x: 50, y: 75, r: 135 },
    { x: 75, y: 75, r: 135 },
    { x: 50, y: 50, r: 45 },
  ],
};

const CROWN =
  "M12 10.938c-1.375 0-2.5-1.125-2.5-2.5 0-1.406 1.125-2.5 2.5-2.5s2.5 1.094 2.5 2.5c0 1.375-1.125 2.5-2.5 2.5zM2.031 9.906c1.094 0 1.969 0.906 1.969 2 0 1.125-0.875 2-1.969 2-1.125 0-2.031-0.875-2.031-2 0-1.094 0.906-2 2.031-2zM22.031 9.906c1.094 0 1.969 0.906 1.969 2 0 1.125-0.875 2-1.969 2-1.125 0-2.031-0.875-2.031-2 0-1.094 0.906-2 2.031-2zM4.219 23.719l-1.656-9.063c0.5-0.094 0.969-0.375 1.344-0.688 1.031 0.938 2.344 1.844 3.594 1.844 1.5 0 2.719-2.313 3.563-4.25 0.281 0.094 0.625 0.188 0.938 0.188s0.656-0.094 0.938-0.188c0.844 1.938 2.063 4.25 3.563 4.25 1.25 0 2.563-0.906 3.594-1.844 0.375 0.313 0.844 0.594 1.344 0.688l-1.656 9.063h-15.563zM3.875 24.5h16.25v1.531h-16.25v-1.531z";
const HORSE = [
  "M100,38.1c9.6,0,17.4-7.8,17.4-17.4c0-9.6-7.8-17.4-17.4-17.4c-9.6,0-17.4,7.8-17.4,17.4 C82.7,30.3,90.4,38.1,100,38.1z",
  "M229.3,88.2l-18.4-3.5L200.1,106c1.7,0.4,3.5,0.6,5.4,0.6C217,106.6,226.6,98.8,229.3,88.2z M2.8,124.2 c0-14.1,11.4-25.6,25.6-25.6h54V59.9c0-9.6,7.8-17.4,17.4-17.4s17.4,7.8,17.4,17.4v6l25.7,6.6c4.5,1,7.4,5.5,6.3,10 c-1,4.6-5.5,7.4-10.1,6.3l-22-5.2v15H143l70.8-73.2l-2.1,19l34.9,23.2c5.7,3.3,7.8,10.7,4.5,16.5c-2.6,4.6-7.7,6.8-12.6,5.9 l-2.8-0.5c-3.4,13.6-15.6,23.6-30.2,23.6c-2.9,0-5.7-0.4-8.3-1.1l-26.4,54v74c0,6.3-5.2,11.5-11.6,11.5c-6.3,0-11.5-5.2-11.5-11.5 v-75.7H89.5L79.1,182l21.8,52c3.2,5.6,1.2,12.6-4.3,15.7c-5.6,3.2-12.6,1.2-15.8-4.3l-25.5-60v-19.1L44,184.2v55.7 c0,6.3-5.1,11.5-11.5,11.5c-6.3,0-11.6-5.2-11.6-11.5v-64.3l9.5-14.9v-50.5L21,124.7v42H2.8V124.2z",
];
const KNAVE =
  "M13.9 2.999A1.9 1.9 0 1 1 12 1.1a1.9 1.9 0 0 1 1.9 1.899zM13.544 6h-3.088a1.855 1.855 0 0 0-1.8 1.405l-1.662 6.652a.667.667 0 0 0 .14.573.873.873 0 0 0 .665.33.718.718 0 0 0 .653-.445L10 9.1V13l-.922 9.219a.71.71 0 0 0 .707.781h.074a.69.69 0 0 0 .678-.563L12 14.583l1.463 7.854a.69.69 0 0 0 .678.563h.074a.71.71 0 0 0 .707-.781L14 13V9.1l1.548 5.415a.718.718 0 0 0 .653.444.873.873 0 0 0 .665-.329.667.667 0 0 0 .14-.573l-1.662-6.652A1.855 1.855 0 0 0 13.544 6z";

// The court figures on their own (Fante, Cavallo, Re), drawn in the current colour:
// the Simple style shows one large and faint behind the letter.
export function ItalianFigure({ rank }: { rank: 11 | 12 | 13 }) {
  const horse = rank === 12;
  return (
    <svg
      viewBox={horse ? "0 0 256 256" : rank === 13 ? "0 -9 24 33" : "0 0 24 24"}
      aria-hidden="true"
    >
      {rank === 13 && (
        <path d={CROWN} transform="translate(7.2 -9) scale(0.4)" />
      )}
      {(horse ? HORSE : [KNAVE]).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

function Suit({ suit }: { suit: ItSuit }) {
  const I = {
    coins: ItalianCoin,
    cups: ItalianCup,
    swords: ItalianSword,
    bats: ItalianBat,
  }[suit];
  return <I size={12} />;
}

export function ItalianFace({ rank, suit }: { rank: ItRank; suit: ItSuit }) {
  const color = IT_COLORS[suit];
  const linear = suit === "swords" || suit === "bats";
  let body: ReactNode;
  if (rank >= 8) {
    // the figure cards: the suit above a figure badge, the king crowned
    body = (
      <span className="itf__court">
        <span
          className="itf__pip"
          style={{ width: "25cqw", height: "25cqw", color }}
        >
          <Suit suit={suit} />
        </span>
        <span className="itf__figure">
          {rank === 10 && (
            <svg
              className="itf__crown"
              viewBox="-3 -2 32 32"
              aria-hidden="true"
            >
              <path fill={IT_COLORS.coins} d={CROWN} />
            </svg>
          )}
          <svg
            viewBox={rank === 9 ? "0 0 256 256" : "0 0 24 24"}
            aria-hidden="true"
          >
            {(rank === 9 ? HORSE : [KNAVE]).map((d, i) => (
              <path key={i} fill="#444" d={d} />
            ))}
          </svg>
        </span>
      </span>
    );
  } else if (rank === 1) {
    body = (
      <span className="itf__center">
        {suit === "coins" && (
          <span
            className="itf__ring"
            style={{ borderColor: IT_COLORS.coins }}
          />
        )}
        <span
          className="itf__pip"
          style={{ width: "70cqw", height: "70cqw", color }}
        >
          <Suit suit={suit} />
        </span>
      </span>
    );
  } else {
    const scale =
      rank >= 6 ? 22 : rank >= 4 ? 28 : linear && rank === 3 ? 25 : 35;
    body = (linear ? LINEAR[rank] : STANDARD[rank]).map((p, i) => (
      <span
        key={i}
        className="itf__pip itf__pip--abs"
        style={{
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${scale}cqw`,
          height: `${scale}cqw`,
          rotate: `${p.r}deg`,
          color,
        }}
      >
        <Suit suit={suit} />
      </span>
    ));
  }
  return (
    <span className="itf">
      <span className="itf__inner">{body}</span>
    </span>
  );
}
