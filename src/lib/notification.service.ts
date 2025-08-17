import prisma from "./prisma";
import { NotificationWithStatus,BasicNotification } from "@/types/notification";

type CreateNotificationInput = {
  tenantId: number;
  createdBy?: number;
  title: string;
  body: string;
  recipientIds?: number[];
};

export const NotificationService = {
    async createNotification(input: CreateNotificationInput): Promise<BasicNotification> {
        const notification = await prisma.notification.create({
          data: {
            tenantId: input.tenantId,
            createdBy: input.createdBy || null,
            title: input.title,
            body: input.body,
          },
          select: {
            id: true,
            tenantId: true,
            createdBy: true,
            title: true,
            body: true,
            createdAt: true,
          },
        });
    
        if (!input.recipientIds || input.recipientIds.length === 0) {
          await this.deliverToAllUsers(notification.id, input.tenantId);
        } else {
          await this.deliverToUsers(notification.id, input.recipientIds);
        }
    
        return notification;
      },
  async deliverToAllUsers(notificationId: number, tenantId: number): Promise<void> {
    const users = await prisma.user.findMany({
      where: { tenantId, isActive: true },
      select: { id: true },
    });

    await prisma.notificationDelivery.createMany({
      data: users.map((user) => ({
        notificationId,
        userId: user.id,
      })),
    });
  },

  async deliverToUsers(notificationId: number, userIds: number[]): Promise<void> {
    await prisma.notificationDelivery.createMany({
      data: userIds.map((userId) => ({
        notificationId,
        userId,
      })),
    });
  },

  async getUserNotifications(
    userId: number,
    options: { limit?: number; unreadOnly?: boolean } = {}
  ): Promise<NotificationWithStatus[]> {
    const deliveries = await prisma.notificationDelivery.findMany({
      where: {
        userId,
        isRead: options.unreadOnly ? false : undefined,
      },
      include: { notification: true },
      orderBy: { notification: { createdAt: "desc" } },
      take: options.limit,
    });

    return deliveries.map((delivery) => ({
      ...delivery.notification,
      isRead: delivery.isRead,
      readAt: delivery.readAt,
      deliveryId: delivery.id,
    }));
  },

  async markAsRead(deliveryId: number): Promise<void> {
    await prisma.notificationDelivery.update({
      where: { id: deliveryId },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async markAllAsRead(userId: number): Promise<void> {
    await prisma.notificationDelivery.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async getUnreadCount(userId: number): Promise<number> {
    return prisma.notificationDelivery.count({
      where: { userId, isRead: false },
    });
  },
};