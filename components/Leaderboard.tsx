"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import { TrendUpIcon, TrendDownIcon, TrendFlatIcon } from "@/components/icons";

// Per Figma node 252:5570 ("Section" — the actual home-page Investor
// Leaderboard section; node 252:5577 from the link given for this section
// is just that frame's empty background-paint layer, not the content — see
// its parent for the real design). Heading/subtitle copy and all 10 mock
// investors' numbers below are taken directly from that node, which is why
// they already lined up exactly with what this section had before this
// pass — only the visual treatment changes here.
//
// Points scale: 1 point per $100 invested, rounded to the nearest 10 —
// arbitrary but consistent, purely to turn a dollar figure into a
// "leaderboard score" that isn't literally a bank balance.
const POINTS_PER_DOLLAR = 1 / 100;
const toPoints = (invested: number) => Math.round((invested * POINTS_PER_DOLLAR) / 10) * 10;

// `change` is how many places each investor has moved since the last
// ranking period — positive climbs, negative drops, 0 holds position.
const INVESTORS = [
  { nickname: "IronVault", invested: 1_240_000, change: 1 },
  { nickname: "GoldFalcon", invested: 980_000, change: -1 },
  { nickname: "SilkRoad88", invested: 865_000, change: 2 },
  { nickname: "NorthStarX", invested: 742_000, change: 0 },
  { nickname: "CrestlineJ", invested: 689_000, change: 3 },
  { nickname: "AtlasReturn", invested: 612_000, change: -2 },
  { nickname: "MidasTouch", invested: 578_000, change: 1 },
  { nickname: "QuietCapital", invested: 524_000, change: 0 },
  { nickname: "EmberYield", invested: 493_000, change: -1 },
  { nickname: "VaultKeeper", invested: 461_000, change: 4 },
].map((investor, i) => ({
  ...investor,
  rank: i + 1,
  points: toPoints(investor.invested),
  initials: investor.nickname.slice(0, 2).toUpperCase(),
}));

const TOP_THREE = INVESTORS.slice(0, 3);
const REST = INVESTORS.slice(3);

// Per-rank medal treatment — the avatar ring gradient plus the exported
// trophy badge icon from the Figma reference (public/brand/leaderboard-
// trophy-{1st,2nd,3rd}.svg, downloaded from that node rather than redrawn,
// per the design-to-code asset-fidelity rule) and its "First/Second/Third
// place" label.
const MEDALS: Record<number, { ring: string; trophy: string; label: string }> = {
  1: { ring: "from-[#f2ca50] to-[#a67c1f]", trophy: "/brand/leaderboard-trophy-1st.svg", label: "First place" },
  2: { ring: "from-[#e8e8e8] to-[#9a9a9a]", trophy: "/brand/leaderboard-trophy-2nd.svg", label: "Second place" },
  3: { ring: "from-[#d7a06b] to-[#8c5a34]", trophy: "/brand/leaderboard-trophy-3rd.svg", label: "Third place" },
};

function ChangeIndicator({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="flex items-center gap-1 text-neutral-500">
        <TrendFlatIcon className="size-2.5" />
        <span className="font-geist text-xs">Holding</span>
      </span>
    );
  }
  const isUp = change > 0;
  return (
    <span className={`flex items-center gap-1 ${isUp ? "text-[#4ade80]" : "text-[#f87171]"}`}>
      {isUp ? <TrendUpIcon className="size-2.5" /> : <TrendDownIcon className="size-2.5" />}
      <span className="font-geist text-xs">{Math.abs(change)}</span>
    </span>
  );
}

// Podium display order (silver, gold, bronze) — a classic 2nd/1st/3rd
// layout on sm+, with rank 1 elevated above the other two. On mobile the
// order resets to plain rank order (1, 2, 3) via the `order-*` reset below,
// since the elevated-center effect only reads once there's room to spare.
const PODIUM_ORDER: Record<number, string> = { 1: "order-1 sm:order-2", 2: "order-2 sm:order-1", 3: "order-3" };

