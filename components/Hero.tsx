"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverScale } from "@/lib/motion";
import { ArrowUpRightIcon, AumIcon, TrendUpIcon } from "@/components/icons";
import HeroLooperVector from "@/components/HeroLooperVector";

export default function Hero() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="relative flex min-h-[60vh] w-full flex-col items-center justify-center gap-12 overflow-hidden sm:gap-16"
    >
      <HeroLooperVector />

      <div className="relative flex max-w-4xl flex-col items-center gap-6 text-center">
        <motion.h1
          variants={staggerItem}
          className="font-jakarta text-4xl font-semibold tracking-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.1] lg:tracking-[-0.04em]"
        >
          <span className="block">Invest with purpose.</span>
          <span className="block bg-gradient-to-r from-gold-bright via-gold-deep via-50% to-gold-bright bg-clip-text text-transparent">
            Grow with confidence.
          </span>
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="max-w-2xl font-jakarta text-base leading-7 text-cream-dim sm:text-lg md:text-xl md:leading-8"
        >
          Aurex is an exclusive private investment platform designed for
          sophisticated investors seeking transparency and strategic growth.
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="flex w-full flex-col items-center gap-4 pt-2 sm:w-auto sm:flex-row sm:gap-6"
        >
          <motion.a
            {...hoverScale}
            href="#join"
            className="flex h-[58px] w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 font-jakarta text-lg text-amainblack sm:w-auto"
          >
            Become an Investor
            <ArrowUpRightIcon className="size-[17px]" />
          </motion.a>
          {/* This one's a page-level CTA, not part of the persistently-dark
              vault visual below it, so unlike the ink-light surfaces it
              sits near, it does flip in light mode — matching Figma's
              light variant (a white/50 blurred pill with dark text) rather
              than the token's usual "stay dark" behavior. */}
          <motion.a
            {...hoverScale}
            href="#explore"
            className="flex h-[58px] w-full items-center justify-center border border-gold-muted/30 bg-ink-light/50 px-8 font-sans text-base font-medium text-neutral-200 backdrop-blur-md light:border-gold/30 light:bg-white/50 light:text-[#1a1a1a] sm:w-auto"
          >
            Explore AUREX
          </motion.a>
        </motion.div>
      </div>

      <motion.div variants={staggerItem} className="relative w-full max-w-5xl">
        <div className="relative aspect-[16/8] w-full overflow-hidden border border-gold-muted/30 bg-ink-light/40">
          <Image
            src="/brand/hero-vault-visual.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover mix-blend-multiply opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/0 opacity-50" />

          <div className="relative flex h-full flex-col justify-between p-4 sm:p-8 md:p-12">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col items-start gap-1 border border-gold-muted/30 bg-ink-light/80 p-3 backdrop-blur-md sm:p-4">
                <span className="font-geist text-[11px] font-semibold uppercase tracking-[1.2px] text-graphite sm:text-xs">
                  Global AUM
                </span>
                <span className="font-geist text-xl font-medium tracking-tight text-gold-muted sm:text-2xl">
                  $4.2B+
                </span>
              </div>

              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold-muted/30 bg-ink-light/80 backdrop-blur-md sm:size-11">
                <AumIcon className="size-[14px] text-gold-muted sm:size-[18px]" />
              </div>
            </div>

            <div className="flex justify-end">
              <div className="flex flex-col items-end gap-1 border border-gold-muted/30 bg-ink-light/80 p-3 backdrop-blur-md sm:p-4">
                <span className="font-geist text-[11px] font-semibold uppercase tracking-[1.2px] text-graphite sm:text-xs">
                  YTD Performance
                </span>
                <span className="flex items-center gap-1 font-geist text-xl font-medium tracking-tight text-gold-muted sm:text-2xl">
                  <TrendUpIcon className="size-3" />
                  14.8%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
