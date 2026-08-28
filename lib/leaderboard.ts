/**
 * The public Investor Leaderboard (app/leaderboard/page.tsx +
 * components/leaderboard/LeaderboardView.tsx). No ranking backend exists
 * yet, so this is realistic mock data shaped exactly like what a real
 * "GET /api/leaderboard"-style endpoint would eventually return: a flat
 * list of { nickname, amountInvestedGhs } rows, ranked here by amount
 * invested descending. Swapping in a real endpoint later means replacing
 * only `getLeaderboard`'s body (e.g. an async fetch) — every caller already
 * treats it as the single source of ranked rows and doesn't do its own
 * sorting.
 *
 * Nickname only, on purpose, same rule as everywhere else on the site a
 * member's identity is shown (see lib/investorPortfolio.ts, the apply/
 * Nickname steps) — a real name is never collected for this list, and
 * there's no opt-out from appearing here: investing ranks you.
 *
 * "GoldFalcon" (lib/investorPortfolio.ts's MOCK_INVESTOR) is deliberately
 * included here, outside the top 3, so the current-user highlight
 * (LeaderboardView's `currentUserNickname` prop) has a real row to
 * demonstrate against without needing "Load More" first.
 */

export type LeaderboardEntry = {
  rank: number;
  nickname: string;
  amountInvestedGhs: number;
};

const MOCK_LEADERBOARD_ROWS: Omit<LeaderboardEntry, "rank">[] = [
  { nickname: "IronVault", amountInvestedGhs: 1_450_000 },
  { nickname: "NorthStarX", amountInvestedGhs: 1_180_000 },
  { nickname: "SilkRoad88", amountInvestedGhs: 990_000 },
  { nickname: "CrestlineJ", amountInvestedGhs: 860_000 },
  { nickname: "AtlasReturn", amountInvestedGhs: 780_000 },
  { nickname: "GoldFalcon", amountInvestedGhs: 715_000 },
  { nickname: "MidasTouch", amountInvestedGhs: 668_000 },
  { nickname: "QuietCapital", amountInvestedGhs: 612_000 },
  { nickname: "EmberYield", amountInvestedGhs: 574_000 },
  { nickname: "VaultKeeper", amountInvestedGhs: 538_000 },
  { nickname: "RegalHorizon", amountInvestedGhs: 501_000 },
  { nickname: "CedarPeakCap", amountInvestedGhs: 468_000 },
  { nickname: "SapphireTrail", amountInvestedGhs: 442_000 },
  { nickname: "BrightHarbor", amountInvestedGhs: 409_000 },
  { nickname: "StonebridgeCo", amountInvestedGhs: 378_000 },
  { nickname: "AmberCrestFnd", amountInvestedGhs: 345_000 },
  { nickname: "LunarYieldCo", amountInvestedGhs: 312_000 },
  { nickname: "TerraNovaGain", amountInvestedGhs: 289_000 },
  { nickname: "PearlHavenInv", amountInvestedGhs: 254_000 },
  { nickname: "WillowRidgeCp", amountInvestedGhs: 221_000 },
];

/** Ranked leaderboard rows, sorted by total amount invested descending.
 *  Kept as a plain sync function today (mock data is already in memory);
 *  a real implementation would make this `async` and the two call sites
 *  (app/leaderboard/page.tsx) would just gain an `await`. */
export function getLeaderboard(): LeaderboardEntry[] {
  return [...MOCK_LEADERBOARD_ROWS]
    .sort((a, b) => b.amountInvestedGhs - a.amountInvestedGhs)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}
