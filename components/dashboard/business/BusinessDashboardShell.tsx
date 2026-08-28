"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { MOCK_LISTINGS, parseListingStatus } from "@/lib/businessListing";

/**
 * Shared shell for the Business Owner Dashboard — logo/log-out header,
 * welcome banner, and the same Investment / Earnings / Leaderboard tab
 * bar the Investor Dashboard uses, reinterpreted for this role: Investment
 * is the listing itself (status + details), Earnings is the funding
 * raised so far, Leaderboard is the same investor leaderboard every
 * member can see. See each tab's own page for the actual content.
 *
 * Lives in its own file (rather than directly in
 * app/business-dashboard/layout.tsx) purely so that file can wrap this
 * in a <Suspense> boundary — this component and its DashboardTabs child
 * both call useSearchParams(), which Next.js requires to sit inside
 * Suspense for static builds; a route's own layout.tsx can't wrap its
 * own returned JSX in Suspense and have that cover itself.
 *
 * `status` is still read straight off the URL as a stub data source
 * (parseListingStatus, unchanged) — DashboardTabs itself carries that
 * query string across tab switches so previewing e.g.
 * /business-dashboard/investment?status=pending stays on "pending" when
 * you click over to Earnings instead of silently resetting to "live".
 */
export default function BusinessDashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth();
  const { logout } = useAuth();
  const router = useRouter();
  const status = parseListingStatus(useSearchParams().get("status") ?? undefined);
  const listing = MOCK_LISTINGS[status];

  if (isLoading || !user) return null;

  const displayName = user.nickname ?? listing.ownerNickname;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <div className="flex w-full max-w-2xl flex-col gap-8">
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
            <DashboardTabs basePath="/business-dashboard" />
          </motion.div>

          <motion.div variants={staggerItem}>{children}</motion.div>
        </motion.div>
      </div>
    </main>
  );
}
