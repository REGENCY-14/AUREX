"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";
import { formatDisplayDate } from "@/lib/formatters";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import CustomSelect from "@/components/apply/CustomSelect";
import DocumentUploadField from "@/components/apply/DocumentUploadField";
import { ChevronDownIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth/AuthContext";
import type { SelectOption } from "@/lib/optionalDetails";
import {
  INVESTOR_REPORT_CATEGORIES,
  BUSINESS_REPORT_CATEGORIES,
  REPORT_PRIORITY_OPTIONS,
  REPORT_STATUS_LABEL,
  NOT_RELATED_VALUE,
  NOT_RELATED_OPTION,
  submitReport,
  type Report,
  type ReportRole,
  type ReportPriority,
  type ReportStatus,
} from "@/lib/reports";

// Tone per status — same "gold for actionable, green for a good/finished
// outcome, neutral otherwise" convention as ListingStatusSection's own
// STATUS_TONE, reused here rather than inventing a fourth color scheme.
const STATUS_TONE: Record<ReportStatus, string> = {
  open: "border-grid-line text-cream-dim",
  "in-progress": "border-gold/30 text-gold-bright",
  resolved: "border-[#4ade80]/30 text-[#4ade80]",
};

function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide ${STATUS_TONE[status]}`}
    >
      {REPORT_STATUS_LABEL[status]}
    </span>
  );
}

/** One row of "My Reports" — collapsed to subject/category/status/date,
 *  expanding on click to the full submitted detail plus Admin's reply
 *  once one exists. Same click-to-expand pattern as Faq.tsx's own
 *  accordion, just with richer content in the expanded panel. */
function ReportRow({ report }: { report: Report }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-grid-line py-4 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-jakarta text-sm font-semibold text-cream">{report.subject}</span>
            <StatusBadge status={report.status} />
          </div>
          <span className="font-sans text-xs text-cream-dim">
            {report.categoryLabel} · Submitted {formatDisplayDate(report.submittedAt)}
          </span>
        </div>
        <ChevronDownIcon
          className={`size-3 shrink-0 text-gold-bright transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-4 border-t border-grid-line pt-4">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Description</span>
            <p className="font-sans text-sm text-cream">{report.description}</p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Related Record</span>
              <span className="font-jakarta text-sm font-medium text-cream">
                {report.relatedRecordLabel ?? "Not related to a specific record"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Priority</span>
              <span className="font-jakarta text-sm font-medium text-cream">{report.priorityLabel}</span>
            </div>
            {report.attachmentName && (
              <div className="flex flex-col gap-0.5">
                <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Attachment</span>
                <span className="font-jakarta text-sm font-medium text-cream">{report.attachmentName}</span>
              </div>
            )}
          </div>

          {report.adminReply ? (
            <div className="flex flex-col gap-1.5 border border-gold/20 bg-gold/5 p-4">
              <span className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-gold-muted">
                Admin Response · {formatDisplayDate(report.adminReply.respondedAt)}
              </span>
              <p className="font-sans text-sm text-cream">{report.adminReply.message}</p>
            </div>
          ) : (
            <p className="font-sans text-xs text-cream-dim">Admin hasn&apos;t responded yet. Check back soon.</p>
          )}
        </div>
      )}
    </div>
  );
}

type ReportSectionProps = {
  role: ReportRole;
  /** Used only when there's no real signed-in nickname/name yet (see
   *  useAuth's own `nickname ?? MOCK_INVESTOR.nickname` fallback every
   *  other dashboard screen already applies) — same mock-account
   *  situation, just centralized here instead of repeated per page. */
  fallbackNickname: string;
  fallbackRealName: string;
  /** Built by the page itself from that role's own mock data — see
   *  lib/reports.ts's getInvestorRelatedRecordOptions /
   *  getBusinessRelatedRecordOptions — so this component doesn't need to
   *  know how each role's records are shaped, only how to list them. */
  relatedRecordOptions: SelectOption[];
  initialReports: Report[];
};

/**
 * The "Report" tab — one component shared by both dashboards (a role
 * prop, not a role-specific copy, per the brief), submitting a report or
 * complaint to Admin plus the member's own report history. Nickname and
 * real name come from the logged-in account (via context, same pattern
 * every other dashboard screen uses) and are shown read-only, never
 * re-entered.
 */
