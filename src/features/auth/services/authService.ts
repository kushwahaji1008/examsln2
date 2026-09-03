import * as authApi from '@/services/api/authApi';
import type { 
  AuthResponse, 
  LoginPayload, 
  RegisterPayload, 
  User 
} from '../types/auth';

export interface RegisterResponse {
  status: number;
  data?: AuthResponse;
}

/**
 * Authenticates a user with email and password credentials.
 */
export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  return await authApi.login(data);
};

/**
 * Registers a new user account.
 */
export const registerUser = async (data: RegisterPayload): Promise<RegisterResponse> => {
  try {
    const res = await authApi.register(data);
    return {
      status: 200,
      data: res,
    };
  } catch (err: any) {
    return {
      status: err?.response?.status || 400,
      data: undefined,
    };
  }
};

/**
 * Retrieves the currently authenticated user's profile details.
 */
export const getMe = async (): Promise<User> => {
  return await authApi.getMe();
};

// ==========================================
// OTP & PASSWORD MANAGEMENT
// ==========================================

export const verifyOtp = async (data: { email: string; otp: string }): Promise<AuthResponse> => {
  return await authApi.verifyEmail(data);
};

export const resendOtp = async (email: string) => {
  return await authApi.resendOtp(email);
};

export const forgotPassword = async (email: string) => {
  return await authApi.forgotPassword(email);
};

export const resetPassword = async (data: { email: string; otp: string; newPassword: string }) => {
  return await authApi.resetPassword(data);
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  return await authApi.changePassword(data);
};

export const checkEmailAvailability = async (email: string) => {
  return await authApi.checkEmail(email);
};

export const checkUsernameAvailability = async (username: string) => {
  return await authApi.checkUsername(username);
};

// ==========================================
// PROFILE MANAGEMENT
// ==========================================

export const updateProfile = async (userId: string, data: any) => {
  return await authApi.updateMyProfile(data);
};

export { authApi };
