"use client";

import { useState, type SVGProps } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { easing, hoverScale } from "@/lib/motion";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import { isValidEmail } from "@/lib/validation";
import { EmailIcon } from "@/components/icons";

function CheckmarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The /forgot-password screen — reached from LoginForm's "Forgot password?"
 * link. Two phases, same AnimatePresence phase-switch pattern as LoginFlow
 * (role picker -> form): "request" (just an email field) and "sent" (a
 * confirmation screen, same circular-icon-badge treatment as
 * ApplicationStatusScreen's own StatusIcon).
 *
 * There's no backend/email delivery in this environment (same situation
 * LoginForm's own loginMock works around — see that file's comment), so
 * submitting here doesn't actually send anything; it just always succeeds
 * and moves to "sent". The "sent" screen's "Simulate the reset link"
 * action exists for the same reason loginMock does: without it, this flow
 * would dead-end at "check your email" with no real email ever arriving to
 * continue from — clicking it takes you to /reset-password exactly like a
 * real emailed link would, carrying the entered address along so that
 * screen can greet you by it.
 */
export default function ForgotPasswordFlow() {
  const [phase, setPhase] = useState<"request" | "sent">("request");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resent, setResent] = useState(false);

  const error = !email.trim() ? "Enter your email address." : !isValidEmail(email) ? "Enter a valid email address." : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (error) return;
    setSubmitting(true);
    // Simulated network delay — mirrors the brief pause a real "send this
    // email" request would have, rather than snapping to "sent" instantly.
    window.setTimeout(() => {
      setSubmitting(false);
      setPhase("sent");
    }, 600);
  };

  const handleResend = () => {
    setResent(true);
    window.setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="flex w-full flex-col gap-5 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "request" ? (
          <motion.div
            key="request"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easing.smooth }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5 p-5">
              <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Forgot Password?</h1>
              <p className="font-sans text-sm text-cream-dim">
                Enter the email on your account and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="p-5">
                <FormField label="Email Address" htmlFor="email" error={touched ? error : null}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="you@example.com"
                    className={fieldClassName(touched && !!error)}
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
                  {submitting ? "Sending…" : "Send Reset Link"}
                </motion.button>
              </div>
            </form>

            <Link
              href="/login"
              className="mx-5 w-fit font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              ← Back to Log In
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easing.smooth }}
            className="flex flex-col items-center gap-6 p-5 text-center"
          >
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
              <EmailIcon className="size-7" />
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Check Your Email</h1>
              <p className="font-sans text-sm text-cream-dim sm:text-base">
                If an account exists for <span className="font-medium text-cream">{email}</span>, we&apos;ve sent a
                link to reset your password.
              </p>
              <p className="font-sans text-xs text-cream-dim/70">
                Didn&apos;t get it? Check your spam folder, or resend it below.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resent}
                className="font-jakarta text-sm font-medium text-gold-bright underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
              >
                {resent ? "Email resent ✓" : "Resend email"}
              </button>

              {/* No real email ever arrives in this environment (see this
                  component's own doc comment) — this is the one way to
                  actually continue the flow end to end. */}
              <Link
                href={`/reset-password?token=mock-reset-token&email=${encodeURIComponent(email)}`}
                className="flex items-center gap-1.5 font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              >
                <CheckmarkIcon className="size-3.5" />
                Simulate opening the email link
              </Link>
            </div>

            <Link
              href="/login"
              className="w-fit font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              ← Back to Log In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
