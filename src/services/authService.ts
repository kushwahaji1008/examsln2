import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: number;
  };
}

export const loginUser = async (data: LoginRequest) => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};
