// src/api/authApi.ts
import api from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserInfo {
  id: number;
  tenant_id: number;
  email: string;
  role: "admin" | "user";
  tenant_name: string
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/login", data);
  return res.data;
}

export async function fetchMe(): Promise<UserInfo> {
  const res = await api.get<UserInfo>("/auth/me");
  return res.data;
}

export interface TenantRegisterRequest {
  tenant_name: string;
  admin_email: string;
  admin_password: string;
}

export interface TenantResponse {
  id: number;
  name: string;
  created_at?: string;
}

export async function registerTenant(
  payload: TenantRegisterRequest
): Promise<TenantResponse> {
  const res = await api.post<TenantResponse>("/auth/register-tenant", payload);
  return res.data;
}
