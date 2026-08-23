"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

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
 * Light mode gets its own treatment, not just the same gold at the same
 * opacity: the source art is a pale gold gradient designed to glow
 * against a near-black page, and at any opacity that stays washed out
 * against a near-white one — pale gold and off-white sit too close in
 * lightness for opacity alone to fix. A `brightness`/`saturate`/`contrast`
 * filter darkens it into a deeper amber that actually reads as linework
 * on a light surface, plus a straightforwardly higher opacity on top.
 * The streaks' filter is applied via a `light:` class (safe — filters are
 * untouched by the opacity/transform values framer-motion writes inline),
 * but their opacity keyframes are genuinely computed per theme in JS: once
 * framer-motion is animating an element's opacity at all, its inline style
 * always wins over any CSS opacity class, so a `light:opacity-*` class on
 * these specifically would be silently dead code.
 *
 * Every animated value here is opacity or a transform (x/y/rotate/scale),
 * matching the pattern already used for ambient/always-on decoration
 * elsewhere in this project (AboutVisualPanel's roaming glow, the
 * rotating grain bloom) — genuinely continuous background motion isn't
 * gated on prefers-reduced-motion the way interactive or timer-driven UI
 * is; the transform values are still auto-neutered by the root layout's
 * <MotionConfig reducedMotion="user"> regardless.
 *
 * Each variant repositions everything differently so the sections this is
 * used in (About, How it Works, Why Aurex, Investment Packages, Client
 * Perspectives, FAQ, and the Coming Soon page) don't all look/move
 * identically.
 */
const SWIRL_SRC = "/brand/looper-bg-glow.svg";
const STREAK_SRC = "/brand/about-line-h.svg";

// Applied to every swirl/streak <img> — a fixed gold-gradient asset can't
// be recolored via a Tailwind text-color class the way currentColor SVGs
// can, so this reaches for a CSS filter instead.
const LIGHT_MODE_FILTER = "light:brightness-50 light:saturate-150 light:contrast-125";

type Swirl = { className: string; rotate: number[]; duration: number };
type Streak = { className: string; opacity: number[]; duration: number; delay?: number };
type Orb = { className: string; path: { x: number[]; y: number[] }; duration: number };

