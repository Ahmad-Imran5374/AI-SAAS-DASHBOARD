import { Notification } from "@prisma/client";

export type BasicNotification = Pick<
  Notification,
  'id' | 'tenantId' | 'createdBy' | 'title' | 'body' | 'createdAt'
>;

export type NotificationWithStatus = BasicNotification & {
  isRead: boolean;
  readAt: Date | null;
  deliveryId: number;
};