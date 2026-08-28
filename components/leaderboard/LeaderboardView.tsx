"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverScale } from "@/lib/motion";
import { formatGhs } from "@/lib/formatters";
import JoinAurexModal from "@/components/JoinAurexModal";
import type { LeaderboardEntry } from "@/lib/leaderboard";

// How many ranks (beyond the top 3) are shown before "Load More" is needed
// — with 20 mock rows total (see lib/leaderboard.ts) this shows one full
// page of 10 up front and needs exactly one click to reveal the rest, so
// both the initial state and the "more available" state are easy to see
// without scrolling through a wall of rows first.
const PAGE_SIZE = 10;

// Same per-rank medal treatment as the home page's teaser (components/
// Leaderboard.tsx) — kept independent here rather than shared, since this
// page's podium cards are a different size/copy (amount invested, not
// points) and that component's own comments are specific to being a home-
// page teaser section.
const MEDALS: Record<number, { ring: string; badge: string }> = {
  1: { ring: "from-[#f2ca50] to-[#a67c1f]", badge: "bg-gradient-to-br from-[#f2ca50] to-[#a67c1f] text-[#241c04]" },
  2: { ring: "from-[#e8e8e8] to-[#9a9a9a]", badge: "bg-gradient-to-br from-[#e8e8e8] to-[#9a9a9a] text-[#1a1a1a]" },
  3: { ring: "from-[#d7a06b] to-[#8c5a34]", badge: "bg-gradient-to-br from-[#d7a06b] to-[#8c5a34] text-[#241804]" },
};

// Podium display order (silver, gold, bronze) on sm+, rank 1 raised above
// the other two — resets to plain rank order (1, 2, 3) on mobile via the
// default order-1/2/3 flow, since the elevated-center effect only reads
// once there's room for the cards to sit side by side.
const PODIUM_ORDER: Record<number, string> = { 1: "order-1 sm:order-2", 2: "order-2 sm:order-1", 3: "order-3" };

function isCurrentUser(nickname: string, currentUserNickname?: string) {
  if (!currentUserNickname) return false;
  return nickname.trim().toLowerCase() === currentUserNickname.trim().toLowerCase();
}

function YouTag() {
  return (
    <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-gold-bright/60 bg-gold-bright/10 px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide text-gold-bright">
      You
    </span>
  );
}

/**
 * The full /leaderboard page body: podium (top 3) + paginated list (rank
 * 4+) + the "join us" CTA, all in one client component since ranking,
 * "Load More", and the current-user match all need client state/render
 * logic together.
 *
 * `entries` comes from lib/leaderboard.ts's mock `getLeaderboard()` today;
 * this component only ever reads a flat, already-ranked array, so nothing
 * here changes when that's swapped for a real endpoint later.
 *
 * `currentUserNickname` is optional and drives two things: which row (if
 * any, anywhere in the list — podium included) gets a "You" tag and a
 * gold highlight, and whether the bottom join CTA renders at all (a
 * registered investor viewing their own dashboard's link here doesn't need
 * to be pitched to join). Passed in from app/leaderboard/page.tsx as a
 * `?me=` query param today, in the absence of any real session — see that
 * file's own comment.
 */
