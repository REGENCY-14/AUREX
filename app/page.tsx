import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import InvestmentPackages from "@/components/InvestmentPackages";
import Testimonials from "@/components/Testimonials";
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
          <InvestmentPackages />
          <Testimonials />
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  );
}
