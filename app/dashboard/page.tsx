import type { Metadata } from "next";
import InvestorDashboard from "@/components/dashboard/InvestorDashboard";
import { MOCK_INVESTOR, INVESTOR_HOLDINGS } from "@/lib/investorPortfolio";
import { INVESTMENT_SLOTS } from "@/lib/investmentSlots";

export const metadata: Metadata = {
  title: "Investor Dashboard | AUREX",
  description: "Track your AUREX investments, earnings, and open investment slots.",
};

/**
 * The Investor Dashboard route — reached today via
 * ApplicationStatusScreen's "Go to Dashboard" link on an approved
 * application (see components/apply/ApplicationStatusScreen.tsx), since
 * there's no real login yet to gate this behind a session. Mock data is
 * passed in as plain props here rather than fetched, so swapping in a real
 * account/slots/holdings API later means changing only this file.
 */
export default function DashboardPage() {
  return (
    <InvestorDashboard
      investor={MOCK_INVESTOR}
      slots={INVESTMENT_SLOTS}
      holdings={INVESTOR_HOLDINGS}
    />
  );
}
