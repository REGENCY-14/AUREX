import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import HowItWorks from "@/components/HowItWorks";
import WhyAurex from "@/components/WhyAurex";
import InvestmentPackages from "@/components/InvestmentPackages";
import Leaderboard from "@/components/Leaderboard";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-20 lg:pt-40">
        <div className="flex w-full max-w-[1280px] flex-col">
          <Hero />
          <AboutSection />
          <HowItWorks />
          <WhyAurex />
          <InvestmentPackages />
          <Leaderboard />
          <Testimonials />
          <Faq />
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  );
}
