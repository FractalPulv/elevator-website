"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useDeck,
  type DeckKind,
  type PokerVariant,
} from "@/app/components/Deck";
import {
  CardFace,
  CardStylePicker,
  SUIT_COLOR,
  SUIT_NAME,
  type Card,
  type Suit,
} from "@/app/components/RoundDemo";

// The deck and its order, in four modes:
//   Full deck: every card, columns by value (weakest left), rows by suit (weakest top)
//   Value:     one suit's cards in a row, 2 < 3 < ... < ace
//   Suit:      one value in its four suits, clubs < spades < hearts < diamonds
//   Compare:   two cards, which one wins and why
//
// Motion, all of it in waves running from the top-left corner:
//   - first time on screen, the deck deals itself in
//   - changing mode or deck size: leaving cards fade out where they were, staying
//     cards glide to their new places, new ones rise in once the way is clear
//   - changing the deck or the card style: the faces fade off, leaving blank cards,
//     and the new faces fade on. Each deck has its own card shape (Italian cards are
//     narrower), shared by all its styles: a new deck reshapes the blank cards first.

const SUITS: Suit[] = ["c", "s", "h", "d"]; // weakest to strongest
const ACE: Record<DeckKind, string> = { poker: "ace", italian: "Asso" };
// the columns the hand-drawn notes point out
const COLUMN_NAME: Record<DeckKind, Record<number, string>> = {
  poker: { 11: "Jacks", 12: "Queens", 13: "Kings", 14: "Aces" },
  italian: { 11: "Fanti", 12: "Cavalli", 13: "Re", 14: "Assi" },
}; // the row shown in Value mode
// Every few seconds Value and Suit mode deal a fresh example: Value mixes the suits
// (any suit, the order holds), Suit runs through other values (any value, same order).
const CYCLE_MS = 3200;
const SUIT_VALUES = [7, 14, 3, 13, 5, 11]; // Suit mode's values, in turn
// a suit for each card of the Value row: hearts first (the row from the full deck),
// then mixed
const valueSuit = (r: number, turn: number): Suit =>
  turn === 0 ? "h" : SUITS[(r * 7 + turn * 5 + ((r * turn) % 3)) % 4];

function valuesFor(deck: DeckKind, variant: PokerVariant) {
  if (deck === "italian" || variant === "no8910")
    return [2, 3, 4, 5, 6, 7, 11, 12, 13, 14];
  if (variant === "noFaces") return [2, 3, 4, 5, 6, 7, 8, 9, 10, 14];
  return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
}

const VARIANTS: { v: PokerVariant; label: string }[] = [
  { v: "no8910", label: "No 8, 9, 10" },
  { v: "noFaces", label: "No J, Q, K" },
  { v: "full52", label: "All 52" },
];

type Mode = "deck" | "value" | "suit" | "compare";
const MODES: { m: Mode; label: string }[] = [
  { m: "deck", label: "Full deck" },
  { m: "value", label: "Value" },
  { m: "suit", label: "Suit" },
  { m: "compare", label: "Compare" },
];

const strength = (c: Card) => c.r * 10 + SUITS.indexOf(c.s);
const key = (c: Card) => `${c.r}${c.s}`;

// motion: moves ease in and out (nothing lurches off or slams to a stop); arrivals
// and departures are quick fades with a touch of depth
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const GLIDE = 720; // a card moving to its new place
const RESHAPE = 520; // a style change's blank cards taking a new deck's shape and places
const EXIT = 300; // a card leaving
const ENTER = 520; // a card arriving
const ENTER_AFTER = 220; // arrivals wait for the leavers to clear
const FACE_OUT = 200; // a style change: the old face fades off the blank card...
const FACE_IN = 380; // ...and the new one fades on
const FLIP_HALF = 190; // Compare: a card turning away (the new one takes a little longer)
const FLIP_STAGGER = 90; // the second card turns a beat after the first
const WAVE = 14; // ms between neighbouring cards in a wave
const wave = (el: HTMLElement) =>
  (Number(el.dataset.col) + Number(el.dataset.row)) * WAVE;