const VARIANTS: Record<string, { swirls: Swirl[]; streaks: Streak[]; orb: Orb }> = {
  about: {
    swirls: [
      {
        className: "-left-[18%] -top-[40%] h-[440px] w-[712px] rotate-[9deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [9, 12, 9],
        duration: 40,
      },
      {
        className:
          "-right-[10%] bottom-[-30%] h-[300px] w-[485px] rotate-[160deg] scale-x-[-1] opacity-[0.09] light:opacity-[0.24]",
        rotate: [160, 156, 160],
        duration: 34,
      },
    ],
    streaks: [
      { className: "left-[8%] top-[62%] w-[220px] -rotate-[35deg]", opacity: [0.2, 0.5, 0.2], duration: 9 },
      { className: "left-[38%] top-[12%] w-[160px] rotate-[20deg]", opacity: [0.15, 0.4, 0.15], duration: 11, delay: 1.5 },
      { className: "right-[6%] top-[70%] w-[190px] rotate-[70deg]", opacity: [0.1, 0.35, 0.1], duration: 13, delay: 3 },
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
          "-right-[20%] top-[-15%] h-[420px] w-[680px] -rotate-[7deg] scale-x-[-1] opacity-[0.16] light:opacity-[0.4]",
        rotate: [-7, -11, -7],
        duration: 38,
      },
      {
        className: "-left-[12%] bottom-[-28%] h-[280px] w-[453px] rotate-[24deg] opacity-[0.09] light:opacity-[0.24]",
        rotate: [24, 28, 24],
        duration: 30,
      },
    ],
    streaks: [
      { className: "right-[10%] top-[18%] w-[200px] rotate-[50deg]", opacity: [0.15, 0.45, 0.15], duration: 10 },
      { className: "left-[10%] top-[55%] w-[170px] -rotate-[18deg]", opacity: [0.15, 0.4, 0.15], duration: 12, delay: 2 },
      { className: "right-[28%] bottom-[12%] w-[210px] rotate-[100deg]", opacity: [0.1, 0.3, 0.1], duration: 14, delay: 4 },
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
        className: "left-[6%] -bottom-[35%] h-[400px] w-[648px] rotate-[4deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [4, 8, 4],
        duration: 36,
      },
      {
        className: "right-[-14%] top-[-32%] h-[260px] w-[421px] rotate-[195deg] scale-x-[-1] opacity-[0.09] light:opacity-[0.24]",
        rotate: [195, 191, 195],
        duration: 32,
      },
    ],
    streaks: [
      { className: "left-[22%] top-[10%] w-[180px] rotate-[10deg]", opacity: [0.15, 0.4, 0.15], duration: 9, delay: 1 },
      { className: "right-[14%] top-[50%] w-[210px] -rotate-[42deg]", opacity: [0.15, 0.45, 0.15], duration: 12 },
      { className: "left-[42%] bottom-[8%] w-[160px] rotate-[85deg]", opacity: [0.1, 0.3, 0.1], duration: 15, delay: 2.5 },
    ],
    orb: {
      className: "left-[30%] bottom-[10%] size-[200px] bg-gold-bright/20",
      path: { x: [0, 140, -100, 30, 0], y: [0, -70, 60, 150, 0] },
      duration: 22,
    },
  },
  howItWorks: {
    swirls: [
      {
        className: "-left-[16%] -top-[38%] h-[420px] w-[680px] rotate-[6deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [6, 10, 6],
        duration: 39,
      },
      {
        className:
          "-right-[12%] bottom-[-32%] h-[290px] w-[469px] rotate-[150deg] scale-x-[-1] opacity-[0.09] light:opacity-[0.24]",
        rotate: [150, 146, 150],
        duration: 33,
      },
    ],
    streaks: [
      { className: "left-[12%] top-[18%] w-[190px] rotate-[15deg]", opacity: [0.15, 0.4, 0.15], duration: 10, delay: 0.5 },
      { className: "right-[8%] top-[58%] w-[200px] -rotate-[26deg]", opacity: [0.15, 0.42, 0.15], duration: 11.5, delay: 2.5 },
      { className: "left-[48%] bottom-[6%] w-[150px] rotate-[95deg]", opacity: [0.1, 0.3, 0.1], duration: 14.5, delay: 4 },
    ],
    orb: {
      className: "right-[18%] top-[15%] size-[230px] bg-gold-bright/20",
      path: { x: [0, -150, 60, -30, 0], y: [0, 100, -50, 130, 0] },
      duration: 25,
    },
  },
  whyAurex: {
    swirls: [
      {
        className:
          "-right-[18%] -top-[36%] h-[400px] w-[647px] -rotate-[9deg] scale-x-[-1] opacity-[0.16] light:opacity-[0.4]",
        rotate: [-9, -13, -9],
        duration: 37,
      },
      {
        className: "-left-[10%] bottom-[-30%] h-[270px] w-[437px] rotate-[30deg] opacity-[0.09] light:opacity-[0.24]",
        rotate: [30, 34, 30],
        duration: 31,
      },
    ],
    streaks: [
      { className: "left-[20%] top-[15%] w-[170px] rotate-[42deg]", opacity: [0.15, 0.42, 0.15], duration: 9.5, delay: 1.5 },
      { className: "right-[16%] top-[62%] w-[210px] -rotate-[15deg]", opacity: [0.15, 0.4, 0.15], duration: 12.5 },
      { className: "left-[44%] bottom-[10%] w-[180px] rotate-[110deg]", opacity: [0.1, 0.32, 0.1], duration: 15, delay: 3 },
    ],
    orb: {
      className: "left-[22%] top-[40%] size-[210px] bg-gold-bright/20",
      path: { x: [0, 130, -80, 50, 0], y: [0, -90, 100, 30, 0] },
      duration: 23,
    },
  },
  faq: {
    swirls: [
      {
        className: "-left-[14%] -bottom-[38%] h-[380px] w-[615px] rotate-[8deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [8, 4, 8],
        duration: 41,
      },
      {
        className:
          "-right-[16%] -top-[30%] h-[250px] w-[405px] rotate-[205deg] scale-x-[-1] opacity-[0.09] light:opacity-[0.24]",
        rotate: [205, 209, 205],
        duration: 35,
      },
    ],
    streaks: [
      { className: "right-[20%] top-[22%] w-[190px] -rotate-[22deg]", opacity: [0.15, 0.4, 0.15], duration: 11, delay: 2 },
      { className: "left-[16%] top-[64%] w-[160px] rotate-[38deg]", opacity: [0.15, 0.42, 0.15], duration: 13 },
      { className: "right-[42%] bottom-[8%] w-[200px] -rotate-[95deg]", opacity: [0.1, 0.3, 0.1], duration: 16, delay: 4.5 },
    ],
    orb: {
      className: "right-[30%] bottom-[15%] size-[190px] bg-gold-bright/20",
      path: { x: [0, -120, 90, -20, 0], y: [0, 70, -60, 140, 0] },
      duration: 21,
    },
  },
  comingSoon: {
    swirls: [
      {
        className: "-left-[15%] -top-[35%] h-[460px] w-[744px] rotate-[12deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [12, 16, 12],
        duration: 42,
      },
      {
        className:
          "-right-[16%] -bottom-[32%] h-[340px] w-[550px] rotate-[172deg] scale-x-[-1] opacity-[0.1] light:opacity-[0.26]",
        rotate: [172, 168, 172],
        duration: 36,
      },
    ],
    streaks: [
      { className: "left-[12%] top-[20%] w-[200px] rotate-[25deg]", opacity: [0.15, 0.4, 0.15], duration: 10, delay: 1 },
      { className: "right-[15%] top-[65%] w-[220px] -rotate-[30deg]", opacity: [0.15, 0.45, 0.15], duration: 12 },
      { className: "left-[45%] bottom-[10%] w-[170px] rotate-[80deg]", opacity: [0.1, 0.3, 0.1], duration: 14, delay: 3.5 },
    ],
    orb: {
      className: "left-[40%] top-[30%] size-[260px] bg-gold-bright/20",
      path: { x: [0, 150, -60, 60, 0], y: [0, -60, 120, 40, 0] },
      duration: 26,
    },
  },
};

