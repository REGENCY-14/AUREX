"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import type { LoginRole } from "@/components/LoginFlow";

const DASHBOARD_HREF: Record<LoginRole, string> = {
  investor: "/dashboard",
  business: "/business-dashboard",
};

/**
 * Stubbed login — there's no real auth/account system yet (same situation
 * as ContactForm's own submission), so this doesn't check the entered
 * email/password against anything. It just requires both fields be filled
 * in (the browser's own HTML5 validation) and then routes to whichever
 * dashboard matches the role picked on LoginRolePicker, matching the
 * brief: "the login button on the navbar should take me there when I
 * enter my details." Swapping in a real credential check later means
 * changing only handleSubmit's body.
 *
 * Reuses components/apply/FormField's field chrome even though this page
 * isn't part of either application flow — that file's actual contents
 * (label/input/error layout) were already flow-agnostic, so this avoids
 * redefining the exact same input styling a third time.
 */
export default function LoginForm({ role }: { role: LoginRole }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    router.push(DASHBOARD_HREF[role]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

      <div className="flex justify-end">
        <Link
          href="/coming-soon"
          className="font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <motion.button
        {...(submitting ? {} : hoverScale)}
        type="submit"
        disabled={submitting}
        className="mt-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Logging In…" : "Log In"}
      </motion.button>

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
