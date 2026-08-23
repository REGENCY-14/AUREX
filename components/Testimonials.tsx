"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
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

const AUTO_SCROLL_INTERVAL_MS = 4000;
const RESUME_AFTER_TOUCH_MS = 3000;

export default function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const stopAutoScroll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startAutoScroll = () => {
    if (prefersReducedMotion) return;
    stopAutoScroll();
    timerRef.current = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      indexRef.current = (indexRef.current + 1) % TESTIMONIALS.length;
      const card = el.children[indexRef.current] as HTMLElement | undefined;
      card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }, AUTO_SCROLL_INTERVAL_MS);
  };

  useEffect(() => {
    startAutoScroll();
    return () => {
      stopAutoScroll();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  // Pause while the user is actually swiping/touching the carousel, then
  // pick auto-advancing back up shortly after they let go — so it doesn't
  // fight a manual swipe, but still keeps moving on its own the rest of
  // the time (this only matters below sm: at sm+ it's a static grid, and
  // scrollIntoView on it is a harmless no-op).
  const handleInteractionStart = () => {
    stopAutoScroll();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleInteractionEnd = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(startAutoScroll, RESUME_AFTER_TOUCH_MS);
  };

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
        {/* Mobile: a horizontal snap-scroll slideshow that auto-advances on
            its own (pausing only while actually being swiped), scrollbar
            hidden via .no-scrollbar since this is meant to read as a
            slideshow, not a visibly-scrollable list. The negative margin +
            matching padding lets each card's shadow/blur bleed to the true
            screen edge while the peeking-next-card still reads as "there's
            more". sm+: reverts to the original static 3-column grid. */}
        <div
          ref={scrollerRef}
          onPointerDown={handleInteractionStart}
          onPointerUp={handleInteractionEnd}
          onPointerCancel={handleInteractionEnd}
          className="no-scrollbar -mx-6 flex w-[calc(100%+3rem)] snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 sm:mx-0 sm:w-full sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.initials + t.quote.slice(0, 8)}
              variants={staggerItem}
              className="relative flex w-[85%] shrink-0 snap-center flex-col items-start justify-between gap-6 border border-gold/20 bg-panel/40 p-6 backdrop-blur-[15px] sm:w-auto sm:shrink sm:snap-none sm:p-8"
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
