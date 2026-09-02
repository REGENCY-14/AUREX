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
// comments are specific to being a home-page teaser section. Per Figma node
// 252:5570 (the actual Investor Leaderboard section design — see
// Leaderboard.tsx's own comment on why 252:5577 from the link isn't it):
// `trophy` is the exported per-rank badge icon (public/brand/leaderboard-
// trophy-{1st,2nd,3rd}.svg) and `label` the "First/Second/Third place" text
// shown with it. `stepHeight` gives three genuinely distinct step heights
// (sm+ only — see the home page teaser's own comment for why), per
// request that the podium not read as equal-height blocks — including
// 2nd vs 3rd, not just 1st vs the other two.
const MEDALS: Record<number, { ring: string; trophy: string; label: string; stepHeight: string }> = {
  1: {
    ring: "from-[#f2ca50] to-[#a67c1f]",
    trophy: "/brand/leaderboard-trophy-1st.svg",
    label: "First place",
    stepHeight: "sm:min-h-[220px]",
  },
  2: {
    ring: "from-[#e8e8e8] to-[#9a9a9a]",
    trophy: "/brand/leaderboard-trophy-2nd.svg",
    label: "Second place",
    stepHeight: "sm:min-h-[175px]",
  },
  3: {
    ring: "from-[#d7a06b] to-[#8c5a34]",
    trophy: "/brand/leaderboard-trophy-3rd.svg",
    label: "Third place",
    stepHeight: "sm:min-h-[135px]",
  },
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

        {/* Podium: avatar + nickname float above a "step" block per rank
            (Figma's own literal podium metaphor), no glow blob behind the
            row anymore (removed per request to remove every golden glow
            from the page background). Per follow-up feedback ("the podium
            doesn't need to be black for light mode"), the step's own colors
            flip with the theme like every other card in the app — see the
            home page teaser's own comment (components/Leaderboard.tsx) for
            the full reasoning. */}
        <motion.div variants={staggerItem} className="relative w-full">
          <div className="relative mx-auto flex max-w-4xl flex-col items-stretch gap-6 sm:flex-row sm:items-end sm:justify-center sm:gap-6">
            {topThree.map((entry) => {
              const medal = MEDALS[entry.rank];
              const isFirst = entry.rank === 1;
              const mine = isCurrentUser(entry.nickname, currentUserNickname);
              const initials = entry.nickname.slice(0, 2).toUpperCase();

              return (
                <div
                  key={entry.nickname}
                  id={`leaderboard-rank-${entry.rank}`}
                  className={`${PODIUM_ORDER[entry.rank]} flex flex-1 flex-col items-center`}
                >
                  {mine && <YouTag />}

                  <div className={`flex items-center justify-center rounded-full bg-gradient-to-br p-[3px] ${medal.ring} ${mine ? "mt-1" : ""}`}>
                    <div
                      className={`flex items-center justify-center rounded-full bg-panel text-gold-bright ${
                        isFirst ? "size-20 sm:size-24" : "size-16 sm:size-20"
                      }`}
                    >
                      <span className={`font-jakarta font-bold ${isFirst ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
                        {initials}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 font-jakarta text-lg font-semibold text-cream sm:text-xl">{entry.nickname}</p>

                  {/* mine's own ring flags "your" podium step without
                      changing the block's own fill, so it stays the same
                      literal "podium step" the reference uses whether or
                      not it happens to be the viewer's own rank. */}
                  <div className="mt-4 flex w-full flex-col items-center">
                    {/* Beveled top facet — reproduces the Figma reference's
                        "Vector 193" shape exactly: a trapezoid, narrower at
                        the top than the bottom, giving the step a faceted
                        3D edge instead of a plain rounded corner (there's no
                        border-radius anywhere on this element in the source
                        design — square corners are AUREX's own established
                        chrome, same as CustomSelect's popup). */}
                    <div
                      aria-hidden="true"
                      className="h-3 w-full bg-black light:bg-white sm:h-4"
                      style={{ clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)" }}
                    />
                    {/* justify-between spreads the trophy/label group up
                        top and the points group down toward the bottom, so
                        the taller 1st-place step reads as a genuinely
                        bigger plaque instead of just empty padding under
                        the same content. */}
                    <div
                      className={`flex w-full flex-col items-center justify-between gap-2 bg-gradient-to-b from-black to-ink-light px-4 pb-6 pt-4 text-center light:border light:border-t-0 light:border-gold/20 light:from-white light:to-[#f3ecd9] ${medal.stepHeight} ${
                        mine ? "ring-2 ring-inset ring-gold-bright" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={medal.trophy} alt="" className="size-[34px]" />
                        <span className="font-jakarta text-sm font-medium text-cream">{medal.label}</span>
                      </div>
                      <p className="flex items-baseline gap-1.5 border-t border-cream/10 pt-2">
                        <span className="font-jakarta text-2xl font-bold text-gold-bright sm:text-3xl">
                          {toPoints(entry.amountInvestedGhs).toLocaleString()}
                        </span>
                        <span className="font-jakarta text-sm text-cream-dim">pts</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Ranks 4+: a clean, scannable, paginated list — per the Figma
            reference, each row a plain HorizontalBorder divider
            (border-gold/20), not a grouped/pill row. */}
        <motion.div variants={staggerItem} className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
          <div className="flex w-full flex-col">
            {visibleRest.map((entry) => {
              const mine = isCurrentUser(entry.nickname, currentUserNickname);
              const initials = entry.nickname.slice(0, 2).toUpperCase();

              return (
                <div
                  key={entry.nickname}
                  id={`leaderboard-rank-${entry.rank}`}
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
                    {toPoints(entry.amountInvestedGhs).toLocaleString()}{" "}
                    <span className="text-xs font-normal text-cream-dim">pts</span>
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
