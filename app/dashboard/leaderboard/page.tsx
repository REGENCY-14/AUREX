"use client";

import { useEffect, useState } from "react";
import LeaderboardView from "@/components/leaderboard/LeaderboardView";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";
import { useAuth } from "@/lib/auth/AuthContext";
import { MOCK_INVESTOR } from "@/lib/investorPortfolio";

export default function DashboardLeaderboardPage() {
  const { user, isLoading } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    getLeaderboard().then((data) => {
      if (!cancelled) setEntries(data);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoading, user]);

  return <LeaderboardView entries={entries} currentUserNickname={user?.nickname ?? MOCK_INVESTOR.nickname} />;
}
