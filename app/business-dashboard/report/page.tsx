"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReportSection from "@/components/dashboard/ReportSection";
import { MOCK_LISTINGS, parseListingStatus } from "@/lib/businessListing";
import { getBusinessRelatedRecordOptions, getMyReports, type Report } from "@/lib/reports";

/**
 * The Business Owner's "Report" tab — same ReportSection component the
 * Investor Dashboard uses (see app/dashboard/report/page.tsx). `status` is
 * read via useSearchParams the same way BusinessDashboardLeaderboardPage
 * already does, so previewing e.g. ?status=pending stays consistent across
 * tabs. Related-record options stay the local mock listing (no backend
 * "business listing" record exists yet); only the report history itself
 * comes from the real API.
 */
export default function BusinessDashboardReportPage() {
  const status = parseListingStatus(useSearchParams().get("status") ?? undefined);
  const listing = MOCK_LISTINGS[status];

  const [reports, setReports] = useState<Report[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMyReports().then((r) => {
      if (!cancelled) setReports(r);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (reports === null) {
    return <p className="px-4 py-10 text-center font-sans text-sm text-cream-dim">Loading…</p>;
  }

  return (
    <ReportSection
      role="business"
      fallbackNickname={listing.ownerNickname}
      fallbackRealName={listing.ownerRealName}
      relatedRecordOptions={getBusinessRelatedRecordOptions(listing)}
      initialReports={reports}
    />
  );
}
