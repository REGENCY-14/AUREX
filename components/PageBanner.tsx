"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Shared full-bleed title banner for standalone pages below the home page
 * (currently /how-it-works and /contact) — generalized from the original
 * /how-it-works-only banner (Figma node 110:13581) so a second page could
 * reuse the exact same background treatment instead of a copy-pasted file.
 *
 * The background is NOT the "Looper BG" thin-line swirl used behind the
 * home hero (an earlier pass here wrongly assumed it was, since a same-
 * named/rotated asset also happens to sit at the page root in Figma) —
 * inspecting the /how-it-works banner node in isolation showed a
 * completely different background: a wavy monochrome sheen
 * (how-it-works-banner-wave.png, mix-blend-overlay) plus a tiny dot-grid
 * tile (how-it-works-banner-dots.png, repeated every 32px at 60% opacity)
 * with a gold tint layer (mix-blend-color) over both. Both PNGs are
 * downloaded/committed from the Figma file rather than referenced by their
 * temporary export URLs (which expire after ~7 days). Reused as-is for
 * /contact (no separate Figma banner design exists for it) so every
 * standalone page shares one consistent "title band" look rather than
 * inventing a new background per page.
 *
 * bg-ink is the normal auto-flipping page background (dark ink -> near-
 * white in light mode), not a pinned-dark surface — this banner is meant
 * to actually look different in light mode, like the rest of the site,
 * rather than staying permanently dark the way AboutVisualPanel's photo
 * panel deliberately does. The blend modes below are tuned per theme
 * because their math depends on the backdrop's own lightness: mix-blend-
 * overlay/color of anything against a near-black backdrop reads as a
 * gold glow, but mix-blend-overlay against a near-white backdrop is
 * mathematically always white (overlay(white, x) == white for any x) —
 * so light mode swaps to mix-blend-multiply instead, the same dark<->
 * light blend-mode swap SectionBackgroundVector's orb already uses
 * (mix-blend-screen light:mix-blend-multiply).
 *
 * The wave photo itself is toned dark (built to sit under mix-blend-
 * overlay on a near-black band), and multiply doesn't lighten a dark
 * source the way the blend-mode swap alone might suggest — multiply only
 * ever preserves or darkens, so dropping straight to `light:mix-blend-
 * multiply` at the same near-full opacity just showed the photo's own
 * dark tones almost unchanged, painting a muddy brown band across an
 * otherwise near-white page instead of a light one. A `brightness`/
 * `contrast` filter (the same fix SectionBackgroundVector's swirls use
 * for the identical "dark asset, light backdrop" problem) plus a much
 * lower opacity is what actually lightens it enough to read as this
 * page's own light band rather than a leftover dark one.
 *
 * The background stack below deliberately has NO negative z-index: since
 * a plain `relative` element (no z-index of its own) doesn't establish
 * its own stacking context, a `-z-10` child here would actually be
 * compared against the page root's stacking context instead of just this
 * section — meaning the section's own background could paint after (i.e.
 * on top of) it. Leaving these children at the default z-index and
 * relying on DOM order (image stack first, text content after) keeps
 * everything correctly layered within this section alone, same as
 * AboutVisualPanel's background stack.
 */
export default function PageBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden border border-grid-line bg-ink px-6 py-16 text-center sm:gap-8 sm:px-10 sm:py-20 md:px-16 lg:px-[100px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/how-it-works-banner-wave.png"
          alt=""
          className="absolute inset-0 size-full object-cover mix-blend-overlay light:mix-blend-multiply light:opacity-30 light:brightness-150 light:contrast-90"
        />
        {/* The dot tile's own dots are light-colored (made to sit on a dark
            backdrop), so on the light background they'd otherwise vanish —
            light:invert flips them dark, and opacity drops to keep the
            texture subtle rather than a bold dot grid. */}
        <div
          className="absolute inset-0 bg-left-top opacity-60 light:opacity-25 light:invert"
          style={{ backgroundImage: "url(/brand/how-it-works-banner-dots.png)", backgroundSize: "32px 32px" }}
        />
        <div className="absolute inset-0 bg-gold-light mix-blend-color light:mix-blend-multiply light:opacity-40" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative flex max-w-3xl flex-col items-center gap-4 sm:gap-6"
      >
        <motion.h1
          variants={staggerItem}
          className="font-barlow text-4xl font-semibold tracking-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={staggerItem}
          className="max-w-2xl font-barlow text-base leading-7 text-neutral-200 light:text-[#1a1a1a] sm:text-lg"
        >
          {description}
        </motion.p>
      </motion.div>
    </section>
  );
}
