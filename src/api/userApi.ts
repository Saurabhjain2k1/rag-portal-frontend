import api from "./client";

export interface UserDTO {
  id: number;
  email: string;
  role: "admin" | "user";
  created_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface UpdateUserRequest {
  email?: string;
  role?: "admin" | "user";
  password?: string;
}

export interface UserListResponse {
  items: UserDTO[];
  total: number;
}

export async function fetchUsers(
  page: number,          // 0-based page index
  pageSize: number,
  search: string
): Promise<UserListResponse> {
  const skip = page * pageSize;

  const res = await api.get<UserListResponse>("/users", {
    params: {
      skip,
      limit: pageSize,
      search: search || undefined,
    },
  });

  return res.data;
}

export async function createUser(data: CreateUserRequest): Promise<UserDTO> {
  const res = await api.post<UserDTO>("/users", data);
  return res.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}

export async function updateUser(
  userId: number,
  payload: UpdateUserRequest
): Promise<UserDTO> {
  return (await api.patch<UserDTO>(`/users/${userId}`, payload)).data;
}