import type { Metadata } from "next";
import OpenSlotsSection from "@/components/dashboard/OpenSlotsSection";
import { INVESTMENT_SLOTS } from "@/lib/investmentSlots";

export const metadata: Metadata = {
  title: "Investment | AUREX",
  description: "Open AUREX investment slots available to back.",
};

export default function DashboardInvestmentPage() {
  return <OpenSlotsSection slots={INVESTMENT_SLOTS} />;
}
