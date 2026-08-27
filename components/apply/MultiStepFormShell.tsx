"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { easing, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import type { StepDefinition } from "@/components/apply/types";

/**
 * Generic shell for any multi-step application flow (currently just the
 * Investor Application — see components/apply/investor/ — but built so a
 * future Business Owner application can reuse it with its own step
 * components and its own TValues shape, rather than forking this file).
 *
 * Responsibilities split cleanly from each step:
 *   - This shell owns `values` (the merged form data) and `stepIndex`, so
 *     data survives moving back and forth between steps, and renders the
 *     progress indicator + Back/Continue chrome.
 *   - Each step owns its own fields' rendering, inline errors, and
 *     validation, reporting up only a single "am I valid right now?"
 *     boolean via onValidityChange — the shell never inspects field
 *     values itself.
 *
 * `steps` is whatever's actually implemented so far (currently 2, for the
 * investor flow); `totalSteps` is the true length of the intended flow (6)
 * so the progress bar/"Step X of 6" text is correct even while most of it
 * is still unbuilt — see StepTwoPlaceholder's own comment.
 */
export default function MultiStepFormShell<TValues>({
  steps,
  totalSteps,
  initialValues,
  eyebrow,
}: {
  steps: StepDefinition<TValues>[];
  totalSteps: number;
  initialValues: TValues;
  eyebrow?: string;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<TValues>(initialValues);
  // Reset to false on every navigation (see goBack/goNext) rather than
  // left holding the previous step's answer — the newly-entered step
  // reports its own real validity a moment later via onValidityChange, so
  // "Continue" is never briefly enabled/disabled based on stale state.
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  // Bounds where the actually-implemented steps run out — distinct from
  // "the last step of the real flow" (totalSteps), which may still be
  // further ahead than anything built yet.
  const isLastImplementedStep = stepIndex === steps.length - 1;

  const updateValues = useCallback((patch: Partial<TValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleValidityChange = useCallback((valid: boolean) => {
    setIsCurrentStepValid(valid);
  }, []);

  const goBack = () => {
    if (isFirstStep) return;
    setIsCurrentStepValid(false);
    setStepIndex((i) => i - 1);
  };

  const goNext = () => {
    if (!isCurrentStepValid || isLastImplementedStep) return;
    setIsCurrentStepValid(false);
    setStepIndex((i) => i + 1);
  };

  const canGoNext = isCurrentStepValid && !isLastImplementedStep;

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex w-full max-w-xl flex-col gap-8">
        {/* Minimal header — no site Navbar here on purpose. This is a
            focused application flow, not a marketing page, and the brief
            calls for keeping friction low; a full nav (with its own CTA
            and links away from the flow) works against that. Just the
            logo and a plain way back out. */}
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="AUREX home">
            <BrandMark variant="nav" />
          </Link>
          <Link
            href="/"
            className="font-sans text-sm text-cream-dim transition-colors hover:text-gold-light"
          >
            Exit
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {eyebrow && (
            <p className="font-jakarta text-xs font-medium uppercase tracking-[1.8px] text-gold-muted">
              {eyebrow}
            </p>
          )}
          <div className="flex items-center justify-between gap-4">
            <span className="font-sans text-sm font-medium text-cream-dim">
              Step {stepIndex + 1} of {totalSteps}
            </span>
            <span className="font-sans text-sm font-medium text-cream-dim">{currentStep.label}</span>
          </div>
          <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  i <= stepIndex ? "bg-gold" : "bg-grid-line"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8">
          {/* mode="wait" + key={currentStep.id}: each step fully unmounts
              before the next mounts, so a step's own internal state
              (touched fields, etc.) never bleeds into a different step
              that happens to reuse the same field names. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: easing.smooth }}
            >
              {currentStep.render({ values, updateValues, onValidityChange: handleValidityChange })}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-grid-line pt-6">
            <motion.button
              {...(isFirstStep ? {} : hoverScale)}
              type="button"
              onClick={goBack}
              disabled={isFirstStep}
              className="font-jakarta text-sm font-medium text-cream-dim transition-colors hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
            >
              Back
            </motion.button>
            <motion.button
              {...(canGoNext ? hoverScale : {})}
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
}
