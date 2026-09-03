import apiClient from './client';
import type {
  SendNotificationRequest,
  UserNotificationPreferences,
  AppNotification,
} from './types/api';

// ============================================================================
// NOTIFICATIONS SERVICE (/api/v1/notifications)
// ============================================================================

export const sendNotification = async (payload: SendNotificationRequest): Promise<any> => {
  const res = await apiClient.post('/api/v1/notifications', payload);
  return res.data;
};

export const sendBulkNotifications = async (payload: SendNotificationRequest): Promise<any> => {
  const res = await apiClient.post('/api/v1/notifications/bulk', payload);
  return res.data;
};

export interface MyNotificationsQuery {
  unreadOnly?: boolean;
  limit?: number;
}

export const getMyNotifications = async (params?: MyNotificationsQuery): Promise<AppNotification[]> => {
  const res = await apiClient.get('/api/v1/notifications/my-notifications', { params });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getUnreadNotificationCount = async (): Promise<{ count: number }> => {
  const res = await apiClient.get('/api/v1/notifications/unread-count');
  return res.data?.data || res.data || { count: 0 };
};

export const markNotificationAsRead = async (notificationId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/notifications/${notificationId}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async (): Promise<any> => {
  const res = await apiClient.post('/api/v1/notifications/mark-all-read');
  return res.data;
};

export const deleteNotification = async (notificationId: string): Promise<any> => {
  const res = await apiClient.delete(`/api/v1/notifications/${notificationId}`);
  return res.data;
};

export const deleteAllNotifications = async (): Promise<any> => {
  const res = await apiClient.delete('/api/v1/notifications/delete-all');
  return res.data;
};

export const getNotificationPreferences = async (): Promise<UserNotificationPreferences> => {
  const res = await apiClient.get('/api/v1/notifications/preferences');
  return res.data?.data || res.data;
};

export const updateNotificationPreferences = async (payload: UserNotificationPreferences): Promise<UserNotificationPreferences> => {
  const res = await apiClient.put('/api/v1/notifications/preferences', payload);
  return res.data?.data || res.data;
};

export const checkNotificationsHealth = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/notifications/health');
  return res.data;
};
