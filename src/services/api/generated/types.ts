// Minimal generated types based on your OpenAPI spec.
export type UserRole = 0 | 1 | 2 | 3;

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string | null;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: UserRole | string;
  createdAt: string;
  lastLoginAt?: string | null;
  profilePicture?: string | null;
}

export interface StartExamRequest {
  examId: string;
}

export interface SubmitAnswerRequest {
  questionId: string;
  selectedOption?: string | null;
  selectedOptions?: string[] | null;
  textAnswer?: string | null;
  codeAnswer?: string | null;
}

export interface SubmitExamRequest {
  attemptId: string;
}
