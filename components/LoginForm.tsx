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
 * bordered section (matching LoginFlow's own header section, same
 * `gap-5` between all three) instead of flowing as one long list, and
 * "Forgot password?" moves to the top of the fields section — above
 * Email — rather than its old spot between Password and the submit
 * button, so that section reads as "here's the field group, with its
 * one quick action up front" instead of a link stranded between two
 * containers.
 *
 * The submit button's gradient uses the original bright gold hex values
 * directly (not the `gold`/`gold-light` tokens) on purpose: those tokens
 * now carry a deliberately deeper light-mode value for text/stroke
 * contrast (see app/globals.css's own comment), which looks right for
 * text sitting directly on a light surface but made this button — dark
 * text on top, no contrast problem to begin with — look muddier than it
 * used to. A button background never needed the darkening, so it keeps
 * the original vivid gold in both themes; the gradient is also a touch
 * more pronounced now (a genuine gold-bright highlight sweeping through
 * the middle, not two near-identical stops) for more visible shine.
 * "Apply as an Investor"/"List Your Business" below use the same
 * gradient-text treatment the navbar's active link already uses
 * (bg-clip-text over the accessible tokens) instead of a flat color, for
 * the same "a bit of gradient instead of flat" reason, minus the
 * contrast trade-off — this one's real text, so it stays on the
 * contrast-checked tokens rather than the button's fixed hex values.
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
      <div className="flex flex-col gap-4 border border-grid-line/60 p-5">
        <div className="flex justify-end">
          <Link
            href="/coming-soon"
            className="font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
          >
            Forgot password?
          </Link>
        </div>

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

        <FormField label="Password" htmlFor="password">
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

      <div className="border border-grid-line/60 p-5">
        <motion.button
          {...(submitting ? {} : hoverScale)}
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#c7953f] via-[#f4cf70] via-50% to-[#c7953f] px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
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
