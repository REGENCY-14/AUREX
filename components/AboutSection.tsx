"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { scrollReveal } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
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

        {/* "grid card" visual — crosshair lines + grain/noise, centered brand mark */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[38px] border border-grid-line md:flex-1">
          <Image
            src="/brand/about-photo.png"
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover mix-blend-overlay"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(25,25,25,0) 0%, #191919 90%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: "url(/brand/about-noise-tile.png)",
              backgroundSize: "32px 32px",
              backgroundPosition: "top left",
            }}
          />
          {/* stray lime-green tint substituted with the brand's gold — the
              source Figma layer used rgba(172,255,36,.2), which doesn't
              match AUREX's palette anywhere else and reads as a leftover
              from a different template. */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(212,175,55,0.2)", mixBlendMode: "color" }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(257deg, rgba(255,255,255,0) 79%, rgba(255,255,255,0.3) 100%)",
              mixBlendMode: "overlay",
            }}
          />
          <Image
            src="/brand/about-luminosity.png"
            alt=""
            fill
            className="object-cover opacity-60 mix-blend-luminosity"
          />

          {/* crosshair reaching all four edges, reproducing the exact gold
              gradient used by the source line assets */}
          <div
            className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #d4af37 0%, #e9c349 50%, #d4af37 100%)",
            }}
          />
          <div
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #d4af37 0%, #e9c349 50%, #d4af37 100%)",
            }}
          />

          {/* soft grain bloom behind the mark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/about-shape.svg"
            alt=""
            className="absolute left-1/2 top-1/2 size-[257px] -translate-x-1/2 -translate-y-1/2 mix-blend-luminosity"
          />

          <div className="absolute left-1/2 top-1/2 flex size-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_23px_16px_rgba(255,255,255,0.5)] sm:size-[100px]">
            <BrandMark variant="nav" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
