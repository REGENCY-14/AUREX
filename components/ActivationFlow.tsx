"use client";

import { useEffect, useState, type ReactNode, type SVGProps } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { easing, hoverScale } from "@/lib/motion";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import { TrendFlatIcon } from "@/components/icons";
import { MIN_PASSWORD_LENGTH, hasPasswordNumber } from "@/lib/validation";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  validateActivationToken,
  activateAccount,
  resendActivationEmail,
  type ApplicationTrack,
} from "@/lib/activation";

function CheckmarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Same "neutral, not exactly an error" circular badge ApplicationStatusScreen's
// StatusIcon uses for its own "rejected" state (border-grid-line/text-cream-dim,
// TrendFlatIcon rather than a dedicated warning glyph invented just for this) —
// reused here for both the expired and already-used states, which are the same
// kind of "this link doesn't work anymore" message, not a fault of anything the
// applicant did.
function NeutralIcon() {
  return (
    <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-grid-line text-cream-dim">
      <TrendFlatIcon className="size-6" />
    </div>
  );
}

function GoldIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
      {children}
    </div>
  );
}

const PASSWORD_REQUIREMENTS: { key: string; label: string; test: (value: string) => boolean }[] = [
  { key: "length", label: `At least ${MIN_PASSWORD_LENGTH} characters`, test: (v) => v.length >= MIN_PASSWORD_LENGTH },
  { key: "number", label: "At least one number", test: hasPasswordNumber },
];

