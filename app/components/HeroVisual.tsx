"use client";

import { motion, useReducedMotion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { CardStack } from "@/app/components/CardStack";
import { PhoneMockup } from "@/app/components/PhoneMockup";

// Hero: the app-icon card stack on the left, the phone beside it on the right.
export function HeroVisual() {
  const reduce = useReducedMotion();

  const phone = (
    <PhoneMockup glow width="13rem" src="/screenshots/games.png" alt="Elevator Scoreboard — Games screen" />
  );

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <CardStack />
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.2, type: "spring", stiffness: 170, damping: 22 }}
      >
        {reduce ? (
          phone
        ) : (
          <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={12}
            scale={1.03}
            transitionSpeed={1600}
            perspective={900}
            glareEnable
            glareMaxOpacity={0.14}
            glareColor="#ffffff"
            glarePosition="all"
            glareBorderRadius="2.4rem"
          >
            {phone}
          </Tilt>
        )}
      </motion.div>
    </div>
  );
}
