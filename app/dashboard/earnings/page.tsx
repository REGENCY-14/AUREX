import type { Metadata } from "next";
import Link from "next/link";
import EarningsSection from "@/components/dashboard/EarningsSection";
import { ArrowUpRightIcon } from "@/components/icons";
import { INVESTOR_HOLDINGS } from "@/lib/investorPortfolio";

export const metadata: Metadata = {
  title: "Earnings | AUREX",
  description: "Track earnings recorded against your AUREX investments.",
};

export default function DashboardEarningsPage() {
  return (
    <div className="flex flex-col gap-8">
      <EarningsSection holdings={INVESTOR_HOLDINGS} />

      {/* Transaction history / statements — genuinely stubbed, not built
          as part of this dashboard. Routed to /coming-soon rather than a
          dead link, the same placeholder every other not-yet-built
          destination on this site already uses. */}
      <div className="flex items-center justify-end border-t border-grid-line pt-6">
        <Link
          href="/coming-soon"
          className="flex items-center gap-1.5 font-jakarta text-sm font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
        >
          Transaction History
          <ArrowUpRightIcon className="size-3" />
        </Link>
      </div>
    </div>
  );
}
