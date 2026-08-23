"use client";

import { motion } from "framer-motion";
import { scrollReveal, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";

export default function CTASection() {
  return (
    <section className="w-full border border-grid-line p-6 sm:p-10 md:p-[60px]">
      <motion.div {...scrollReveal} className="flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
          <BrandMark variant="footer" />
          <div className="flex flex-1 flex-col gap-3 text-neutral-400">
            <p className="font-jakarta text-xl sm:text-2xl">
              AUREX Continues to Redefine Private Investing.
            </p>
            <p className="font-sans text-sm leading-relaxed sm:text-base">
              Combining rigorous due diligence, transparent reporting, and
              hands-on portfolio strategy to help sophisticated investors
              build lasting wealth. Join a growing network of investors who
              trust AUREX with their capital.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 border border-grid-line bg-ink-light/20 p-6 backdrop-blur-md sm:flex-row sm:items-center sm:gap-5 sm:p-[30px]">
          <div className="flex flex-1 flex-col items-start gap-3.5 sm:flex-row sm:items-center">
            <p className="whitespace-nowrap font-sans text-lg text-neutral-400">Welcome to Aurex</p>
            {/* On mobile this is plain text with no surrounding box at
                all — per request, rather than trying to fix the padding
                further. sm+: the pill container comes back at the source
                Figma's fixed padding, corners squared off per the
                site-wide "remove rounded corners" pass. */}
            <p className="font-sans text-sm leading-relaxed text-white sm:bg-grid-line sm:px-3.5 sm:py-2.5 sm:text-base">
              Where transparency, expertise, and client-centricity intersect
              to shape the future of private investing.
            </p>
          </div>
          <motion.a
            {...hoverScale}
            href="#join"
            className="flex shrink-0 items-center justify-center bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-5 py-3.5 font-jakarta text-sm text-amainblack"
          >
            Get Started
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
