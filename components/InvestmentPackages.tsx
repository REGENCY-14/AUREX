"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/motion";

const PACKAGES = [
  {
    name: "Steady Income",
    rate: "8.0%",
    description:
      "Consistent yield generation through diversified fixed-income assets.",
    cta: { style: "solid" as const },
    glow: true,
  },
  {
    name: "Strategic Alpha",
    rate: "15.0%+",
    description:
      "Opportunistic alternative investments designed for sophisticated portfolios.",
    cta: { style: "outline" as const },
    glow: false,
  },
];

export default function InvestmentPackages() {
  return (
    <section
      id="packages"
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
          Investment Packages
        </motion.h2>

        <div className="grid w-full grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {PACKAGES.map((pkg) => (
            <motion.div
              key={pkg.name}
              variants={staggerItem}
              {...hoverLift}
              className="relative flex flex-col items-start gap-6 overflow-hidden rounded-[32px] border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:rounded-[40px] sm:p-8"
            >
              {pkg.glow && (
                <div className="absolute -right-16 -top-16 size-32 rounded-full bg-gold-bright/10 blur-[20px]" />
              )}

              <h3 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">
                {pkg.name}
              </h3>

              <p className="flex items-baseline gap-2">
                <span className="font-jakarta text-3xl font-bold text-gold-bright sm:text-4xl">
                  {pkg.rate}
                </span>
                <span className="font-jakarta text-base text-cream-dim sm:text-lg">APY</span>
              </p>

              <p className="font-jakarta text-sm text-cream-dim sm:text-base">
                {pkg.description}
              </p>

              <a
                href="#"
                className={
                  pkg.cta.style === "solid"
                    ? "mt-2 flex w-full items-center justify-center rounded-full bg-gold-bright py-3 font-jakarta text-sm uppercase text-gold-brown shadow-[0_10px_15px_-3px_rgba(242,202,80,0.2),0_4px_6px_-4px_rgba(242,202,80,0.2)] transition-transform"
                    : "mt-2 flex w-full items-center justify-center rounded-full border border-gold-bright/50 py-3 font-jakarta text-sm uppercase text-gold-bright transition-colors hover:bg-gold-bright/10"
                }
              >
                View Details
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
