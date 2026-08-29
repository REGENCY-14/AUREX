/**
 * Mock data/stubs for the "Create Your Account" activation flow — the
 * screen a newly approved applicant reaches from the unique link Admin's
 * approval action would have emailed them. The applicant already gave
 * their nickname and email during their application (see
 * components/apply/investor/NicknameStep.tsx / IdentityContactStep.tsx and
 * their Business Owner equivalents) — this flow only ever asks for a
 * password, never re-collects anything already on file.
 *
 * No backend or email delivery exists yet, so every function here
 * simulates one: MOCK_TOKENS stands in for "tokens Admin has issued and
 * their current state" (a real backend would look this up server-side
 * instead), with a network delay and — for the one action that can fail —
 * a simulated failure, same shape as lib/reports.ts's submitReport.
 */

export type ApplicationTrack = "investor" | "business";

type MockTokenRecord =
  | { state: "valid"; nickname: string; email: string; track: ApplicationTrack }
  | { state: "expired" }
  | { state: "already_used" };

export type ActivationTokenResult = MockTokenRecord;

// Stand-ins for tokens a real "application approved" action would have
// generated and emailed out. Visit /activate with no ?token at all to see
// the happy path (falls back to DEFAULT_TOKEN below); use these to see
// the other two:
//   /activate?token=expired-demo
//   /activate?token=used-demo
// Any other unrecognized token also resolves as "expired" — from the
// applicant's side, a token we don't recognize and one that's simply too
// old read the same ("this link doesn't work anymore"), and the brief
// calls for exactly three states, not a fourth "invalid" bucket.
const MOCK_TOKENS: Record<string, MockTokenRecord> = {
  "demo-investor-token": { state: "valid", nickname: "GoldFalcon", email: "goldfalcon@example.com", track: "investor" },
  "demo-business-token": { state: "valid", nickname: "AcmeFoods", email: "owner@acmefoods.com", track: "business" },
  "expired-demo": { state: "expired" },
  "used-demo": { state: "already_used" },
};

const DEFAULT_TOKEN = "demo-investor-token";

export async function validateActivationToken(token: string | null): Promise<ActivationTokenResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));
  return (token && MOCK_TOKENS[token]) || MOCK_TOKENS[DEFAULT_TOKEN];
}

export type ActivateAccountResult = { nickname: string; track: ApplicationTrack };

/**
 * `password` is threaded through (rather than dropped) so the call site
 * reads exactly like the real request it stands in for — a real backend
 * would receive it here to hash and store; there's nothing to send it to
 * yet. Fails ~1 in 4 tries, same "realistic delay, occasional simulated
 * failure" shape as submitReport, so ActivationFlow's error+retry state is
 * actually reachable rather than dead code.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function activateAccount(token: string, password: string): Promise<ActivateAccountResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 900));
  if (Math.random() < 0.25) {
    throw new Error("Something went wrong setting up your account. Please try again.");
  }
  const record = MOCK_TOKENS[token] ?? MOCK_TOKENS[DEFAULT_TOKEN];
  // Defensive only — ActivationFlow never renders the password form (and so
  // never calls this) outside the "valid" token state.
  if (record.state !== "valid") {
    throw new Error("This activation link is no longer valid.");
  }
  return { nickname: record.nickname, track: record.track };
}

export async function resendActivationEmail(): Promise<{ message: string }> {
  await new Promise((resolve) => window.setTimeout(resolve, 600));
  return { message: "A new link has been sent to your email." };
}
