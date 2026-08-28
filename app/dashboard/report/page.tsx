import type { Metadata } from "next";
import ReportSection from "@/components/dashboard/ReportSection";
import { MOCK_INVESTOR, INVESTOR_HOLDINGS } from "@/lib/investorPortfolio";
import { MOCK_REPORTS, getInvestorRelatedRecordOptions } from "@/lib/reports";

export const metadata: Metadata = {
  title: "Report | AUREX",
  description: "Submit a report or complaint to AUREX Admin.",
};

export default function DashboardReportPage() {
  return (
    <ReportSection
      role="investor"
      fallbackNickname={MOCK_INVESTOR.nickname}
      fallbackRealName={MOCK_INVESTOR.realName}
      relatedRecordOptions={getInvestorRelatedRecordOptions(INVESTOR_HOLDINGS)}
      initialReports={MOCK_REPORTS.investor}
    />
  );
}
