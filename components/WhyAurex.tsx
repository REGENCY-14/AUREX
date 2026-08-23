"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverLiftStrong } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import {
  ExclusivityIcon,
  SecurityIcon,
  TransparencyIcon,
  GrowthIcon,
} from "@/components/icons";

// Per Figma node 85:11775 — new section added between How it Works and
// Investment Packages, restating AUREX's core value pillars.
const PILLARS = [
  {
    title: "Exclusivity",
    description: "Access to off-market private equity and specialized funds.",
    Icon: ExclusivityIcon,
  },
  {
    title: "Security",
    description: "Institutional-grade encryption and secure vault technology.",
    Icon: SecurityIcon,
  },
  {
    title: "Transparency",
    description: "Real-time performance reporting and clear fee structures.",
    Icon: TransparencyIcon,
  },
  {
    title: "Growth",
    description:
      "Curated strategies designed for sophisticated capital appreciation.",
    Icon: GrowthIcon,
  },
];

export default function WhyAurex() {
  return (
    <section
      id="why-aurex"
      className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
      <SectionBackgroundVector variant="whyAurex" />
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col items-center gap-12 sm:gap-16"
      >
        <motion.h2
          variants={staggerItem}
          className="text-center font-jakarta text-2xl font-semibold tracking-tight text-cream sm:text-3xl lg:text-4xl"
        >
          Why Aurex
        </motion.h2>

        {/* 4-up in one row from lg, matching Figma — same tight-at-lg
            squeeze as HowItWorks.tsx (this section's own lg:px-[100px]
            stacks on top of <main>'s lg:px-20), so padding/gap/title size
            are trimmed at lg specifically and relax again at xl. */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2 xl:gap-6">
          {PILLARS.map(({ title, description, Icon }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              {...hoverLiftStrong}
              // Per Figma node 100:12429 (light mode): unlike the dark-only
              // ink-light surfaces elsewhere (the Hero vault, its stat
              // overlays), this section's cards are meant to actually flip
              // to a near-white translucent surface in light mode, so this
              // uses the theme-aware panel token (like every other content
              // card) instead — bg-ink-light/30 stayed muddy dark-gray in
              // light mode because that token deliberately never flips.
              className="flex flex-col gap-6 border border-gold/20 bg-panel/40 p-5 backdrop-blur-[20px] lg:p-4 xl:p-6"
            >
              <div className="flex flex-col items-start gap-2">
                <h3 className="break-words font-jakarta text-lg font-semibold text-cream xl:text-xl">
                  {title}
                </h3>
                <p className="break-words font-sans text-sm leading-5 text-cream-dim">
                  {description}
                </p>
              </div>

              {/* Same reasoning as the card itself: the icon tile needs a
                  light-mode-specific surface (Figma's rgba(253,250,242,0.5)
                  warm off-white) since no existing token flips to that —
                  bg-ink-light stays dark by design everywhere else. The
                  icon itself also fades further in light mode to match the
                  much fainter glyph Figma shows there. */}
              <div className="flex items-center justify-center border border-gold/20 bg-ink-light/50 py-16 opacity-60 light:bg-[#fdfaf2]/50">
                <Icon className="size-8 text-gold-muted light:text-gold-muted/40" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
