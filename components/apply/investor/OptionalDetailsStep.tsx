"use client";

import { useEffect } from "react";
import {
  INVESTMENT_RANGE_OPTIONS,
  SOURCE_OF_FUNDS_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
  type SelectOption,
} from "@/lib/optionalDetails";
import { FormField, fieldClassName, optionStyle } from "@/components/apply/FormField";
import { ChevronDownIcon } from "@/components/icons";
import type { StepProps } from "@/components/apply/types";
import type { InvestorFormData } from "@/components/apply/investor/types";

// Small local helper so the three selects below (identical shape: a
// placeholder option + a flat list, same chevron/appearance-none
// treatment already used by Step 1's country dropdown and Step 3's ID
// type dropdown) don't triplicate the same markup.
function ChevronSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClassName(false, "w-full appearance-none pr-10")}
      >
        <option value="" style={optionStyle}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} style={optionStyle}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-3 -translate-y-1/2 text-gold-bright" />
    </div>
  );
}

/**
 * Step 4 of 6 — "Optional Details". Every field here is genuinely
 * optional (per the brief), which changes this step's shape compared to
 * Steps 1-3 in two ways:
 *   - It reports itself valid once, on mount, and never re-evaluates —
 *     there's no combination of these three selects that could ever make
 *     "Continue" need to disable itself.
 *   - MultiStepFormShell renders a separate "Skip this step" action next
 *     to Continue for it (see this step's `skippable: true` in
 *     InvestorApplication.tsx), so skipping is its own visible, honest
 *     action rather than an unlabeled Continue the applicant has to
 *     realize is optional on their own.
 *
 * De-emphasis (per the brief's design direction) is handled with a
 * subtle "Optional" badge next to the heading and "(optional)" appended
 * to each field's own label — the same wording Step 3's ID Type field
 * already uses for its one optional field — rather than a separate
 * lighter color treatment invented just for this step.
 */
export default function OptionalDetailsStep({ values, updateValues, onValidityChange }: StepProps<InvestorFormData>) {
  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Optional Details</h1>
          <span className="inline-flex items-center rounded-full border border-grid-line px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide text-cream-dim">
            Optional
          </span>
        </div>
        <p className="font-sans text-sm text-cream-dim sm:text-base">
          These details are optional, but help us prepare for our conversation with you. Feel free to skip
          anything you&apos;d rather not share yet.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <FormField label="Intended Investment Range (optional)" htmlFor="investmentRange">
          <ChevronSelect
            id="investmentRange"
            value={values.investmentRange}
            onChange={(value) => updateValues({ investmentRange: value })}
            options={INVESTMENT_RANGE_OPTIONS}
            placeholder="Select a range"
          />
        </FormField>

        <FormField
          label="Source of Funds (optional)"
          htmlFor="sourceOfFunds"
          hint="This is a simple declaration: no documentation needed at this stage."
        >
          <ChevronSelect
            id="sourceOfFunds"
            value={values.sourceOfFunds}
            onChange={(value) => updateValues({ sourceOfFunds: value })}
            options={SOURCE_OF_FUNDS_OPTIONS}
            placeholder="Select a source"
          />
        </FormField>

        <FormField label="How Did You Hear About AUREX? (optional)" htmlFor="referralSource">
          <ChevronSelect
            id="referralSource"
            value={values.referralSource}
            onChange={(value) => updateValues({ referralSource: value })}
            options={REFERRAL_SOURCE_OPTIONS}
            placeholder="Select an option"
          />
        </FormField>
      </div>
    </div>
  );
}
