import { apiFetch } from "@/lib/api/client";

export type LeaderboardEntry = {
  rank: number;
  nickname: string;
  amountInvestedGhs: number;
};

const POINTS_PER_DOLLAR = 1 / 100;
export function toPoints(amountInvestedGhs: number): number {
  return Math.round((amountInvestedGhs * POINTS_PER_DOLLAR) / 10) * 10;
}

type LeaderboardApiRow = { nickname: string; amount_invested: string };

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const { data } = await apiFetch<LeaderboardApiRow[]>("/leaderboard");
    return data.map((row, i) => ({ rank: i + 1, nickname: row.nickname, amountInvestedGhs: Number(row.amount_invested) }));
  } catch {
    return [];
  }
}
