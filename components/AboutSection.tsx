"use client";

import { motion } from "framer-motion";
import { scrollReveal } from "@/lib/motion";
import AboutVisualPanel from "@/components/AboutVisualPanel";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
      <SectionBackgroundVector variant="about" />
      <motion.div
        {...scrollReveal}
        className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:items-center md:gap-12 lg:gap-[100px]"
      >
        <div className="flex flex-col items-start gap-6 md:flex-1">
          <h2 className="font-jakarta text-3xl font-semibold leading-tight tracking-tight text-cream sm:text-4xl md:text-5xl md:leading-[1.15] md:tracking-[-0.02em]">
            A smarter way to participate in investment opportunities.
          </h2>
          <p className="font-sans text-base leading-7 text-cream-dim sm:text-lg sm:leading-8 not-italic">
            AUREX provides sophisticated investors with exclusive access to
            private investment information, bridging the gap between elite
            capital and unprecedented growth opportunities.
          </p>
        </div>

        <AboutVisualPanel />
      </motion.div>
    </section>
  );
}
