import type { ReactNode } from "react";

/**
 * Shared field chrome for every step's inputs — extracted from
 * IdentityContactStep (Step 1) so Step 2 (and any future step) doesn't
 * re-implement the same label/input/error layout. Same visual language as
 * the rest of the site's forms (ContactForm's border/bg/padding/text),
 * with an error variant on top.
 *
 * #f87171 isn't a new color introduced for this: it's the exact
 * "declining" red Leaderboard.tsx already uses for a negative rank
 * change, reused here so the app doesn't end up with two reds for the
 * same "something's wrong" idea.
 */
export function fieldClassName(hasError: boolean, extra = "") {
  return [
    "border bg-ink-light/20 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-dim/60 outline-none transition-colors light:bg-white/60",
    hasError ? "border-[#f87171] focus:border-[#f87171]" : "border-grid-line focus:border-gold",
    extra,
  ].join(" ");
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  action,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  /** Optional inline label-row action — e.g. LoginForm's "Forgot
   *  password?" link, right-aligned on the same row as the label rather
   *  than floating elsewhere in the form. */
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-cream-dim">
          {label}
        </label>
        {action}
      </div>
      {children}
      {error ? (
        <p role="alert" className="font-sans text-xs text-[#f87171]">
          {error}
        </p>
      ) : hint ? (
        <p className="font-sans text-xs text-cream-dim/70">{hint}</p>
      ) : null}
    </div>
  );
}
