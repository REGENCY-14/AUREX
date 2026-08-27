import type { CSSProperties, ReactNode } from "react";

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
/**
 * `color-scheme` (see globals.css) fixes a <select>'s native option-list
 * popup from being unreadable (light popup under our light `cream` text),
 * but it only buys generic OS dark/light chrome — not AUREX's own ink/gold
 * palette. Chromium and Firefox both render an <option>'s own
 * background-color/color in that popup (a long-supported way to theme
 * native selects), so every <option> across the apply flow spreads this
 * to actually match the surrounding design instead of a generic dark gray.
 * Reads the same CSS custom properties the rest of the theme does, so it
 * flips automatically with the light/dark toggle — no separate `light:`
 * variant needed here.
 */
export const optionStyle: CSSProperties = {
  backgroundColor: "var(--color-ink)",
  color: "var(--color-cream)",
};

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
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-cream-dim">
        {label}
      </label>
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
