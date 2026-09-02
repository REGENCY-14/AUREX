"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideInRight, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import JoinAurexModal from "@/components/JoinAurexModal";

// Per Figma node 37:1946 (updated): "About Us" has been replaced with
// "How it Works". This used to be an in-page anchor down to the summary
// section on the home page (components/HowItWorks.tsx); now that the fuller
// standalone /how-it-works page exists (components/PageBanner.tsx +
// HowItWorksProcess.tsx), the nav link points there instead. Contact
// likewise now has its own standalone page (components/ContactSection.tsx)
// instead of routing to the coming-soon placeholder. "Insights" has been
// removed per request. "Leaderboard" added pointing at the new standalone
// /leaderboard page (see app/leaderboard/page.tsx) — no ?me= here, since
// the navbar renders identically for every visitor regardless of who (if
// anyone) is logged in; a logged-in investor's own highlighted view is
// only reachable via their dashboard's own link, which does pass it.
const NAV_LINKS = [
  { label: "How it Works", href: "/how-it-works" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Contact", href: "/contact" },
];

// The "active" gold-underline treatment used to be hardcoded onto Home
// regardless of which page was actually open — now driven by the real
// route (usePathname) so it follows whichever page you're on instead.
// border-b-2/pb-1.5 is applied to BOTH states (border-transparent when
// inactive) so every desktop link reserves the same underline space and
// stays vertically aligned whether or not it's the active one.
function desktopLinkClassName(isActive: boolean) {
  return isActive
    ? "border-b-2 border-gold bg-gradient-to-r from-gold via-gold-light via-50% to-gold bg-clip-text pb-1.5 font-jakarta text-[16px] font-semibold tracking-[0.7px] text-transparent"
    : "border-b-2 border-transparent pb-1.5 font-sans text-[16px] font-medium tracking-[0.7px] text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep";
}

// Large stacked typography for the slide-in panel's primary links —
// deliberately much bigger than the old dropdown's own list, matching the
// reference mobile design's bold, one-link-per-line nav.
function mobileLinkClassName(isActive: boolean) {
  return isActive
    ? "font-jakarta text-3xl font-semibold tracking-tight text-gold-light"
    : "font-jakarta text-3xl font-semibold tracking-tight text-cream transition-colors hover:text-gold-light light:text-[#1a1a1a] light:hover:text-gold-deep";
}

// Replaces the old 3-line hamburger — per request, a 2x2 dot grid (a more
// modern "more options" affordance, matching the reference mobile design)
// that morphs into a close (X) glyph once the panel is open, same swap
// pattern the old MenuIcon used.
function MenuTriggerIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
        <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <circle cx="5.5" cy="5.5" r="1.7" fill="currentColor" />
      <circle cx="14.5" cy="5.5" r="1.7" fill="currentColor" />
      <circle cx="5.5" cy="14.5" r="1.7" fill="currentColor" />
      <circle cx="14.5" cy="14.5" r="1.7" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const pathname = usePathname();

  // Closes the panel on Escape — the only "click outside to close" affordance
  // needed now is the backdrop's own onClick below (it covers the entire
  // rest of the screen while the panel is open), but that leaves no
  // keyboard-only way to dismiss it without this.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    // JoinAurexModal (and, on mobile, the nav panel + its backdrop) are
    // rendered as siblings of <motion.header> below, NOT nested inside it:
    // the header has `backdrop-blur-md`, and a `backdrop-filter` on an
    // ancestor — like `transform`/`filter`/`perspective` — establishes a
    // new containing block for any `position: fixed` descendant (see MDN's
    // "Identifying the containing block" page). Nesting a `fixed inset-0`
    // element inside the header made it resolve against the header's own
    // navbar-height-only box instead of the viewport.
    <>
      <motion.header
        variants={fadeIn}
        initial="initial"
        animate="animate"
        // Docked flush to the top edge and spanning the full viewport width
        // — no floating pill, no side margin, no border-radius. Per
        // request: "remove the round[ed] [pil]l on the navbar and make it
        // touch the edges."
        className="fixed inset-x-0 top-0 z-50 w-full border-b border-grid-line bg-ink/80 backdrop-blur-md"
      >
        {/* Inner row is capped to the same max-w-[1280px] content column every
            page body uses (see page.tsx etc.) and centered within the full-
            bleed bar above — otherwise on very wide/ultrawide desktop
            viewports (the bar itself has no max-width, by design, so its
            bg/border still spans edge-to-edge) the logo and nav/CTA group
            would drift apart to the far left/right edges of the screen while
            the actual page content below stays centered in its 1280px
            column, visibly misaligning the nav from everything under it. */}
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-6 lg:gap-12">
            <Link href="/" aria-label="AUREX home" className="shrink-0">
              <BrandMark variant="nav" />
            </Link>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
              <Link href="/" className={desktopLinkClassName(pathname === "/")}>
                Home
              </Link>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={label} href={href} className={desktopLinkClassName(pathname === href)}>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/login"
              className="hidden px-2 py-2 font-sans text-[16px] font-medium tracking-[0.7px] text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep sm:inline-block"
            >
              Login
            </Link>
            {/* Opens JoinAurexModal instead of linking straight to
                /coming-soon — this single CTA used to go to one generic
                placeholder, but the site actually serves two distinct
                audiences (investors, and businesses raising capital), so it
                now offers a choice between the two first. */}
            <motion.button
              {...hoverScale}
              type="button"
              onClick={() => setJoinModalOpen(true)}
              // Smaller pill on mobile (it's sharing the row with the logo and
              // hamburger, with no nav-link breathing room below lg) — steps
              // back up to the original 16px/px-4/py-3 from sm.
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-3 py-2 font-jakarta text-sm text-amainblack sm:gap-2 sm:px-4 sm:py-3 sm:text-[16px]"
            >
              Join Aurex
            </motion.button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex size-9 items-center justify-center text-cream lg:hidden"
            >
              <MenuTriggerIcon open={open} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile nav: a full-height panel sliding in from the right over a
          dimmed backdrop, replacing the old dropdown-below-header. Modeled
          on the reference mobile design — big stacked primary links, a
          smaller secondary link below them, and a CTA pinned to the panel's
          own bottom edge — rather than a compact list. */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="mobile-nav-backdrop"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="initial"
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.nav
              key="mobile-nav-panel"
              id="mobile-nav"
              aria-label="Primary"
              variants={slideInRight}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-y-0 right-0 z-50 flex w-[min(85vw,360px)] flex-col border-l border-grid-line bg-ink px-6 py-6 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Link href="/" aria-label="AUREX home" onClick={() => setOpen(false)} className="shrink-0">
                  <BrandMark variant="nav" />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex size-9 items-center justify-center text-cream"
                >
                  <MenuTriggerIcon open />
                </button>
              </div>

              <div className="mt-10 flex flex-1 flex-col gap-6 overflow-y-auto">
                <Link href="/" onClick={() => setOpen(false)} className={mobileLinkClassName(pathname === "/")}>
                  Home
                </Link>
                {NAV_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={mobileLinkClassName(pathname === href)}
                  >
                    {label}
                  </a>
                ))}

                <div className="mt-2 border-t border-grid-line pt-6">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="font-sans text-base font-medium text-cream-dim transition-colors hover:text-cream light:text-[#5f5e5e] light:hover:text-gold-deep"
                  >
                    Login
                  </Link>
                </div>
              </div>

              {/* Pinned to the panel's bottom edge, same as the reference
                  design's own footer-anchored action. */}
              <motion.button
                {...hoverScale}
                type="button"
                onClick={() => {
                  setOpen(false);
                  setJoinModalOpen(true);
                }}
                className="flex shrink-0 items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-4 py-3 font-jakarta text-[16px] text-amainblack"
              >
                Join Aurex
              </motion.button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <JoinAurexModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
    </>
  );
}
