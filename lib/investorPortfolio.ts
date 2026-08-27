/**
 * The logged-in investor's own profile + holdings, for the Investor
 * Dashboard's header stat and "My Earnings" section (see
 * components/dashboard/EarningsSection.tsx). No auth/backend exists yet,
 * so this whole file is mock data shaped like what a real account lookup
 * would return.
 *
 * Every figure on a holding — amount invested, rate applied, earnings to
 * date — is something Admin manually typed in after the fact, not a value
 * this app calculated from the others (there's no automated interest
 * calculation or live payment data yet). `lastUpdated` is when Admin last
 * touched that record, which is also why it can lag behind today's date
 * by a while — nobody's updated it since.
 */

export type InvestorProfile = {
  nickname: string;
};

export const MOCK_INVESTOR: InvestorProfile = {
  nickname: "GoldFalcon",
};

export type HoldingPackage = "core" | "ventures";
export type HoldingStatus = "active" | "matured";

export type InvestmentHolding = {
  id: string;
  package: HoldingPackage;
  /** Only set for Ventures holdings, same reasoning as
   *  InvestmentSlot.businessName in lib/investmentSlots.ts. */
  businessName?: string;
  amountInvestedGhs: number;
  ratePercentLabel: string;
  earningsToDateGhs: number;
  lastUpdated: string;
  status: HoldingStatus;
};

// Swap this array to [] to see EarningsSection's empty state — left
// populated here since the brief asks for 2-3 realistic example holdings.
export const INVESTOR_HOLDINGS: InvestmentHolding[] = [
  {
    id: "holding-core-1",
    package: "core",
    amountInvestedGhs: 5000,
    ratePercentLabel: "8% p.a.",
    earningsToDateGhs: 210,
    lastUpdated: "2026-08-01",
    status: "active",
  },
  {
    id: "holding-ventures-greenharvest",
    package: "ventures",
    businessName: "GreenHarvest Foods",
    amountInvestedGhs: 3000,
    ratePercentLabel: "14% p.a.",
    earningsToDateGhs: 245,
    lastUpdated: "2026-08-15",
    status: "active",
  },
  {
    id: "holding-core-matured",
    package: "core",
    amountInvestedGhs: 2000,
    ratePercentLabel: "7.5% p.a.",
    earningsToDateGhs: 300,
    lastUpdated: "2026-06-30",
    status: "matured",
  },
];
