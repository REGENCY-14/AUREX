import { apiUpload, ApiError } from "@/lib/api/client";
import type { InvestorFormData } from "@/components/apply/investor/types";

export type SubmitInvestorApplicationResult = { success: true } | { success: false; error: string };

export async function submitInvestorApplication(values: InvestorFormData): Promise<SubmitInvestorApplicationResult> {
  const formData = new FormData();
  formData.set("type", "investor");
  formData.set("full_name", values.fullName);
  formData.set("email", values.email);
  formData.set("phone_country", values.phoneCountry.toUpperCase());
  formData.set("phone_number", values.phoneNumber);
  formData.set("nickname", values.nickname);
  formData.set("country_of_residence", values.countryOfResidence.toUpperCase());
  if (values.idType) formData.set("id_type", values.idType);
  if (values.investmentRange) formData.set("investment_range", values.investmentRange);
  if (values.sourceOfFunds) formData.set("source_of_funds", values.sourceOfFunds);
  if (values.referralSource) formData.set("referral_source", values.referralSource);
  if (values.idDocument) formData.set("id_document", values.idDocument);

  try {
    await apiUpload("/applications", formData);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof ApiError ? err.message : "Something went wrong submitting your application. Please try again.",
    };
  }
}
