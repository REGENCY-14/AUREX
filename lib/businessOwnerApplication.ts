import { uploadDocument } from "@/lib/businessDocuments";
import type { BusinessOwnerFormData } from "@/components/apply/business/types";

/**
 * Submission for Step 5 of the Business Owner Application ("Review &
 * Submit" — see components/apply/business/ReviewSubmitStep.tsx). Mirrors
 * lib/investorApplication.ts's own stub exactly (same simulated delay,
 * same simulated failure rate) so the two flows' retry/loading behavior
 * feels identical — the only real difference is that this one uploads
 * *two* documents instead of one.
 */
export type SubmitBusinessOwnerApplicationResult = { success: true } | { success: false; error: string };

const SIMULATED_DELAY_MS = 1200;
const SIMULATED_FAILURE_RATE = 0.2;

export async function submitBusinessOwnerApplication(
  values: BusinessOwnerFormData,
): Promise<SubmitBusinessOwnerApplicationResult> {
  if (values.idDocument) {
    await uploadDocument(values.idDocument, "id");
  }
  if (values.businessRegistrationDocument) {
    await uploadDocument(values.businessRegistrationDocument, "business-registration");
  }

  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

  if (Math.random() < SIMULATED_FAILURE_RATE) {
    return { success: false, error: "Something went wrong submitting your application. Please try again." };
  }

  return { success: true };
}
