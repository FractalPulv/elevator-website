// The court cards (J, Q, K) from the app's CC0 poker set keep their figures, but their
// suit symbols get swapped for the app's own (the clean ones the rest of the deck uses).
// All four symbols sit at the same spots on every court card of the set (measured in the
// browser on the spades, the only suit whose paths are named consistently): each spot is
// papered over and the app's glyph drawn in its place, upside down for the bottom pair.
//   bun scripts/cards/courts.ts
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { INK, RED, SUIT_PATHS, type FrenchSuitName } from "../../../elevator-scoreboard/src/components/rules/frenchCardArt";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../../elevator-scoreboard/assets/images/cards_french");
const OUT = join(HERE, "../../public/cards/real/poker");

// [x, y, w, h, upside down] in the card's 234 x 333 space
const SPOTS: [number, number, number, number, boolean][] = [
  [7.8, 42.4, 18.8, 18.9, false], // top-left corner index
  [207.4, 271.7, 18.8, 18.9, true], // bottom-right corner index
  [39.8, 47.5, 37.7, 37.8, false], // large, inside the frame, top
  [156.5, 247.7, 37.7, 37.8, true], // large, inside the frame, bottom
];
const RANKS: [number, string][] = [
  [11, "Jack"],
  [12, "Queen"],
  [13, "King"],
];
const SUITS: [string, FrenchSuitName][] = [
  ["c", "clubs"],
  ["s", "spades"],
  ["h", "hearts"],
  ["d", "diamonds"],
];

for (const [r, rank] of RANKS) {
  for (const [s, suit] of SUITS) {
    const name = `${rank} of ${suit[0].toUpperCase()}${suit.slice(1)} Playing Card.svg`;
    const svg = readFileSync(join(SRC, name), "utf8");
    const fill = suit === "hearts" || suit === "diamonds" ? RED : INK;
    const patches = SPOTS.map(([x, y, w, h, flip]) => {
      const size = Math.min(w, h);
      const cx = x + w / 2;
      const cy = y + h / 2;
      const k = size / 100;
      const t = `translate(${cx - size / 2} ${cy - size / 2}) scale(${k})`;
      const glyph = SUIT_PATHS[suit].map((d) => `<path d="${d}"/>`).join("");
      return (
        `<rect x="${x - 1.5}" y="${y - 1.5}" width="${w + 3}" height="${h + 3}" fill="#ffffff"/>` +
        `<g fill="${fill}" transform="${flip ? `rotate(180 ${cx} ${cy}) ` : ""}${t}">${glyph}</g>`
      );
    }).join("");
    const out = svg.replace(/<\/svg>\s*$/, `<g id="clean-suits">${patches}</g></svg>`);
    writeFileSync(join(OUT, `${r}${s}.svg`), out);
  }
}
console.log("12 court cards patched");
