"use client";

import { motion } from "framer-motion";

/**
 * A subtle decorative backdrop for a content section: the same abstract
 * "Looper BG" line-art vector used behind the hero, reused here at a
 * smaller scale/opacity so it reads as background texture rather than
 * competing with the section's real content, plus a soft gold orb that
 * continuously drifts across it —
 *
 * Deliberately the *boosted-opacity* asset (public/brand/looper-bg-
 * glow.svg), not the dim resting one (looper-bg.svg) HeroLooperVector
 * layers underneath its own hover-lit copy. That resting asset has many
 * individual paths at near-zero opacity — fine there, since the hero
 * pairs it with an interactive lit overlay, but here it meant whether
 * this backdrop was visible at all came down to luck: which random
 * cluster of paths a given crop/rotation happened to land on. The
 * glow variant's paths are uniformly opaque, so a single low CSS
 * opacity reads consistently across every placement below.
 * "a glowing ball moving around" the vector, per request. Unlike
 * HeroLooperVector, this isn't cursor-tracked: it's a fully ambient
 * animation that runs on its own regardless of interaction, since these
 * sections (About / Packages / Client Perspectives) don't have the
 * hero's large empty canvas for a pointer-following effect to read well.
 *
 * Each variant repositions/rotates/mirrors the same source vector and
 * gives the orb its own drift path and duration, so the three sections
 * this is used in (About, Investment Packages, Client Perspectives)
 * don't all pulse in visual lockstep.
 *
 * The orb animates via x/y transform motion values (not left/top) so it
 * is automatically neutered by the root layout's
 * <MotionConfig reducedMotion="user"> — no manual reduced-motion branch
 * needed here, consistent with how transform-based motion is handled
 * elsewhere in this project (see HeroLooperVector / AboutVisualPanel).
 */
const VARIANTS = {
  about: {
    vectorClassName: "-left-[18%] -top-[40%] h-[440px] w-[712px] rotate-[9deg] opacity-[0.16]",
    orbClassName: "left-[15%] top-[20%] size-[220px] bg-gold-bright/20",
    path: { x: [0, 160, 40, -40, 0], y: [0, 80, 200, 60, 0] },
    duration: 24,
  },
  packages: {
    vectorClassName:
      "-right-[20%] top-[-15%] h-[420px] w-[680px] -rotate-[7deg] scale-x-[-1] opacity-[0.16]",
    orbClassName: "right-[12%] top-[35%] size-[240px] bg-gold-bright/20",
    path: { x: [0, -180, -20, 120, 0], y: [0, 90, 220, 40, 0] },
    duration: 27,
  },
  testimonials: {
    vectorClassName: "left-[6%] -bottom-[35%] h-[400px] w-[648px] rotate-[4deg] opacity-[0.16]",
    orbClassName: "left-[30%] bottom-[10%] size-[200px] bg-gold-bright/20",
    path: { x: [0, 140, -100, 30, 0], y: [0, -70, 60, 150, 0] },
    duration: 22,
  },
} as const;

export type SectionVectorVariant = keyof typeof VARIANTS;

export default function SectionBackgroundVector({
  variant,
}: {
  variant: SectionVectorVariant;
}) {
  const cfg = VARIANTS[variant];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/looper-bg-glow.svg"
        alt=""
        className={`absolute ${cfg.vectorClassName}`}
      />
      <motion.div
        className={`absolute rounded-full blur-[70px] mix-blend-screen ${cfg.orbClassName}`}
        animate={{ x: cfg.path.x, y: cfg.path.y }}
        transition={{ duration: cfg.duration, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
