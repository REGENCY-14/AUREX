"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverScale } from "@/lib/motion";
import JoinAurexModal from "@/components/JoinAurexModal";
import { toPoints, type LeaderboardEntry } from "@/lib/leaderboard";

// How many ranks (beyond the top 3) are shown before "Load More" is needed
// — with 20 mock rows total (see lib/leaderboard.ts) this shows one full
// page of 10 up front and needs exactly one click to reveal the rest, so
// both the initial state and the "more available" state are easy to see
// without scrolling through a wall of rows first.
const PAGE_SIZE = 10;

// Same per-rank medal treatment as the home page's teaser (components/
// Leaderboard.tsx) — kept independent here rather than shared, since this
// page's podium cards are a different size/copy and that component's own
// comments are specific to being a home-page teaser section. `label` is the
// ordinal shown under each podium card's divider, matching the "First
// place"/"Second place"/"Third place" pattern from the Figma leaderboard
// reference (node 244:4265), adapted to AUREX's own card layout/colors.
const MEDALS: Record<number, { ring: string; badge: string; label: string }> = {
  1: { ring: "from-[#f2ca50] to-[#a67c1f]", badge: "bg-gradient-to-br from-[#f2ca50] to-[#a67c1f] text-[#241c04]", label: "1st Place" },
  2: { ring: "from-[#e8e8e8] to-[#9a9a9a]", badge: "bg-gradient-to-br from-[#e8e8e8] to-[#9a9a9a] text-[#1a1a1a]", label: "2nd Place" },
  3: { ring: "from-[#d7a06b] to-[#8c5a34]", badge: "bg-gradient-to-br from-[#d7a06b] to-[#8c5a34] text-[#241804]", label: "3rd Place" },
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

// `solid` is used inside the ranks-4+ list row, whose "mine" state is a
// solid bg-gold-bright bar — the default gold-on-transparent tag would be
// invisible against that same gold, so that row passes solid to flip to a
// dark-on-translucent-white treatment instead. The podium's own "mine" card
// stays on a translucent bg-gold-bright/5, where the default tag still reads
// fine.
function YouTag({ solid = false }: { solid?: boolean }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide ${
        solid
          ? "border-amainblack/30 bg-white/40 text-amainblack"
          : "border-gold-bright/60 bg-gold-bright/10 text-gold-bright"
      }`}
    >
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
 * `currentUserNickname` is optional and drives three things: which row (if
 * any, anywhere in the list — podium included) gets a "You" tag and a
 * gold highlight; whether the bottom join CTA renders at all (a
 * registered investor viewing their own dashboard's link here doesn't need
 * to be pitched to join); and — when that nickname actually appears in
 * `entries` — a "Your Position" callout up top with a jump-to-your-row
 * action, so finding yourself doesn't mean scrolling/Load-More-ing
 * through everyone ranked above you. Passed in from app/leaderboard/
 * page.tsx as a `?me=` query param, or from the dashboard's own embedded
 * leaderboard tab with the signed-in member's real nickname — see each
 * call site's own comment.
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
  // Set by "Jump to My Rank" when the target row isn't rendered yet (rank
  // beyond the current visibleCount) — a ref, not state, since it doesn't
  // need to trigger its own re-render: growing visibleCount already does
  // that, and the effect below just needs to read it once that happens.
  const pendingScrollRankRef = useRef<number | null>(null);

  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);
  const visibleRest = rest.slice(0, visibleCount);
  const hasMore = visibleCount < rest.length;

  const myEntry = currentUserNickname
    ? entries.find((entry) => isCurrentUser(entry.nickname, currentUserNickname))
    : undefined;

  // A registered member (identified by the presence of their own nickname)
  // never sees the "come join us" pitch — it's aimed at the logged-out
  // visitors who are this page's primary audience, per the brief.
  const showJoinCta = !currentUserNickname;

  // Re-runs whenever visibleCount grows — the one moment a row that didn't
  // exist yet (rank > 3, beyond the previous page) shows up in the DOM.
  useEffect(() => {
    const rank = pendingScrollRankRef.current;
    if (rank === null) return;
    const row = document.getElementById(`leaderboard-rank-${rank}`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      pendingScrollRankRef.current = null;
    }
  }, [visibleCount]);

  function handleJumpToMyRank() {
    if (!myEntry) return;
    const neededCount = myEntry.rank - 3;
    // Ranks 4+ only render up to `visibleCount` of them. If the row is
    // already in the DOM (podium, or already-revealed page), scroll to it
    // right away; otherwise grow visibleCount and let the effect above
    // scroll to it once it actually exists.
    if (myEntry.rank > 3 && neededCount > visibleCount) {
      pendingScrollRankRef.current = myEntry.rank;
      setVisibleCount(neededCount);
      return;
    }
    document.getElementById(`leaderboard-rank-${myEntry.rank}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex w-full flex-col gap-12 py-12 sm:gap-16 sm:py-16"
      >
        {/* "Your Position" — only when the current user's own nickname
            actually appears in `entries` (an investor; a Business Owner
            viewing this from their own dashboard never matches a row).
            Sits above the podium so it's the first thing you see, not
            something you have to scroll or Load More to find. */}
        {myEntry && (
          <motion.div
            variants={staggerItem}
            className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 border border-gold-bright/40 bg-gold-bright/5 px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold-bright/50 font-jakarta text-sm font-bold text-gold-bright">
                #{myEntry.rank}
              </span>
              <div className="flex flex-col">
                <span className="font-jakarta text-sm font-semibold text-cream">Your Position</span>
                <span className="font-sans text-xs text-cream-dim">
                  {toPoints(myEntry.amountInvestedGhs).toLocaleString()} pts
                </span>
              </div>
            </div>
            <motion.button
              {...hoverScale}
              type="button"
              onClick={handleJumpToMyRank}
              className="font-jakarta text-sm font-medium text-gold-bright underline-offset-4 hover:underline"
            >
              Jump to my rank →
            </motion.button>
          </motion.div>
        )}

        {/* Podium: top 3, visually distinct/celebratory via the border/bg
            treatment below — same as the home page teaser's own top 3, no
            glow blob behind the row anymore (removed per request to remove
            every golden glow from the page background). */}
        <motion.div variants={staggerItem} className="relative w-full">
          <div className="relative mx-auto flex max-w-4xl flex-col items-stretch gap-5 sm:flex-row sm:items-end sm:justify-center sm:gap-6">
            {topThree.map((entry) => {
              const medal = MEDALS[entry.rank];
              const isFirst = entry.rank === 1;
              const mine = isCurrentUser(entry.nickname, currentUserNickname);
              const initials = entry.nickname.slice(0, 2).toUpperCase();

              return (
                <div
                  key={entry.nickname}
                  id={`leaderboard-rank-${entry.rank}`}
                  className={`${PODIUM_ORDER[entry.rank]} flex flex-1 flex-col items-center gap-4 border p-8 text-center backdrop-blur-2xl ${
                    mine ? "border-gold-bright bg-gold-bright/5" : "border-gold/30 bg-panel/60"
                  } ${isFirst ? "sm:-mt-8 sm:pb-10 sm:pt-10" : ""}`}
                >
                  {mine && <YouTag />}

                  {/* text-gold-bright, not text-cream: bg-ink-light is one
                      of the deliberately-non-flipping dark tokens (see
                      globals.css), so its label needs a color that also
                      doesn't flip. */}
                  <div className="relative">
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
                    {/* Rank badge — a Figma-style small pill overlapping the
                        avatar's corner instead of a separate line above
                        the card. */}
                    <span
                      className={`absolute -bottom-1 -right-1 flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-panel font-jakarta text-xs font-bold ${medal.badge}`}
                    >
                      {entry.rank}
                    </span>
                  </div>

                  <p className="font-jakarta text-lg font-semibold text-cream sm:text-xl">{entry.nickname}</p>

                  {/* Divider + ordinal label — the "First place"/"Second
                      place"/"Third place" pattern from the Figma leaderboard
                      reference. */}
                  <div className="flex w-full flex-col items-center gap-1.5 border-t border-gold/20 pt-4">
                    <span className="font-jakarta text-xs font-medium uppercase tracking-[1.2px] text-cream-dim">
                      {medal.label}
                    </span>
                    <p className="flex items-baseline gap-1.5">
                      <span className="font-jakarta text-2xl font-bold text-gold-bright sm:text-3xl">
                        {toPoints(entry.amountInvestedGhs).toLocaleString()}
                      </span>
                      <span className="font-jakarta text-sm text-cream-dim">pts</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Ranks 4+: a grouped-row table (per the Figma leaderboard
            reference's layout), each rank its own rounded "pill" row rather
            than a plain divided list, in AUREX's own gold/cream palette. */}
        <motion.div variants={staggerItem} className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-4 rounded-2xl bg-ink-light/15 px-4 py-2.5 sm:px-5 light:bg-black/[0.03]">
              <span className="w-8 shrink-0 font-jakarta text-xs font-medium uppercase tracking-[1px] text-cream-dim">
                Rank
              </span>
              <span className="flex-1 font-jakarta text-xs font-medium uppercase tracking-[1px] text-cream-dim">
                Player
              </span>
              <span className="shrink-0 font-jakarta text-xs font-medium uppercase tracking-[1px] text-cream-dim">
                Points
              </span>
            </div>

            {visibleRest.map((entry) => {
              const mine = isCurrentUser(entry.nickname, currentUserNickname);
              const initials = entry.nickname.slice(0, 2).toUpperCase();

              return (
                <div
                  key={entry.nickname}
                  id={`leaderboard-rank-${entry.rank}`}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 ${
                    mine ? "bg-gold-bright text-amainblack" : "bg-ink-light/8 light:bg-black/[0.02]"
                  }`}
                >
                  <span
                    className={`w-8 shrink-0 font-geist text-sm font-semibold ${mine ? "text-amainblack/70" : "text-cream-dim"}`}
                  >
                    {entry.rank}
                  </span>

                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${
                      mine ? "border-amainblack/20 bg-white/40" : "border-gold/20 bg-[#3d392f] light:bg-[#eee]"
                    }`}
                  >
                    <span className={`font-jakarta text-xs font-bold ${mine ? "text-amainblack" : "text-gold-bright"}`}>
                      {initials}
                    </span>
                  </div>

                  <span
                    className={`flex flex-1 items-center gap-2 truncate font-jakarta text-sm font-medium sm:text-base ${
                      mine ? "text-amainblack" : "text-cream"
                    }`}
                  >
                    {entry.nickname}
                    {mine && <YouTag solid />}
                  </span>

                  <span
                    className={`shrink-0 font-jakarta text-sm font-semibold sm:text-base ${
                      mine ? "text-amainblack" : "text-gold-bright"
                    }`}
                  >
                    {toPoints(entry.amountInvestedGhs).toLocaleString()}{" "}
                    <span className={`text-xs font-normal ${mine ? "text-amainblack/70" : "text-cream-dim"}`}>pts</span>
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
