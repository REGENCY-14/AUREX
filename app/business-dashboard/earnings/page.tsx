"use client";

import { useEffect, useState } from "react";
import FundingProgressSection from "@/components/dashboard/business/FundingProgressSection";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMyListing, type BusinessListing } from "@/lib/businessListing";

export default function BusinessDashboardEarningsPage() {
  const { user, isLoading } = useAuth();
  const [listing, setListing] = useState<BusinessListing | null | undefined>(undefined);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    getMyListing().then((data) => {
      if (!cancelled) setListing(data ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoading, user]);

  if (listing === undefined) {
    return <p className="px-4 py-10 text-center font-sans text-sm text-cream-dim">Loading…</p>;
  }

  if (listing === null || listing.status === "pending") {
    return (
      <div className="flex flex-col items-center gap-2 border border-grid-line py-12 text-center">
        <p className="font-jakarta text-sm font-medium text-cream">No earnings to show yet.</p>
        <p className="max-w-sm font-sans text-sm text-cream-dim">
          AUREX Admin is still reviewing your listing. Funding figures will appear here once it goes live.
        </p>
      </div>
    );
  }

  return <FundingProgressSection listing={listing} />;
}
