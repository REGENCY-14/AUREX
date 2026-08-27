"use client";

import { useEffect } from "react";
import { ID_TYPE_OPTIONS } from "@/lib/businessDocuments";
import { FormField, fieldClassName, optionStyle } from "@/components/apply/FormField";
import DocumentUploadField from "@/components/apply/DocumentUploadField";
import { ChevronDownIcon, SecurityIcon } from "@/components/icons";
import type { StepProps } from "@/components/apply/types";
import type { BusinessOwnerFormData } from "@/components/apply/business/types";

const FILE_HINT = "JPG, PNG, or PDF · up to 10MB · on a phone, your camera is usually offered as an option too";

/**
 * Step 3 of 6 — "Document Upload". The Business Owner flow's equivalent
 * of the Investor flow's ID Upload step, but with two separate documents
 * instead of one: the applicant's own government-issued ID, and the
 * business's own registration/incorporation document. Both use the same
 * shared DocumentUploadField (drag-drop, preview, remove/replace,
 * JPG/PNG/PDF-under-10MB validation) as the Investor flow's single field —
 * see that component's own comment.
 *
 * "Continue" needs *both* files, not just one — this is the highest-
 * friction step in either flow, so the trust messaging stays visible
 * (matching IdUploadStep's own reasoning) rather than being buried above
 * the fold.
 */
export default function DocumentUploadStep({ values, updateValues, onValidityChange }: StepProps<BusinessOwnerFormData>) {
  const isValid = values.idDocument !== null && values.businessRegistrationDocument !== null;

  useEffect(() => {
    onValidityChange(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Document Upload</h1>
        <p className="flex items-start gap-2 font-sans text-sm leading-6 text-cream-dim sm:text-base">
          <SecurityIcon className="mt-0.5 size-4 shrink-0 text-gold-muted" />
          <span>
            These documents are only visible to AUREX admin as part of reviewing your application, and are never
            shown publicly or to other members.
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <DocumentUploadField
          id="idDocument"
          label="Government-Issued ID"
          hint={FILE_HINT}
          file={values.idDocument}
          onFileSelected={(file) => updateValues({ idDocument: file })}
          onRemove={() => updateValues({ idDocument: null })}
        />

        <FormField label="ID Type (optional)" htmlFor="idType">
          <div className="relative">
            <select
              id="idType"
              name="idType"
              value={values.idType}
              onChange={(e) => updateValues({ idType: e.target.value })}
              className={fieldClassName(false, "w-full appearance-none pr-10")}
            >
              <option value="" style={optionStyle}>
                Select ID type
              </option>
              {ID_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} style={optionStyle}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-3 -translate-y-1/2 text-gold-bright" />
          </div>
        </FormField>

        <DocumentUploadField
          id="businessRegistrationDocument"
          label="Business Registration Document"
          hint={FILE_HINT}
          file={values.businessRegistrationDocument}
          onFileSelected={(file) => updateValues({ businessRegistrationDocument: file })}
          onRemove={() => updateValues({ businessRegistrationDocument: null })}
        />
      </div>
    </div>
  );
}
