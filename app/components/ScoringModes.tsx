"use client";

import { useEffect, useRef, useState } from "react";

// One four-player game, eight rounds, scored both ways from the same predictions. Round n
// deals n cards, so the hands taken each round add up to n, and the dealer's last call
// never lets the predictions add up to n (the app's rule). Each pair is
// [predicted, took], in the order of PLAYERS.
const PLAYERS = [
  { name: "Giulia", color: "#3b82f6" },
  { name: "Marco", color: "#f97316" },
  { name: "Sofia", color: "#22c55e" },
  { name: "Luca", color: "#d946ef" },
];
const GAME: [number, number][][] = [
  [
    [1, 1],
    [0, 0],
    [0, 0],
    [1, 0],
  ],
  [
    [1, 1],
    [1, 0],
    [0, 0],
    [1, 1],
  ],
  [
    [1, 1],
    [2, 1],
    [1, 1],
    [0, 0],
  ],
  [
    [2, 2],
    [2, 0],
    [1, 1],
    [0, 1],
  ],
  [
    [1, 1],
    [3, 1],
    [2, 2],
    [1, 1],
  ],
  [
    [2, 2],
    [2, 3],
    [2, 0],
    [1, 1],
  ],
  [
    [3, 2],
    [2, 2],
    [1, 1],
    [2, 2],
  ],
  [
    [1, 3],
    [3, 3],
    [3, 0],
    [2, 2],
  ],
];
const ROUNDS = GAME.length;

// The app's scoring: exact scores 10 + 10 per predicted; a miss scores 0 in casual and
// loses 10 per one off in competitive, with the total never going below 0.
function totals(competitive: boolean) {
  return PLAYERS.map((_, p) => {
    const out = [0];
    for (const round of GAME) {
      const [called, took] = round[p];
      const pts =
        called === took
          ? 10 + 10 * called
          : competitive
            ? -10 * Math.abs(called - took)
            : 0;
      out.push(Math.max(0, out[out.length - 1] + pts));
    }
    return out;
  });
}

const CASUAL = totals(false);
const COMPETITIVE = totals(true);

const W = 300;
const H = 210;
// room on the right for each line's name and score
const PAD = { l: 6, r: 66, t: 12, b: 24 };
const MAX = Math.max(...CASUAL.flat());
const x = (i: number) => PAD.l + (i / ROUNDS) * (W - PAD.l - PAD.r);
const y = (v: number) => H - PAD.b - (v / MAX) * (H - PAD.t - PAD.b);
// end labels closer than this (in chart units) get pushed apart
const LABEL_GAP = 13;

// Smooth Bezier curve through the totals. Monotone (Fritsch-Carlson) tangents, so a flat
// stretch stays dead flat and the curve never overshoots a real score.
function path(vals: number[]) {
  const pts = vals.map((v, i) => [x(i), y(v)] as const);
  const n = pts.length;
  const d = pts
    .slice(1)
    .map(([px, py], i) => (py - pts[i][1]) / (px - pts[i][0]));
  const m = pts.map((_, i) =>
    i === 0
      ? d[0]
      : i === n - 1
        ? d[n - 2]
        : d[i - 1] * d[i] <= 0
          ? 0
          : (d[i - 1] + d[i]) / 2,
  );
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  let out = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const dx = (x1 - x0) / 3;
    out += ` C${(x0 + dx).toFixed(1)} ${(y0 + m[i] * dx).toFixed(1)} ${(x1 - dx).toFixed(1)} ${(y1 - m[i + 1] * dx).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return out;
}

// Label heights for the line ends: in score order, each at least LABEL_GAP below the one
// above it, then the stack is shifted back up if it ran past the bottom.
function labelYs(ends: number[]) {
  const order = ends.map((v, i) => ({ i, y: y(v) })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < order.length; k++)
    order[k].y = Math.max(order[k].y, order[k - 1].y + LABEL_GAP);
  const over = order[order.length - 1].y - (H - PAD.b);
  if (over > 0) order.forEach((o) => (o.y -= over));
  const out: number[] = [];
  order.forEach((o) => (out[o.i] = o.y));
  return out;
}

const DRAW_MS = 2000;
const MORPH_MS = 900;

const MODES = {
  casual: {
    label: "Casual",
    note: "Miss your prediction and you score nothing that round. Scores only go up.",
  },
  competitive: {
    label: "Competitive",
    note: "Miss and you lose 10 for each one you were off by. Nobody drops below 0.",
  },
} as const;
type Mode = keyof typeof MODES;

const standings = (vals: number[][]) =>
  PLAYERS.map((p, i) => ({ name: p.name, end: vals[i][ROUNDS] }))
    .sort((a, b) => b.end - a.end)
    .map((s) => `${s.name} ${s.end}`)
    .join(", ");

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function ScoringModes() {
  const ref = useRef<SVGSVGElement>(null);
  // set once the chart has been seen, which starts the one-time draw
  const [run, setRun] = useState(false);
  const [mode, setMode] = useState<Mode>("casual");
  // 0 = casual, 1 = competitive; in between while the lines move
  const [mix, setMix] = useState(0);
  const mixRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Move every line from where it is now to the chosen mode's scores.
  useEffect(() => {
    const target = mode === "competitive" ? 1 : 0;
    const from = mixRef.current;
    if (from === target) return;
    const set = (v: number) => {
      mixRef.current = v;
      setMix(v);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MORPH_MS);
      set(from + (target - from) * ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  const vals = CASUAL.map((line, p) =>
    line.map((v, i) => v + (COMPETITIVE[p][i] - v) * mix),
  );
  const ends = vals.map((line) => line[ROUNDS]);
  const labels = labelYs(ends);

  return (
    <div className="mt-auto flex flex-col gap-4">
      <svg
        ref={ref}
        className="mode-chart"
        data-run={run ? "true" : undefined}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`The same four-player game over ${ROUNDS} rounds, scored ${mode}. Final scores: ${standings(mode === "casual" ? CASUAL : COMPETITIVE)}.`}
        style={{ ["--draw" as string]: `${DRAW_MS}ms` }}
      >
        <line
          className="mode-chart__axis"
          x1={PAD.l}
          x2={x(ROUNDS)}
          y1={H - PAD.b}
          y2={H - PAD.b}
        />
        {GAME.map((_, i) => (
          <text
            key={i}
            className="mode-chart__tick"
            x={x(i + 1)}
            y={H - 7}
            textAnchor="middle"
          >
            {i + 1}
          </text>
        ))}

        {PLAYERS.map((p, i) => (
          <path
            key={p.name}
            className="mode-chart__line"
            d={path(vals[i])}
            pathLength={1}
            style={{ stroke: p.color }}
          />
        ))}
        {PLAYERS.map((p, i) => (
          <g key={p.name} className="mode-chart__end">
            <circle
              cx={x(ROUNDS)}
              cy={y(ends[i])}
              r={3.5}
              style={{ fill: p.color }}
            />
            {/* name and score, nudged apart when two lines end close together */}
            <text
              className="mode-chart__label"
              x={x(ROUNDS) + 9}
              y={labels[i] + 3.8}
              style={{ fill: p.color }}
            >
              {p.name}
              <tspan className="mode-chart__score" dx={4}>
                {Math.round(ends[i] / 10) * 10}
              </tspan>
            </text>
          </g>
        ))}
      </svg>

      <p
        className="min-h-[3rem] text-sm leading-6 text-[var(--text-2)]"
        aria-live="polite"
      >
        {MODES[mode].note}
      </p>

      <div className="seg self-center" role="group" aria-label="Scoring mode">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            className="seg__btn"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>
    </div>
  );
}
