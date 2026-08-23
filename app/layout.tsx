import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, DM_Sans, Inter, Manrope, Barlow } from "next/font/google";
import { MotionConfig } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AUREX",
  description: "Invest with purpose. Grow with confidence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${dmSans.variable} ${inter.variable} ${manrope.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-ink">
        {/* reducedMotion="user" makes every motion.* element in the app honor
            prefers-reduced-motion automatically, in addition to the manual
            checks already inside AnimatedBackground. Single source of truth
            for motion-safety, kept here so no page has to opt in itself.

            The sitewide cursor glow (components/CursorGlow.tsx) is turned
            off for now per request — the hero's Looper vector has its own
            scoped hover-glow instead (see HeroLooperVector). The component
            file is kept in place in case it's wanted again later. */}
        <MotionConfig reducedMotion="user">
          <AnimatedBackground />
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