export default function LeaderboardView({
  entries,
  currentUserNickname,
}: {
  entries: LeaderboardEntry[];
  currentUserNickname?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);
  const visibleRest = rest.slice(0, visibleCount);
  const hasMore = visibleCount < rest.length;

  // A registered member (identified by the presence of their own nickname)
  // never sees the "come join us" pitch — it's aimed at the logged-out
  // visitors who are this page's primary audience, per the brief.
  const showJoinCta = !currentUserNickname;

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex w-full flex-col gap-12 py-12 sm:gap-16 sm:py-16"
      >
        {/* Podium: top 3, visually distinct/celebratory. A soft gold glow
            sits behind the whole row rather than each card individually,
            so the set reads as one "podium", the same treatment the home
            page teaser uses for its own top 3. */}
        <motion.div variants={staggerItem} className="relative w-full">
          <div className="pointer-events-none absolute inset-x-8 top-1/2 h-40 -translate-y-1/2 rounded-full bg-gold-bright/20 blur-[80px]" />

          <div className="relative mx-auto flex max-w-4xl flex-col items-stretch gap-5 sm:flex-row sm:items-end sm:justify-center sm:gap-6">
            {topThree.map((entry) => {
              const medal = MEDALS[entry.rank];
              const isFirst = entry.rank === 1;
              const mine = isCurrentUser(entry.nickname, currentUserNickname);
              const initials = entry.nickname.slice(0, 2).toUpperCase();

              return (
                <div
                  key={entry.nickname}
                  className={`${PODIUM_ORDER[entry.rank]} flex flex-1 flex-col items-center gap-4 border p-8 text-center backdrop-blur-2xl ${
                    mine ? "border-gold-bright bg-gold-bright/5" : "border-gold/30 bg-panel/60"
                  } ${isFirst ? "sm:-mt-8 sm:pb-10 sm:pt-10" : ""}`}
                >
                  {mine && <YouTag />}

                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full font-jakarta text-sm font-bold ${medal.badge}`}
                  >
                    {entry.rank}
                  </span>

                  {/* text-gold-bright, not text-cream: bg-ink-light is one
                      of the deliberately-non-flipping dark tokens (see
                      globals.css), so its label needs a color that also
                      doesn't flip. */}
                  <div className={`flex items-center justify-center rounded-full bg-gradient-to-br p-[3px] ${medal.ring}`}>
                    <div
                      className={`flex items-center justify-center rounded-full bg-ink-light text-gold-bright ${
                        isFirst ? "size-20 sm:size-24" : "size-16 sm:size-20"
                      }`}
                    >
                      <span className={`font-jakarta font-bold ${isFirst ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
                        {initials}
                      </span>
                    </div>
                  </div>

                  <p className="font-jakarta text-lg font-semibold text-cream sm:text-xl">{entry.nickname}</p>

                  <span className="font-jakarta text-2xl font-bold text-gold-bright sm:text-3xl">
                    {formatGhs(entry.amountInvestedGhs)}
                  </span>
                  <span className="font-sans text-xs uppercase tracking-wide text-cream-dim">Total Invested</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Ranks 4+: a clean, scannable, paginated list. */}
        <motion.div variants={staggerItem} className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
          <div className="flex w-full flex-col">
            {visibleRest.map((entry) => {
              const mine = isCurrentUser(entry.nickname, currentUserNickname);
              const initials = entry.nickname.slice(0, 2).toUpperCase();

              return (
                <div
                  key={entry.nickname}
                  className={`flex items-center gap-4 border-b border-gold/20 px-3 py-4 first:pt-0 last:border-b-0 ${
                    mine ? "border-l-2 border-l-gold-bright bg-gold-bright/5" : ""
                  }`}
                >
                  <span className="w-8 shrink-0 font-geist text-sm font-semibold text-cream-dim">{entry.rank}</span>

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-[#3d392f] light:bg-[#eee]">
                    <span className="font-jakarta text-xs font-bold text-gold-bright">{initials}</span>
                  </div>

                  <span className="flex flex-1 items-center gap-2 truncate font-jakarta text-sm font-medium text-cream sm:text-base">
                    {entry.nickname}
                    {mine && <YouTag />}
                  </span>

                  <span className="shrink-0 font-jakarta text-sm font-semibold text-gold-bright sm:text-base">
                    {formatGhs(entry.amountInvestedGhs)}
                  </span>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <motion.button
              {...hoverScale}
              type="button"
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="flex items-center justify-center border border-gold/30 px-6 py-3 font-jakarta text-sm font-medium text-gold-bright transition-colors hover:border-gold hover:bg-gold/5"
            >
              Load More
            </motion.button>
          )}
        </motion.div>

        {/* Bottom CTA — hidden entirely for a viewer we already know is a
            registered member (currentUserNickname set), per the brief. */}
        {showJoinCta && (
          <motion.div
            variants={staggerItem}
            className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 border border-gold/20 bg-ink-light/20 p-8 text-center sm:p-10"
          >
            <p className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">Want to see your name here?</p>
            <p className="max-w-md font-sans text-sm text-cream-dim sm:text-base">
              Join AUREX and start building your own place on the leaderboard.
            </p>
            <motion.button
              {...hoverScale}
              type="button"
              onClick={() => setJoinModalOpen(true)}
              className="mt-2 flex items-center justify-center bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm text-amainblack"
            >
              Get Started
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Same JoinAurexModal used by the navbar/CTASection — rendered as a
          sibling of the scrolling content above rather than nested inside
          it, so its `fixed inset-0` resolves against the viewport (see
          Navbar.tsx / CTASection.tsx's own comments on this). */}
      <JoinAurexModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
    </>
  );
}
