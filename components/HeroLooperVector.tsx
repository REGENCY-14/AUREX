"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The "Looper BG" decorative vector behind the hero, reproduced from its
 * exported SVG asset (already gold/white-gradient toned in the source file
 * — see public/brand/looper-bg.svg). Per request: this specific vector
 * glows gold as the cursor moves near/along it. The general sitewide
 * cursor-glow has been turned off — this replaces it, scoped to just this
 * graphic.
 *
 * Implementation: the same image is layered twice — a dim resting copy,
 * and a brightened+glowing copy revealed only within a soft radius around
 * the pointer via a CSS radial-gradient mask. The mask position is written
 * directly to the DOM on pointermove (no React state) to stay smooth.
 * Skipped for touch input and prefers-reduced-motion.
 */
export default function HeroLooperVector() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const glow = glowRef.current;
    if (!wrapper || !glow) return;

    // Chromium drops the `at <var> <var>` position clause of a
    // radial-gradient mask when it's set via an HTML style ATTRIBUTE
    // string (i.e. a JSX inline `style` object) — reproducible in
    // isolation, unrelated to React/Tailwind. Assigning the identical
    // value through the CSSOM property setter works correctly and keeps
    // tracking live updates to the custom properties afterward, so the
    // mask is wired up here in JS rather than via JSX style.
    glow.style.setProperty("--glow-x", "50%");
    glow.style.setProperty("--glow-y", "50%");
    const maskValue =
      "radial-gradient(circle 340px at var(--glow-x) var(--glow-y), black, transparent 75%)";
    glow.style.maskImage = maskValue;
    glow.style.setProperty("-webkit-mask-image", maskValue);

    if (prefersReducedMotion) return;
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const ROTATION_RAD = (10.92 * Math.PI) / 180;
    const cos = Math.cos(ROTATION_RAD);
    const sin = Math.sin(ROTATION_RAD);

    const handleMove = (event: PointerEvent) => {
      // getBoundingClientRect() returns the axis-aligned box AFTER rotation,
      // so its top-left is NOT the element's local (0,0) origin — only its
      // center is reliable (rotation pivots on the center, which is
      // invariant under the transform). Take the mouse vector from that
      // center in viewport space, rotate it by -θ to undo the transform,
      // then re-add half width/height to land in the image's own
      // (unrotated) local coordinate space that the mask actually uses.
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const localDx = dx * cos + dy * sin;
      const localDy = -dx * sin + dy * cos;
      const x = localDx + wrapper.offsetWidth / 2;
      const y = localDy + wrapper.offsetHeight / 2;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        glow.style.setProperty("--glow-x", `${x}px`);
        glow.style.setProperty("--glow-y", `${y}px`);
        glow.style.opacity = "1";
      });
    };

    const handleLeaveWindow = () => {
      glow.style.opacity = "0";
    };

    // Listen on window (bubbles from anywhere, including over foreground
    // text/buttons) so the glow tracks correctly even where UI sits above
    // the vector, using the vector's own bounding rect for the math.
    window.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerleave", handleLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeaveWindow);
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute -left-[27%] -top-[46%] hidden h-[1396px] w-[2260px] rotate-[10.92deg] opacity-90 md:block"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/looper-bg.svg" alt="" className="absolute inset-0 size-full" />

      {!prefersReducedMotion && (
        <div ref={glowRef} className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/looper-bg.svg"
            alt=""
            className="absolute inset-0 size-full"
            style={{
              filter:
                "brightness(10) contrast(1.3) drop-shadow(0 0 6px rgba(233,195,73,1)) drop-shadow(0 0 28px rgba(212,175,55,0.8))",
            }}
          />
        </div>
      )}
    </div>
  );
}
