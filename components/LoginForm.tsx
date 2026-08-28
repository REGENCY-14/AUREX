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
