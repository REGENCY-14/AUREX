"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import { TrendUpIcon, TrendDownIcon, TrendFlatIcon } from "@/components/icons";

// Not from Figma — there's no leaderboard design at the link given for
// this section, so this was built from the user's own spec: nickname,
// points (money invested converted to a point scale), rank, and a
// progressing/dropping/holding indicator, with the top 3 rendered as a
// distinct gold/silver/bronze podium.
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

// Per-rank medal treatment for the podium — distinct gradient rings/badges
// (gold/silver/bronze) rather than one shared style, per request that the
// top 3 "should be unique". Podium display order (silver, gold, bronze)
// is handled via the `order` classes below, independent of this map.
const MEDALS: Record<number, { ring: string; badge: string; label: string }> = {
  1: { ring: "from-[#f2ca50] to-[#a67c1f]", badge: "bg-gradient-to-br from-[#f2ca50] to-[#a67c1f] text-[#241c04]", label: "1st" },
  2: { ring: "from-[#e8e8e8] to-[#9a9a9a]", badge: "bg-gradient-to-br from-[#e8e8e8] to-[#9a9a9a] text-[#1a1a1a]", label: "2nd" },
  3: { ring: "from-[#d7a06b] to-[#8c5a34]", badge: "bg-gradient-to-br from-[#d7a06b] to-[#8c5a34] text-[#241804]", label: "3rd" },
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

        {/* Podium: a soft gold glow sits behind the whole row (not just
            individually per card) so the top 3 stand out from the ranked
            list below, per request. */}
        <motion.div variants={staggerItem} className="relative w-full max-w-3xl">
          <div className="pointer-events-none absolute inset-x-8 top-1/2 h-40 -translate-y-1/2 rounded-full bg-gold-bright/25 blur-[60px]" />

          <div className="relative flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-center sm:gap-4">
            {TOP_THREE.map((investor) => {
              const medal = MEDALS[investor.rank];
              const isFirst = investor.rank === 1;
              return (
                <div
                  key={investor.nickname}
                  className={`${PODIUM_ORDER[investor.rank]} flex flex-1 flex-col items-center gap-3 border border-gold/30 bg-panel/60 p-6 text-center backdrop-blur-2xl sm:p-6 ${
                    isFirst ? "sm:-mt-6 sm:pb-8 sm:pt-8" : ""
                  }`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full font-jakarta text-xs font-bold ${medal.badge}`}
                  >
                    {investor.rank}
                  </span>

                  {/* text-gold-bright, not text-cream: bg-ink-light is one
                      of the deliberately-non-flipping dark tokens (see
                      globals.css), so its label needs a color that also
                      doesn't flip — text-cream turns near-black in light
                      mode and becomes unreadable against it. */}
                  <div
                    className={`flex items-center justify-center rounded-full bg-gradient-to-br p-[3px] ${medal.ring}`}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full bg-ink-light text-gold-bright ${
                        isFirst ? "size-16 sm:size-20" : "size-14 sm:size-16"
                      }`}
                    >
                      <span className={`font-jakarta font-bold ${isFirst ? "text-xl sm:text-2xl" : "text-lg"}`}>
                        {investor.initials}
                      </span>
                    </div>
                  </div>

                  <p className="font-jakarta text-base font-semibold text-cream sm:text-lg">{investor.nickname}</p>

                  <p className="flex items-baseline gap-1.5">
                    <span className="font-jakarta text-2xl font-bold text-gold-bright sm:text-3xl">
                      {investor.points.toLocaleString()}
                    </span>
                    <span className="font-jakarta text-xs text-cream-dim">pts</span>
                  </p>

                  <ChangeIndicator change={investor.change} />
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Ranks 4-10 as a plain scannable list. */}
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