function RequirementRow({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 font-sans text-xs transition-colors ${met ? "text-[#4ade80]" : "text-cream-dim"}`}>
      <span
        className={`flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          met ? "border-[#4ade80] bg-[#4ade80]/10" : "border-grid-line"
        }`}
      >
        {met && <CheckmarkIcon className="size-2" />}
      </span>
      {label}
    </li>
  );
}

// Same 2-entry role -> dashboard-route map LoginForm.tsx keeps locally
// rather than a shared export — small enough, and specific enough to each
// call site's own role/track naming, that duplicating it here reads more
// clearly than a shared module both would need to import and reconcile
// naming with.
const DASHBOARD_HREF: Record<ApplicationTrack, string> = {
  investor: "/dashboard",
  business: "/business-dashboard",
};

type FieldName = "password" | "confirmPassword";
type Phase = "checking" | "expired" | "already_used" | "form" | "success";

export default function ActivationFlow() {
  const token = useSearchParams().get("token");
  const { login } = useAuth();

  const [phase, setPhase] = useState<Phase>("checking");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState<ApplicationTrack>("investor");

  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({ password: false, confirmPassword: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [resent, setResent] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void validateActivationToken(token).then((result) => {
      if (cancelled) return;
      if (result.state === "valid") {
        setNickname(result.nickname);
        setEmail(result.email);
        setTrack(result.track);
        setPhase("form");
      } else {
        setPhase(result.state);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const requirementResults = PASSWORD_REQUIREMENTS.map((rule) => ({ ...rule, met: rule.test(values.password) }));
  const isPasswordValid = requirementResults.every((rule) => rule.met);

  const errors: Record<FieldName, string | null> = {
    password: !values.password
      ? "Enter a password."
      : !isPasswordValid
        ? "Doesn't meet the requirements below yet."
        : null,
    confirmPassword: !values.confirmPassword
      ? "Confirm your password."
      : values.confirmPassword !== values.password
        ? "Passwords don't match."
        : null,
  };

  const isValid = isPasswordValid && values.confirmPassword === values.password && values.confirmPassword !== "";

  const markTouched = (field: FieldName) => setTouched((prev) => ({ ...prev, [field]: true }));

  const attemptActivate = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await activateAccount(token ?? "", values.password);
      await login(email, values.password);
      setPhase("success");
    } catch {
      setSubmitError("Something went wrong setting up your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (!isValid || submitting) return;
    void attemptActivate();
  };

  const handleResend = () => {
    setResent(true);
    void resendActivationEmail(token).then((result) => setResendMessage(result.message));
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {phase === "checking" && (
        <motion.div
          key="checking"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: easing.smooth }}
          className="flex w-full flex-col items-center gap-3 border border-gold/20 bg-panel/40 p-10 text-center backdrop-blur-2xl"
        >
          <p className="font-sans text-sm text-cream-dim">Checking your activation link…</p>
        </motion.div>
      )}

      {phase === "expired" && (
        <motion.div
          key="expired"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: easing.smooth }}
          className="flex w-full flex-col items-center gap-6 border border-gold/20 bg-panel/40 p-6 text-center backdrop-blur-2xl sm:p-8"
        >
          <NeutralIcon />

          <div className="flex flex-col gap-3">
            <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Link Expired</h1>
            <p className="font-sans text-sm text-cream-dim sm:text-base">This activation link has expired.</p>
            <p className="font-sans text-xs text-cream-dim/70">
              Activation links are only valid for a limited time after your application is approved — request a new
              one below and we&apos;ll send it to the email on file.
            </p>
          </div>

          {resendMessage ? (
            <p className="font-sans text-sm text-[#4ade80]">{resendMessage}</p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resent}
              className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resent ? "Sending…" : "Resend Activation Email"}
            </button>
          )}

          <Link
            href="/login"
            className="w-fit font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
          >
            ← Back to Log In
          </Link>
        </motion.div>
      )}

      {phase === "already_used" && (
        <motion.div
          key="already_used"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: easing.smooth }}
          className="flex w-full flex-col items-center gap-6 border border-gold/20 bg-panel/40 p-6 text-center backdrop-blur-2xl sm:p-8"
        >
          <NeutralIcon />

          <div className="flex flex-col gap-3">
            <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Already Activated</h1>
            <p className="font-sans text-sm text-cream-dim sm:text-base">This account has already been set up.</p>
            <p className="font-sans text-xs text-cream-dim/70">
              Log in with the password you already chose, or use &quot;Forgot password?&quot; there if you don&apos;t
              remember it.
            </p>
          </div>

          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity hover:opacity-90"
          >
            Go to Log In
          </Link>
        </motion.div>
      )}

      {phase === "form" && (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: easing.smooth }}
          className="flex w-full flex-col gap-5 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8"
        >
          <div className="flex flex-col gap-1.5 p-5">
            <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Create Your Account</h1>
            <p className="font-sans text-sm text-cream-dim">
              You&apos;re approved — choose a password to finish setting up your AUREX account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-y border-grid-line px-5 py-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Nickname</span>
              <span className="font-jakarta text-sm font-medium text-cream">{nickname}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Email</span>
              <span className="font-jakarta text-sm font-medium text-cream">{email}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 p-5">
              <FormField label="Password" htmlFor="password" error={touched.password ? errors.password : null}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={values.password}
                  onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                  onBlur={() => markTouched("password")}
                  placeholder="••••••••"
                  className={fieldClassName(touched.password && !!errors.password)}
                />
              </FormField>

              <ul className="-mt-2 flex flex-col gap-1.5 pl-1">
                {requirementResults.map((rule) => (
                  <RequirementRow key={rule.key} met={rule.met} label={rule.label} />
                ))}
              </ul>

              <FormField
                label="Confirm Password"
                htmlFor="confirmPassword"
                error={touched.confirmPassword ? errors.confirmPassword : null}
              >
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))}
                  onBlur={() => markTouched("confirmPassword")}
                  placeholder="••••••••"
                  className={fieldClassName(touched.confirmPassword && !!errors.confirmPassword)}
                />
              </FormField>
            </div>

            {submitError && (
              <div className="mx-5 flex flex-wrap items-center justify-between gap-3 border border-[#f87171]/30 bg-[#f87171]/5 px-4 py-3">
                <p role="alert" className="font-sans text-xs text-[#f87171]">
                  {submitError}
                </p>
                <button
                  type="button"
                  onClick={() => void attemptActivate()}
                  disabled={submitting}
                  className="shrink-0 font-jakarta text-xs font-medium text-gold-bright underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="p-5">
              <motion.button
                {...(submitting || !isValid ? {} : hoverScale)}
                type="submit"
                disabled={!isValid || submitting}
                className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating Account…" : "Create Account"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {phase === "success" && (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: easing.smooth }}
          className="flex w-full flex-col items-center gap-6 border border-gold/20 bg-panel/40 p-6 text-center backdrop-blur-2xl sm:p-8"
        >
          <GoldIcon>
            <CheckmarkIcon className="size-8" />
          </GoldIcon>

          <div className="flex flex-col gap-3">
            <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">
              Your account is ready, {nickname}!
            </h1>
            <p className="font-sans text-sm text-cream-dim sm:text-base">
              You&apos;re signed in — head to your dashboard whenever you&apos;re ready.
            </p>
          </div>

          <Link
            href={DASHBOARD_HREF[track]}
            className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity hover:opacity-90"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
