"use client";

import { useEffect, useState } from "react";
import LeaderboardView from "@/components/leaderboard/LeaderboardView";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMyListing, type BusinessListing } from "@/lib/businessListing";

export default function BusinessDashboardLeaderboardPage() {
  const { user, isLoading } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [listing, setListing] = useState<BusinessListing | null>(null);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    Promise.all([getLeaderboard(), getMyListing()]).then(([e, l]) => {
      if (cancelled) return;
      setEntries(e);
      setListing(l ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoading, user]);

  return <LeaderboardView entries={entries} currentUserNickname={user?.nickname ?? listing?.ownerNickname} />;
}
