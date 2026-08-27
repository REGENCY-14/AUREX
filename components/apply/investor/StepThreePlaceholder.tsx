"use client";

import { useEffect } from "react";
import type { StepProps } from "@/components/apply/types";
import type { InvestorFormData } from "@/components/apply/investor/types";

/**
 * Stub for Step 3 ("ID Upload") — exists only so MultiStepFormShell's
 * Back/Continue navigation can be exercised end-to-end through Step 2
 * before Step 3 is actually built (per the brief: "Don't build Step 3's
 * real ID upload UI yet — just the placeholder").
 *
 * Always reports itself invalid, same reasoning as StepTwoPlaceholder:
 * there's nothing to fill in yet, so "Continue" should never be able to
 * advance past it. Going Back from here returns to Step 2 with the
 * nickname already entered, since `values` lives in the shell, not in
 * either step.
 */
export default function StepThreePlaceholder({ onValidityChange }: StepProps<InvestorFormData>) {
  useEffect(() => {
    onValidityChange(false);
  }, [onValidityChange]);

  return (
    <div className="flex flex-col items-center gap-3 border border-dashed border-grid-line px-6 py-16 text-center">
      <p className="font-jakarta text-lg font-semibold text-cream">ID Upload — coming next</p>
      <p className="max-w-sm font-sans text-sm text-cream-dim">
        The ID Upload step isn&apos;t built yet — this placeholder exists so the shell&apos;s Back/Continue
        navigation can be tested end-to-end through Step 2. Your Identity &amp; Contact details and nickname are
        preserved if you go back.
      </p>
    </div>
  );
}
