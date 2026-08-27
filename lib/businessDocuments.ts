/**
 * Document-upload stub for Step 3 of the Business Owner Application (see
 * components/apply/business/DocumentUploadStep.tsx) — the validation rules
 * and ID-type list themselves are generic and shared with the Investor
 * flow's own ID Upload step; see lib/fileValidation.ts.
 */

export {
  MAX_FILE_SIZE_BYTES,
  FILE_INPUT_ACCEPT,
  ID_TYPE_OPTIONS,
  getFileError,
  formatFileSize,
} from "@/lib/fileValidation";

export type DocumentType = "id" | "business-registration";

/**
 * Stub — there's no backend/storage bucket to upload to yet. Step 3 only
 * holds each File object in the shared form state; nothing calls this
 * until Review & Submit actually submits the application (see
 * lib/businessOwnerApplication.ts). `type` distinguishes which of the two
 * document fields this is, so a real implementation can route each to the
 * right place without this call site needing to change.
 */
export async function uploadDocument(file: File, type: DocumentType): Promise<{ url: string }> {
  void file;
  void type;
  return { url: "" };
}
