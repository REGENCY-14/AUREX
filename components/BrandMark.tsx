"use client";

import { useTheme } from "@/lib/theme";

// Each variant's box scales down on mobile (~75% of its desktop size,
// same aspect ratio) and steps back up to the original figures from sm —
// full-size logos read as oversized against mobile-scaled nav/footer
// content, per request to bring "the logos" down to mobile scale too.
const VARIANTS = {
  // Navbar — 68x51 box, tall enough for icon + "AUREX" text.
  nav: {
    boxClassName: "w-[52px] h-[39px] sm:w-[68px] sm:h-[51px]",
    dark: "/brand/logo-mark-crop.png",
    light: "/brand/logo-mark-about-crop.png",
  },
  // Footer / CTA — 68x34 box. Too short to keep the wordmark text legible
  // (it was rendering as illegible noise beside the icon), so this variant
  // uses an icon-only crop instead — matching what the original export's
  // own footer-sized crop showed anyway.
  footer: {
    boxClassName: "w-[52px] h-[26px] sm:w-[68px] sm:h-[34px]",
    dark: "/brand/logo-mark-icon.png",
    light: "/brand/logo-mark-about-icon.png",
  },
  // Standalone centerpiece — e.g. the coming-soon page. Same icon+text
  // crop as `nav`, just scaled up (136x102, same 4:3-ish aspect).
  large: {
    boxClassName: "w-[104px] h-[78px] sm:w-[136px] sm:h-[102px]",
    dark: "/brand/logo-mark-crop.png",
    light: "/brand/logo-mark-about-crop.png",
  },
} as const;

/**
 * AUREX wordmark/icon. Theme-aware: the dark-mode exports render "AUREX"
 * in white text (invisible once the navbar/footer backgrounds go light in
 * light mode), so light mode swaps to dark-text exports instead.
 *
 * All four files are pre-cropped, purpose-made assets (see the crop
 * script in project history) that isolate just the icon, or icon +
 * "AUREX" text, out of the much larger original square/near-square
 * exports — those also include a tagline underneath that never needs to
 * show at this size, and don't share a common aspect ratio with each
 * other, so cropping each one in advance to a matching window and then
 * just object-fit: cover-ing the result is far more robust than deriving
 * one shared percentage-overflow crop for both.
 */
export default function BrandMark({ variant }: { variant: keyof typeof VARIANTS }) {
  const { boxClassName, dark, light } = VARIANTS[variant];
  const { theme } = useTheme();
  const src = theme === "light" ? light : dark;

  return (
    <div className={`relative shrink-0 overflow-hidden ${boxClassName}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="AUREX" src={src} className="absolute inset-0 size-full object-cover object-center" />
    </div>
  );
}
