"use client";

import { motion } from "framer-motion";

/**
 * A subtle decorative backdrop for a content section: a small "mish-mash"
 * of gold line-art layered behind the real content —
 *
 * - two copies of the abstract "Looper BG" swirl (the same vector used
 *   behind the hero), at different scale/rotation/mirror so they don't
 *   read as one flat repeated shape
 * - three thin straight gold-gradient streaks (the same line asset used
 *   in the About visual panel's crosshair) scattered at different angles,
 *   for texture that isn't just "one big swirl"
 * - a soft gold orb that continuously drifts across all of it — "a
 *   glowing ball moving around" the lines, per request
 *
 * Every layer animates on its own now, not just the orb: the swirls
 * slowly rotate/breathe and the streaks fade in and out and drift a
 * little, each on its own duration so the whole thing never looks like
 * it's pulsing in lockstep. It's a fully ambient effect (not cursor-
 * tracked like HeroLooperVector) — these sections don't have the hero's
 * large empty canvas for a pointer-following effect to read well.
 *
 * Deliberately the *boosted-opacity* swirl asset (public/brand/looper-bg-
 * glow.svg), not the dim resting one (looper-bg.svg) HeroLooperVector
 * layers underneath its own hover-lit copy: that resting asset has many
 * individual paths at near-zero opacity, so whether it was visible at all
 * came down to luck — which random cluster of paths a given crop/rotation
 * happened to land on. The glow variant's paths are uniformly opaque, so
 * a single low CSS opacity reads consistently across every placement.
 *
 * Every animated value here is opacity or a transform (x/y/rotate/scale),
 * matching the pattern already used for ambient/always-on decoration
 * elsewhere in this project (AboutVisualPanel's roaming glow, the
 * rotating grain bloom) — genuinely continuous background motion isn't
 * gated on prefers-reduced-motion the way interactive or timer-driven UI
 * is; the transform values are still auto-neutered by the root layout's
 * <MotionConfig reducedMotion="user"> regardless.
 *
 * Each variant repositions everything differently so the three sections
 * this is used in (About, Investment Packages, Client Perspectives)
 * don't all look/move identically.
 */
const SWIRL_SRC = "/brand/looper-bg-glow.svg";
const STREAK_SRC = "/brand/about-line-h.svg";

type Swirl = { className: string; rotate: number[]; duration: number };
type Streak = { className: string; opacity: number[]; duration: number; delay?: number };
type Orb = { className: string; path: { x: number[]; y: number[] }; duration: number };

const VARIANTS: Record<string, { swirls: Swirl[]; streaks: Streak[]; orb: Orb }> = {
  about: {
    swirls: [
      {
        className: "-left-[18%] -top-[40%] h-[440px] w-[712px] rotate-[9deg] opacity-[0.16]",
        rotate: [9, 12, 9],
        duration: 40,
      },
      {
        className:
          "-right-[10%] bottom-[-30%] h-[300px] w-[485px] rotate-[160deg] scale-x-[-1] opacity-[0.09]",
        rotate: [160, 156, 160],
        duration: 34,
      },
    ],
    streaks: [
      { className: "left-[8%] top-[62%] w-[220px] -rotate-[35deg] opacity-[0.5]", opacity: [0.2, 0.5, 0.2], duration: 9 },
      { className: "left-[38%] top-[12%] w-[160px] rotate-[20deg] opacity-[0.4]", opacity: [0.15, 0.4, 0.15], duration: 11, delay: 1.5 },
      { className: "right-[6%] top-[70%] w-[190px] rotate-[70deg] opacity-[0.35]", opacity: [0.1, 0.35, 0.1], duration: 13, delay: 3 },
    ],
    orb: {
      className: "left-[15%] top-[20%] size-[220px] bg-gold-bright/20",
      path: { x: [0, 160, 40, -40, 0], y: [0, 80, 200, 60, 0] },
      duration: 24,
    },
  },
  packages: {
    swirls: [
      {
        className:
          "-right-[20%] top-[-15%] h-[420px] w-[680px] -rotate-[7deg] scale-x-[-1] opacity-[0.16]",
        rotate: [-7, -11, -7],
        duration: 38,
      },
      {
        className: "-left-[12%] bottom-[-28%] h-[280px] w-[453px] rotate-[24deg] opacity-[0.09]",
        rotate: [24, 28, 24],
        duration: 30,
      },
    ],
    streaks: [
      { className: "right-[10%] top-[18%] w-[200px] rotate-[50deg] opacity-[0.45]", opacity: [0.15, 0.45, 0.15], duration: 10 },
      { className: "left-[10%] top-[55%] w-[170px] -rotate-[18deg] opacity-[0.4]", opacity: [0.15, 0.4, 0.15], duration: 12, delay: 2 },
      { className: "right-[28%] bottom-[12%] w-[210px] rotate-[100deg] opacity-[0.3]", opacity: [0.1, 0.3, 0.1], duration: 14, delay: 4 },
    ],
    orb: {
      className: "right-[12%] top-[35%] size-[240px] bg-gold-bright/20",
      path: { x: [0, -180, -20, 120, 0], y: [0, 90, 220, 40, 0] },
      duration: 27,
    },
  },
  testimonials: {
    swirls: [
      {
        className: "left-[6%] -bottom-[35%] h-[400px] w-[648px] rotate-[4deg] opacity-[0.16]",
        rotate: [4, 8, 4],
        duration: 36,
      },
      {
        className: "right-[-14%] top-[-32%] h-[260px] w-[421px] rotate-[195deg] scale-x-[-1] opacity-[0.09]",
        rotate: [195, 191, 195],
        duration: 32,
      },
    ],
    streaks: [
      { className: "left-[22%] top-[10%] w-[180px] rotate-[10deg] opacity-[0.4]", opacity: [0.15, 0.4, 0.15], duration: 9, delay: 1 },
      { className: "right-[14%] top-[50%] w-[210px] -rotate-[42deg] opacity-[0.45]", opacity: [0.15, 0.45, 0.15], duration: 12 },
      { className: "left-[42%] bottom-[8%] w-[160px] rotate-[85deg] opacity-[0.3]", opacity: [0.1, 0.3, 0.1], duration: 15, delay: 2.5 },
    ],
    orb: {
      className: "left-[30%] bottom-[10%] size-[200px] bg-gold-bright/20",
      path: { x: [0, 140, -100, 30, 0], y: [0, -70, 60, 150, 0] },
      duration: 22,
    },
  },
};

export type SectionVectorVariant = keyof typeof VARIANTS;

export default function SectionBackgroundVector({
  variant,
}: {
  variant: SectionVectorVariant;
}) {
  const cfg = VARIANTS[variant];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {cfg.swirls.map((swirl, i) => (
        <motion.img
          key={`swirl-${i}`}
          src={SWIRL_SRC}
          alt=""
          className={`absolute ${swirl.className}`}
          animate={{ rotate: swirl.rotate }}
          transition={{ duration: swirl.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {cfg.streaks.map((streak, i) => (
        <motion.img
          key={`streak-${i}`}
          src={STREAK_SRC}
          alt=""
          className={`absolute h-[2px] ${streak.className} light:opacity-[0.6]`}
          animate={{ opacity: streak.opacity }}
          transition={{
            duration: streak.duration,
            delay: streak.delay ?? 0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className={`absolute rounded-full blur-[70px] mix-blend-screen light:mix-blend-multiply light:bg-gold-bright/40 ${cfg.orb.className}`}
        animate={{ x: cfg.orb.path.x, y: cfg.orb.path.y }}
        transition={{ duration: cfg.orb.duration, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
