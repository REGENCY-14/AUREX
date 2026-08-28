"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import ListingStatusSection from "@/components/dashboard/business/ListingStatusSection";
import FundingProgressSection from "@/components/dashboard/business/FundingProgressSection";
import ListingDetailsSection from "@/components/dashboard/business/ListingDetailsSection";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import type { BusinessListing } from "@/lib/businessListing";

/**
 * The screen an approved Business Owner lands on after logging in.
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
  const { user, isLoading } = useRequireAuth();
  const { logout } = useAuth();
  const router = useRouter();
  const isPublished = listing.status !== "pending";

  if (isLoading || !user) return null;

  const displayName = user.nickname ?? listing.ownerNickname;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <div className="flex w-full max-w-2xl flex-col gap-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="AUREX home">
            <BrandMark variant="nav" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="font-sans text-sm text-cream-dim transition-colors hover:text-gold-light"
          >
            Log out
          </button>
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
              Welcome back, {displayName}
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
        </motion.div>
      </div>
    </main>
  );
}
