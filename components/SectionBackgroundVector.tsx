"use client";

import { motion } from "framer-motion";

/**
 * A subtle decorative backdrop for a content section: a small "mish-mash"
 * of gold line-art layered behind the real content —
 *
 * - two copies of the abstract "Looper BG" swirl (the same vector used
 *   behind the hero), at different scale/rotation/mirror so they don't
 *   read as one flat repeated shape
 * - a soft gold orb that continuously drifts across all of it — "a
 *   glowing ball moving around" the lines, per request
 *
 * (This used to also scatter three thin straight gold-gradient "streak"
 * lines at different angles for extra texture, but on the beige/cream
 * light-mode background those read as a distracting diagonal dashed
 * line rather than subtle texture, so that layer was removed.)
 *
 * The swirls animate on their own, not just the orb: they slowly
 * rotate/breathe, each on its own duration so the whole thing never looks
 * like it's pulsing in lockstep. It's a fully ambient effect (not cursor-
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
 * used in (About, How it Works, Why Aurex, Investment Packages, Leaderboard,
 * Client Perspectives, FAQ, the Coming Soon page, the Contact page's form
 * section, and the 404 page) don't all look/move identically.
 */
const SWIRL_SRC = "/brand/looper-bg-glow.svg";

// Applied to every swirl <img> — a fixed gold-gradient asset can't be
// recolored via a Tailwind text-color class the way currentColor SVGs
// can, so this reaches for a CSS filter instead.
const LIGHT_MODE_FILTER = "light:brightness-50 light:saturate-150 light:contrast-125";

type Swirl = { className: string; rotate: number[]; duration: number };
type Orb = { className: string; path: { x: number[]; y: number[] }; duration: number };

const VARIANTS: Record<string, { swirls: Swirl[]; orb: Orb }> = {
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
    orb: {
      className: "left-[22%] top-[40%] size-[210px] bg-gold-bright/20",
      path: { x: [0, 130, -80, 50, 0], y: [0, -90, 100, 30, 0] },
      duration: 23,
    },
  },
  leaderboard: {
    swirls: [
      {
        className:
          "-right-[16%] -top-[34%] h-[410px] w-[663px] rotate-[16deg] scale-x-[-1] opacity-[0.16] light:opacity-[0.4]",
        rotate: [16, 20, 16],
        duration: 40,
      },
      {
        className: "-left-[14%] bottom-[-30%] h-[280px] w-[453px] rotate-[195deg] opacity-[0.09] light:opacity-[0.24]",
        rotate: [195, 199, 195],
        duration: 32,
      },
    ],
    orb: {
      className: "right-[20%] top-[22%] size-[220px] bg-gold-bright/20",
      path: { x: [0, -140, 70, -40, 0], y: [0, 90, -60, 120, 0] },
      duration: 24,
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
    orb: {
      className: "left-[40%] top-[30%] size-[260px] bg-gold-bright/20",
      path: { x: [0, 150, -60, 60, 0], y: [0, -60, 120, 40, 0] },
      duration: 26,
    },
  },
  contact: {
    swirls: [
      {
        className: "-right-[16%] -top-[36%] h-[420px] w-[680px] rotate-[14deg] scale-x-[-1] opacity-[0.16] light:opacity-[0.4]",
        rotate: [14, 18, 14],
        duration: 38,
      },
      {
        className: "-left-[12%] bottom-[-28%] h-[280px] w-[453px] rotate-[188deg] opacity-[0.09] light:opacity-[0.24]",
        rotate: [188, 184, 188],
        duration: 33,
      },
    ],
    orb: {
      className: "right-[18%] top-[30%] size-[230px] bg-gold-bright/20",
      path: { x: [0, -130, 70, -30, 0], y: [0, 90, -60, 110, 0] },
      duration: 25,
    },
  },
  notFound: {
    swirls: [
      {
        className: "-right-[14%] -top-[38%] h-[440px] w-[712px] rotate-[20deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [20, 24, 20],
        duration: 41,
      },
      {
        className: "-left-[16%] bottom-[-34%] h-[300px] w-[485px] rotate-[200deg] scale-x-[-1] opacity-[0.09] light:opacity-[0.24]",
        rotate: [200, 196, 200],
        duration: 35,
      },
    ],
    orb: {
      className: "left-[35%] top-[45%] size-[240px] bg-gold-bright/20",
      path: { x: [0, 140, -90, 40, 0], y: [0, -80, 70, 130, 0] },
      duration: 24,
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
          className={`absolute ${swirl.className} ${LIGHT_MODE_FILTER}`}
          animate={{ rotate: swirl.rotate }}
          transition={{ duration: swirl.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Light mode can't reuse the dark-mode alpha here: `mix-blend-screen`
          (used against the near-black page) makes a translucent color
          fade toward invisible the lighter the backdrop gets — screen of
          white with anything is just white — so against a near-black page
          a `/20` gold reads as a soft glow. `mix-blend-multiply` is the
          correct swap for a light backdrop (screen would just vanish), but
          multiply doesn't have that same self-dimming behavior: it shows
          a translucent color at close to its own alpha regardless of the
          backdrop. Carrying over the same `/50` alpha that reads as a
          gentle wash on black instead painted a solid, dirty-looking tan
          smudge on the light cream page — so light mode gets its own,
          much lower alpha to land at the same "barely-there ambient glow"
          weight, not just a swapped blend mode. */}
      <motion.div
        className={`absolute rounded-full blur-[70px] mix-blend-screen light:mix-blend-multiply light:bg-gold-bright/12 ${cfg.orb.className}`}
        animate={{ x: cfg.orb.path.x, y: cfg.orb.path.y }}
        transition={{ duration: cfg.orb.duration, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
