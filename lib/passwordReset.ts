import { apiFetch } from "@/lib/api/client";

export type PasswordResetTokenState = { state: "valid" } | { state: "expired" };

export async function requestPasswordReset(email: string): Promise<void> {
  await apiFetch("/auth/forgot-password", { method: "POST", body: { email } });
}

export async function validatePasswordResetToken(token: string | null): Promise<PasswordResetTokenState> {
  if (!token) return { state: "expired" };
  const { data } = await apiFetch<PasswordResetTokenState>("/auth/reset-password/validate", {
    method: "POST",
    body: { token },
  });
  return data;
}

export async function resetPassword(params: { token: string; newPassword: string }): Promise<void> {
  await apiFetch("/auth/reset-password", { method: "POST", body: params });
}
