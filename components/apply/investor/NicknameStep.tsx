"use client";

import { useEffect, useState } from "react";
import { getNicknameFormatError, isNicknameAvailable, NICKNAME_MAX_LENGTH } from "@/lib/nickname";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import { TrendFlatIcon } from "@/components/icons";
import type { StepProps } from "@/components/apply/types";
import type { InvestorFormData } from "@/components/apply/investor/types";

// Placeholder rank/points for the live preview only — this step doesn't
// know (and shouldn't guess) the applicant's real future leaderboard
// standing, it's just demonstrating the row shape their nickname will
// appear in. Matches Leaderboard.tsx's own initials logic exactly
// (first two characters of the nickname, uppercased) rather than a
// different scheme invented just for this preview.
const PREVIEW_RANK = 12;
const PREVIEW_POINTS = "1,240";

/**
 * Step 2 of 6 — "Nickname / Display Name". A single required field, but
 * with two things Step 1's fields don't need:
 *   - A live preview (a mock Leaderboard row) so the applicant sees
 *     exactly how the name they're typing will actually appear on the
 *     platform, before committing to it.
 *   - A two-part validity check: getNicknameFormatError runs synchronously
 *     on every keystroke (length, characters, impersonation guard);
 *     isNicknameAvailable is an async stub for the uniqueness check a real
 *     backend will eventually own (see lib/nickname.ts) — there isn't one
 *     yet, so it always resolves available, but the call site is already
 *     wired so swapping in a real API call later only means changing that
 *     function's body.
 */
export default function NicknameStep({ values, updateValues, onValidityChange }: StepProps<InvestorFormData>) {
  const [touched, setTouched] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const formatError = getNicknameFormatError(values.nickname);

  useEffect(() => {
    // Format already invalid — no point spending an availability check
    // (real or stubbed) on a nickname that can't be used anyway. Not
    // resetting `isAvailable` here is fine, not just lazy: both `isValid`
    // and `availabilityError` below already gate on `!formatError` first,
    // so a stale `isAvailable` value from before the format broke can
    // never leak into what the user sees.
    if (formatError) return;

    let cancelled = false;
    isNicknameAvailable(values.nickname).then((available) => {
      if (!cancelled) setIsAvailable(available);
    });
    return () => {
      cancelled = true;
    };
  }, [values.nickname, formatError]);

  const availabilityError = !formatError && isAvailable === false ? "That nickname is already taken." : null;
  const error = formatError ?? availabilityError;
  const isValid = !formatError && isAvailable === true;

  useEffect(() => {
    onValidityChange(isValid);
    // Only isValid should re-trigger this — see IdentityContactStep's
    // identical pattern/reasoning for why onValidityChange itself isn't a
    // dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const trimmed = values.nickname.trim();
  const previewName = trimmed || "Your Nickname";
  const previewInitials = trimmed.slice(0, 2).toUpperCase() || "—";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Nickname / Display Name</h1>
        {/* Deliberately smaller/more muted than Step 1's intro paragraph —
            per the brief, this copy is context for the field below it,
            not the focus of the step. */}
        <p className="max-w-lg font-sans text-xs leading-5 text-cream-dim/80">
          Choose a nickname — this is what other members will see instead of your real name, anywhere your
          identity appears on AUREX (members list, leaderboard, etc.). Your real name stays private and is only
          visible to AUREX admin.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <FormField
          label="Nickname"
          htmlFor="nickname"
          error={touched ? error : null}
          hint={`${trimmed.length}/${NICKNAME_MAX_LENGTH} characters`}
        >
          <input
            id="nickname"
            name="nickname"
            type="text"
            required
            maxLength={NICKNAME_MAX_LENGTH}
            autoComplete="off"
            value={values.nickname}
            onChange={(e) => updateValues({ nickname: e.target.value })}
            onBlur={() => setTouched(true)}
            placeholder="GoldFalcon"
            className={fieldClassName(touched && !!error)}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <span className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-cream-dim">
            Preview
          </span>
          <p className="font-sans text-xs text-cream-dim/70">This is how you&apos;ll appear on the Investor Leaderboard.</p>

          {/* Mirrors Leaderboard.tsx's own "ranks 4-10" row exactly (same
              classes, same initials logic) rather than a one-off preview
              style, so what's shown here is a true preview of the real
              component, not an approximation of it. */}
          <div className="border border-gold/20 bg-panel/40 p-4">
            <div className="flex items-center gap-4">
              <span className="w-6 shrink-0 font-geist text-sm font-semibold text-cream-dim">{PREVIEW_RANK}</span>

              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-[#3d392f] light:bg-[#eee]">
                <span className="font-jakarta text-xs font-bold text-gold-bright">{previewInitials}</span>
              </div>

              <span
                className={`flex-1 truncate font-jakarta text-sm font-medium sm:text-base ${
                  trimmed ? "text-cream" : "italic text-cream-dim"
                }`}
              >
                {previewName}
              </span>

              <span className="shrink-0 font-jakarta text-sm font-semibold text-gold-bright sm:text-base">
                {PREVIEW_POINTS} <span className="text-xs font-normal text-cream-dim">pts</span>
              </span>

              <span className="flex w-14 shrink-0 items-center justify-end gap-1 text-neutral-500">
                <TrendFlatIcon className="size-2.5" />
                <span className="font-geist text-xs">Holding</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
