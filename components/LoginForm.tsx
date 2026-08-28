"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import type { LoginRole } from "@/components/LoginFlow";

const DASHBOARD_HREF: Record<string, string> = {
  investor: "/dashboard",
  business: "/business-dashboard",
};

/**
 * Per request, the fields and the submit button each sit in their own
 * section (no border on either — just the grouping/padding — same
 * `gap-5` rhythm as LoginFlow's own header section above them) instead
 * of flowing as one long list. "Forgot password?" sits inline with the
 * "Password" label itself (FormField's `action` slot), not floating
 * elsewhere in the form.
 *
 * The submit button's gradient uses bright gold hex values directly
 * (not the `gold`/`gold-light` tokens) on purpose: those tokens now
 * carry a deliberately deeper light-mode value for text/stroke contrast
 * (see app/globals.css's own comment) — correct for text sitting
 * directly on a light surface, but wrong for a button background with
 * dark text already on top of it, which never had a contrast problem to
 * begin with. Anchored on gold-light/gold-bright specifically (not
 * gold-deep) so it reads as a genuinely light, glowing gold bar rather
 * than a darker bronze with one brief bright flash.
 * "Apply as an Investor"/"List Your Business" below use the same
 * gradient-text treatment the navbar's own active-link style already
 * uses (bg-clip-text over the accessible tokens) instead of a flat
 * color — real text, so it keeps the contrast-checked tokens rather
 * than the button's fixed hex values, while still reading as "gold"
 * rather than one flat shade.
 */
export default function LoginForm({ role }: { role: LoginRole }) {
  const router = useRouter();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const user = await login(email, password);
      const href = (user.role && DASHBOARD_HREF[user.role]) ?? DASHBOARD_HREF[role];
      if (!href) {
        setError(
          "Your account doesn't have dashboard access yet. If you recently applied, wait for your application to be approved.",
        );
        setSubmitting(false);
        return;
      }
      router.push(href);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
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
              href="/coming-soon"
              className="font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              Forgot password?
            </Link>
          }
        >
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className={fieldClassName(false)}
          />
        </FormField>

        {error && <p className="font-sans text-sm text-[#f87171]">{error}</p>}
      </div>

      <div className="p-5">
        <motion.button
          {...(submitting ? {} : hoverScale)}
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#e4b95b] via-[#f4cf70] via-50% to-[#e4b95b] px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Logging In…" : "Log In"}
        </motion.button>
      </div>

      <p className="text-center font-sans text-sm text-cream-dim">
        Don&apos;t have an account?{" "}
        <Link
          href="/apply/investor"
          className="bg-gradient-to-r from-gold via-gold-light via-50% to-gold bg-clip-text font-medium text-transparent underline-offset-4 hover:underline"
        >
          Apply as an Investor
        </Link>{" "}
        <span className="text-cream-dim/60">·</span>{" "}
        <Link
          href="/apply-business"
          className="bg-gradient-to-r from-gold via-gold-light via-50% to-gold bg-clip-text font-medium text-transparent underline-offset-4 hover:underline"
        >
          List Your Business
        </Link>
      </p>
    </form>
  );
}
