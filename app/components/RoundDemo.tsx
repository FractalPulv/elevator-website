"use client";

import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useDeck, type DeckKind, type Faces } from "@/app/components/Deck";
import {
  ItalianFace,
  ItalianFigure,
  type ItRank,
} from "@/app/components/ItalianFace";
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

// One whole round of Elevator, seen from above: three cards each, four players. Every
// step is a fixed snapshot derived from the step number, so going back and forward is
// exact. The game follows the app's rules: the player left of the dealer calls first and
// leads the first trick, nobody has to follow suit, the highest card takes the trick and
// its winner leads the next, and only an exact call scores (10, plus 10 per trick).

export type Suit = "d" | "h" | "s" | "c"; // diamonds/coins, hearts/cups, spades/swords, clubs/bats
export type Card = { r: number; s: Suit }; // r: 2..7, 11 J, 12 Q, 13 K, 14 A

type Seat = "S" | "W" | "N" | "E";
const PLAYERS: {
  name: string;
  color: string;
  seat: Seat;
  pronouns: [string, string];
}[] = [
  { name: "Giulia", color: "#3b82f6", seat: "S", pronouns: ["she", "her"] },
  { name: "Marco", color: "#f97316", seat: "W", pronouns: ["he", "his"] },
  { name: "Sofia", color: "#22c55e", seat: "N", pronouns: ["she", "her"] },
  { name: "Luca", color: "#d946ef", seat: "E", pronouns: ["he", "his"] },
];
const DEALER = 3; // Luca; Giulia, on his left, calls first and leads
const CALLS = [1, 0, 1, 2];
// what each player says when calling, in calling order
const SAYS = ["I'll take 1.", "0 for me.", "1.", "Not 1… 2, then."];

// each hand in the order it gets played
const HANDS: Card[][] = [
  [
    // one sure winner and two cards that almost never win: an easy call of 1
    { r: 14, s: "d" },
    { r: 2, s: "c" },
    { r: 3, s: "h" },
  ],
  [
    { r: 2, s: "d" },
    { r: 3, s: "s" },
    { r: 5, s: "c" },
  ],
  [
    { r: 3, s: "d" },
    { r: 13, s: "s" },
    { r: 7, s: "h" },
  ],
  [
    { r: 5, s: "d" },
    { r: 13, s: "c" }, // ties Sofia's king in trick 2 and loses on suit
    { r: 12, s: "h" },
  ],
];

// trick k: who leads, in what order the table plays, who wins
const TRICKS = [
  { lead: 0, order: [0, 1, 2, 3], winner: 0 },
  { lead: 0, order: [0, 1, 2, 3], winner: 2 },
  { lead: 2, order: [2, 3, 0, 1], winner: 3 },
];

const POS: Record<
  Seat,
  {
    seat: [number, number];
    hand: [number, number];
    play: [number, number];
    pile: [number, number];
    axis: "x" | "y";
  }
> = {
  S: {
    seat: [50, 93],
    hand: [50, 77],
    play: [50, 59],
    pile: [70, 80],
    axis: "x",
  },
  W: {
    seat: [7, 50],
    hand: [22, 50],
    play: [39, 50],
    pile: [20, 70],
    axis: "y",
  },
  N: {
    seat: [50, 7],
    hand: [50, 23],
    play: [50, 41],
    pile: [30, 20],
    axis: "x",
  },
  E: {
    seat: [93, 50],
    hand: [78, 50],
    play: [61, 50],
    pile: [80, 30],
    axis: "y",
  },
};

export const RANK: Record<DeckKind, Record<number, string>> = {
  poker: { 11: "J", 12: "Q", 13: "K", 14: "A" },
  italian: { 11: "F", 12: "C", 13: "R", 14: "A" },
};
// which way each seat's cards face on the table (a hand is held facing its owner)
const SEAT_ROT: Record<Seat, number> = { S: 0, W: 90, N: 180, E: -90 };

const RANK_NAME: Record<DeckKind, Record<number, string>> = {
  poker: { 11: "jack", 12: "queen", 13: "king", 14: "ace" },
  italian: { 11: "Fante", 12: "Cavallo", 13: "Re", 14: "Asso" },
};
export const SUIT_NAME: Record<DeckKind, Record<Suit, string>> = {
  poker: { d: "diamonds", h: "hearts", s: "spades", c: "clubs" },
  italian: { d: "Denari", h: "Coppe", s: "Spade", c: "Bastoni" },
};
export const SUIT_COLOR: Record<DeckKind, Record<Suit, string>> = {
  poker: { d: "#c42b2b", h: "#c42b2b", s: "#1d1d1f", c: "#1d1d1f" },
  italian: { d: "#b8860b", h: "#c42b2b", s: "#1f5fbf", c: "#2f7d32" },
};

export function SuitGlyph({
  deck,
  s,
  size,
}: {
  deck: DeckKind;
  s: Suit;
  size: number;
}) {
  const I =
    deck === "poker"
      ? { d: FrenchDiamond, h: FrenchHeart, s: FrenchSpade, c: FrenchClub }[s]
      : { d: ItalianCoin, h: ItalianCup, s: ItalianSword, c: ItalianBat }[s];
  return <I size={size} />;
}

export function cardName(c: Card, deck: DeckKind) {
  const rank = RANK_NAME[deck][c.r] ?? String(c.r);
  return deck === "poker"
    ? `${rank} of ${SUIT_NAME.poker[c.s]}`
    : `${rank} di ${SUIT_NAME.italian[c.s]}`;
}

const first = (DEALER + 1) % 4;
const total = HANDS[0].length;
// steps: 0 deal · 1-4 calls · then per trick: played, won · score · next round
const PLAYED = (k: number) => 5 + 2 * k;
const WON = (k: number) => 6 + 2 * k;
const SCORE = WON(TRICKS.length - 1) + 1;
// scoring takes one step per player, in calling order, the camera on each in turn
const NEXT = SCORE + 4;
/** On a scoring step, the player being scored. */
const scoredPlayer = (step: number) =>
  step >= SCORE && step < NEXT ? (first + step - SCORE) % 4 : null;
const STEPS = NEXT + 1;