export default function Leaderboard() {
  return (
    <section
      id="leaderboard"
      className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
      <SectionBackgroundVector variant="leaderboard" />
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col items-center gap-12 sm:gap-16"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <motion.h2
            variants={staggerItem}
            className="font-jakarta text-2xl font-semibold tracking-tight text-cream sm:text-3xl lg:text-4xl"
          >
            Investor Leaderboard
          </motion.h2>
          <motion.p variants={staggerItem} className="max-w-xl font-sans text-sm text-cream-dim sm:text-base">
            The top 10 AUREX members this cycle, ranked by points earned on
            capital invested.
          </motion.p>
        </div>

        {/* Podium: avatar + nickname float above a "step" block per rank
            (Figma's own literal podium metaphor), no glow blob behind the
            row (removed per request to remove every golden glow from the
            page background). Per follow-up feedback ("the podium doesn't
            need to be black for light mode"), the step's own colors now
            flip with the theme like every other card in the app — dark
            mode still matches the Figma reference's black-to-ink-light
            gradient exactly, light mode gets its own warm, light
            equivalent instead of staying pinned dark. Every color on/in the
            step (avatar circle, trophy label, points, divider) uses the
            normal flipping tokens again for the same reason — a fixed dark-
            mode-only hex only made sense while the step itself was pinned
            dark. */}
        <motion.div variants={staggerItem} className="relative w-full max-w-3xl">
          <div className="relative flex flex-col items-stretch gap-6 sm:flex-row sm:items-end sm:justify-center sm:gap-4">
            {TOP_THREE.map((investor) => {
              const medal = MEDALS[investor.rank];
              const isFirst = investor.rank === 1;
              return (
                <div
                  key={investor.nickname}
                  className={`${PODIUM_ORDER[investor.rank]} flex flex-1 flex-col items-center ${isFirst ? "sm:-mt-6" : ""}`}
                >
                  <div
                    className={`flex items-center justify-center rounded-full bg-gradient-to-br p-[3px] ${medal.ring}`}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full bg-panel text-gold-bright ${
                        isFirst ? "size-16 sm:size-20" : "size-14 sm:size-16"
                      }`}
                    >
                      <span className={`font-jakarta font-bold ${isFirst ? "text-xl sm:text-2xl" : "text-lg"}`}>
                        {investor.initials}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 font-jakarta text-base font-semibold text-cream sm:text-lg">
                    {investor.nickname}
                  </p>

                  <div className="mt-4 flex w-full flex-col items-center">
                    {/* Beveled top facet — reproduces the Figma reference's
                        "Vector 193" shape exactly: a trapezoid, narrower at
                        the top than the bottom, giving the step a faceted
                        3D edge instead of a plain rounded corner (there's no
                        border-radius anywhere on this element in the
                        source design — square corners are AUREX's own
                        established chrome, same as CustomSelect's popup). */}
                    <div
                      aria-hidden="true"
                      className="h-3 w-full bg-black light:bg-white sm:h-4"
                      style={{ clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)" }}
                    />
                    <div
                      className={`flex w-full flex-col items-center gap-2 bg-gradient-to-b from-black to-ink-light px-4 pb-5 text-center light:border light:border-t-0 light:border-gold/20 light:from-white light:to-[#f3ecd9] ${
                        isFirst ? "pt-4" : "pt-3"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={medal.trophy} alt="" className="size-[30px]" />
                      <span className="font-jakarta text-xs font-medium text-cream">{medal.label}</span>
                      <p className="flex items-baseline gap-1.5 border-t border-cream/10 pt-2">
                        <span className="font-jakarta text-2xl font-bold text-gold-bright sm:text-3xl">
                          {investor.points.toLocaleString()}
                        </span>
                        <span className="font-jakarta text-xs text-cream-dim">pts</span>
                      </p>
                      <ChangeIndicator change={investor.change} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Ranks 4-10 as a plain scannable list, per the Figma reference —
            each row a HorizontalBorder divider (border-gold/20), not a
            grouped/pill row. */}
        <motion.div variants={staggerItem} className="flex w-full max-w-3xl flex-col">
          {REST.map((investor) => (
            <div
              key={investor.nickname}
              className="flex items-center gap-4 border-b border-gold/20 py-4 first:pt-0 last:border-b-0"
            >
              <span className="w-6 shrink-0 font-geist text-sm font-semibold text-cream-dim">{investor.rank}</span>

              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-[#3d392f] light:bg-[#eee]">
                <span className="font-jakarta text-xs font-bold text-gold-bright">{investor.initials}</span>
              </div>

              <span className="flex-1 truncate font-jakarta text-sm font-medium text-cream sm:text-base">
                {investor.nickname}
              </span>

              <span className="shrink-0 font-jakarta text-sm font-semibold text-gold-bright sm:text-base">
                {investor.points.toLocaleString()} <span className="text-xs font-normal text-cream-dim">pts</span>
              </span>

              <span className="w-14 shrink-0 text-right">
                <ChangeIndicator change={investor.change} />
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
