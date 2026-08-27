import type { ReactNode } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";

/**
 * Shared shell + typography primitives for the site's standalone legal
 * pages (/terms, /privacy) — extracted from the original /terms page once
 * /privacy needed the exact same document styling, per the brief's own
 * "same document styling as /terms" requirement. Both pages still own
 * their actual section content; this file only owns the repeated layout
 * (logo + back link, title block, cross-link footer) and the plain
 * heading/paragraph/list building blocks each page's sections use.
 */

export function Heading({ children }: { children: string }) {
  return <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">{children}</h2>;
}

export function Paragraph({ children }: { children: ReactNode }) {
  return <p className="font-sans text-sm leading-7 text-cream-dim sm:text-base sm:leading-8">{children}</p>;
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 font-sans text-sm leading-7 text-cream-dim sm:text-base sm:leading-8">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * The page-level shell both /terms and /privacy render their sections
 * inside. Deliberately skips the site's usual Navbar/PageBanner/Footer
 * chrome — per the brief, these should read like plain legal documents,
 * not marketing pages. Just the logo, a way back to the home page, and
 * the document itself, capped to a comfortable reading width (max-w-3xl)
 * rather than stretching full-width on large screens.
 *
 * `crossLink` renders a small "See also our ___" line at the bottom of
 * the document, pointing at the other legal page — these two documents
 * reference each other in practice, so each should be one click from the
 * other rather than requiring a trip back through the footer.
 */
export function LegalPageShell({
  title,
  lastUpdated,
  crossLink,
  children,
}: {
  title: string;
  lastUpdated: string;
  crossLink: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex w-full max-w-3xl flex-col gap-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="AUREX home">
            <BrandMark variant="nav" />
          </Link>
          <Link href="/" className="font-sans text-sm text-cream-dim transition-colors hover:text-gold-light">
            ← Back to Home
          </Link>
        </div>

        <article className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 border-b border-grid-line pb-8">
            <h1 className="font-jakarta text-3xl font-semibold text-cream sm:text-4xl">{title}</h1>
            <p className="font-sans text-sm text-cream-dim">Last updated: {lastUpdated}</p>
            <p className="mt-2 font-sans text-xs italic text-cream-dim/70">
              This is placeholder content standing in for AUREX&apos;s actual {title}, pending final legal review. Do
              not treat it as binding.
            </p>
          </div>

          {children}

          <div className="flex flex-col gap-2 border-t border-grid-line pt-8">
            <p className="font-sans text-sm text-cream-dim">
              See also our{" "}
              <Link
                href={crossLink.href}
                className="text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              >
                {crossLink.label}
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