export default function ReportSection({
  role,
  fallbackNickname,
  fallbackRealName,
  relatedRecordOptions,
  initialReports,
}: ReportSectionProps) {
  const { user } = useAuth();
  const nickname = user?.nickname ?? fallbackNickname;
  const realName = [user?.firstname, user?.lastname].filter(Boolean).join(" ") || fallbackRealName;

  const categoryOptions = role === "investor" ? INVESTOR_REPORT_CATEGORIES : BUSINESS_REPORT_CATEGORIES;

  const [category, setCategory] = useState("");
  const [relatedRecord, setRelatedRecord] = useState<string>(NOT_RELATED_VALUE);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ReportPriority>("medium");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [reports, setReports] = useState<Report[]>(initialReports);

  const isValid = category !== "" && subject.trim() !== "" && description.trim() !== "";

  const attemptSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const categoryLabel = categoryOptions.find((c) => c.value === category)?.label ?? category;
      const relatedRecordLabel =
        relatedRecord === NOT_RELATED_VALUE
          ? null
          : (relatedRecordOptions.find((r) => r.value === relatedRecord)?.label ?? null);
      const priorityLabel = REPORT_PRIORITY_OPTIONS.find((p) => p.value === priority)?.label ?? priority;

      const created = await submitReport({
        categoryLabel,
        relatedRecordLabel,
        subject: subject.trim(),
        description: description.trim(),
        priorityLabel,
        attachmentName: attachment?.name ?? null,
      });

      setReports((prev) => [created, ...prev]);
      setCategory("");
      setRelatedRecord(NOT_RELATED_VALUE);
      setSubject("");
      setDescription("");
      setPriority("medium");
      setAttachment(null);
      setTouched(false);
      setJustSubmitted(true);
      window.setTimeout(() => setJustSubmitted(false), 4000);
    } catch {
      setSubmitError("Something went wrong submitting your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || submitting) return;
    void attemptSubmit();
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">Submit a Report</h2>
          <p className="font-sans text-sm text-cream-dim">
            Flag a problem or ask AUREX Admin a question. They&apos;ll respond here once they&apos;ve looked into it.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-y border-grid-line py-4">
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Nickname</span>
            <span className="font-jakarta text-sm font-medium text-cream">{nickname}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Name</span>
            <span className="font-jakarta text-sm font-medium text-cream">{realName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Category"
              htmlFor="report-category"
              error={touched && category === "" ? "Select a category." : null}
            >
              <CustomSelect
                id="report-category"
                value={category}
                onChange={setCategory}
                onBlur={() => setTouched(true)}
                options={categoryOptions}
                placeholder="Select a category"
                hasError={touched && category === ""}
                triggerClassName="w-full"
              />
            </FormField>

            <FormField label="Related Record (optional)" htmlFor="report-related-record">
              <CustomSelect
                id="report-related-record"
                value={relatedRecord}
                onChange={setRelatedRecord}
                options={[NOT_RELATED_OPTION, ...relatedRecordOptions]}
                triggerClassName="w-full"
              />
            </FormField>
          </div>

          <FormField
            label="Subject"
            htmlFor="report-subject"
            error={touched && subject.trim() === "" ? "Enter a short subject." : null}
          >
            <input
              id="report-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="e.g. Earnings figure looks off for my Core holding"
              className={fieldClassName(touched && subject.trim() === "")}
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="report-description"
            error={touched && description.trim() === "" ? "Tell us what happened." : null}
          >
            <textarea
              id="report-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="What happened, and when? Include any details that would help Admin look into it."
              className={fieldClassName(touched && description.trim() === "", "min-h-24 resize-y")}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <DocumentUploadField
              id="report-attachment"
              label="Attachment (optional)"
              hint="Screenshot or PDF, up to 10MB."
              file={attachment}
              onFileSelected={setAttachment}
              onRemove={() => setAttachment(null)}
            />

            <FormField label="Priority" htmlFor="report-priority">
              <CustomSelect
                id="report-priority"
                value={priority}
                onChange={(v) => setPriority(v as ReportPriority)}
                options={REPORT_PRIORITY_OPTIONS}
                triggerClassName="w-full"
              />
            </FormField>
          </div>

          {submitError && (
            <div className="flex flex-wrap items-center justify-between gap-3 border border-[#f87171]/30 bg-[#f87171]/5 px-4 py-3">
              <p role="alert" className="font-sans text-xs text-[#f87171]">
                {submitError}
              </p>
              <button
                type="button"
                onClick={() => void attemptSubmit()}
                disabled={submitting}
                className="shrink-0 font-jakarta text-xs font-medium text-gold-bright underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                Retry
              </button>
            </div>
          )}

          {justSubmitted && (
            <p className="font-sans text-xs text-[#4ade80]">Report submitted. Admin has been notified.</p>
          )}

          <motion.button
            {...(submitting ? {} : hoverScale)}
            type="submit"
            disabled={!isValid || submitting}
            className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit sm:self-start sm:px-8"
          >
            {submitting ? "Submitting…" : "Submit Report"}
          </motion.button>
        </form>
      </section>

      <section className="flex flex-col gap-4 border border-grid-line bg-panel/20 p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">My Reports</h2>
          <p className="font-sans text-sm text-cream-dim">Reports you&apos;ve previously submitted to Admin.</p>
        </div>

        {reports.length > 0 ? (
          <div className="flex flex-col">
            {reports.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-cream-dim">You haven&apos;t submitted any reports yet.</p>
        )}
      </section>
    </div>
  );
}
