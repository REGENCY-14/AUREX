import { uploadIdDocument } from "@/lib/idUpload";
import type { InvestorFormData } from "@/components/apply/investor/types";

/**
 * Submission for Step 5 of the Investor Application ("Review & Submit" —
 * see components/apply/investor/ReviewSubmitStep.tsx). There's no backend
 * to submit to yet, so this is a stub: it awaits a short artificial delay
 * (so the review step's loading state is real, not instant) and resolves
 * to a mocked result, occasionally failing on purpose so the review step's
 * retry path has something real to exercise before a backend exists.
 *
 * Does call the one real piece of Step 3's own pipeline that was waiting
 * for a caller — lib/idUpload.ts's uploadIdDocument stub, per its own
 * comment ("nothing calls this yet — it exists so whichever later step
 * actually submits the application ... can call it"). Swapping this whole
 * function for a real API call later shouldn't require touching
 * ReviewSubmitStep itself.
 */
export type SubmitInvestorApplicationResult = { success: true } | { success: false; error: string };

const SIMULATED_DELAY_MS = 1200;
const SIMULATED_FAILURE_RATE = 0.2;

export async function submitInvestorApplication(values: InvestorFormData): Promise<SubmitInvestorApplicationResult> {
  if (values.idDocument) {
    await uploadIdDocument(values.idDocument);
  }

  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

  if (Math.random() < SIMULATED_FAILURE_RATE) {
    return { success: false, error: "Something went wrong submitting your application. Please try again." };
  }

  return { success: true };
}
