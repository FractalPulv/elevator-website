"use client";

import { motion, useReducedMotion } from "framer-motion";

// Replicates the app icon: rounded cards turned in 3D (rotateY → trapezoid),
// cascading down-right like an elevator descending. Back → front.
// rotateY is kept constant inside the animation so the perspective is present
// from the first frame (no snap on load).
const ROTATE_Y = 35;

const cards = [
  { x: -42, y: -94, scale: 0.9 },
  { x: -28, y: -62, scale: 0.93 },
  { x: -14, y: -31, scale: 0.965 },
  { x: 0, y: 0, scale: 1 },
];

export function CardStack() {
  const reduce = useReducedMotion();

  return (
    <div className="cardstack">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          className="cardstack__card"
          initial={reduce ? false : { x: 0, y: 0, scale: 0.72, opacity: 0, rotateY: ROTATE_Y }}
          animate={{ x: c.x, y: c.y, scale: c.scale, opacity: 1, rotateY: ROTATE_Y }}
          transition={{ delay: reduce ? 0 : 0.12 + i * 0.12, type: "spring", stiffness: 210, damping: 22 }}
        >
          <div
            className={`cardstack__face${reduce ? "" : " app-icon__float"}`}
            style={reduce ? undefined : { animationDelay: `${i * 0.5}s` }}
          />
        </motion.div>
      ))}
    </div>
  );
}
