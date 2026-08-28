import { apiUpload, ApiError } from "@/lib/api/client";
import type { BusinessOwnerFormData } from "@/components/apply/business/types";

export type SubmitBusinessOwnerApplicationResult = { success: true } | { success: false; error: string };

export async function submitBusinessOwnerApplication(
  values: BusinessOwnerFormData,
): Promise<SubmitBusinessOwnerApplicationResult> {
  const formData = new FormData();
  formData.set("type", "business");
  formData.set("full_name", values.fullName);
  formData.set("business_name", values.businessName);
  formData.set("email", values.email);
  formData.set("phone_country", values.phoneCountry.toUpperCase());
  formData.set("phone_number", values.phoneNumber);
  formData.set("country_of_operation", values.countryOfOperation.toUpperCase());
  formData.set("business_description", values.businessDescription);
  formData.set("funding_amount", values.fundingAmount);
  formData.set("nickname", values.nickname);
  if (values.idType) formData.set("id_type", values.idType);
  if (values.referralSource) formData.set("referral_source", values.referralSource);
  if (values.idDocument) formData.set("id_document", values.idDocument);
  if (values.businessRegistrationDocument) {
    formData.set("business_registration_document", values.businessRegistrationDocument);
  }

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
