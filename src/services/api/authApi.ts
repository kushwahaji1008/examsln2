import apiClient from './client';
import type {
  UserProfile,
  UserSecurityOverview,
  UserActivityLogItem,
  MfaStatusResponse,
  MfaSetupResponse,
  AuthSession,
  AuthDevice,
  CheckAvailabilityResponse,
  ValidateTokenResponse,
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  ChangeEmailRequest,
  AddPhoneRequest,
  MfaSetupRequest,
  MfaVerifyRequest,
  MfaChallengeRequest,
} from './types/api';
import type { 
  AuthResponse, 
  LoginPayload, 
  RegisterPayload, 
  User 
} from '@/features/auth/types/auth';

// ============================================================================
// 1. AUTHENTICATION ENDPOINTS (/api/v1/auth/...)
// ============================================================================

export const register = async (payload: RegisterRequest | RegisterPayload): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/register', payload);
  return res.data;
};

export const login = async (payload: LoginRequest | LoginPayload): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/login', payload);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/api/v1/auth/logout').catch(() => {});
};

export const refreshToken = async (payload: RefreshTokenRequest | { token: string; refreshToken: string }): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/refresh-token', payload);
  return res.data;
};

export const verifyEmail = async (payload: VerifyOtpRequest | { email: string; otp: string }): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/verify-email', payload);
  return res.data;
};

export const resendOtp = async (email: string | ResendOtpRequest): Promise<{ message: string }> => {
  const payload = typeof email === 'string' ? { email } : email;
  const res = await apiClient.post('/api/v1/auth/resend-otp', payload);
  return res.data;
};

export const forgotPassword = async (email: string | ResendOtpRequest): Promise<{ message: string }> => {
  const payload = typeof email === 'string' ? { email } : email;
  const res = await apiClient.post('/api/v1/auth/forgot-password', payload);
  return res.data;
};

export const resetPassword = async (payload: ResetPasswordRequest | { email: string; otp: string; newPassword: string }): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/reset-password', payload);
  return res.data;
};

export const changePassword = async (payload: ChangePasswordRequest | { oldPassword: string; newPassword: string }): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/change-password', payload);
  return res.data;
};

export const checkEmail = async (email: string): Promise<CheckAvailabilityResponse> => {
  const res = await apiClient.post<CheckAvailabilityResponse>('/api/v1/auth/check-email', { value: email });
  return res.data;
};

export const checkUsername = async (username: string): Promise<CheckAvailabilityResponse> => {
  const res = await apiClient.post<CheckAvailabilityResponse>('/api/v1/auth/check-username', { value: username });
  return res.data;
};

export const validateToken = async (token?: string): Promise<ValidateTokenResponse> => {
  const res = await apiClient.post<ValidateTokenResponse>('/api/v1/auth/validate-token', { token: token || localStorage.getItem('token') });
  return res.data;
};

export const revokeToken = async (token?: string): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/revoke-token', { token: token || localStorage.getItem('token') });
  return res.data;
};

export const revokeAllTokens = async (): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/revoke-all-tokens');
  return res.data;
};

// ============================================================================
// 2. CURRENT USER (ME) ENDPOINTS
// ============================================================================

export const getMe = async (): Promise<User> => {
  const res = await apiClient.get<User>('/api/v1/auth/me');
  return res.data;
};

export const updateMe = async (data: Partial<UpdateProfileRequest | User>): Promise<User> => {
  const res = await apiClient.put<User>('/api/v1/auth/me', data);
  return res.data;
};

export const patchMe = async (data: Partial<User>): Promise<User> => {
  const res = await apiClient.patch<User>('/api/v1/auth/me', data);
  return res.data;
};

export const deleteMe = async (): Promise<{ message: string }> => {
  const res = await apiClient.delete('/api/v1/auth/me');
  return res.data;
};

export const getMyProfile = async (): Promise<UserProfile> => {
  const res = await apiClient.get<UserProfile>('/api/v1/auth/me/profile');
  return res.data;
};

export const updateMyProfile = async (data: Partial<UpdateProfileRequest | UserProfile>): Promise<UserProfile> => {
  const res = await apiClient.put<UserProfile>('/api/v1/auth/me/profile', data);
  return res.data;
};

export const getMySecurity = async (): Promise<UserSecurityOverview> => {
  const res = await apiClient.get<UserSecurityOverview>('/api/v1/auth/me/security');
  return res.data;
};

export const getMyActivity = async (page = 1, pageSize = 10): Promise<UserActivityLogItem[]> => {
  const res = await apiClient.get<UserActivityLogItem[]>('/api/v1/auth/me/activity', { params: { page, pageSize } });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

// ============================================================================
// 3. EMAIL ENDPOINTS
// ============================================================================

export const changeEmail = async (payload: ChangeEmailRequest | { newEmail: string; password?: string }): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/email/change', payload);
  return res.data;
};

export const verifyEmailChange = async (payload: VerifyOtpRequest | { email?: string; otp: string }): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/email/verify', payload);
  return res.data;
};

