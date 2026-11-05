// Renders the site's poker cards from the app's own card art
// (elevator-scoreboard/src/components/rules/frenchCardArt.ts), so the website and
// the app's Rules tab show the same faces. Run with: bun scripts/cards/render.ts
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CARD_H,
  CARD_W,
  PAPER,
  PIP_LAYOUT,
  RANK_LABEL,
  SUIT_PATHS,
  pipTransform,
  suitColor,
  type FrenchSuitName,
} from "../../../elevator-scoreboard/src/components/rules/frenchCardArt";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../../public/cards/poker");
const NAMES: Record<number, string> = {
  1: "ace", 2: "two", 3: "three", 4: "four", 5: "five",
  6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
};
const FONT = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif";

const pip = (s: FrenchSuitName, x: number, y: number, size: number, flip = false) =>
  `<g transform="${pipTransform(x, y, size, flip)}" fill="${suitColor(s)}">${SUIT_PATHS[s]
    .map((d) => `<path d="${d}"/>`)
    .join("")}</g>`;

function corner(label: string, s: FrenchSuitName) {
  const ten = label === "10";
  return `<text x="28" y="57" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="${
    ten ? 40 : 44
  }" letter-spacing="${ten ? -3.5 : 0}" fill="${suitColor(s)}">${label}</text>${pip(s, 28, 82, 26)}`;
}

function card(rank: number, s: FrenchSuitName) {
  const label = RANK_LABEL[rank] ?? String(rank);
  const body =
    rank === 1
      ? pip(s, 125, 175, s === "spades" ? 124 : 112)
      : PIP_LAYOUT[rank].map(([x, y]) => pip(s, x, y, rank >= 8 ? 48 : 54, y > 175)).join("");
  const c = corner(label, s);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_W} ${CARD_H}" width="${CARD_W}" height="${CARD_H}">
<rect x="0.75" y="0.75" width="248.5" height="348.5" rx="15" fill="${PAPER}" stroke="rgba(0,0,0,0.14)" stroke-width="1.5"/>
${body}
${c}
<g transform="rotate(180 ${CARD_W / 2} ${CARD_H / 2})">${c}</g>
</svg>
`;
}

const cards: [number, FrenchSuitName][] = [
  [10, "clubs"], [7, "spades"], [9, "hearts"], [1, "diamonds"],
  [1, "hearts"], [7, "diamonds"], [10, "spades"], [4, "clubs"], [9, "diamonds"], [2, "hearts"],
];
for (const [r, s] of cards) writeFileSync(join(OUT, `${NAMES[r]}-${s}.svg`), card(r, s));
console.log(`wrote ${cards.length} cards to ${OUT}`);
