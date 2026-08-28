import type { Metadata } from "next";
import FundingProgressSection from "@/components/dashboard/business/FundingProgressSection";
import { MOCK_LISTINGS, parseListingStatus } from "@/lib/businessListing";

export const metadata: Metadata = {
  title: "Earnings | AUREX",
  description: "Funding raised so far on your AUREX business listing.",
};

/**
 * The Business Owner's "Earnings" tab — funds raised from investors
 * backing the listing (FundingProgressSection: amount raised, % of
 * goal, backer count). A business owner doesn't have personal earnings
 * the way an investor does; this is the closest real equivalent — money
 * actually coming in against the listing.
 */
export default async function BusinessDashboardEarningsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const listing = MOCK_LISTINGS[parseListingStatus(status)];

  if (listing.status === "pending") {
    return (
      <div className="flex flex-col items-center gap-2 border border-grid-line py-12 text-center">
        <p className="font-jakarta text-sm font-medium text-cream">No earnings to show yet.</p>
        <p className="max-w-sm font-sans text-sm text-cream-dim">
          AUREX Admin is still reviewing your listing — funding figures will appear here once it goes live.
        </p>
      </div>
    );
  }

  return <FundingProgressSection listing={listing} />;
}
