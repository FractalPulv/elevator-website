"use client";

import { useEffect, useRef, useState } from "react";

// One player's game, scored both ways. An exact call scores the same in both modes
// (10 points plus 10 per trick called); only a miss differs. Casual: the line holds
// flat. Competitive: it dips, 10 points for every trick off.
const rounds: { pts: number; off?: number }[] = [
  { pts: 20 },
  { pts: 30 },
  { pts: 0, off: 1 },
  { pts: 20 },
  { pts: 40 },
  { pts: 0, off: 2 },
  { pts: 0, off: 1 },
  { pts: 30 },
  { pts: 20 },
  { pts: 30 },
];

function totals(competitive: boolean) {
  const out = [0];
  for (const r of rounds) out.push(out[out.length - 1] + (r.off ? (competitive ? -10 * r.off : 0) : r.pts));
  return out;
}

const casual = totals(false);
const competitive = totals(true);

const W = 600;
const H = 200;
const PAD = { l: 8, r: 8, t: 14, b: 26 };
const MAX = Math.max(...casual);
const x = (i: number) => PAD.l + (i / rounds.length) * (W - PAD.l - PAD.r);
const y = (v: number) => H - PAD.b - (v / MAX) * (H - PAD.t - PAD.b);
const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

const DRAW_MS = 2600;

export function ScoringModes() {
  const ref = useRef<SVGSVGElement>(null);
  // bumped each time the chart scrolls into view, so it draws again
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setRun((v) => v + 1);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const misses = rounds.map((r, i) => (r.off ? i + 1 : 0)).filter(Boolean);

  return (
    <div className="mt-auto flex flex-col gap-4">
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
        <span className="mode-key" style={{ ["--c" as string]: "var(--casual)" }}>
          Casual
        </span>
        <span className="mode-key" style={{ ["--c" as string]: "var(--competitive)" }}>
          Competitive
        </span>
        <span className="mode-key mode-key--miss">Missed call</span>
      </div>

      <svg
        ref={ref}
        className="mode-chart"
        data-run={run > 0 ? "true" : undefined}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="One player's score over ten rounds. Casual: the line climbs and holds flat on the three missed calls, ending on 190. Competitive: the same climb, but it dips on each miss, ending on 150."
        style={{ ["--draw" as string]: `${DRAW_MS}ms` }}
      >
        <line className="mode-chart__axis" x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} />
        {rounds.map((_, i) => (
          <text key={i} className="mode-chart__tick" x={(x(i) + x(i + 1)) / 2} y={H - 8} textAnchor="middle">
            {i + 1}
          </text>
        ))}

        {/* re-keyed per run, so every animation starts over */}
        <g key={run}>
        {/* the rounds where the call was missed */}
        {misses.map((i) => (
          <rect
            key={i}
            className="mode-chart__miss"
            x={x(i - 1) + 3}
            y={PAD.t - 6}
            width={x(i) - x(i - 1) - 6}
            height={H - PAD.t - PAD.b + 6}
            rx={6}
            style={{ animationDelay: `${((i - 1) / rounds.length) * DRAW_MS}ms` }}
          />
        ))}

        <path className="mode-chart__line" d={path(competitive)} pathLength={1} style={{ stroke: "var(--competitive)" }} />
        <path className="mode-chart__line" d={path(casual)} pathLength={1} style={{ stroke: "var(--casual)" }} />

        {/* where each line ends up */}
        {(
          [
            [casual, "var(--casual)"],
            [competitive, "var(--competitive)"],
          ] as const
        ).map(([vals, c]) => (
          <circle
            key={c}
            className="mode-chart__end"
            cx={x(rounds.length)}
            cy={y(vals[vals.length - 1])}
            r={4.5}
            style={{ fill: c }}
          />
        ))}
        </g>
      </svg>
    </div>
  );
}
