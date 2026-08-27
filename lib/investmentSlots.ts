/**
 * "Open Investment Slots" for the Investor Dashboard — investment
 * opportunities Admin has published (see
 * components/dashboard/OpenSlotsSection.tsx). No Admin-side publishing
 * tool exists yet (that's separate Admin-side work), so this is realistic
 * mock data shaped exactly like what that tool would eventually produce:
 * a package type, a business name only when that package is Ventures, and
 * the handful of figures Admin would type in when opening a slot — a
 * minimum, a term, an availability window, and a rate. `status` is set by
 * Admin directly (open/closed), not derived from comparing `closesAt` to
 * "now" — this dashboard doesn't run its own open/closed logic, it just
 * displays whatever the (eventually real) data says, same as everywhere
 * else on this screen.
 */

import { formatDisplayDate } from "@/lib/formatters";

export type SlotPackage = "core" | "ventures";
export type SlotStatus = "open" | "closed";

export const SLOT_PACKAGE_LABEL: Record<SlotPackage, string> = {
  core: "AUREX Core",
  ventures: "AUREX Ventures",
};

export type InvestmentSlot = {
  id: string;
  package: SlotPackage;
  /** Only set for Ventures slots — the specific business the slot raises
   *  funds for. Core slots pool into AUREX itself, so there's no single
   *  business to name. */
  businessName?: string;
  minInvestmentGhs: number;
  termLabel: string;
  opensAt: string;
  closesAt: string;
  /** e.g. "12% p.a." — Admin's own figure, not something computed from a
   *  rate + term. */
  ratePercentLabel: string;
  status: SlotStatus;
};

export const INVESTMENT_SLOTS: InvestmentSlot[] = [
  {
    id: "core-q2-2026",
    package: "core",
    minInvestmentGhs: 500,
    termLabel: "6-month term",
    opensAt: "2026-02-01",
    closesAt: "2026-03-30",
    ratePercentLabel: "8% p.a.",
    status: "open",
  },
  {
    id: "ventures-greenharvest",
    package: "ventures",
    businessName: "GreenHarvest Foods",
    minInvestmentGhs: 2000,
    termLabel: "12-month term",
    opensAt: "2026-02-10",
    closesAt: "2026-04-15",
    ratePercentLabel: "14% p.a.",
    status: "open",
  },
  {
    id: "ventures-atlasfreight",
    package: "ventures",
    businessName: "Atlas Freight Logistics",
    minInvestmentGhs: 1500,
    termLabel: "9-month term",
    opensAt: "2025-11-01",
    closesAt: "2025-12-20",
    ratePercentLabel: "11% p.a.",
    status: "closed",
  },
];

/** "Open until 30 Mar 2026" / "Closed on 20 Dec 2025" — reads off `status`
 *  and `closesAt` as given, doesn't decide open/closed itself. */
export function getSlotWindowLabel(slot: InvestmentSlot): string {
  return slot.status === "closed"
    ? `Closed on ${formatDisplayDate(slot.closesAt)}`
    : `Open until ${formatDisplayDate(slot.closesAt)}`;
}
