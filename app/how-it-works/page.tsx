import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import CTASection from "@/components/CTASection";
import HowItWorksProcess from "@/components/HowItWorksProcess";
import HowItWorksBanner from "@/components/HowItWorksBanner";

export const metadata: Metadata = {
  title: "How It Works | AUREX",
  description:
    "Discover how AUREX makes strategic investing simple, transparent, and seamless — from exploring carefully selected opportunities and understanding potential returns to applying, investing, and tracking your investment with confidence.",
};

/**
 * Standalone page for Figma node 110:13059 — a dedicated "How It Works"
 * page (title banner + a 4-step Process breakdown), distinct from the
 * anchor-scrolled `#how-it-works` summary section on the home page
 * (components/HowItWorks.tsx). Per request, built as its own route rather
 * than folded into that existing section.
 *
 * The FAQ, CTA, and Footer blocks in the Figma frame are pixel-for-pixel
 * the same copy already live in components/Faq.tsx, CTASection.tsx, and
 * Footer.tsx (same questions, same CTA copy, same footer links/contact
 * info) — reused directly here rather than re-authored, per the project's
 * "single source of truth" component convention.
 */
export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-20 lg:pt-40">
        <div className="flex w-full max-w-[1280px] flex-col">
          <HowItWorksBanner />
          <HowItWorksProcess />
          <Faq />
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  );
}
