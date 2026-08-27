import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Log In | AUREX",
  description: "Log in to your AUREX account to access your Investor Dashboard.",
};

/**
 * Reached from the navbar's "Login" link (see Navbar.tsx). There's no real
 * account system yet, so LoginForm doesn't check credentials — entering
 * anything and submitting takes you straight to /dashboard, the only
 * place logging in currently needs to lead.
 *
 * Same minimal chrome as the application flows and ApplicationStatusScreen
 * (logo + centered card, no site Navbar/Footer) — this is a focused,
 * single-purpose screen, not a marketing page.
 */
export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/" aria-label="AUREX home">
          <BrandMark variant="nav" />
        </Link>

        <div className="flex w-full flex-col gap-6 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col gap-1.5">
            <p className="font-jakarta text-xs font-medium uppercase tracking-[1.8px] text-gold-muted">
              AUREX Login
            </p>
            <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Welcome Back</h1>
            <p className="font-sans text-sm text-cream-dim">Enter your details to access your Investor Dashboard.</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
