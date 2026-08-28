"use client";

import LeaderboardView from "@/components/leaderboard/LeaderboardView";
import { getLeaderboard } from "@/lib/leaderboard";
import { useAuth } from "@/lib/auth/AuthContext";
import { MOCK_INVESTOR } from "@/lib/investorPortfolio";

/**
 * The same public leaderboard content (components/leaderboard/
 * LeaderboardView.tsx, the exact component behind /leaderboard) embedded
 * as this dashboard's own tab, rather than a link out to a separate page
 * — an investor viewing this from inside their own dashboard is exactly
 * the "already-registered member" case that component's own
 * `currentUserNickname` prop exists for: it highlights their row with a
 * "You" tag, and skips the bottom "join us" CTA entirely, both for free,
 * just by passing their nickname in directly instead of through a `?me=`
 * query param.
 *
 * "use client" + useAuth() (not useRequireAuth — the layout above
 * already gates this whole route on being logged in) so this highlights
 * the real signed-in nickname rather than the mock investor's; no
 * <Metadata> export here since a client component page can't export one
 * — DashboardLayout's own header already identifies the screen.
 */
export default function DashboardLeaderboardPage() {
  const { user } = useAuth();
  return <LeaderboardView entries={getLeaderboard()} currentUserNickname={user?.nickname ?? MOCK_INVESTOR.nickname} />;
}
