"use client";

import { useTheme } from "@/lib/theme";

const VARIANTS = {
  // Navbar — 68x51 box, tall enough for icon + "AUREX" text.
  nav: { width: 68, height: 51, dark: "/brand/logo-mark-crop.png", light: "/brand/logo-mark-about-crop.png" },
  // Footer / CTA — 68x34 box. Too short to keep the wordmark text legible
  // (it was rendering as illegible noise beside the icon), so this variant
  // uses an icon-only crop instead — matching what the original export's
  // own footer-sized crop showed anyway.
  footer: { width: 68, height: 34, dark: "/brand/logo-mark-icon.png", light: "/brand/logo-mark-about-icon.png" },
  // Standalone centerpiece — e.g. the coming-soon page. Same icon+text
  // crop as `nav`, just scaled up (136x102, same 4:3-ish aspect).
  large: { width: 136, height: 102, dark: "/brand/logo-mark-crop.png", light: "/brand/logo-mark-about-crop.png" },
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
  const { width, height, dark, light } = VARIANTS[variant];
  const { theme } = useTheme();
  const src = theme === "light" ? light : dark;

  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width, height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="AUREX" src={src} className="absolute inset-0 size-full object-cover object-center" />
    </div>
  );
}