export const resendEmailVerification = async (payload?: ResendOtpRequest | { email?: string }): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/email/resend-verification', payload || {});
  return res.data;
};

// ============================================================================
// 4. PHONE ENDPOINTS
// ============================================================================

export const addPhone = async (payload: AddPhoneRequest | { phoneNumber: string } | string): Promise<{ message: string }> => {
  const body = typeof payload === 'string' ? { phoneNumber: payload } : payload;
  const res = await apiClient.post('/api/v1/auth/phone/add', body);
  return res.data;
};

export const verifyPhone = async (payload: VerifyOtpRequest | { email?: string; otp: string }): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/phone/verify', payload);
  return res.data;
};

export const changePhone = async (payload: AddPhoneRequest | { phoneNumber: string } | string): Promise<{ message: string }> => {
  const body = typeof payload === 'string' ? { phoneNumber: payload } : payload;
  const res = await apiClient.post('/api/v1/auth/phone/change', body);
  return res.data;
};

export const deletePhone = async (): Promise<{ message: string }> => {
  const res = await apiClient.delete('/api/v1/auth/phone');
  return res.data;
};

export const resendPhoneOtp = async (): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/phone/resend-otp');
  return res.data;
};

// ============================================================================
// 5. MFA (MULTI-FACTOR AUTHENTICATION) ENDPOINTS
// ============================================================================

export const getMfa = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/auth/mfa');
  return res.data;
};

export const getMfaStatus = async (): Promise<MfaStatusResponse> => {
  const res = await apiClient.get<MfaStatusResponse>('/api/v1/auth/mfa/status');
  return res.data;
};

export const setupMfa = async (payload?: MfaSetupRequest | { method: string }): Promise<MfaSetupResponse> => {
  const res = await apiClient.post<MfaSetupResponse>('/api/v1/auth/mfa/setup', payload || { method: 'totp' });
  return res.data;
};

export const verifyMfa = async (code: string | MfaVerifyRequest): Promise<{ message: string; verified: boolean }> => {
  const payload = typeof code === 'string' ? { code } : code;
  const res = await apiClient.post('/api/v1/auth/mfa/verify', payload);
  return res.data;
};

export const enableMfa = async (code: string | MfaVerifyRequest): Promise<{ message: string; backupCodes?: string[] }> => {
  const payload = typeof code === 'string' ? { code } : code;
  const res = await apiClient.post('/api/v1/auth/mfa/enable', payload);
  return res.data;
};

export const disableMfa = async (payload: MfaVerifyRequest | { code: string; password?: string }): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/mfa/disable', payload);
  return res.data;
};

export const challengeMfa = async (payload: MfaChallengeRequest | { userId: string; code: string }): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/mfa/challenge', payload);
  return res.data;
};

export const getMfaRecoveryCodes = async (): Promise<{ backupCodes: string[] }> => {
  const res = await apiClient.post('/api/v1/auth/mfa/recovery-codes');
  return res.data;
};

export const regenerateMfaRecoveryCodes = async (): Promise<{ backupCodes: string[] }> => {
  const res = await apiClient.post('/api/v1/auth/mfa/recovery-codes/regenerate');
  return res.data;
};

export const verifyMfaRecoveryCode = async (payload: MfaChallengeRequest | { userId: string; code: string }): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/mfa/recovery-codes/verify', payload);
  return res.data;
};

// ============================================================================
// 6. SESSIONS & DEVICES ENDPOINTS
// ============================================================================

export const getSessions = async (): Promise<AuthSession[]> => {
  const res = await apiClient.get<AuthSession[]>('/api/v1/auth/sessions');
  return Array.isArray(res.data) ? res.data : [];
};

export const getSession = async (sessionId: string): Promise<AuthSession> => {
  const res = await apiClient.get<AuthSession>(`/api/v1/auth/sessions/${sessionId}`);
  return res.data;
};

export const deleteSession = async (sessionId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete(`/api/v1/auth/sessions/${sessionId}`);
  return res.data;
};

export const revokeSession = async (sessionId: string): Promise<{ message: string }> => {
  const res = await apiClient.post(`/api/v1/auth/sessions/${sessionId}/revoke`);
  return res.data;
};

export const revokeAllSessions = async (): Promise<{ message: string }> => {
  const res = await apiClient.post('/api/v1/auth/sessions/revoke-all');
  return res.data;
};

export const getDevices = async (): Promise<AuthDevice[]> => {
  const res = await apiClient.get<AuthDevice[]>('/api/v1/auth/devices');
  return Array.isArray(res.data) ? res.data : [];
};

export const getDevice = async (deviceId: string): Promise<AuthDevice> => {
  const res = await apiClient.get<AuthDevice>(`/api/v1/auth/devices/${deviceId}`);
  return res.data;
};

export const deleteDevice = async (deviceId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete(`/api/v1/auth/devices/${deviceId}`);
  return res.data;
};

export const checkAuthHealth = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/auth/health');
  return res.data;
};
