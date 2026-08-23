"use client";

import { useTheme } from "@/lib/theme";

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10" cy="10" r="4" fill="currentColor" />
      <path
        d="M10 0.833V3M10 17v2.167M2.05 2.05l1.534 1.534M16.416 16.416l1.534 1.534M0.833 10H3M17 10h2.167M2.05 17.95l1.534-1.534M16.416 3.584l1.534-1.534"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M17.5 11.892A8.334 8.334 0 1 1 8.108 2.5a6.667 6.667 0 0 0 9.392 9.392Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Manual light/dark toggle — independent of the OS-level prefers-color-
 * scheme (this site is dark by default regardless of system setting; the
 * toggle is the only way to reach the light theme from Figma node 37:2570).
 * State is applied via a `data-theme` attribute on <html> (see lib/theme.ts
 * for the persistence + no-flash init script) and every color that needs to
 * change per theme is driven by CSS custom properties in globals.css, not
 * by this component — it only flips the switch.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isLight}
      className={`flex size-9 shrink-0 items-center justify-center text-cream transition-colors hover:text-gold-light ${className}`}
    >
      {isLight ? <MoonIcon className="size-[18px]" /> : <SunIcon className="size-[18px]" />}
    </button>
  );
}
