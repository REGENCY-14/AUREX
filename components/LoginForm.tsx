"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";
import { FormField, fieldClassName, PasswordInput } from "@/components/apply/FormField";
import { useAuth } from "@/lib/auth/AuthContext";
import { MOCK_INVESTOR } from "@/lib/investorPortfolio";
import { MOCK_LISTINGS } from "@/lib/businessListing";
import type { LoginRole } from "@/components/LoginFlow";

const DASHBOARD_HREF: Record<string, string> = {
  investor: "/dashboard",
  business: "/business-dashboard",
};

// Same mock nickname each dashboard's own mock data already keys off of
// (lib/investorPortfolio.ts's MOCK_INVESTOR, lib/businessListing.ts's
// "live" MOCK_LISTINGS entry) — signing in as this exact nickname means
// the dashboard you land on shows real-looking data instead of an empty
// "unknown member" state.
const MOCK_NICKNAME: Record<LoginRole, string> = {
  investor: MOCK_INVESTOR.nickname,
  business: MOCK_LISTINGS.live.ownerNickname,
};

/**
 * Per request, the fields and the submit button each sit in their own
 * section (no border on either — just the grouping/padding — same
 * `gap-5` rhythm as LoginFlow's own header section above them) instead
 * of flowing as one long list. "Forgot password?" sits inline with the
 * "Password" label itself (FormField's `action` slot), not floating
 * elsewhere in the form.
 *
 * The submit button's gradient and the "Apply as an Investor"/"List
 * Your Business" links both went through a couple of gold-shade
 * experiments (a deeper contrast-safe tint, then a hand-picked brighter
 * hex gradient) before landing back here, on the plain gold/gold-light
 * tokens — per feedback, reverted to the original color this app has
 * always used rather than any of the in-between attempts.
 *
 * Signs in via `loginMock` (lib/auth/AuthContext.tsx), not the real
 * `login` — there's no backend reachable in this environment yet (every
 * real `login` attempt was failing with a generic "Something went
 * wrong", per the brief), so this doesn't check the entered email/
 * password against anything; it just signs in as the role's own mock
 * member and routes to the matching dashboard, same as this form did
 * before the real-auth integration. Swapping back to a real credential
 * check once a backend exists means changing only this one call — see
 * loginMock's own comment for the exact one-line swap.
 */
export default function LoginForm({ role }: { role: LoginRole }) {
  const router = useRouter();
  const { loginMock } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  // Uncontrolled everywhere else in this form (loginMock never reads what
  // was typed — see this component's own doc comment) — password is the
  // one field that needs to be controlled anyway, purely so PasswordInput's
  // show/hide toggle has a value to render as plain text.
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    loginMock(MOCK_NICKNAME[role], role);
    router.push(DASHBOARD_HREF[role]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 p-5">
        <FormField label="Email Address" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={fieldClassName(false)}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          action={
            <Link
              href="/forgot-password"
              className="font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput id="password" name="password" required value={password} onChange={setPassword} />
        </FormField>
      </div>

      <div className="p-5">
        <motion.button
          {...(submitting ? {} : hoverScale)}
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Logging In…" : "Log In"}
        </motion.button>
      </div>

      <p className="text-center font-sans text-sm text-cream-dim">
        Don&apos;t have an account?{" "}
        <Link href="/apply/investor" className="font-medium text-gold-bright underline-offset-4 hover:underline">
          Apply as an Investor
        </Link>{" "}
        <span className="text-cream-dim/60">·</span>{" "}
        <Link href="/apply-business" className="font-medium text-gold-bright underline-offset-4 hover:underline">
          List Your Business
        </Link>
      </p>
    </form>
  );
}
