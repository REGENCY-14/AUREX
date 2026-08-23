const VARIANTS = {
  // Navbar wordmark — 68x51 box
  nav: { width: 68, height: 51, imgHeight: "169.23%", imgTop: "-28.21%" },
  // Footer wordmark — 68x34 box (same crop, shorter box)
  footer: { width: 68, height: 34, imgHeight: "253.85%", imgTop: "-43.78%" },
} as const;

/**
 * AUREX wordmark, reproduced from the design's exported logo asset.
 * The source asset is a square canvas with the mark off-center; the design
 * crops into it via percentage-based overflow rather than a pre-cropped
 * file, so we reproduce that same crop here to preserve the exact framing.
 */
export default function BrandMark({ variant }: { variant: keyof typeof VARIANTS }) {
  const { width, height, imgHeight, imgTop } = VARIANTS[variant];

  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width, height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="AUREX"
        src="/brand/logo-mark.png"
        className="absolute max-w-none"
        style={{ left: "-14.71%", top: imgTop, width: "126.47%", height: imgHeight }}
      />
    </div>
  );
}