const faceOf = (el: HTMLElement) =>
  el.querySelector<HTMLElement>(".round-demo__face");

// Two different cards, at random (or a fixed first example, so the server and the
// first render agree).
function pickPair(values: number[], random: boolean): [Card, Card] {
  const all = values.flatMap((r) => SUITS.map((s) => ({ r, s })));
  if (!random) return [all[13], all[7]];
  const a = all[Math.floor(Math.random() * all.length)];
  // half the time the same value, so the suit rule comes up as often as the value rule
  const sameValue = Math.random() < 0.5;
  const pool = sameValue
    ? all.filter((c) => c.r === a.r && c.s !== a.s)
    : all.filter((c) => c.r !== a.r);
  return [a, pool[Math.floor(Math.random() * pool.length)]];
}

// A short hand-drawn arrow, pointing down (CSS turns it to point up). Drawn at its own
// size, never stretched: the stroke keeps its weight and draws in as one clean line.
function PenArrow() {
  return (
    <svg className="deck-grid__pen" viewBox="0 0 14 22" width="14" height="22">
      <path d="M10.5 1.5 C3.5 5.5 7 12.5 7 20" pathLength={1} />
      <path d="M4 16.4 L7 20.3 L10 16.8" pathLength={1} />
    </svg>
  );
}

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function DeckGrid() {
  const live = useDeck();
  const { variant, setVariant } = live;
  // The faces on show lag the picker a moment: they change while the cards are blank.
  const [look, setLook] = useState({ deck: live.deck, faces: live.faces });
  const { deck, faces } = look;
  const values = valuesFor(deck, variant);
  const full52 = live.deck === "poker" && variant === "full52";
  const [mode, setMode] = useState<Mode>("deck");
  const [pair, setPair] = useState<[Card, Card] | null>(null);
  const [turn, setTurn] = useState(0);
  const inDeck = SUIT_VALUES.filter((v) => values.includes(v));
  const suitValue = inDeck[turn % inDeck.length];

  // dealt in the first time it scrolls into view
  const sectionRef = useRef<HTMLElement>(null);
  const [pending, setPending] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (reducedMotion()) return setPending(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setPending(false);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // a pair from a deck that has since changed falls back to the first example
  const livePair =
    pair && pair.every((c) => values.includes(c.r)) ? pair : null;
  const [a, b] = livePair ?? pickPair(values, false);
  const winner = strength(a) > strength(b) ? a : b;
  const loser = winner === a ? b : a;

  const stageRef = useRef<HTMLDivElement>(null);
  const ghostsRef = useRef<HTMLDivElement>(null);
  // Where every card is on screen right now, and a copy of it, taken the moment a
  // control is clicked: mid-animation included, so an interrupted move carries on
  // from where the card really is. A card that leaves fades out from there.
  const last = useRef(new Map<string, { rect: DOMRect; node: Node }>());
  const dealt = useRef(false);
  const lastHeight = useRef(0);
  const swapping = useRef(false);
  const turning = useRef(false); // "Another pair": the cards turn over
  const capture = () => {
    const snap = new Map<string, { rect: DOMRect; node: Node }>();
    stageRef.current
      ?.querySelectorAll<HTMLElement>("[data-card]")
      .forEach((el) => {
        const node = el.cloneNode(true) as HTMLElement;
        // a copied image would decode afresh and show blank for a frame: not here
        node.querySelectorAll("img").forEach((im) => (im.decoding = "sync"));
        snap.set(el.dataset.card!, { rect: el.getBoundingClientRect(), node });
      });
    last.current = snap;
    lastHeight.current = stageRef.current?.offsetHeight ?? 0;
  };

  // The picker changed: every face fades off its card (a wave), leaving blank cards;
  // then the new faces go on. Within a deck the cards keep their size; a new deck
  // reshapes the blank cards before the faces arrive.
  useEffect(() => {
    if (live.deck === look.deck && live.faces === look.faces) return;
    const stage = stageRef.current;
    const next = { deck: live.deck, faces: live.faces };
    if (!stage || pending || reducedMotion()) {
      setLook(next);
      return;
    }
    let cancelled = false;
    const outs = [...stage.querySelectorAll<HTMLElement>("[data-card]")].map(
      (el) =>
        faceOf(el)?.animate(
          [
            { opacity: 1, filter: "blur(0)" },
            { opacity: 0, filter: "blur(2px)" },
          ],
          {
            duration: FACE_OUT,
            delay: wave(el) * 0.5,
            easing: "ease-in",
            fill: "forwards",
          },
        ),
    );
    // a new deck: the column names go with the faces (the new deck draws its own)
    if (live.deck !== look.deck)
      stage
        .querySelectorAll<HTMLElement>(".deck-grid__label, .deck-grid__corner")
        .forEach((el) =>
          outs.push(
            el.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: FACE_OUT,
              easing: "ease-in",
              fill: "forwards",
            }),
          ),
        );
    let swapped = false;
    Promise.all(outs.map((t) => t?.finished))
      .then(() => {
        if (cancelled) return;
        capture(); // the deck size can differ: cards may move, leave or arrive too
        swapping.current = true;
        swapped = true;
        setLook(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      // picked back before the swap: put the faces back rather than leave them blank
      if (!swapped) outs.forEach((t) => t?.cancel());
    };
  }, [live.deck, live.faces, look.deck, look.faces, pending]);

  // Value and Suit deal a fresh example every few seconds, while they're on screen
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // A pick in the style picker starts the clock again: a fresh example dealt mid
  // style change would copy cards half-faded, and their copies flash on as they leave.
  useEffect(() => {
    if ((mode !== "value" && mode !== "suit") || !inView || pending) return;
    if (reducedMotion()) return;
    const id = window.setInterval(() => {
      capture();
      setTurn((t) => t + 1);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [mode, inView, pending, live.deck, live.faces, deck, faces]);

  // the "weakest" and "strongest" notes sit under the first card and over the last,
  // their arrows on the card's centre line; a word that would poke out of the row
  // slides back in, the arrow stays put
  const chainRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const place = () => {
      const ch = chainRef.current;
      if (!ch) return;
      const cards = ch.querySelectorAll<HTMLElement>("[data-card]");
      const lastCard = cards[cards.length - 1];
      const ends: [HTMLElement | undefined, "weak" | "strong"][] = [
        [cards[0], "weak"],
        [lastCard, "strong"],
      ];
      // the row's right edge: its last card, or the visible width if that's wider
      // (not scrollWidth, which counts the notes themselves)
      const right = Math.max(
        ch.clientWidth,
        lastCard ? lastCard.offsetLeft + lastCard.offsetWidth : 0,
      );
      for (const [c, end] of ends) {
        const note = ch.querySelector<HTMLElement>(`[data-end="${end}"]`);
        const word = note?.querySelector<HTMLElement>("span");
        if (!c || !note || !word) continue;
        const x = c.offsetLeft + c.offsetWidth / 2;
        note.style.left = `${x}px`;
        note.style.top = `${end === "weak" ? c.offsetTop + c.offsetHeight : c.offsetTop}px`;
        const half = word.offsetWidth / 2 + 4;
        const nudge = Math.max(half - x, 0) - Math.max(x + half - right, 0);
        note.style.setProperty("--nudge", `${nudge}px`);
      }
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  });

  const layoutKey = `${turn}|${mode}|${values.join(",")}|${key(a)}${key(b)}|${deck}|${faces}|${pending}`;
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const ghosts = ghostsRef.current;
    if (!stage || !ghosts || pending) return;
    const cards = [...stage.querySelectorAll<HTMLElement>("[data-card]")];
    const before = last.current;
    last.current = new Map();
    const firstTime = !dealt.current;
    dealt.current = true;
    const swap = swapping.current;
    swapping.current = false;
    const still = reducedMotion();
    // the blank cards of a style change move briskly: the new faces are waiting
    const glide = swap ? RESHAPE : GLIDE;
    // measure where things now belong, free of any move still under way
    cards.forEach((el) => el.getAnimations().forEach((an) => an.cancel()));
    stage.getAnimations().forEach((an) => an.cancel());
    const stageBox = stage.getBoundingClientRect();

    // the stage grows or shrinks to its new height instead of jumping
    const h = stage.offsetHeight;
    if (!still && !firstTime && lastHeight.current && lastHeight.current !== h)
      stage.animate(
        [{ height: `${lastHeight.current}px` }, { height: `${h}px` }],
        { duration: glide, easing: EASE },
      );
    lastHeight.current = h;
    if (still) return;

    if (firstTime) {
      // dealt in: a wave from the top-left corner
      cards.forEach((el) =>
        el.animate(
          [
            {
              opacity: 0,
              transform: "translateY(18px) scale(0.94)",
              filter: "blur(4px)",
            },
            { opacity: 1, transform: "none", filter: "blur(0)" },
          ],
          {
            duration: 760,
            delay: 120 + wave(el) * 2.2,
            easing: EASE_OUT,
            fill: "backwards",
          },
        ),
      );
      return;
    }

    const now = new Set(cards.map((el) => el.dataset.card!));
    const near = mode === "compare" ? 16 : 2;
    const turnOver = turning.current && !swap;
    turning.current = false;
    let moved = false;
    // leavers: a copy fades out where the card was
    let n = 0;
    const leftSpots: DOMRect[] = [];
    before.forEach(({ rect, node }, id) => {
      if (now.has(id)) return;
      leftSpots.push(rect);
      const g = node as HTMLElement;
      Object.assign(g.style, {
        position: "absolute",
        left: `${rect.left - stageBox.left}px`,
        top: `${rect.top - stageBox.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: "0",
      });
      // mid style change the face had already faded off: keep the copy blank too
      const face = faceOf(g);
      if (swap && face) face.style.opacity = "0";
      ghosts.appendChild(g);
      // Compare's "another pair": each card turns over, away from view...
      const flip = turnOver;
      g.animate(
        flip
          ? [
              { transform: "perspective(700px) rotateY(0)" },
              { transform: "perspective(700px) rotateY(90deg)" },
            ]
          : [
              { opacity: 1, transform: "none", filter: "blur(0)" },
              { opacity: 0, transform: "scale(0.94)", filter: "blur(3px)" },
            ],
        flip
          ? {
              duration: FLIP_HALF,
              delay: n++ * FLIP_STAGGER,
              easing: "cubic-bezier(0.55, 0, 0.9, 0.45)",
              fill: "forwards",
            }
          : {
              duration: EXIT,
              delay: Math.min(n++, 12) * 8,
              easing: "ease-out",
              fill: "forwards",
            },
      ).onfinish = () => g.remove();
    });
    // stayers glide; newcomers rise in once the leavers have cleared
    cards.forEach((el) => {
      const id = el.dataset.card!;
      const r = el.getBoundingClientRect();
      const was = before.get(id);
      if (was) {
        if (
          Math.abs(was.rect.left - r.left) < 0.5 &&
          Math.abs(was.rect.top - r.top) < 0.5 &&
          Math.abs(was.rect.width - r.width) < 0.5 &&
          Math.abs(was.rect.height - r.height) < 0.5
        )
          return;
        moved = true;
        // scaled on each axis: a new deck's cards can be a different shape
        el.animate(
          [
            {
              transform: `translate(${was.rect.left - r.left}px, ${was.rect.top - r.top}px) scale(${was.rect.width / r.width}, ${was.rect.height / r.height})`,
              transformOrigin: "0 0",
            },
            { transform: "none", transformOrigin: "0 0" },
          ],
          {
            duration: glide,
            delay: wave(el) * 0.4,
            easing: EASE,
            fill: "backwards",
          },
        );
      } else if (
        !swap &&
        leftSpots.some(
          // (Compare's cards step forward or back as they change: a looser match)
          (q) =>
            Math.abs(q.left - r.left) < near && Math.abs(q.top - r.top) < near,
        )
      ) {
        // ...and the new card turns the rest of the way, face up
        if (turnOver) {
          el.animate(
            [
              { transform: "perspective(700px) rotateY(-90deg)" },
              { transform: "perspective(700px) rotateY(0)" },
            ],
            {
              duration: FLIP_HALF * 1.4,
              delay: FLIP_HALF + Number(el.dataset.col) * FLIP_STAGGER * 0.5,
              easing: "cubic-bezier(0.1, 0.55, 0.45, 1)",
              fill: "backwards",
            },
          );
          return;
        }
        // a card swapped for another in the same spot: a quick cross-fade
        el.animate(
          [
            { opacity: 0, transform: "scale(0.96)", filter: "blur(2px)" },
            { opacity: 1, transform: "none", filter: "blur(0)" },
          ],
          {
            duration: 420,
            delay: 60 + wave(el) * 3,
            easing: EASE_OUT,
            fill: "backwards",
          },
        );
      } else if (!swap) {
        el.animate(
          [
            {
              opacity: 0,
              transform: "translateY(10px) scale(0.95)",
              filter: "blur(3px)",
            },
            { opacity: 1, transform: "none", filter: "blur(0)" },
          ],
          {
            duration: ENTER,
            delay: ENTER_AFTER + wave(el),
            easing: EASE_OUT,
            fill: "backwards",
          },
        );
      }
    });

    // a style change: the new faces go on, once any cards have found their places
    if (swap)
      cards.forEach((el) => {
        const id = el.dataset.card!;
        const from = before.has(id) ? 0 : ENTER_AFTER;
        if (!before.has(id))
          el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: ENTER,
            delay: from + wave(el),
            easing: EASE_OUT,
            fill: "backwards",
          });
        faceOf(el)?.animate(
          [
            { opacity: 0, filter: "blur(2px)" },
            { opacity: 1, filter: "blur(0)" },
          ],
          {
            duration: FACE_IN,
            // on a card that has (nearly) settled into its new place and shape
            delay: (moved ? glide * 0.75 : 40) + from + wave(el) * 0.6,
            easing: EASE_OUT,
            fill: "backwards",
          },
        );
      });
  }, [layoutKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // court cards by name, not by letter
  const COURT: Record<DeckKind, Record<number, string>> = {
    poker: { 11: "jack", 12: "queen", 13: "king" },
    italian: { 11: "Fante", 12: "Cavallo", 13: "Re" },
  };
  const valueName = (r: number) =>
    r === 14 ? ACE[deck] : (COURT[deck][r] ?? String(r));
  const card = (c: Card, col: number, row: number, pair?: "win" | "lose") => (
    <span
      key={key(c)}
      data-card={key(c)}
      data-col={col}
      data-row={row}
      className="deck-grid__card"
      // on the card itself, so a turning-away copy keeps its lift or shade
      data-pair={pair}
      style={{ color: SUIT_COLOR[deck][c.s] }}
    >
      <CardFace c={c} deck={deck} faces={faces} />
    </span>
  );
  const lt = (k: string, i: number) => (
    <span
      key={k}
      className="deck-grid__lt"
      aria-hidden="true"
      style={{ ["--d" as string]: `${ENTER_AFTER + 200 + i * 40}ms` }}
    >
      &lt;
    </span>
  );
  const chain = (cards: Card[]) =>
    cards.flatMap((c, i): ReactNode[] =>
      i ? [lt(`lt${i}`, i), card(c, i, 0)] : [card(c, i, 0)],
    );
  // Compare: each card over its value and suit, the one that decided it marked on both;
  // the winner steps forward under a "Wins" tag
  const valueDecides = winner.r !== loser.r;
  const side = (c: Card, col: number) => (
    <div
      className="deck-grid__side"
      data-win={c === winner ? "true" : undefined}
    >
      <span
        key={`${key(a)}${key(b)}`}
        className="deck-grid__verdict"
        aria-hidden={c !== winner}
      >
        Wins
      </span>
      {card(c, col, 0, c === winner ? "win" : "lose")}
      <span key={`f${key(a)}${key(b)}`} className="deck-grid__facts">
        <span data-key={valueDecides ? "true" : undefined}>
          {valueName(c.r)}
        </span>
        <span data-key={valueDecides ? undefined : "true"}>
          {SUIT_NAME[deck][c.s]}
        </span>
      </span>
    </div>
  );
  // hand-drawn notes at either end of a Value or Suit row, like the column names
  const ends = (
    <>
      <span className="deck-grid__end" data-end="weak" aria-hidden="true">
        <PenArrow />
        <span>weakest</span>
      </span>
      <span className="deck-grid__end" data-end="strong" aria-hidden="true">
        <span>strongest</span>
        <PenArrow />
      </span>
    </>
  );

  const text: Record<Mode, { title: string; body: string }> = {
    deck: {
      title: "The deck",
      body: `All ${values.length * 4} cards. Columns run from the weakest value (the 2) to the strongest (the ${ACE[deck]}); rows run from the weakest suit to the strongest.`,
    },
    value: {
      title: "Value comes first",
      body: `Any higher value beats any lower one, whatever the suits: 2 is the lowest, the ${ACE[deck]} the highest.`,
    },
    suit: {
      title: "Same value? Suit decides",
      body: `Only when two cards share a value: ${SUITS.map((s) => SUIT_NAME[deck][s]).join(" < ")}.`,
    },
    compare: {
      title: "Which card wins?",
      body: "The higher value wins. Only when the values match does the suit decide.",
    },
  };

  return (
    <section
      ref={sectionRef}
      className="deck-grid"
      data-deck={deck}
      data-pending={pending ? "true" : undefined}
    >
      <div className="deck-grid__head">
        <p className="eyebrow">The cards</p>
        {/* re-keyed per mode, so the words cross-fade with the cards */}
        <h2
          key={`t-${mode}`}
          className="display deck-grid__title mt-3 text-2xl"
        >
          {text[mode].title}
        </h2>
        <p key={`b-${mode}`} className="deck-grid__body" aria-live="polite">
          {text[mode].body}
        </p>
      </div>

      {/* one fixed row: the variant slot keeps its place (hidden) for the Italian deck */}
      <div className="deck-grid__controls">
        <CardStylePicker />
        <div
          className="seg"
          role="group"
          aria-label="Poker deck"
          style={{ visibility: live.deck === "poker" ? "visible" : "hidden" }}
        >
          {VARIANTS.map((o) => (
            <button
              key={o.v}
              type="button"
              className="seg__btn"
              aria-pressed={variant === o.v}
              onClick={() => {
                capture();
                setVariant(o.v);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
        {/* a calm word on the 52-card deck, opening under the controls */}
        <div
          className="deck-grid__caveat"
          data-show={full52 ? "true" : undefined}
          aria-hidden={!full52}
        >
          <p>
            Elevator is usually played with 40 cards. With 52 the game climbs to
            13 cards each with four players, so it runs 26 rounds instead of 20.
          </p>
        </div>
      </div>

      <div className="seg deck-grid__modes" role="group" aria-label="Show">
        {MODES.map((o) => (
          <button
            key={o.m}
            type="button"
            className="seg__btn"
            aria-pressed={mode === o.m}
            onClick={() => {
              capture();
              setTurn(0);
              setMode(o.m);
            }}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div ref={stageRef} className="deck-grid__stage" data-mode={mode}>
        {/* cards on their way out fade here, where they were */}
        <div ref={ghostsRef} className="deck-grid__ghosts" aria-hidden="true" />

        {mode === "deck" && (
          <div className="deck-grid__scroll">
            {/* the court and ace columns, named in hand-drawn notes above the deck */}
            <div
              className="deck-grid__labels"
              aria-hidden="true"
              style={{
                gridTemplateColumns: `repeat(${values.length}, minmax(2.6rem, 1fr))`,
              }}
            >
              {values.map((r, col) => {
                const k = [11, 12, 13, 14].indexOf(r);
                return (
                  <span key={`${deck}-${r}`} className="deck-grid__label-cell">
                    {/* the weakest card of all, top-left: its note sits over it */}
                    {col === 0 && !pending && (
                      <span
                        className="deck-grid__corner"
                        data-corner="weak"
                        style={{ ["--d" as string]: "450ms" }}
                      >
                        <span>weakest card in the game</span>
                        <PenArrow />
                      </span>
                    )}
                    {/* drawn once the deck has been dealt in */}
                    {/* Italian only: a French deck's J, Q, K and A need no introduction */}
                    {k !== -1 && !pending && deck === "italian" && (
                      <span
                        className="deck-grid__label"
                        data-alt={k % 2 ? "true" : undefined}
                        style={{ ["--d" as string]: `${700 + k * 90}ms` }}
                      >
                        <span className="deck-grid__label-text">
                          {COLUMN_NAME[deck][r]}
                        </span>
                        <PenArrow />
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <div
              className="deck-grid__board"
              style={{
                gridTemplateColumns: `repeat(${values.length}, minmax(2.6rem, 1fr))`,
              }}
            >
              {SUITS.flatMap((s, row) =>
                values.map((r, col) => card({ r, s }, col, row)),
              )}
            </div>
            {/* the strongest card of all, bottom-right: its note sits under it, drawn
                once the deal has reached it */}
            <div
              className="deck-grid__labels deck-grid__foot"
              aria-hidden="true"
              style={{
                gridTemplateColumns: `repeat(${values.length}, minmax(2.6rem, 1fr))`,
              }}
            >
              <span
                key={`${deck}-${values.length}`}
                className="deck-grid__label-cell"
                style={{ gridColumn: values.length }}
              >
                {!pending && (
                  <span
                    className="deck-grid__corner"
                    data-corner="strong"
                    style={{ ["--d" as string]: "1300ms" }}
                  >
                    <PenArrow />
                    <span>strongest card in the game</span>
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {mode === "value" && (
          <div
            ref={chainRef}
            className="deck-grid__chain"
            style={{ ["--n" as string]: values.length }}
          >
            {ends}
            {chain(values.map((r) => ({ r, s: valueSuit(r, turn) })))}
          </div>
        )}

        {mode === "suit" && (
          <div
            ref={chainRef}
            className="deck-grid__chain deck-grid__chain--big"
            style={{ ["--n" as string]: 4 }}
          >
            {ends}
            {chain(SUITS.map((s) => ({ r: suitValue, s })))}
          </div>
        )}

        {mode === "compare" && (
          <div className="deck-grid__compare">
            <div className="deck-grid__duel">
              {side(a, 0)}
              <span className="deck-grid__vs">vs</span>
              {side(b, 2)}
            </div>
            {/* re-keyed per pair, so the reason arrives with the cards */}
            <p
              key={`${key(a)}${key(b)}`}
              className="deck-grid__reason"
              aria-live="polite"
            >
              {valueDecides ? (
                <>
                  Higher value wins: the <b>{valueName(winner.r)}</b> beats the{" "}
                  <b>{valueName(loser.r)}</b>
                </>
              ) : (
                <>
                  Same value, so the suit decides:{" "}
                  <b>{SUIT_NAME[deck][winner.s]}</b> beat{" "}
                  <b>{SUIT_NAME[deck][loser.s]}</b>
                </>
              )}
            </p>
            <button
              type="button"
              className="seg__btn deck-grid__another"
              onClick={() => {
                capture();
                turning.current = true;
                setPair(pickPair(values, true));
              }}
            >
              Another pair
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
