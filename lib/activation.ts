import { apiFetch } from "@/lib/api/client";

export type ApplicationTrack = "investor" | "business";

export type ActivationTokenResult =
  | { state: "valid"; nickname: string; email: string; track: ApplicationTrack }
  | { state: "expired" }
  | { state: "already_used" };

export async function validateActivationToken(token: string | null): Promise<ActivationTokenResult> {
  if (!token) return { state: "expired" };
  const { data } = await apiFetch<ActivationTokenResult>("/auth/activate/validate", {
    method: "POST",
    body: { token },
  });
  return data;
}

export type ActivateAccountResult = { nickname: string; track: ApplicationTrack };

export async function activateAccount(token: string, password: string): Promise<ActivateAccountResult> {
  const { data } = await apiFetch<ActivateAccountResult>("/auth/activate", {
    method: "POST",
    body: { token, password },
  });
  return data;
}

export async function resendActivationEmail(token: string | null): Promise<{ message: string }> {
  await apiFetch("/auth/activate/resend", { method: "POST", body: { token } });
  return { message: "If this link is still valid, a new one has been sent." };
}
