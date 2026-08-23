"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideUp, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import { ArrowRightIcon } from "@/components/icons";

const NAV_LINKS = ["Portfolio", "Markets", "Insights", "Concierge"];

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
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6 sm:px-6"
    >
      <div className="flex w-full max-w-[1152px] flex-col">
        <div className="flex items-center justify-between gap-4 rounded-full border border-ink-light bg-ink/60 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
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
              {NAV_LINKS.map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  className="font-sans text-[16px] font-medium tracking-[0.7px] text-neutral-200 transition-colors hover:text-cream"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <a
              href="#login"
              className="hidden rounded-full px-2 py-2 font-sans text-[16px] font-medium tracking-[0.7px] text-neutral-200 transition-colors hover:text-cream sm:inline-block"
            >
              Login
            </a>
            <motion.a
              {...hoverScale}
              href="#join"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-4 py-3 font-jakarta text-[16px] text-amainblack"
            >
              Join Us
              <ArrowRightIcon className="size-4" />
            </motion.a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex size-9 items-center justify-center rounded-full text-cream lg:hidden"
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
              className="mt-2 flex flex-col gap-1 rounded-3xl border border-ink-light bg-ink p-4 lg:hidden"
            >
              <a
                href="#features"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 font-jakarta text-[16px] font-semibold text-gold-light"
              >
                Features
              </a>
              {NAV_LINKS.map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 font-sans text-[16px] font-medium text-neutral-200 transition-colors hover:text-cream"
                >
                  {label}
                </a>
              ))}
              <a
                href="#login"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 font-sans text-[16px] font-medium text-neutral-200 transition-colors hover:text-cream"
              >
                Login
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
