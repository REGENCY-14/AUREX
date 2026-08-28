import type { Metadata } from "next";
import ListingStatusSection from "@/components/dashboard/business/ListingStatusSection";
import ListingDetailsSection from "@/components/dashboard/business/ListingDetailsSection";
import { MOCK_LISTINGS, parseListingStatus } from "@/lib/businessListing";

export const metadata: Metadata = {
  title: "Investment | AUREX",
  description: "Your AUREX business listing's status and details.",
};

/**
 * The Business Owner's "Investment" tab — the listing itself: its status
 * badge always shows, and its read-only details join it once Admin has
 * actually published it (see ListingDetailsSection's own comment on why
 * a pending listing has nothing to detail yet).
 */
export default async function BusinessDashboardInvestmentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const listing = MOCK_LISTINGS[parseListingStatus(status)];
  const isPublished = listing.status !== "pending";

  return (
    <div className="flex flex-col gap-8">
      <ListingStatusSection listing={listing} />
      {isPublished && <ListingDetailsSection listing={listing} />}
    </div>
  );
}
