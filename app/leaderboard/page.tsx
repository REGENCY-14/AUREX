import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import LeaderboardView from "@/components/leaderboard/LeaderboardView";
import { getLeaderboard } from "@/lib/leaderboard";

export const metadata: Metadata = {
  title: "Investor Leaderboard | AUREX",
  description: "See the top AUREX investors ranked by total amount invested, by nickname only.",
};

/**
 * The standalone, public /leaderboard page — no auth required, since this
 * is the full version of the "top 10" teaser already on the home page
 * (components/Leaderboard.tsx, left untouched — that's a separate, smaller
 * component this page doesn't replace) and the destination both the
 * Investor and Business Owner dashboards link out to for "more detail".
 *
 * `?me=<nickname>` is how a logged-in investor's own row gets highlighted:
 * there's no real session/auth yet (same situation as every other
 * dashboard on this site — see app/business-dashboard/page.tsx's own
 * `?status=` stub for the identical pattern), so the Investor Dashboard
 * passes its own nickname through as a query param when it links here
 * rather than this page reading it from a session that doesn't exist.
 * Left off entirely, the page renders exactly as a logged-out/non-
 * registered visitor sees it — its primary audience — join CTA included.
 */
export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ me?: string }>;
}) {
  const { me } = await searchParams;
  const entries = getLeaderboard();

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center pb-16 pt-[72px] sm:pt-[84px]">
        <PageBanner title="AUREX Investor Leaderboard" description="Ranked by total amount invested" />
        <div className="flex w-full max-w-[1280px] flex-col px-4 sm:px-6 lg:px-20">
          <LeaderboardView entries={entries} currentUserNickname={me} />
        </div>
      </main>
      <Footer />
    </>
  );
}