function caption(step: number, deck: DeckKind): ReactNode {
  const n = (i: number) => PLAYERS[i].name;
  if (step === 0)
    return `Round ${total}, so ${total} cards each. ${n(DEALER)} shuffles and deals one at a time, starting with ${n(first)} on his left. She'll call first and lead the first trick.`;
  if (step <= 4) {
    const i = (first + step - 1) % 4;
    if (step < 4) {
      const [he, his] = PLAYERS[i].pronouns;
      return `${n(i)} looks at ${his} hand and calls ${CALLS[i]}: how many tricks ${he} thinks ${his} cards will win.`;
    }
    const before = CALLS.reduce((a, c, j) => (j === i ? a : a + c), 0);
    return `${n(i)} calls last, so the calls can't add up to ${total}: ${total - before} is off limits. He calls ${CALLS[i]}, so someone will miss.`;
  }
  for (let k = 0; k < TRICKS.length; k++) {
    const t = TRICKS[k];
    const top = HANDS[t.winner][k];
    if (step === PLAYED(k))
      return k === 0
        ? `Trick 1: ${n(t.lead)} leads, then everyone plays one card, going round to the left.`
        : `${n(t.lead)} won the last trick, so ${PLAYERS[t.lead].pronouns[0]} leads this one.${
            k === 1 ? " Nobody has to follow suit: any card can be played." : ""
          }`;
    if (step === WON(k)) {
      const rest = `${n(t.winner)} takes trick ${k + 1}${k < TRICKS.length - 1 ? " and leads the next one" : ""}.`;
      const tie = tieWith(k);
      return tie === null
        ? `The ${cardName(top, deck)} is the highest card, so ${rest}`
        : `${pairName(top, deck)}: both high cards, with the same value. A tie on value is settled by the suit (${SUIT_ORDER_TEXT[deck]}), and ${SUIT_NAME[deck][top.s]} beat ${SUIT_NAME[deck][HANDS[tie][k].s]}. So ${rest}`;
    }
  }
  const sp = scoredPlayer(step);
  if (sp !== null) {
    const took = TRICKS.filter((t) => t.winner === sp).length;
    const [he] = PLAYERS[sp].pronouns;
    return CALLS[sp] === took
      ? `${n(sp)} called ${CALLS[sp]} and took ${took}: exact, so ${he} scores 10, plus 10 for each trick.`
      : `${n(sp)} called ${CALLS[sp]} but took ${took}: a miss scores nothing. In competitive ${he}'d lose 10 for the trick ${he} was off by.`;
  }
  return `Next round: ${total + 1} cards each. The deal moves left to ${n(first)}, so ${n((first + 1) % 4)} calls and leads first.`;
}

// Card strength: value first, suit only on a tie (clubs < spades < hearts < diamonds).
const strength = (c: Card) => c.r * 10 + ["c", "s", "h", "d"].indexOf(c.s);
// Each card's place in its owner's fan, weakest to strongest.
const SLOT = HANDS.map((hand) =>
  hand.map((c) => hand.filter((o) => strength(o) < strength(c)).length),
);

// "Two kings" / "Two Re": the pair of tied cards, named.
function pairName(c: Card, deck: DeckKind) {
  const name = RANK_NAME[deck][c.r] ?? String(c.r);
  return `Two ${name}${deck === "poker" ? "s" : ""}`;
}
const SUIT_ORDER_TEXT: Record<DeckKind, string> = {
  poker: "clubs < spades < hearts < diamonds",
  italian: "Bastoni < Spade < Coppe < Denari",
};

// The player whose card tied the winner's on value in trick k, if any.
function tieWith(k: number) {
  const t = TRICKS[k];
  const top = HANDS[t.winner][k];
  const other = t.order.find((i) => i !== t.winner && HANDS[i][k].r === top.r);
  return other ?? null;
}

// Where the sketched note sits for each trick's winner, and where its arrow lands.
const NOTE: Record<Seat, { at: [number, number]; to: [number, number] }> = {
  S: { at: [76, 74], to: [55, 62] },
  N: { at: [76, 20], to: [55, 38] },
  E: { at: [80, 76], to: [63, 55] },
  W: { at: [22, 76], to: [37, 55] },
};

// A hand-drawn note and arrow pointing at the card that took trick k: why it won.
// A hand-drawn arrow from a note at `at` to a point `to`, stopping `gap` short of it, with
// the note written beside its tail. Shared by every annotation on the table.
function SketchArrow({
  at,
  to,
  from,
  gap = 4.5,
  className,
  children,
  "data-first": dataFirst,
}: {
  at: [number, number];
  to: [number, number];
  /** where the line starts, if not just above the note */
  from?: [number, number];
  gap?: number;
  className?: string;
  children: ReactNode;
  "data-first"?: string;
}) {
  // Start just outside the note's text (about 26 x 7 units around `at`), on the side
  // facing the target, so the line never crosses its own words.
  const dx0 = to[0] - at[0];
  const dy0 = to[1] - at[1];
  const d0 = Math.hypot(dx0, dy0) || 1;
  const exit =
    Math.min(
      13 / (Math.abs(dx0 / d0) || 1e-6),
      4.5 / (Math.abs(dy0 / d0) || 1e-6),
    ) + 1.5;
  const start =
    from ??
    ([at[0] + (dx0 / d0) * exit, at[1] + (dy0 / d0) * exit] as [
      number,
      number,
    ]);
  const len = Math.hypot(to[0] - start[0], to[1] - start[1]);
  // a gentle, hand-drawn bow, in proportion to the line
  const bow = Math.min(0.18, 4 / Math.max(len, 1));
  const mx = (start[0] + to[0]) / 2 + (to[1] - start[1]) * bow;
  const my = (start[1] + to[1]) / 2 - (to[0] - start[0]) * bow;
  const ang = Math.atan2(to[1] - my, to[0] - mx);
  // stop short of the target: a white arrowhead on a white card disappears
  const end = [
    to[0] - gap * Math.cos(ang),
    to[1] - gap * Math.sin(ang),
  ] as const;
  // an arrowhead in proportion: a short arrow with a big head reads as a squiggle
  const hs = Math.max(1.6, Math.min(3, len * 0.2));
  const head = (da: number) =>
    `${end[0] - hs * Math.cos(ang + da)},${end[1] - hs * Math.sin(ang + da)}`;
  const line = `M${start[0]} ${start[1]} Q${mx} ${my} ${end[0]} ${end[1]}`;
  const tip = `M${head(0.45)} L${end[0]},${end[1]} L${head(-0.45)}`;
  return (
    <span className={className} data-first={dataFirst}>
      <svg
        className="round-demo__sketch"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* a dark outline under the white stroke, so it reads over cards and felt alike */}
        {(["outline", "ink"] as const).map((layer) => (
          <g key={layer} className={`round-demo__sketch-${layer}`}>
            <path d={line} pathLength={1} />
            <path d={tip} pathLength={1} className="round-demo__sketch-head" />
          </g>
        ))}
      </svg>
      <span
        className="round-demo__note"
        style={{ left: `${at[0]}%`, top: `${at[1]}%` }}
      >
        {children}
      </span>
    </span>
  );
}

// The note on the card that took trick k: why it won.
function Sketch({ k, deck }: { k: number; deck: DeckKind }) {
  const t = TRICKS[k];
  const { at, to } = NOTE[PLAYERS[t.winner].seat];
  const top = HANDS[t.winner][k];
  const tie = tieWith(k);
  return (
    <SketchArrow at={at} to={to} className="round-demo__won-note">
      {tie === null ? (
        <>Highest card wins</>
      ) : (
        <>
          {pairName(top, deck)}, same value.
          <br />
          Suit decides: {SUIT_NAME[deck][top.s]} beat{" "}
          {SUIT_NAME[deck][HANDS[tie][k].s]}
        </>
      )}
    </SketchArrow>
  );
}

