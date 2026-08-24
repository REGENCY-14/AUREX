"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";

/**
 * Title banner for the /how-it-works page (Figma node 110:13581) — a
 * bordered band with the page's own Looper-swirl backdrop (variant
 * "howItWorksHero" on the shared SectionBackgroundVector) plus a warm
 * grain/gold-tint texture behind the title, reusing the same noise-tile
 * asset and gold-tint-via-mix-blend-mode technique already used for
 * AboutVisualPanel's background stack, rather than pulling in new
 * Figma-exported texture assets for the same effect.
 */
export default function HowItWorksBanner() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden border border-grid-line px-6 py-16 text-center sm:gap-8 sm:px-10 sm:py-20 md:px-16 lg:px-[100px]">
      <SectionBackgroundVector variant="howItWorksHero" />

      {/* warm grain + gold-tint texture, matching AboutVisualPanel's
          noise-tile + color-blend layers rather than one-off assets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{ backgroundImage: "url(/brand/about-noise-tile.png)", backgroundSize: "32px 32px", backgroundPosition: "top left" }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gold-light mix-blend-color" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex max-w-3xl flex-col items-center gap-4 sm:gap-6"
      >
        <motion.h1
          variants={staggerItem}
          className="font-barlow text-4xl font-semibold tracking-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl"
        >
          How It Works
        </motion.h1>
        <motion.p
          variants={staggerItem}
          className="max-w-2xl font-barlow text-base leading-7 text-neutral-200 light:text-[#1a1a1a] sm:text-lg"
        >
          Discover how AUREX makes strategic investing simple, transparent,
          and seamless — from exploring carefully selected opportunities and
          understanding potential returns to applying, investing, and
          tracking your investment with confidence.
        </motion.p>
      </motion.div>
    </section>
  );
}
