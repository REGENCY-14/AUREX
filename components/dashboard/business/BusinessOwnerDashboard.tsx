"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import { ArrowUpRightIcon } from "@/components/icons";
import ListingStatusSection from "@/components/dashboard/business/ListingStatusSection";
import FundingProgressSection from "@/components/dashboard/business/FundingProgressSection";
import ListingDetailsSection from "@/components/dashboard/business/ListingDetailsSection";
import type { BusinessListing } from "@/lib/businessListing";

/**
 * The screen an approved Business Owner lands on after logging in —
 * reached today only by navigating here directly (see
 * app/business-dashboard/page.tsx), since there's no real auth yet.
 *
 * A separate component tree from the Investor Dashboard (components/
 * dashboard/*.tsx) on purpose, per the brief: a Business Owner doesn't
 * invest, doesn't see open slots, and doesn't get an earnings breakdown,
 * so there's nothing to actually share beyond the same design tokens
 * (borders, panel backgrounds, gold accents) both dashboards already pull
 * from globals.css — no shared layout component sits between them.
 *
 * Section order/visibility is deliberate: Listing Status always renders
 * first and alone when pending (Admin hasn't published anything yet, so
 * there's nothing for Funding Progress or Listing Details to meaningfully
 * show); live/funded/closed additionally get the funding numbers and the
 * read-only listing content once there's real activity to report on.
 */
export default function BusinessOwnerDashboard({ listing }: { listing: BusinessListing }) {
  const isPublished = listing.status !== "pending";

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <div className="flex w-full max-w-2xl flex-col gap-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="AUREX home">
            <BrandMark variant="nav" />
          </Link>
          <Link href="/" className="font-sans text-sm text-cream-dim transition-colors hover:text-gold-light">
            Log out
          </Link>
        </div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-8">
          <motion.div
            variants={staggerItem}
            className="flex flex-col gap-1.5 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8"
          >
            <p className="font-jakarta text-xs font-medium uppercase tracking-[1.8px] text-gold-muted">
              Business Owner Dashboard
            </p>
            <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">
              Welcome back, {listing.ownerNickname}
            </h1>
            <p className="font-sans text-sm text-cream-dim sm:text-base">
              Here&apos;s how {listing.businessName} is doing.
            </p>
          </motion.div>

          <motion.div variants={staggerItem}>
            <ListingStatusSection listing={listing} />
          </motion.div>

          {isPublished && (
            <>
              <motion.div variants={staggerItem}>
                <FundingProgressSection listing={listing} />
              </motion.div>
              <motion.div variants={staggerItem}>
                <ListingDetailsSection listing={listing} />
              </motion.div>
            </>
          )}

          {/* No `?me=` here, unlike the Investor Dashboard's own link to
              this page: a Business Owner doesn't invest, so their nickname
              never appears as a leaderboard row to highlight — this is
              just a plain "go look at it" link. */}
          <motion.div variants={staggerItem} className="flex items-center justify-between border-t border-grid-line pt-8">
            <p className="font-sans text-sm text-cream-dim">Curious how AUREX investors are doing?</p>
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 font-jakarta text-sm font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              View Leaderboard
              <ArrowUpRightIcon className="size-3" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
