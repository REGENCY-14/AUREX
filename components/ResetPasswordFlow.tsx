"use client";

import { useState, type SVGProps } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";
import { FormField, PasswordInput } from "@/components/apply/FormField";
import { isValidPassword, MIN_PASSWORD_LENGTH } from "@/lib/validation";

function CheckmarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type FieldName = "password" | "confirmPassword";

/**
 * The screen the emailed reset link would point to (ForgotPasswordFlow's
 * "Simulate opening the email link" is the only way to actually reach it
 * in this environment — see that component's own comment). `token` is read
 * but never checked against anything real; there's no backend yet to issue
 * or validate one against, so — same reasoning as loginMock in lib/auth/
 * AuthContext.tsx — this always succeeds rather than modeling a failure
 * mode this app has no way to actually produce. `email`, if present,
 * is shown for context only.
 *
 * Wrapped in <Suspense> by app/reset-password/page.tsx: useSearchParams
 * requires a Suspense boundary for static builds (same reason
 * DashboardTabs.tsx needs one — see that file's own comment).
 */
export default function ResetPasswordFlow() {
  const email = useSearchParams().get("email");
  const [phase, setPhase] = useState<"form" | "done">("form");
  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({ password: false, confirmPassword: false });
  const [submitting, setSubmitting] = useState(false);

  const errors: Record<FieldName, string | null> = {
    password: !values.password
      ? "Enter a new password."
      : !isValidPassword(values.password)
        ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
        : null,
    confirmPassword: !values.confirmPassword
      ? "Confirm your new password."
      : values.confirmPassword !== values.password
        ? "Passwords don't match."
        : null,
  };

  const markTouched = (field: FieldName) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (errors.password || errors.confirmPassword) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setPhase("done");
    }, 600);
  };

  if (phase === "done") {
    return (
      <div className="flex w-full flex-col items-center gap-6 border border-gold/20 bg-panel/40 p-6 text-center backdrop-blur-2xl sm:p-8">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
          <CheckmarkIcon className="size-8" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Password Reset</h1>
          <p className="font-sans text-sm text-cream-dim sm:text-base">
            Your password has been reset. You can now log in with your new password.
          </p>
        </div>

        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity hover:opacity-90"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8">
      <div className="flex flex-col gap-1.5 p-5">
        <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Reset Password</h1>
        <p className="font-sans text-sm text-cream-dim">
          {email ? (
            <>
              Choose a new password for <span className="font-medium text-cream">{email}</span>.
            </>
          ) : (
            "Choose a new password for your account."
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 p-5">
          <FormField label="New Password" htmlFor="password" error={touched.password ? errors.password : null}>
            <PasswordInput
              id="password"
              name="password"
              required
              autoComplete="new-password"
              value={values.password}
              onChange={(value) => setValues((v) => ({ ...v, password: value }))}
              onBlur={() => markTouched("password")}
              hasError={touched.password && !!errors.password}
            />
          </FormField>

          <FormField
            label="Confirm New Password"
            htmlFor="confirmPassword"
            error={touched.confirmPassword ? errors.confirmPassword : null}
          >
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              required
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={(value) => setValues((v) => ({ ...v, confirmPassword: value }))}
              onBlur={() => markTouched("confirmPassword")}
              hasError={touched.confirmPassword && !!errors.confirmPassword}
            />
          </FormField>
        </div>

        <div className="p-5">
          <motion.button
            {...(submitting ? {} : hoverScale)}
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Resetting…" : "Reset Password"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
