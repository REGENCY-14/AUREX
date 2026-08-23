"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

const TESTIMONIALS = [
  {
    quote:
      "The level of transparency and strategic foresight AUREX provides is unparalleled. My portfolio has seen consistent growth since joining.",
    initials: "J.R.",
    title: "Managing Partner",
  },
  {
    quote:
      "The level of transparency and strategic foresight AUREX provides is unparalleled. My portfolio has seen consistent growth since joining.",
    initials: "A.K.",
    title: "Managing Partner",
  },
  {
    quote:
      "Access to private investment opportunities used to be incredibly opaque. AUREX has completely revolutionized how I approach wealth building.",
    initials: "E.C.",
    title: "Tech Executive",
  },
];

export default function Testimonials() {
  return (
    <section
      id="insights"
      className="w-full border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
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
          Client Perspectives
        </motion.h2>

        {/* No fixed aspect-ratio on the cards below, on purpose: Figma's
            card hit its ~339x258 landscape proportions because its quote
            text was manually pre-broken into exactly 3 lines. A real
            browser wraps this text differently at different widths, so
            locking the box to that ratio clipped text out of view
            (invisible, since the card also had overflow-hidden). Letting
            height follow content avoids that.

            The quote mark is absolutely positioned (matching the Figma
            source, which floats it in the corner rather than stacking it
            in the flex flow) so it doesn't consume its own line above the
            text — that was the main source of the extra height. */}
        {/* Mobile: a horizontal snap-scroll slideshow (native touch swipe,
            no JS needed) instead of stacking the cards vertically. The
            negative margin + matching padding lets each card's shadow/blur
            bleed to the true screen edge while the peeking-next-card still
            reads as "there's more" — a plain edge-to-edge full-bleed card
            would look like a single static screen instead of a carousel.
            sm+: reverts to the original 3-column grid. */}
        <div className="-mx-6 flex w-[calc(100%+3rem)] snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 sm:mx-0 sm:w-full sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.initials + t.quote.slice(0, 8)}
              variants={staggerItem}
              className="relative flex w-[85%] shrink-0 snap-center flex-col items-start justify-between gap-6 rounded-[62px] border border-gold/20 bg-panel/40 p-6 backdrop-blur-[15px] sm:w-auto sm:shrink sm:snap-none sm:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute left-6 top-9 -translate-y-1/2 font-serif text-6xl leading-none text-gold-bright/20 sm:left-8"
              >
                &ldquo;
              </span>

              <p className="text-right font-jakarta text-sm italic leading-6 text-cream sm:text-base">
                {t.quote}
              </p>

              <div className="flex w-full items-center justify-end gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-[#3d392f]">
                  <span className="font-jakarta text-sm font-bold text-gold-bright">
                    {t.initials}
                  </span>
                </div>
                <span className="font-jakarta text-sm uppercase tracking-[1.6px] text-cream-dim">
                  {t.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
