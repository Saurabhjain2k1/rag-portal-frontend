// src/api/chatApi.ts
import api from "./client";


export interface ChatResponse {
  answer: string;
  sources: any[];
}

export async function askChat(query: string): Promise<ChatResponse> {
  const res = await api.post<ChatResponse>("/chat/query", { query });
  return res.data;
}
