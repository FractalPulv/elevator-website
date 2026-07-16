"use client";

import { motion, useReducedMotion } from "framer-motion";

const climb = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export function ElevatorDiagram() {
  const reduce = useReducedMotion();

  return (
    <div>
      <div className="climb">
        {climb.map((n, i) => {
          const h = `${(n / 10) * 100}%`;
          return (
            <motion.div
              key={i}
              className="climb__bar"
              data-peak={n === 10 ? "true" : undefined}
              style={{ height: h, "--i": i } as React.CSSProperties}
              initial={reduce ? false : { height: 0 }}
              whileInView={{ height: h }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: reduce ? 0 : i * 0.05, duration: 0.4, ease: "easeOut" }}
            >
              {n}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-3)]">
        <span>↑ Climbing · 1 card</span>
        <span>Peak · 10 cards × 2</span>
        <span>Falling ↓ · 1 card</span>
      </div>
    </div>
  );
}
