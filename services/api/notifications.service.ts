import client from './client';

export const getNotifications = async (userId: string) => {
  const response = await client.get(`/notifications?userId=${userId}`);
  return response.data;
};

export const markAsRead = async (notificationId: string) => {
  const response = await client.patch(`/notifications/${notificationId}/read`);
  return response.data;
};