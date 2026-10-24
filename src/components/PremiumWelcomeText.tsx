"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

type Props = {
  /** Start the entrance when true. (The veil is invisible while it is "waiting", so don't burn the animation then.) */
  play?: boolean;
};

const LINES: { words: string[]; tone: "chrome" | "gold" }[] = [
  { words: ["Step", "into"], tone: "chrome" },
  { words: ["seamless", "finance."], tone: "gold" },
];

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function PremiumWelcomeText({ play = true }: Props) {
  const reduce = useReducedMotion();

  // Parent: staggers the words
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.11, delayChildren: reduce ? 0 : 0.12 } },
  };

  // Each word rises out of its mask, un-blurring as it lands
  const word: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { y: "112%", opacity: 0, filter: "blur(14px)" },
        show: {
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            y: { type: "spring", stiffness: 120, damping: 19, mass: 0.9 },
            opacity: { duration: 0.45, ease: "easeOut" },
            filter: { duration: 0.75, ease: EASE_OUT_EXPO },
          },
        },
      };

  // Gold hairline that draws itself in under the text
  const rule: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    show: { scaleX: 1, opacity: 1, transition: { duration: reduce ? 0.3 : 0.9, ease: EASE_OUT_EXPO, delay: reduce ? 0 : 0.5 } },
  };

  let idx = 0; // running word index, drives the staggered shimmer in CSS

  return (
    // Slow, subtle float (starts after the entrance). Disabled for reduced motion.
    <motion.div
      className="pwt-float"
      animate={play && !reduce ? { y: [0, -6, 0] } : { y: 0 }}
      transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1.8 }}
    >
      <motion.div
        className="pwt"
        role="img"
        aria-label="Step into seamless finance."
        variants={container}
        initial="hidden"
        animate={play ? "show" : "hidden"}
      >
        {LINES.map((line, li) => (
          <div className="pwt-line" key={li} aria-hidden="true">
            {line.words.map((w) => {
              const i = idx++;
              return (
                <span className="pwt-mask" key={w}>
                  <motion.span
                    className={`pwt-word pwt-${line.tone}`}
                    variants={word}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    {w}
                  </motion.span>
                </span>
              );
            })}
          </div>
        ))}
        <motion.span className="pwt-rule" variants={rule} aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
}
