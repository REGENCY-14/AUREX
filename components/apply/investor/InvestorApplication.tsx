"use client";

import MultiStepFormShell from "@/components/apply/MultiStepFormShell";
import IdentityContactStep from "@/components/apply/investor/IdentityContactStep";
import NicknameStep from "@/components/apply/investor/NicknameStep";
import StepThreePlaceholder from "@/components/apply/investor/StepThreePlaceholder";
import { initialInvestorFormData, type InvestorFormData } from "@/components/apply/investor/types";
import type { StepDefinition } from "@/components/apply/types";

// The full intended flow: Identity & Contact -> Nickname -> ID Upload ->
// Optional Details -> Review & Submit -> Confirmation. Only the first
// three are implemented (see StepThreePlaceholder's own comment for why),
// but every label is listed here so MultiStepFormShell's progress
// indicator can show "Step X of 6" against the real flow length instead
// of just however many steps happen to exist so far.
const STEP_LABELS = [
  "Identity & Contact",
  "Nickname",
  "ID Upload",
  "Optional Details",
  "Review & Submit",
  "Confirmation",
];

const STEPS: StepDefinition<InvestorFormData>[] = [
  { id: "identity-contact", label: STEP_LABELS[0], render: (props) => <IdentityContactStep {...props} /> },
  { id: "nickname", label: STEP_LABELS[1], render: (props) => <NicknameStep {...props} /> },
  { id: "id-upload-placeholder", label: STEP_LABELS[2], render: (props) => <StepThreePlaceholder {...props} /> },
];

export default function InvestorApplication() {
  return (
    <MultiStepFormShell
      steps={STEPS}
      totalSteps={STEP_LABELS.length}
      initialValues={initialInvestorFormData}
      eyebrow="AUREX Investor Application"
    />
  );
}
