/**
 * A Business Owner's own listing, for the Business Owner Dashboard (see
 * components/dashboard/business/). No Admin-side tool exists yet to
 * publish/manage listings (separate work, same situation as
 * lib/investmentSlots.ts on the Investor side) — this is mock data shaped
 * like what a real listing lookup would return, one record per status so
 * every state the brief asks for (pending/live/funded/closed) can be
 * previewed. `status` is set by Admin directly; nothing here decides it.
 *
 * Every figure is something Admin would have recorded after the fact
 * (funding raised, backer count), not calculated live — same reasoning as
 * the Investor Dashboard's own mock data. The one derived value,
 * getFundingPercent, is plain presentation math (raised ÷ goal, for the
 * progress bar) the brief itself asks for, not a stand-in for real payment
 * data.
 */

export type ListingStatus = "pending" | "live" | "funded" | "closed";

export const LISTING_STATUS_LABEL: Record<ListingStatus, string> = {
  pending: "Pending Review",
  live: "Live",
  funded: "Funded",
  closed: "Closed",
};

export type BusinessListing = {
  businessName: string;
  ownerNickname: string;
  /** The owner's real name — same reasoning as InvestorProfile.realName
   *  (lib/investorPortfolio.ts): the dashboard itself only ever shows the
   *  nickname, but the Report tab's read-only identity block needs both. */
  ownerRealName: string;
  /** What the business does — public pitch copy, exactly as approved. */
  description: string;
  /** What this round of funding specifically goes toward — kept separate
   *  from `description` since the dashboard shows them as their own
   *  fields (the application flow collects both as one combined pitch;
   *  Admin can split them out once a listing is actually published). */
  fundingPurpose: string;
  fundingGoalGhs: number;
  amountRaisedGhs: number;
  /** Aggregate count only — never a list of who they are, per the brief. */
  backerCount: number;
  status: ListingStatus;
};

export const MOCK_LISTINGS: Record<ListingStatus, BusinessListing> = {
  pending: {
    businessName: "GreenHarvest Foods",
    ownerNickname: "HarvestHQ",
    ownerRealName: "Ama Boateng",
    description:
      "GreenHarvest Foods packages and distributes locally-grown produce across Accra, working directly with smallholder farmers.",
    fundingPurpose: "A second cold-storage facility to serve two new markets.",
    fundingGoalGhs: 50000,
    amountRaisedGhs: 0,
    backerCount: 0,
    status: "pending",
  },
  live: {
    businessName: "GreenHarvest Foods",
    ownerNickname: "HarvestHQ",
    ownerRealName: "Ama Boateng",
    description:
      "GreenHarvest Foods packages and distributes locally-grown produce across Accra, working directly with smallholder farmers.",
    fundingPurpose: "A second cold-storage facility to serve two new markets.",
    fundingGoalGhs: 50000,
    amountRaisedGhs: 32000,
    backerCount: 14,
    status: "live",
  },
  funded: {
    businessName: "GreenHarvest Foods",
    ownerNickname: "HarvestHQ",
    ownerRealName: "Ama Boateng",
    description:
      "GreenHarvest Foods packages and distributes locally-grown produce across Accra, working directly with smallholder farmers.",
    fundingPurpose: "A second cold-storage facility to serve two new markets.",
    fundingGoalGhs: 50000,
    amountRaisedGhs: 50000,
    backerCount: 23,
    status: "funded",
  },
  closed: {
    businessName: "GreenHarvest Foods",
    ownerNickname: "HarvestHQ",
    ownerRealName: "Ama Boateng",
    description:
      "GreenHarvest Foods packages and distributes locally-grown produce across Accra, working directly with smallholder farmers.",
    fundingPurpose: "A second cold-storage facility to serve two new markets.",
    fundingGoalGhs: 50000,
    amountRaisedGhs: 21000,
    backerCount: 9,
    status: "closed",
  },
};

/** Whole-percent progress toward the funding goal, capped at 100 — plain
 *  presentation math for the progress bar, not a stand-in for real
 *  payment/interest data (see this file's own comment). */
export function getFundingPercent(listing: BusinessListing): number {
  if (listing.fundingGoalGhs <= 0) return 0;
  return Math.min(100, Math.round((listing.amountRaisedGhs / listing.fundingGoalGhs) * 100));
}

const VALID_STATUSES: ListingStatus[] = ["pending", "live", "funded", "closed"];

/** Reads `status` straight off the URL as a stub data source, same
 *  reasoning as lib/applicationStatusParams.ts — there's no backend/auth
 *  yet to look a listing up for real, so /business-dashboard?status=pending
 *  etc. is how each of the other three states gets previewed. Defaults to
 *  "live": reaching this dashboard at all (e.g. via the Login flow's
 *  Business Owner form) assumes Admin has already approved both the
 *  application and the listing itself, so a bare /business-dashboard
 *  should show an active, fully-populated listing rather than the mostly-
 *  empty pending view. */
export function parseListingStatus(value: string | string[] | undefined): ListingStatus {
  const first = Array.isArray(value) ? value[0] : value;
  return (VALID_STATUSES as string[]).includes(first ?? "") ? (first as ListingStatus) : "live";
}
