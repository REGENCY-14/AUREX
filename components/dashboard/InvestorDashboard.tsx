"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { formatGhs } from "@/lib/formatters";
import BrandMark from "@/components/BrandMark";
import { ArrowUpRightIcon } from "@/components/icons";
import OpenSlotsSection from "@/components/dashboard/OpenSlotsSection";
import EarningsSection from "@/components/dashboard/EarningsSection";
import type { InvestmentSlot } from "@/lib/investmentSlots";
import type { InvestorProfile, InvestmentHolding } from "@/lib/investorPortfolio";

/**
 * The screen an approved Investor lands on after logging in — reached
 * today only via ApplicationStatusScreen's "Go to Dashboard" link on the
 * approved state (see app/dashboard/page.tsx), since there's no real
 * auth/login yet to gate this behind.
 *
 * No Admin-side tool exists yet to publish slots or record holdings (both
 * separate pieces of work) — `slots` and `holdings` are passed in as
 * plain props so this component doesn't know or care whether they came
 * from mock data (today) or a real API (later); see lib/investmentSlots.ts
 * and lib/investorPortfolio.ts for the mock data itself.
 *
 * Section order is deliberate: Open Investment Slots first, since that's
 * what should drive action, with the calmer, purely-informational
 * Earnings section below it rather than competing for the same attention.
 *
 * Deliberately skips the site's full marketing Navbar (same reasoning as
 * MultiStepFormShell's own header) — this is an app screen for someone
 * already inside the platform, not a page trying to sell them on joining
 * it. "Log out" is a stub link back to the home page; there's no real
 * session to end yet.
 */
export default function InvestorDashboard({
  investor,
  slots,
  holdings,
}: {
  investor: InvestorProfile;
  slots: InvestmentSlot[];
  holdings: InvestmentHolding[];
}) {
  // "Total amount currently invested across all holdings" per the brief —
  // unlike EarningsSection's own headline figure (active investments
  // only), this deliberately includes matured holdings too, matching the
  // brief's own wording difference between the two stats.
  const totalInvested = holdings.reduce((sum, h) => sum + h.amountInvestedGhs, 0);

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <div className="flex w-full max-w-6xl flex-col gap-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="AUREX home">
            <BrandMark variant="nav" />
          </Link>
          <Link
            href="/"
            className="font-sans text-sm text-cream-dim transition-colors hover:text-gold-light"
          >
            Log out
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-10"
        >
          <motion.div
            variants={staggerItem}
            className="flex flex-col items-start justify-between gap-6 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:flex-row sm:items-center sm:p-8"
          >
            <div className="flex flex-col gap-1.5">
              <p className="font-jakarta text-xs font-medium uppercase tracking-[1.8px] text-gold-muted">
                Investor Dashboard
              </p>
              <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">
                Welcome back, {investor.nickname}
              </h1>
            </div>
            <div className="flex flex-col items-start gap-0.5 sm:items-end">
              <span className="font-sans text-xs uppercase tracking-wide text-cream-dim">Total Invested</span>
              <span className="font-jakarta text-2xl font-bold text-gold-bright sm:text-3xl">
                {formatGhs(totalInvested)}
              </span>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} id="open-slots">
            <OpenSlotsSection slots={slots} />
          </motion.div>

          <motion.div variants={staggerItem}>
            <EarningsSection holdings={holdings} />
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="flex flex-col items-start gap-3 border-t border-grid-line pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="font-sans text-sm text-cream-dim">Want more detail?</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link
                href={`/leaderboard?me=${encodeURIComponent(investor.nickname)}`}
                className="flex items-center gap-1.5 font-jakarta text-sm font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              >
                View Leaderboard
                <ArrowUpRightIcon className="size-3" />
              </Link>
              {/* Transaction history / statements — genuinely stubbed, not
                  built as part of this dashboard (per the brief). Routed
                  to /coming-soon rather than a dead link, the same
                  placeholder every other not-yet-built destination on this
                  site already uses. */}
              <Link
                href="/coming-soon"
                className="flex items-center gap-1.5 font-jakarta text-sm font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              >
                Transaction History
                <ArrowUpRightIcon className="size-3" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
