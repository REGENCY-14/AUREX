/**
 * The Report tab shared by both dashboards (see
 * components/dashboard/ReportSection.tsx) — a member flagging a problem
 * or asking Admin a question, not a support ticket system with its own
 * backend. No Admin-side tool exists yet to receive/answer these (same
 * situation as lib/investmentSlots.ts and lib/businessListing.ts on their
 * own sides), so this file is mock data shaped like what a real report
 * lookup would return, plus a stubbed submit call.
 */

import type { SelectOption } from "@/lib/optionalDetails";
import { formatGhs } from "@/lib/formatters";
import { SLOT_PACKAGE_LABEL } from "@/lib/investmentSlots";
import type { InvestmentHolding } from "@/lib/investorPortfolio";
import type { BusinessListing } from "@/lib/businessListing";

export type ReportRole = "investor" | "business";
export type ReportPriority = "low" | "medium" | "high";
export type ReportStatus = "open" | "in-progress" | "resolved";

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
};

// Category lists straight from the brief, one per role — a category
// meaningful to an Investor (e.g. "Leaderboard issue") isn't necessarily
// meaningful to a Business Owner and vice versa, so ReportSection picks
// between these by its `role` prop rather than showing one combined list.
export const INVESTOR_REPORT_CATEGORIES: SelectOption[] = [
  { value: "investment-not-showing", label: "Investment not showing on dashboard" },
  { value: "incorrect-earnings", label: "Incorrect earnings figure" },
  { value: "admin-whatsapp-issue", label: "Issue with Admin/WhatsApp communication" },
  { value: "payment-proof-dispute", label: "Proof of payment dispute" },
  { value: "leaderboard-issue", label: "Leaderboard issue" },
  { value: "account-issue", label: "Account issue" },
  { value: "other", label: "Other" },
];

export const BUSINESS_REPORT_CATEGORIES: SelectOption[] = [
  { value: "funding-not-updating", label: "Funding progress not updating" },
  { value: "listing-info-incorrect", label: "Listing information incorrect" },
  { value: "admin-issue", label: "Issue with Admin communication" },
  { value: "account-issue", label: "Account issue" },
  { value: "other", label: "Other" },
];

