"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideUp, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";

// Per Figma node 37:1946 (updated): "About Us" has been replaced with
// "How it Works". This used to be an in-page anchor down to the summary
// section on the home page (components/HowItWorks.tsx); now that the fuller
// standalone /how-it-works page exists (components/HowItWorksBanner.tsx +
// HowItWorksProcess.tsx), the nav link points there instead. Contact is
// still meant to be its own separate page (not an anchor into the landing
// page's sections), so — like every other not-yet-built page — it keeps
// routing to the coming-soon page until that actually exists. "Insights"
// has been removed per request.
const NAV_LINKS = [
  { label: "How it Works", href: "/how-it-works" },
  { label: "Contact", href: "/coming-soon" },
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
          <Link href="/" aria-label="AUREX home" className="shrink-0">
            <BrandMark variant="nav" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            <Link
              href="/"
              className="border-b-2 border-gold bg-gradient-to-r from-gold via-gold-light via-50% to-gold bg-clip-text pb-1.5 font-jakarta text-[16px] font-semibold tracking-[0.7px] text-transparent"
            >
              Home
            </Link>
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
          <a
            href="/coming-soon"
            className="hidden px-2 py-2 font-sans text-[16px] font-medium tracking-[0.7px] text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep sm:inline-block"
          >
            Login
          </a>
          <motion.a
            {...hoverScale}
            href="/coming-soon"
            // Smaller pill on mobile (it's sharing the row with the logo and
            // hamburger, with no nav-link breathing room below lg) — steps
            // back up to the original 16px/px-4/py-3 from sm.
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-3 py-2 font-jakarta text-sm text-amainblack sm:gap-2 sm:px-4 sm:py-3 sm:text-[16px]"
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
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 font-jakarta text-[16px] font-semibold text-gold-light"
            >
              Home
            </Link>
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
              href="/coming-soon"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 font-sans text-[16px] font-medium text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep"
            >
              Login
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
