"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideUp, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import ThemeToggle from "@/components/ThemeToggle";

// Per Figma node 37:1946 — "About Us" / "Contact" / "Insights", not the
// earlier placeholder set.
const NAV_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Insights", href: "#insights" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      {open ? (
        <path
          d="M5 5L15 15M15 5L5 15"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3 6H17M3 10H17M3 14H17"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      variants={fadeIn}
      initial="initial"
      animate="animate"
      // Docked flush to the top edge and spanning the full viewport width —
      // no floating pill, no side margin, no border-radius. Per request:
      // "remove the round[ed] [pil]l on the navbar and make it touch the
      // edges."
      className="fixed inset-x-0 top-0 z-50 w-full border-b border-grid-line bg-ink/80 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-6 lg:gap-12">
          <a href="#" aria-label="AUREX home" className="shrink-0">
            <BrandMark variant="nav" />
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            <a
              href="#features"
              className="border-b-2 border-gold bg-gradient-to-r from-gold via-gold-light via-50% to-gold bg-clip-text pb-1.5 font-jakarta text-[16px] font-semibold tracking-[0.7px] text-transparent"
            >
              Features
            </a>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-sans text-[16px] font-medium tracking-[0.7px] text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <ThemeToggle />
          <a
            href="#login"
            className="hidden px-2 py-2 font-sans text-[16px] font-medium tracking-[0.7px] text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep sm:inline-block"
          >
            Login
          </a>
          <motion.a
            {...hoverScale}
            href="#join"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-4 py-3 font-jakarta text-[16px] text-amainblack"
          >
            Invest With Us
          </motion.a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-9 items-center justify-center text-cream lg:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            variants={slideUp}
            initial="initial"
            animate="animate"
            exit="initial"
            className="flex flex-col gap-1 border-t border-grid-line bg-ink p-4 lg:hidden"
          >
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 font-jakarta text-[16px] font-semibold text-gold-light"
            >
              Features
            </a>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 font-sans text-[16px] font-medium text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep"
              >
                {label}
              </a>
            ))}
            <a
              href="#login"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 font-sans text-[16px] font-medium text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep"
            >
              Login
            </a>
            {/* No separate theme toggle here — the top bar's toggle stays
                visible and reachable even with this dropdown open, so a
                second one here would just be a duplicate. */}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
