"use client";

import { useSearchParams } from "next/navigation";
import LeaderboardView from "@/components/leaderboard/LeaderboardView";
import { getLeaderboard } from "@/lib/leaderboard";
import { useAuth } from "@/lib/auth/AuthContext";
import { MOCK_LISTINGS, parseListingStatus } from "@/lib/businessListing";

/**
 * The Business Owner's "Leaderboard" tab — the same investor leaderboard
 * every member can see (a business owner doesn't invest, so they never
 * appear as a row themselves). `currentUserNickname` is still passed —
 * not to highlight a row that will never match, but because that's also
 * what suppresses LeaderboardView's own "join us" CTA, which a
 * registered member (any role) shouldn't see. Real auth nickname first,
 * falling back to the mock listing's owner nickname, same pattern as the
 * layout's own displayName.
 */
export default function BusinessDashboardLeaderboardPage() {
  const { user } = useAuth();
  const status = parseListingStatus(useSearchParams().get("status") ?? undefined);
  const listing = MOCK_LISTINGS[status];

  return <LeaderboardView entries={getLeaderboard()} currentUserNickname={user?.nickname ?? listing.ownerNickname} />;
}
