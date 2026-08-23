import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandMark from "@/components/BrandMark";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import { ArrowUpRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Coming Soon | AUREX",
  description: "This part of AUREX is on its way. Check back soon.",
};

/**
 * Shared destination for every nav item, footer link, and CTA that
 * doesn't have a real page behind it yet — this build only fleshes out
 * the home page (Hero/About/Packages/Client Perspectives/CTA). Rather
 * than leaving those as dead "#" anchors that silently do nothing, they
 * route here so visiting them gives real feedback instead.
 */
export default function ComingSoonPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-20 lg:pt-40">
        <div className="flex w-full max-w-[1280px] flex-col">
          <section className="relative flex min-h-[60vh] w-full flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 text-center sm:py-24">
            <SectionBackgroundVector variant="comingSoon" />

            <BrandMark variant="large" />

            <div className="flex max-w-2xl flex-col items-center gap-4">
              <h1 className="font-jakarta text-4xl font-semibold tracking-tight text-cream sm:text-5xl md:text-6xl md:tracking-[-0.02em]">
                <span className="block">Coming</span>
                <span className="block bg-gradient-to-r from-gold-bright via-gold-deep via-50% to-gold-bright bg-clip-text text-transparent">
                  Soon.
                </span>
              </h1>
              <p className="max-w-md font-jakarta text-base leading-7 text-cream-dim sm:text-lg">
                We&apos;re still building this part of AUREX. In the meantime,
                explore what&apos;s already live on the home page.
              </p>
            </div>

            <a
              href="/"
              className="flex h-[52px] items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-8 font-jakarta text-base text-amainblack"
            >
              Back to Home
              <ArrowUpRightIcon className="size-[15px]" />
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