export const REPORT_PRIORITY_OPTIONS: { value: ReportPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

// Sentinel "related record" value for "Not related to a specific record" —
// always the first option and the default selection, ahead of whatever
// role-specific records ReportSection is given.
export const NOT_RELATED_VALUE = "none";
export const NOT_RELATED_OPTION: SelectOption = { value: NOT_RELATED_VALUE, label: "Not related to a specific record" };

/** An Investor's own recorded holdings, as "related record" choices — e.g.
 *  "GreenHarvest Foods — GHS 3,000". Same title logic as HoldingRow's own
 *  (businessName for a Ventures holding, the package label otherwise). */
export function getInvestorRelatedRecordOptions(holdings: InvestmentHolding[]): SelectOption[] {
  return holdings.map((h) => ({
    value: h.id,
    label: `${h.businessName ?? SLOT_PACKAGE_LABEL[h.package]} — ${formatGhs(h.amountInvestedGhs)}`,
  }));
}

/** A Business Owner only ever has the one listing, so this is a single
 *  option naming it — still routed through the same "related record"
 *  dropdown (rather than assumed automatically) so a report about
 *  something else entirely can still pick "Not related to a specific
 *  record" instead. */
export function getBusinessRelatedRecordOptions(listing: BusinessListing): SelectOption[] {
  return [{ value: "listing", label: listing.businessName }];
}

export type AdminReply = {
  message: string;
  respondedAt: string;
};

export type Report = {
  id: string;
  categoryLabel: string;
  /** Null means "Not related to a specific record" was chosen. */
  relatedRecordLabel: string | null;
  subject: string;
  description: string;
  priorityLabel: string;
  /** Just the file's name — there's no real file storage yet, same
   *  "stub the submission" situation as everything else in this file. */
  attachmentName: string | null;
  status: ReportStatus;
  submittedAt: string;
  adminReply: AdminReply | null;
};

// One resolved (with an Admin reply) and one open (without one) example
// per role, per the brief — enough to demonstrate both states of "My
// Reports" without a real backend to fetch them from.
export const MOCK_REPORTS: Record<ReportRole, Report[]> = {
  investor: [
    {
      id: "report-investor-open-1",
      categoryLabel: "Incorrect earnings figure",
      relatedRecordLabel: "AUREX Core — GHS 5,000",
      subject: "Earnings figure looks off for my Core holding",
      description:
        "My Core holding's earnings to date still shows GHS 210, but I was told last week it had been updated after this quarter's payout. Could someone double check the figure?",
      priorityLabel: "Medium",
      attachmentName: null,
      status: "open",
      submittedAt: "2026-08-24",
      adminReply: null,
    },
    {
      id: "report-investor-resolved-1",
      categoryLabel: "Investment not showing on dashboard",
      relatedRecordLabel: "GreenHarvest Foods — GHS 3,000",
      subject: "Missing GreenHarvest Ventures investment",
      description:
        "I invested GHS 3,000 into the GreenHarvest Foods Ventures slot two weeks ago (confirmed by WhatsApp with Admin), but it never showed up under My Earnings until today.",
      priorityLabel: "High",
      attachmentName: "payment-confirmation.pdf",
      status: "resolved",
      submittedAt: "2026-08-10",
      adminReply: {
        message:
          "Thanks for flagging this — your GreenHarvest Ventures holding had been recorded under the wrong account. It's now corrected and showing under My Earnings with the right figures. Sorry for the delay!",
        respondedAt: "2026-08-12",
      },
    },
  ],
  business: [
    {
      id: "report-business-open-1",
      categoryLabel: "Listing information incorrect",
      relatedRecordLabel: "GreenHarvest Foods",
      subject: "Typo in our funding purpose text",
      description:
        "The funding purpose on our live listing still says \"a second cold-storage facility\" but we finalized plans for two facilities last month. Can this be updated?",
      priorityLabel: "Low",
      attachmentName: null,
      status: "open",
      submittedAt: "2026-08-22",
      adminReply: null,
    },
    {
      id: "report-business-resolved-1",
      categoryLabel: "Funding progress not updating",
      relatedRecordLabel: "GreenHarvest Foods",
      subject: "Funding total hasn't moved in two weeks",
      description:
        "We know of at least two new backers from the last two weeks, but the funding progress bar on our dashboard still shows the same total as before. Is there a delay on Admin's side?",
      priorityLabel: "Medium",
      attachmentName: "backer-list-screenshot.png",
      status: "resolved",
      submittedAt: "2026-08-05",
      adminReply: {
        message:
          "You're right — those two backers' payments were confirmed but hadn't been posted to your listing yet. Your funding total is now up to date; sorry for the confusion.",
        respondedAt: "2026-08-07",
      },
    },
  ],
};

export type SubmitReportInput = {
  categoryLabel: string;
  relatedRecordLabel: string | null;
  subject: string;
  description: string;
  priorityLabel: string;
  attachmentName: string | null;
};

/**
 * Stub for the real "submit a report to Admin" API call — no backend
 * exists yet. Waits like a real request would, then resolves with a
 * freshly-minted Open report most of the time; the rest of the time it
 * rejects, so ReportSection's own inline error + Retry path has a real
 * failure to demonstrate rather than only ever succeeding. Retrying calls
 * this again with the same entered values, exactly like retrying a real
 * flaky request would.
 */
export async function submitReport(input: SubmitReportInput): Promise<Report> {
  await new Promise((resolve) => window.setTimeout(resolve, 900));

  if (Math.random() < 0.3) {
    throw new Error("Something went wrong submitting your report.");
  }

  return {
    id: `report-${Date.now()}`,
    categoryLabel: input.categoryLabel,
    relatedRecordLabel: input.relatedRecordLabel,
    subject: input.subject,
    description: input.description,
    priorityLabel: input.priorityLabel,
    attachmentName: input.attachmentName,
    status: "open",
    submittedAt: new Date().toISOString().slice(0, 10),
    adminReply: null,
  };
}