// A face laid out like a real card: corner indices (the bottom one upside down), pips
// placed as on a printed card, one big pip for the ace, and a framed letter for the
// court cards. Sized in container units, so it stays crisp at any zoom.
// The side columns sit far enough in that no pip ever touches a corner index (x in % of
// the width, y in % of the height); 8, 9 and 10 use smaller pips (PIP_SIZE) to fit.
const PIPS: Record<number, [number, number][]> = {
  2: [
    [50, 22],
    [50, 78],
  ],
  3: [
    [50, 22],
    [50, 50],
    [50, 78],
  ],
  4: [
    [36, 22],
    [64, 22],
    [36, 78],
    [64, 78],
  ],
  5: [
    [36, 22],
    [64, 22],
    [50, 50],
    [36, 78],
    [64, 78],
  ],
  6: [
    [36, 22],
    [64, 22],
    [36, 50],
    [64, 50],
    [36, 78],
    [64, 78],
  ],
  7: [
    [36, 22],
    [64, 22],
    [50, 36],
    [36, 50],
    [64, 50],
    [36, 78],
    [64, 78],
  ],
  // 8, 9 and 10: only in the poker decks that keep them
  8: [
    [35, 22],
    [65, 22],
    [50, 36],
    [35, 50],
    [65, 50],
    [50, 64],
    [35, 78],
    [65, 78],
  ],
  9: [
    [34, 21],
    [66, 21],
    [34, 40.5],
    [66, 40.5],
    [50, 50],
    [34, 59.5],
    [66, 59.5],
    [34, 79],
    [66, 79],
  ],
  10: [
    [34, 20],
    [66, 20],
    [50, 30],
    [34, 40],
    [66, 40],
    [34, 60],
    [66, 60],
    [50, 70],
    [34, 80],
    [66, 80],
  ],
};
const PIP_SIZE: Record<number, string> = {
  8: "20cqw",
  9: "18cqw",
  10: "18cqw",
};
export function ClassicFace({ c, deck }: { c: Card; deck: DeckKind }) {
  if (deck === "italian") {
    // the app's own Italian faces: the real number of suit symbols, figure badges
    const rank = (c.r === 14 ? 1 : c.r > 10 ? c.r - 3 : c.r) as ItRank;
    const suit = ({ d: "coins", h: "cups", s: "swords", c: "bats" } as const)[
      c.s
    ];
    return <ItalianFace rank={rank} suit={suit} />;
  }
  const label = RANK[deck][c.r] ?? String(c.r);
  const corner = (flip: boolean) => (
    <span className="classic__corner" data-flip={flip ? "true" : undefined}>
      {/* the two-digit 10 is set tighter, so it stays inside its corner */}
      <span
        className="classic__idx"
        data-wide={label.length > 1 ? "true" : undefined}
      >
        {label}
      </span>
      <span className="classic__pip classic__pip--corner">
        <SuitGlyph deck={deck} s={c.s} size={12} />
      </span>
    </span>
  );
  return (
    <span className="classic" style={{ ["--pip" as string]: PIP_SIZE[c.r] }}>
      {corner(false)}
      {corner(true)}
      {c.r === 14 ? (
        <span
          className="classic__pip classic__pip--ace"
          style={{ left: "50%", top: "50%" }}
        >
          <SuitGlyph deck={deck} s={c.s} size={12} />
        </span>
      ) : c.r > 10 ? (
        <span className="classic__court">
          <span>{label}</span>
          <span className="classic__pip classic__pip--court">
            <SuitGlyph deck={deck} s={c.s} size={12} />
          </span>
        </span>
      ) : (
        PIPS[c.r].map(([x, y], i) => (
          <span
            key={i}
            className="classic__pip"
            data-flip={y > 50 ? "true" : undefined}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <SuitGlyph deck={deck} s={c.s} size={12} />
          </span>
        ))
      )}
    </span>
  );
}

// One face, in any of the three styles. Real cards are the printed decks (the poker SVGs
// are CC0; the Piacentine scans are the app's own); the rest is drawn here. Re-keyed on
// style, so switching fades rather than snaps.
export function CardFace({
  c,
  deck,
  faces,
}: {
  c: Card;
  deck: DeckKind;
  faces: Faces;
}) {
  // poker has no separate drawn style any more: its "classic" is the merged real look
  if (deck === "poker" && faces === "classic") faces = "real";
  return (
    <span
      key={`${deck}-${faces}`}
      className="round-demo__face"
      data-classic={faces !== "simple" ? "true" : undefined}
      data-style={faces}
    >
      {faces === "real" && deck === "poker" && (c.r <= 10 || c.r === 14) ? (
        // the open poker set's pips are poor; its court cards are good. Numbers and aces
        // use the app's own pip art, the J, Q and K the real cards.
        <ClassicFace c={c} deck={deck} />
      ) : faces === "real" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={`real-face real-face--${deck}`}
          src={`/cards/real/${deck}/${c.r}${c.s}.${deck === "poker" ? "svg" : "webp"}`}
          alt=""
          draggable={false}
        />
      ) : faces === "classic" ? (
        <ClassicFace c={c} deck={deck} />
      ) : deck === "italian" && c.r === 14 ? (
        // the Asso: one big suit sign, as on the real card
        <span className="simple-face">
          <span className="simple-face__ace">
            <SuitGlyph deck={deck} s={c.s} size={12} />
          </span>
        </span>
      ) : (
        <span className="simple-face">
          {/* Fante, Cavallo, Re: the figure, large and faint, behind the letter */}
          {deck === "italian" && c.r >= 11 && (
            <span className="simple-face__figure">
              <ItalianFigure rank={c.r as 11 | 12 | 13} />
            </span>
          )}
          <span className="simple-face__rank">{RANK[deck][c.r] ?? c.r}</span>
          <span className="simple-face__suit">
            <SuitGlyph deck={deck} s={c.s} size={12} />
          </span>
        </span>
      )}
    </span>
  );
}

