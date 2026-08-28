import type { Metadata } from "next";
import ReportSection from "@/components/dashboard/ReportSection";
import { MOCK_LISTINGS, parseListingStatus } from "@/lib/businessListing";
import { MOCK_REPORTS, getBusinessRelatedRecordOptions } from "@/lib/reports";

export const metadata: Metadata = {
  title: "Report | AUREX",
  description: "Submit a report or complaint to AUREX Admin about your listing.",
};

/**
 * The Business Owner's "Report" tab — same ReportSection component the
 * Investor Dashboard uses (see app/dashboard/report/page.tsx), just fed
 * this role's own category list and related-record options via its
 * `role` prop. `status` is read the same way every other Business Owner
 * dashboard page already does (see BusinessDashboardInvestmentPage) so
 * previewing e.g. ?status=pending stays consistent across tabs.
 */
export default async function BusinessDashboardReportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const listing = MOCK_LISTINGS[parseListingStatus(status)];

  return (
    <ReportSection
      role="business"
      fallbackNickname={listing.ownerNickname}
      fallbackRealName={listing.ownerRealName}
      relatedRecordOptions={getBusinessRelatedRecordOptions(listing)}
      initialReports={MOCK_REPORTS.business}
    />
  );
}
