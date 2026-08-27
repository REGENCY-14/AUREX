import type { ReactNode } from "react";

/**
 * Shared contract between MultiStepFormShell and every step it renders.
 * The shell owns `values` (so data survives moving back/forward across
 * steps) and only ever hands a step its own updater + validity reporter —
 * a step never needs to know about the shell's navigation, and the shell
 * never needs to know a given step's field-level validation rules.
 */
export type StepProps<TValues> = {
  values: TValues;
  updateValues: (patch: Partial<TValues>) => void;
  /**
   * A step calls this (typically from a useEffect over its own fields)
   * whenever whether-it's-complete changes. The shell uses the latest
   * value to enable/disable "Continue" — it never validates a step's
   * fields itself.
   */
  onValidityChange: (isValid: boolean) => void;
};

export type StepDefinition<TValues> = {
  /** Stable id, used as the React key when switching steps (so a step's
   *  own internal state/effects reliably reset on entry rather than
   *  bleeding over from whatever the previous step left behind). */
  id: string;
  /** Shown in the shell's progress row (e.g. "Identity & Contact"). */
  label: string;
  render: (props: StepProps<TValues>) => ReactNode;
};