// One control for how the cards look: deck and face style together, each option with a
// small preview.
// Poker has one classic look (real court cards, the app's own pips); Italian has the
// real Piacentine cards and a drawn version.
const STYLES = [
  { deck: "poker", faces: "real", name: "Classic" },
  { deck: "poker", faces: "simple", name: "Simple" },
  { deck: "italian", faces: "real", name: "Real" },
  { deck: "italian", faces: "classic", name: "Drawn" },
  { deck: "italian", faces: "simple", name: "Simple" },
] as const;
// a number card, so each style shows how it draws the pips: seven clubs (or Bastoni)
const PREVIEW: Card = { r: 7, s: "c" };
export function CardStylePicker() {
  const { deck, setDeck, faces, setFaces } = useDeck();
  return (
    <div className="style-pick" role="group" aria-label="Card style">
      {STYLES.map((o) => {
        const name = `${o.deck === "poker" ? "Poker" : "Italian"}, ${o.name.toLowerCase()}`;
        return (
          <button
            key={name}
            type="button"
            className="style-pick__btn"
            aria-pressed={deck === o.deck && faces === o.faces}
            aria-label={name}
            title={name}
            onClick={() => {
              setDeck(o.deck);
              setFaces(o.faces);
            }}
          >
            <span
              className="style-pick__card"
              style={{ color: SUIT_COLOR[o.deck][PREVIEW.s] }}
            >
              <CardFace c={PREVIEW} deck={o.deck} faces={o.faces} />
            </span>
            <span className="style-pick__label">
              {o.deck === "poker" ? "Poker" : "Italian"}
              <span className="style-pick__sub">{o.name}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Scoring, one player at a time: the call, the tricks, and the sum spelled out.
function ScoreCallout({
  i,
  tricks,
  delay,
}: {
  i: number;
  tricks: number;
  delay: boolean;
}) {
  const call = CALLS[i];
  const hit = call === tricks;
  return (
    <div
      className="round-demo__callout"
      data-hit={hit ? "true" : undefined}
      style={{
        ["--who" as string]: PLAYERS[i].color,
        animationDelay: delay ? "1.1s" : "0.3s",
      }}
    >
      <span className="round-demo__callout-who">
        <span className="round-demo__scores-dot">{PLAYERS[i].name[0]}</span>
        {PLAYERS[i].name}
      </span>
      <span className="round-demo__callout-line">
        Called <strong>{call}</strong> · took <strong>{tricks}</strong>
      </span>
      {hit ? (
        <span className="round-demo__callout-sum">
          10 + 10 × {tricks} = <strong>+{10 + 10 * tricks}</strong>
        </span>
      ) : (
        <span className="round-demo__callout-sum">
          Missed by {Math.abs(call - tricks)}: <strong>0</strong>
          <em>competitive: −{10 * Math.abs(call - tricks)}</em>
        </span>
      )}
    </div>
  );
}

// Notes in the middle of the table point from here to a seat.
const LEAD_NOTE_AT: [number, number] = [50, 48];
const LEAD_NOTE: Record<Seat, { to: [number, number] }> = {
  S: { to: [50, 87] },
  N: { to: [50, 13] },
  E: { to: [87, 50] },
  W: { to: [13, 50] },
};

// Luca's call: why 1 is the number he can't say.
function ForcedSketch() {
  const before = CALLS.reduce((a, c, j) => (j === DEALER ? a : a + c), 0);
  const { to } = LEAD_NOTE[PLAYERS[DEALER].seat];
  return (
    <SketchArrow
      at={LEAD_NOTE_AT}
      to={to}
      gap={3}
      className="round-demo__forced-note"
    >
      {total - before} would make the calls add up to {total},
      <br />
      so {PLAYERS[DEALER].name} can&rsquo;t say it
    </SketchArrow>
  );
}

// After the round: where to read more about each phase, or watch it again.
const PHASE_LINKS = [
  { name: "Dealing", href: "#rules-the-elevator" },
  { name: "Calling", href: "#rules-calling" },
  { name: "Playing", href: "#rules-playing" },
  { name: "Scoring", href: "#rules-scoring" },
];
function EndCard({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="round-demo__end">
      <p className="round-demo__end-title">That&rsquo;s one round.</p>
      <p className="round-demo__end-sub">Want more on one part of it?</p>
      <div className="round-demo__end-links">
        {PHASE_LINKS.map((l) => (
          <a key={l.name} href={l.href} className="round-demo__end-link">
            {l.name}
          </a>
        ))}
      </div>
      <button
        type="button"
        className="round-demo__end-replay"
        onClick={onReplay}
      >
        Watch it again
      </button>
    </div>
  );
}

// The card values, weakest to strongest, with Giulia's three marked: the legend she
// reads her hand against while the camera is on it.
const VALUES = [2, 3, 4, 5, 6, 7, 11, 12, 13, 14];
// The value strip inside Giulia's thought: weakest to strongest, her three marked.
function ThinkLegend({ deck }: { deck: DeckKind }) {
  const held = new Set(HANDS[0].map((c) => c.r));
  const top = Math.max(...held);
  return (
    <span className="round-demo__legend">
      <span className="round-demo__legend-label">Weakest → strongest</span>
      <span className="round-demo__legend-row">
        {VALUES.map((r) => (
          <span
            key={r}
            className="round-demo__legend-card"
            data-legend-r={r}
            data-held={held.has(r) ? (r === top ? "top" : "low") : undefined}
          >
            {RANK[deck][r] ?? r}
          </span>
        ))}
      </span>
    </span>
  );
}

// the top-centre of each of Giulia's cards in her fan, in stage % (same maths as the fan)
function handTop(k: number): [number, number] {
  const f = SLOT[0][k] - 1;
  return [POS.S.hand[0] + f * 9, POS.S.hand[1] + Math.abs(f) * 1.2 - 6.6];
}

// The bubble's text with the called number picked out: it's the number that flies into
// the tally.
function withCall(text: string, call: number): ReactNode {
  const at = text.lastIndexOf(String(call));
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="round-demo__says-n">{call}</span>
      {text.slice(at + String(call).length)}
    </>
  );
}

// Giulia's reasoning as she looks at her hand: the zoom step's thought bubble.
function thinking(deck: DeckKind) {
  const [a, b, c] = HANDS[0];
  const ace = RANK_NAME[deck][a.r] ?? a.r;
  return `The ${ace} should win. A ${RANK[deck][b.r] ?? b.r} and a ${RANK[deck][c.r] ?? c.r} won't. So: 1.`;
}

// The homepage tile's one-liners: the gist, with the detail left to /rules.
function shortCaption(step: number) {
  if (step === 0) return "Everyone gets the same number of cards.";
  if (step <= 4) return "Everyone calls how many tricks they'll win.";
  if (step < SCORE) return "Highest card takes the trick.";
  if (step < NEXT) return "Hit your call exactly and you score.";
  return "Next round, one more card each.";
}

// The round's four phases, in order, with the steps each one covers.
const PHASES = [
  { name: "Dealing", from: 0, to: 0 },
  { name: "Calling", from: 1, to: 4 },
  { name: "Playing", from: PLAYED(0), to: SCORE - 1 },
  { name: "Scoring", from: SCORE, to: NEXT },
];
function phase(step: number) {
  const i = PHASES.findIndex((p) => step >= p.from && step <= p.to);
  return { n: i + 1, name: PHASES[i].name };
}
// a phase's first step: the label shows big in the middle before the action starts
const PHASE_START = new Set(PHASES.map((p) => p.from));
const PHASE_PAUSE = 1100;
// A beat added to every step, so nothing moves on the instant it has finished.
const HOLD = 800;
// After a pause is lifted the step is already shown finished: a short beat, then on.
const RESUME_BEAT = 1200;

// Gap between one player's card and the next, as at a real table.
const PLAY_GAP = 650;
// Before the second and third tricks: the last one is collected and its winner leads.
const LEAD_PAUSE = 2800;
// On a won step: the note is read, then the trick is swept to its winner at this point.
const SWEEP_AT = 2300; // long enough to read the note in the middle of the table

// The deal: Luca shuffles, then deals one card at a time from his left, round after round.
const SHUFFLE_MS = 500; // the deck settles by Luca, then he deals
const DEAL_GAP = 170;
const DECK_AT: [number, number] = [87, 72]; // off the felt, right by Luca's seat
const dealDelay = (i: number, k: number) =>
  // each pass round the table fills the next slot of every fan, left to right
  PHASE_PAUSE +
  SHUFFLE_MS +
  (SLOT[i][k] * 4 + ((i - first + 4) % 4)) * DEAL_GAP;
const DEAL_DONE = dealDelay(DEALER, total - 1) + 520;

// How long each step holds before the next. A phase's first step also waits for its
// label (the pause comes first, so it's added, not folded into the base).
function baseDuration(step: number) {
  if (step === 0) return DEAL_DONE - PHASE_PAUSE + 3200; // deal, then read who calls first
  if (step === 1) return 5600; // Giulia thinks, then calls
  if (step === 4) return 6200; // Luca's call: read why 1 is off limits
  if (step <= 4) return 2600;
  if (scoredPlayer(step) !== null) return 4400;
  if (step === NEXT) return 4200;
  const played = TRICKS.some((_, k) => step === PLAYED(k));
  if (!played) return SWEEP_AT + 2200; // the trick won: read the note, sweep, tally
  // after the first trick, a beat for the last one to be collected and the winner to lead
  return 600 + 4 * PLAY_GAP + LEAD_PAUSE; // every trick opens on its "who leads" note
}
const DURATION = (step: number) =>
  (PHASE_START.has(step) ? PHASE_PAUSE : 0) + baseDuration(step) + HOLD;

// The camera. Each step has a plan: where to push in, when, and when to come back out.
// A push always settles before the step ends, so the next step starts with the camera
// at rest, and it starts from wherever the camera is now, so a jump never snaps.
const CAM_MOVE = 900; // one push in or pull out
const CAM_IN_AT = PHASE_PAUSE; // after a phase's big label has had its moment
type Shot = { at: number; s: number; o: readonly [number, number] };
const cam = ({ s, o }: { s: number; o: readonly [number, number] }) =>
  // a zoom by s about the point o (percent of the stage), with the origin at 0 0
  `translate(${(1 - s) * o[0]}%, ${(1 - s) * o[1]}%) scale(${s})`;
const AT_REST = { s: 1, o: [50, 50] as const };
function shots(step: number): Shot[] {
  const end = DURATION(step);
  if (step === 1) {
    // Giulia's hand while she works out her call; out once her number has landed
    const z = { s: 1.75, o: [50, 100] as const };
    return [
      { at: CAM_IN_AT, ...AT_REST },
      { at: CAM_IN_AT + CAM_MOVE, ...z },
      { at: end - HOLD - CAM_MOVE, ...z },
      { at: end - HOLD, ...AT_REST },
    ];
  }
  const k = TRICKS.findIndex((_, j) => step === WON(j));
  if (k !== -1) {
    // the winning card while its note is read; out as the trick is swept away
    const z = { s: 1.22, o: POS[PLAYERS[TRICKS[k].winner].seat].play };
    return [
      { at: 150, ...AT_REST },
      { at: 150 + CAM_MOVE, ...z },
      { at: SWEEP_AT, ...z },
      { at: SWEEP_AT + CAM_MOVE, ...AT_REST },
    ];
  }
  const p = scoredPlayer(step);
  if (p !== null) {
    // each player in turn: the camera glides from one to the next
    const z = { s: 1.18, o: POS[PLAYERS[p].seat].seat };
    return step === SCORE
      ? [
          { at: CAM_IN_AT, ...AT_REST },
          { at: CAM_IN_AT + CAM_MOVE, ...z },
        ]
      : [{ at: CAM_MOVE, ...z }];
  }
  return [{ at: 700, ...AT_REST }];
}

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** The full walkthrough (the rules page), or a quiet looping snippet (the homepage tile). */
export function RoundDemo({
  compact = false,
  title,
}: {
  compact?: boolean;
  /** the full version's heading; its header holds the card-face and deck switches */
  title?: string;
}) {
  return compact ? <RoundSnippet /> : <FullRoundDemo title={title} />;
}

// ---- The homepage snippet ----
// Only the play: the three cards go round, each card lands in the middle and the
// winner sweeps the lot, then the table clears and it starts again. No captions, round
// label, calls or controls: it's a teaser for the rules page, not the lesson.
const SNIP_REST = 1300;
const SNIP_GAP = 420; // between one player's card and the next
const SNIP_LOOK = 1000; // the trick sits in the middle before it's swept
const SNIP_SWEEP_AT = 450; // the winning card lights up, then the pile goes
const SNIP_CLEAR = 900;
// steps: 0 rest, then per trick k: 1 + 2k played, 2 + 2k swept; last: the table clears
const SNIP_STEPS = 2 + 2 * TRICKS.length;
const snipPlayed = (k: number) => 1 + 2 * k;
const snipWon = (k: number) => 2 + 2 * k;
function snipDuration(step: number) {
  if (step === 0) return SNIP_REST;
  if (step === SNIP_STEPS - 1) return SNIP_CLEAR;
  return step % 2 === 1 ? 3 * SNIP_GAP + 700 + SNIP_LOOK : SNIP_SWEEP_AT + 1100;
}

// where card k of player i is held: fanned towards its owner, as in the full round
function fanned(i: number, k: number): [number, number, number] {
  const p = PLAYERS[i];
  const pos = POS[p.seat];
  const f = SLOT[i][k] - 1;
  const spread = i === 0 ? 9 : 5;
  const lift = Math.abs(f) * 1.2;
  const along = f * spread;
  const rot = SEAT_ROT[p.seat] + f * (i === 0 ? 9 : 12);
  return pos.axis === "x"
    ? [
        pos.hand[0] + (p.seat === "S" ? along : -along),
        pos.hand[1] + (p.seat === "S" ? lift : -lift),
        rot,
      ]
    : [
        pos.hand[0] + (p.seat === "W" ? -lift : lift),
        pos.hand[1] + (p.seat === "W" ? along : -along),
        rot,
      ];
}

function RoundSnippet() {
  const { deck } = useDeck();
  const still = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
  const [{ step, loop }, setState] = useState({ step: 0, loop: 0 });
  const [onScreen, setOnScreen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen || still) return;
    const id = window.setTimeout(
      () =>
        setState((s) =>
          s.step === SNIP_STEPS - 1
            ? { step: 0, loop: s.loop + 1 }
            : { ...s, step: s.step + 1 },
        ),
      snipDuration(step),
    );
    return () => window.clearTimeout(id);
  }, [onScreen, still, step]);

  // reduced motion: one still frame, the second card of the round in the middle
  const at = still ? snipPlayed(1) : step;
  const clearing = at === SNIP_STEPS - 1;

  return (
    <div
      ref={ref}
      className="round-demo round-demo--compact"
      // back at the start after a clear: cards appear in their hands, they don't fly there
      data-reset={at === 0 && loop > 0 ? "true" : undefined}
      aria-hidden="true"
    >
      <div className="round-demo__table">
        <div className="round-demo__stage">
          <div className="round-demo__felt" />
          {PLAYERS.map((p) => (
            <div
              key={p.name}
              className="round-demo__seat"
              style={{
                left: `${POS[p.seat].seat[0]}%`,
                top: `${POS[p.seat].seat[1]}%`,
                ["--who" as string]: p.color,
              }}
            >
              <span className="round-demo__avatar">{p.name[0]}</span>
            </div>
          ))}
          {PLAYERS.flatMap((p, i) =>
            HANDS[i].map((c, k) => {
              const t = TRICKS[k];
              const order = t.order.indexOf(i);
              const played = at >= snipPlayed(k);
              const collected = at >= snipWon(k);
              let x: number, y: number, rot: number;
              let z = 2 + SLOT[i][k];
              let delay = 0;
              if (collected) {
                const pile = POS[PLAYERS[t.winner].seat].pile;
                const before = TRICKS.slice(0, k).filter(
                  (o) => o.winner === t.winner,
                ).length;
                [x, y] = [pile[0] + before * 1.2, pile[1] - before * 1.2];
                rot = SEAT_ROT[PLAYERS[t.winner].seat] + before * 6;
                z = 1 + k;
                if (at === snipWon(k)) delay = SNIP_SWEEP_AT;
              } else if (played) {
                [x, y] = POS[p.seat].play;
                rot = SEAT_ROT[p.seat] / 12 + (order - 1.5) * 4;
                z = 10 + order;
                if (at === snipPlayed(k)) delay = 300 + order * SNIP_GAP;
              } else [x, y, rot] = fanned(i, k);
              return (
                <div
                  key={`${p.name}-${k}`}
                  className="round-demo__card"
                  // Giulia's hand is face up, as it would be to her; the rest stay hidden
                  // until they're played
                  data-back={
                    collected || (!played && i !== 0) ? "true" : undefined
                  }
                  data-win={
                    at === snipWon(k) && t.winner === i ? "true" : undefined
                  }
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    zIndex: z,
                    opacity: clearing ? 0 : 1,
                    ["--rot" as string]: `${rot}deg`,
                    ["--delay" as string]: `${delay}ms`,
                    transitionDelay: "var(--delay)",
                    color: SUIT_COLOR[deck][c.s],
                  }}
                >
                  <span className="round-demo__flip">
                    <CardFace c={c} deck={deck} faces="simple" />
                    <span className="round-demo__back" />
                  </span>
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}

function FullRoundDemo({
  compact = false,
  title,
}: {
  compact?: boolean;
  title?: string;
}) {
  const { deck } = useDeck();
  const still = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
  // The step, plus a count of how many times it has gone backwards (a wrap to the start
  // or a step back): the timeline's fills re-mount on it, so they fade rather than drain.
  const [{ step, loop, playing, pausedAt, resumedOn }, go] = useReducer(
    (
      st: {
        step: number;
        loop: number;
        playing: boolean;
        pausedAt: number | null;
        /** the step a pause was lifted on: it was shown finished, so it moves on soon */
        resumedOn: number | null;
      },
      to: number | "next" | "prev" | "toggle" | "play",
    ) => {
      // pausing remembers which step it froze; stepping while paused shows each step
      // settled (its entrance animations run), only that one step stays frozen
      if (to === "toggle")
        return st.playing
          ? { ...st, playing: false, pausedAt: st.step, resumedOn: null }
          : { ...st, playing: true, pausedAt: null, resumedOn: st.pausedAt };
      if (to === "play")
        return { ...st, playing: true, pausedAt: null, resumedOn: null };
      const next =
        to === "next"
          ? (st.step + 1) % STEPS
          : to === "prev"
            ? (st.step - 1 + STEPS) % STEPS
            : to;
      return {
        ...st,
        step: next,
        loop: next < st.step ? st.loop + 1 : st.loop,
      };
    },
    { step: 0, loop: 0, playing: true, pausedAt: null, resumedOn: null },
  );

  // how the faces are drawn: a big rank and suit, or laid out like a real card
  // the homepage's small round keeps simple faces; the full one follows the picker
  const { faces: pickedFaces } = useDeck();
  const faces = compact ? "simple" : pickedFaces;
  const [onScreen, setOnScreen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<Animation | null>(null);
  const cablesRef = useRef<SVGSVGElement>(null);

  // Join each of Giulia's cards to its value in her thought bubble. Measured on screen,
  // then mapped back into the stage's own (unzoomed) pixels, once the zoom and the
  // bubble's entrance have settled.
  useEffect(() => {
    if (step !== 1 || compact) return;
    const id = window.setTimeout(
      () => {
        const svg = cablesRef.current;
        const stage = svg?.parentElement;
        if (!svg || !stage) return;
        const W = stage.offsetWidth;
        const H = stage.offsetHeight;
        const box = stage.getBoundingClientRect();
        const k = box.width / W; // the camera's current scale
        svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        const paths = svg.querySelectorAll("path");
        HANDS[0].forEach((c, n) => {
          const cell = stage.querySelector<HTMLElement>(
            `[data-legend-r="${c.r}"]`,
          );
          if (!cell) return;
          const r = cell.getBoundingClientRect();
          const x1 = (r.left + r.width / 2 - box.left) / k;
          const y1 = (r.bottom - box.top) / k;
          const [px, py] = handTop(n);
          const x0 = (px / 100) * W;
          const y0 = (py / 100) * H;
          const bend = (y0 - y1) * 0.5;
          paths[n]?.setAttribute(
            "d",
            `M${x0} ${y0} C${x0} ${y0 - bend} ${x1} ${y1 + bend} ${x1} ${y1}`,
          );
        });
      },
      CAM_IN_AT + CAM_MOVE + 200,
    );
    return () => window.clearTimeout(id);
  }, [step, deck, compact]);

  // Aim the flying number: from the middle of the caller's bubble to the middle of their
  // tally. Measured from layout offsets (both sit in the seat), so the camera's zoom
  // doesn't skew it.
  useLayoutEffect(() => {
    const fly = flyRef.current;
    const seat = fly?.parentElement;
    if (!fly || !seat) return;
    const says = seat.querySelector<HTMLElement>("[data-says]");
    const tally = seat.querySelector<HTMLElement>("[data-tally]");
    if (!says || !tally) return;
    const c = (el: HTMLElement) => [
      el.offsetLeft + el.offsetWidth / 2,
      el.offsetTop + el.offsetHeight / 2,
    ];
    const [sx, sy] = c(says);
    const [tx, ty] = c(tally);
    fly.style.left = `${tx}px`;
    fly.style.top = `${ty}px`;
    fly.style.setProperty("--fx", `${sx - tx}px`);
    fly.style.setProperty("--fy", `${sy - ty}px`);
  }, [step]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = playing && onScreen && !still;

  // Keyboard, while the round is on screen: ← → step, space pauses and plays.
  useEffect(() => {
    if (compact || !onScreen) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
      )
        return;
      if (e.key === "ArrowRight") go("next");
      else if (e.key === "ArrowLeft") go("prev");
      else if (e.key === " ") {
        // a focused button already acts on space; toggling here too undid it instantly
        if (el?.tagName === "BUTTON") return;
        go("toggle");
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compact, onScreen]);
  // The clock. Pausing keeps what's left of the step, so play picks up where it stopped
  // instead of starting the step over. The full version stops on its last step (the end
  // card); the homepage one loops.
  const remainRef = useRef(DURATION(0));
  const remainStepRef = useRef(0);
  useEffect(() => {
    if (remainStepRef.current !== step) {
      remainStepRef.current = step;
      remainRef.current = DURATION(step);
    }
    if (!running || (!compact && step === NEXT)) return;
    // coming back from a pause the step was shown finished: move on after a short beat
    if (resumedOn === step)
      remainRef.current = Math.min(remainRef.current, RESUME_BEAT);
    const started = performance.now();
    const id = window.setTimeout(() => go("next"), remainRef.current);
    return () => {
      window.clearTimeout(id);
      remainRef.current = Math.max(
        0,
        remainRef.current - (performance.now() - started),
      );
    };
  }, [running, step, compact, resumedOn]);

  // paused on this step: it's shown finished, so its progress reads full too
  const settled = !playing && pausedAt === step && !still;
  // Run the step's camera plan, from wherever the camera is now.
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el || compact || still) return;
    const from = getComputedStyle(el).transform;
    camRef.current?.cancel();
    const end = DURATION(step);
    const frames: Keyframe[] = [
      { offset: 0, transform: from === "none" ? cam(AT_REST) : from },
      ...shots(step).map((sh) => ({
        offset: Math.min(sh.at / end, 1),
        transform: cam(sh),
      })),
    ];
    // every move eases in and out (a frame's easing is for the move that leaves it)
    frames.forEach((f) => (f.easing = "cubic-bezier(0.65, 0, 0.35, 1)"));
    camRef.current = el.animate(frames, { duration: end, fill: "forwards" });
  }, [step, compact, still]);

  // The camera keeps time with the round: it holds off screen, and a pause shows the
  // step finished, camera included.
  useEffect(() => {
    // A pause shows the step finished. CSS can't do it alone: a transition already
    // under way (or waiting out its delay) keeps its old timing whatever the styles say,
    // so the table would carry on catching up for seconds. Jump them all to their end.
    if (settled)
      ref.current?.getAnimations({ subtree: true }).forEach((an) => {
        if (an === camRef.current) return;
        try {
          an.finish();
        } catch {
          // an endless loop (a pulse) has no end to jump to: leave it
        }
      });
    const a = camRef.current;
    if (!a) return;
    if (settled) a.finish();
    else if (onScreen) a.play();
    else a.pause();
  }, [settled, onScreen, step]);

  const won = TRICKS.map((_, k) => step >= WON(k));
  const tricks = PLAYERS.map(
    (_, i) => TRICKS.filter((t, k) => won[k] && t.winner === i).length,
  );
  const calls = PLAYERS.map((_, i) =>
    step >= ((i - first + 4) % 4) + 1 ? CALLS[i] : null,
  );
  const scored = step >= SCORE;
  const scoringP = scoredPlayer(step);
  const ph = phase(step);
  // the trick just won, if this step is one: the camera and the sketched note point at it
  const wonK = TRICKS.findIndex((_, k) => step === WON(k));
  const wonKOrNull = wonK === -1 ? null : wonK;
  const dealer = step === NEXT ? first : DEALER;
  const playingK = TRICKS.findIndex((_, k) => step === PLAYED(k));
  // whoever is calling on this step
  const caller = step >= 1 && step <= 4 ? (first + step - 1) % 4 : null;
  const leader = playingK === -1 ? null : TRICKS[playingK].lead;

  return (
    <div
      ref={ref}
      className={`round-demo${compact ? " round-demo--compact" : ""}`}
      // freezes every animation on the table mid-motion while paused
      // the deal note shows once the last card is down
      style={{ ["--deal-note-at" as string]: `${DEAL_DONE}ms` }}
      data-paused={settled ? "true" : undefined}
      // Italian cards are dealt in their own, narrower shape
      data-deck={deck}
    >
      {title && !compact && (
        // the header stays put while the table zooms: title, then the two switches
        <div className="scrim-top mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="tile__title">{title}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <CardStylePicker />
          </div>
        </div>
      )}
      <div className="round-demo__table" aria-hidden="true">
        <div ref={stageRef} className="round-demo__stage">
          <div className="round-demo__felt" />
          {step === 0 && (
            // the deck by the dealer: shuffled, then dealt away to nothing
            <div
              className="round-demo__deck"
              style={{
                left: `${DECK_AT[0]}%`,
                top: `${DECK_AT[1]}%`,
                ["--pause" as string]: `${PHASE_PAUSE}ms`,
                ["--gone" as string]: `${DEAL_DONE - 400}ms`,
              }}
            >
              {/* a stack you can see the thickness of; the top half lifts and drops
                  behind as he shuffles */}
              <span className="round-demo__deck-half" />
              <span className="round-demo__deck-half" />
            </div>
          )}

          {step === 1 && !compact && (
            // tendrils from the top of each of her cards up to its value in her thought
            <svg ref={cablesRef} className="round-demo__cables">
              {HANDS[0].map((c, k) => (
                <path
                  key={k}
                  data-top={
                    c.r === Math.max(...HANDS[0].map((h) => h.r))
                      ? "true"
                      : undefined
                  }
                  pathLength={1}
                />
              ))}
            </svg>
          )}
          {wonKOrNull !== null && !compact && (
            <Sketch key={step} k={wonKOrNull} deck={deck} />
          )}
          {step === 4 && !compact && <ForcedSketch />}

          {PLAYERS.map((p, i) => {
            const pos = POS[p.seat];
            const hit = scored && calls[i] === tricks[i];
            return (
              <div
                key={p.name}
                className="round-demo__seat"
                style={{
                  left: `${pos.seat[0]}%`,
                  top: `${pos.seat[1]}%`,
                  ["--who" as string]: p.color,
                }}
              >
                <span className="round-demo__avatar">{p.name[0]}</span>
                <span className="round-demo__name">
                  {p.name}
                  {i === dealer && (
                    <span className="round-demo__dealer">Deals</span>
                  )}
                  {/* who starts this trick: the last trick's winner */}
                  {leader === i && (
                    <span className="round-demo__dealer round-demo__leads">
                      Leads
                    </span>
                  )}
                </span>
                {/* tricks won / called, from the moment they call: bumps on each trick */}
                {calls[i] === null ? (
                  <span className="round-demo__stats">…</span>
                ) : (
                  <span
                    key={tricks[i]}
                    data-tally={i}
                    // the caller's chip appears as their number lands in it
                    data-arrive={caller === i && !compact ? "true" : undefined}
                    className="round-demo__tally"
                    data-bump={
                      wonKOrNull !== null && TRICKS[wonKOrNull].winner === i
                        ? "true"
                        : undefined
                    }
                    data-result={
                      scored
                        ? calls[i] === tricks[i]
                          ? "hit"
                          : "miss"
                        : undefined
                    }
                    title="Tricks won / called"
                  >
                    {wonKOrNull !== null &&
                    TRICKS[wonKOrNull].winner === i &&
                    !compact ? (
                      // the count ticks over as the trick lands in the pile
                      <span className="round-demo__tally-count">
                        <span className="round-demo__tally-old">
                          {tricks[i] - 1}
                        </span>
                        <span className="round-demo__tally-new">
                          {tricks[i]}
                        </span>
                        <span className="round-demo__plus">+1</span>
                      </span>
                    ) : (
                      tricks[i]
                    )}
                    <span className="round-demo__tally-of">/{calls[i]}</span>
                  </span>
                )}
                {step === 1 && i === first && !compact && (
                  <span className="round-demo__think" data-side={p.seat}>
                    {thinking(deck)}
                    <ThinkLegend deck={deck} />
                  </span>
                )}
                {step >= 1 && step <= 4 && (first + step - 1) % 4 === i && (
                  <span
                    className="round-demo__says"
                    data-says={i}
                    data-side={p.seat}
                    data-late={step === 1 && !compact ? "true" : undefined}
                  >
                    {withCall(SAYS[step - 1], CALLS[i])}
                  </span>
                )}
                {/* the number leaves the bubble and drops into the tally */}
                {caller === i && !compact && (
                  <span
                    ref={flyRef}
                    className="round-demo__fly"
                    data-late={step === 1 ? "true" : undefined}
                  >
                    {CALLS[i]}
                  </span>
                )}
                {/* the small homepage version keeps a badge; the full one has the panel */}
                {scored && step !== NEXT && compact && (
                  <span
                    className="round-demo__score"
                    data-hit={hit ? "true" : undefined}
                  >
                    {hit ? `+${10 + 10 * tricks[i]}` : "0"}
                  </span>
                )}
              </div>
            );
          })}

          {PLAYERS.flatMap((p, i) =>
            HANDS[i].map((c, k) => {
              const t = TRICKS[k];
              const pos = POS[p.seat];
              const playedAt = step >= PLAYED(k);
              // swept into the winner's pile partway through the step it's won on
              const collected = step >= WON(k);
              const sweeping = step === WON(k);
              const order = t.order.indexOf(i);
              const isWin = step === WON(k) && t.winner === i;
              let x: number,
                y: number,
                rot: number,
                z = 1;
              if (collected) {
                const pile = POS[PLAYERS[t.winner].seat].pile;
                const before = TRICKS.slice(0, k).filter(
                  (tt) => tt.winner === t.winner,
                ).length;
                [x, y] = [pile[0] + before * 1.2, pile[1] - before * 1.2];
                rot = SEAT_ROT[PLAYERS[t.winner].seat] + before * 6;
                z = 1 + k;
              } else if (playedAt) {
                [x, y] = pos.play;
                rot = SEAT_ROT[p.seat] / 12 + (order - 1.5) * 4; // dropped, not placed
                z = 10 + order;
              } else {
                // a fan held towards its owner: cards spread along the edge and turned out
                // held weakest on the owner's left, strongest on their right
                const f = SLOT[i][k] - 1;
                const spread = i === 0 ? 9 : 5;
                const lift = Math.abs(f) * 1.2;
                const base = SEAT_ROT[p.seat];
                const along = f * spread;
                [x, y] =
                  pos.axis === "x"
                    ? [
                        pos.hand[0] + (p.seat === "S" ? along : -along),
                        pos.hand[1] + (p.seat === "S" ? lift : -lift),
                      ]
                    : [
                        pos.hand[0] + (p.seat === "W" ? -lift : lift),
                        pos.hand[1] + (p.seat === "W" ? along : -along),
                      ];
                rot = base + f * (i === 0 ? 9 : 12);
                z = 2 + SLOT[i][k];
              }
              const hidden = step === NEXT;
              return (
                <div
                  key={`${p.name}-${k}`}
                  className="round-demo__card"
                  // only Giulia's hand is shown face up, as at a real table; the rest are
                  // turned over as they hit the felt
                  data-back={
                    collected || (!playedAt && (i !== 0 || step === 0))
                      ? "true"
                      : undefined
                  }
                  data-win={isWin ? "true" : undefined}
                  // dealt from the deck, one at a time, in dealing order
                  data-deal={step === 0 ? "true" : undefined}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    ["--deck-x" as string]: `${DECK_AT[0]}%`,
                    ["--deck-y" as string]: `${DECK_AT[1]}%`,
                    ["--deal-delay" as string]: `${dealDelay(i, k)}ms`,
                    zIndex: z,
                    ["--rot" as string]: `${rot}deg`,
                    opacity: hidden ? 0 : 1,
                    // the card waits its turn, and its flip waits with it
                    ["--delay" as string]:
                      playedAt && !collected && step === PLAYED(k)
                        ? `${order * PLAY_GAP + (k === 0 ? PHASE_PAUSE + LEAD_PAUSE : LEAD_PAUSE)}ms`
                        : sweeping
                          ? `${SWEEP_AT}ms`
                          : "0ms",
                    transitionDelay: "var(--delay)",
                    color: SUIT_COLOR[deck][c.s],
                  }}
                >
                  {/* two faces on one card: turning it over is a real 3D flip */}
                  <span className="round-demo__flip">
                    <CardFace c={c} deck={deck} faces={faces} />
                    <span className="round-demo__back" />
                  </span>
                </div>
              );
            }),
          )}
        </div>
        {/* the HUD: on the table but off the zooming stage, so the camera never hides it */}
        <div className="round-demo__hud">
          {scoringP !== null && !compact && (
            <ScoreCallout
              key={step}
              i={scoringP}
              tricks={tricks[scoringP]}
              delay={step === SCORE}
            />
          )}
          <div className="round-demo__round">
            Round {step === NEXT ? total + 1 : total} ·{" "}
            {step === NEXT ? total + 1 : total} cards each
          </div>
          {ph && !compact && (
            <div
              key={ph.n}
              className="round-demo__phase"
              data-intro={PHASE_START.has(step) ? "true" : undefined}
            >
              <span className="round-demo__phase-n">{ph.n}</span>
              {ph.name}
            </div>
          )}
          {!playing && !compact && step !== NEXT && (
            <div className="round-demo__paused">
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" />
              </svg>
              Paused
            </div>
          )}
          {step === NEXT && !compact && (
            <EndCard
              onReplay={() => {
                go(0);
                go("play");
              }}
            />
          )}
        </div>
      </div>

      {/* caption and controls sit on a fade, so a zoomed table slides under them softly */}
      <div className="round-demo__foot">
        <p className="round-demo__caption" aria-live="polite">
          {compact ? shortCaption(step) : caption(step, deck)}
        </p>

        {compact ? null : (
          <div
            className="round-demo__controls"
            // after a click, give focus back so space means pause/play, not "press
            // the last button again"
            onPointerUp={(e) =>
              (e.target as HTMLElement).closest("button")?.blur()
            }
          >
            <button
              type="button"
              className="round-demo__btn"
              onClick={() => go("prev")}
              aria-label="Previous step"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="M10 3 L5 8 L10 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {/* the round as a timeline: a pill per phase, notched into its steps. Click a
                notch to jump to that step; the current one fills as the clock runs. */}
            <div
              className="round-demo__timeline"
              role="group"
              aria-label="Steps of the round"
            >
              {PHASES.map((p) => {
                const len = p.to - p.from + 1;
                const current = step >= p.from && step <= p.to;
                return (
                  <div
                    key={p.name}
                    className="round-demo__phase-btn"
                    style={{ flexGrow: len }}
                    data-current={current ? "true" : undefined}
                  >
                    {Array.from({ length: len }, (_, j) => {
                      const s = p.from + j;
                      const state =
                        s < step ? "done" : s === step ? "now" : undefined;
                      return (
                        <button
                          key={s}
                          type="button"
                          className="round-demo__seg"
                          data-state={state}
                          aria-label={`${p.name}${len > 1 ? `, step ${j + 1} of ${len}` : ""}`}
                          aria-current={s === step ? "step" : undefined}
                          onClick={() => go(s)}
                        >
                          {s === step && (
                            <span
                              key={`${step}-${loop}`}
                              className="round-demo__seg-fill"
                              data-full={
                                settled || resumedOn === step
                                  ? "true"
                                  : undefined
                              }
                              style={{
                                animationDuration: `${DURATION(step)}ms`,
                                animationPlayState: running
                                  ? "running"
                                  : "paused",
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                    <span className="round-demo__phase-label">{p.name}</span>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              className="round-demo__btn round-demo__next"
              onClick={() => go("next")}
              aria-label="Next step"
            >
              {/* a ring round the button: how long until the round moves on by itself */}
              {step !== NEXT && (
                <svg
                  key={`${step}-${loop}-${resumedOn === step}`}
                  className="round-demo__ring"
                  viewBox="0 0 40 40"
                  aria-hidden="true"
                  data-full={settled ? "true" : undefined}
                  style={{
                    animationDuration: `${resumedOn === step ? RESUME_BEAT : DURATION(step)}ms`,
                    animationPlayState: running ? "running" : "paused",
                  }}
                >
                  <circle cx="20" cy="20" r="18.5" pathLength="1" />
                </svg>
              )}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="M6 3 L11 8 L6 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {!still && (
              <button
                type="button"
                className="round-demo__btn round-demo__btn--wide"
                onClick={() => {
                  if (step === NEXT) {
                    go(0);
                    go("play");
                  } else go("toggle");
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                >
                  {step === NEXT ? (
                    <path
                      d="M10 6a4 4 0 1 1-1.2-2.85M10 1.5V4H7.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : playing ? (
                    <path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" />
                  ) : (
                    <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                  )}
                </svg>
                {step === NEXT ? "Replay" : playing ? "Pause" : "Play"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