export type SectionVectorVariant = keyof typeof VARIANTS;

// Light mode's streak opacity keyframes are scaled up from the dark-mode
// values above rather than duplicated per variant — see the note at the
// top of this file on why a `light:opacity-*` class can't do this instead.
const LIGHT_STREAK_OPACITY_SCALE = 1.7;
const LIGHT_STREAK_OPACITY_CAP = 0.85;

export default function SectionBackgroundVector({
  variant,
}: {
  variant: SectionVectorVariant;
}) {
  const cfg = VARIANTS[variant];
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {cfg.swirls.map((swirl, i) => (
        <motion.img
          key={`swirl-${i}`}
          src={SWIRL_SRC}
          alt=""
          className={`absolute ${swirl.className} ${LIGHT_MODE_FILTER}`}
          animate={{ rotate: swirl.rotate }}
          transition={{ duration: swirl.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {cfg.streaks.map((streak, i) => (
        <motion.img
          key={`streak-${i}`}
          src={STREAK_SRC}
          alt=""
          className={`absolute h-[2px] ${streak.className} ${LIGHT_MODE_FILTER}`}
          animate={{
            opacity: isLight
              ? streak.opacity.map((v) => Math.min(LIGHT_STREAK_OPACITY_CAP, v * LIGHT_STREAK_OPACITY_SCALE))
              : streak.opacity,
          }}
          transition={{
            duration: streak.duration,
            delay: streak.delay ?? 0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className={`absolute rounded-full blur-[70px] mix-blend-screen light:mix-blend-multiply light:bg-gold-bright/50 ${cfg.orb.className}`}
        animate={{ x: cfg.orb.path.x, y: cfg.orb.path.y }}
        transition={{ duration: cfg.orb.duration, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
