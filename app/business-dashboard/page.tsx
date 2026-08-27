import type { Metadata } from "next";
import BusinessOwnerDashboard from "@/components/dashboard/business/BusinessOwnerDashboard";
import { MOCK_LISTINGS, parseListingStatus } from "@/lib/businessListing";

export const metadata: Metadata = {
  title: "Business Owner Dashboard | AUREX",
  description: "Track your AUREX business listing's status and funding progress.",
};

/**
 * The Business Owner Dashboard route — parallel to /dashboard (the
 * Investor Dashboard) but a fully separate page/component tree, per the
 * brief. There's no real auth or listing lookup yet, so `status` is read
 * straight off the URL as a stub data source (defaulting to "live" — see
 * parseListingStatus's own comment), the same convention
 * app/apply/status/page.tsx already uses — e.g.
 * /business-dashboard?status=pending to preview that state instead.
 */
export default async function BusinessDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const status = parseListingStatus(params.status);

  return <BusinessOwnerDashboard listing={MOCK_LISTINGS[status]} />;
}
