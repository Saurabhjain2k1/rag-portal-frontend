// src/api/profileApi.ts
import api from "./client";

export interface MeResponse {
  id: number;
  email: string;
  role: "admin" | "user";
  tenant_id: number;
  created_at: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export async function fetchMe(): Promise<MeResponse> {
  const res = await api.get<MeResponse>("/auth/me");
  return res.data;
}

export async function changePassword(
  payload: ChangePasswordRequest
): Promise<void> {
  await api.post("/auth/change-password", payload);
}
