/**
 * User roles mapping to backend schema definitions.
 */
export enum UserRole {
  Student = 0,
  Teacher = 1,
  Admin = 2,
  SuperAdmin = 3,
}

/**
 * Core User entity representation.
 */
export interface User {
  userId: string;
  email: string;
  userName: string;
  fullName: string;
  phone?: string | null;
  role: UserRole | string | number;
  createdAt: string;
  lastLoginAt?: string | null;
  profilePicture?: string | null;
  isEmailVerified: boolean;
  mfaEnabled: boolean;
}

/**
 * Credentials required for login operations.
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Data payload required for registering a new user account.
 */
export interface RegisterPayload extends LoginPayload {
  fullName: string;
  phone?: string;
  role: UserRole;
}

/**
 * Standard backend authentication response payload.
 */


export interface AuthResponse {
  message?: string;
  token: string;
  refreshToken: string; // <-- ADD THIS LINE
  user: User;
}