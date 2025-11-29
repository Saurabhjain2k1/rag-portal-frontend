// src/api/documentsApi.ts
import api from "./client";

export interface DocumentDTO {
  id: number;
  filename: string;
  original_filename?: string;
  status: string;
  size_bytes?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedDocumentsResponse {
  items: DocumentDTO[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchDocuments(page = 1, limit = 10): Promise<PaginatedDocumentsResponse> {
  const res = await api.get("/documents", {
    params: { page, limit },
  });
  return res.data;
}


/** Upload a file */
export async function uploadDocument(file: File): Promise<DocumentDTO> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<DocumentDTO>("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/** Upload a URL */
export async function uploadUrl(url: string): Promise<DocumentDTO> {
  const res = await api.post<DocumentDTO>("/documents/upload-url", { url });
  return res.data;
}

/** Trigger ingestion */
export async function ingestDocument(documentId: number): Promise<void> {
  await api.post(`/documents/${documentId}/ingest`);
}

