export type InvestorFormData = {
  fullName: string;
  email: string;
  /** ISO 3166-1 alpha-2, e.g. "GH" — the phone number's dialing country,
   *  independent of countryOfResidence (an applicant may live somewhere
   *  other than where their WhatsApp-reachable number is registered). */
  phoneCountry: string;
  phoneNumber: string;
  /** ISO 3166-1 alpha-2. */
  countryOfResidence: string;
  /** Step 2 — the public display name shown anywhere the applicant's
   *  identity appears on AUREX (members list, leaderboard, etc.); their
   *  real name (fullName, above) stays admin-only. */
  nickname: string;
};

// Defaults phoneCountry to Ghana (AUREX's home market — see the "+233"
// numbers already in Footer.tsx/ContactInfo.tsx) as the most likely
// applicant, while every other country stays one selection away.
export const initialInvestorFormData: InvestorFormData = {
  fullName: "",
  email: "",
  phoneCountry: "GH",
  phoneNumber: "",
  countryOfResidence: "",
  nickname: "",
};
