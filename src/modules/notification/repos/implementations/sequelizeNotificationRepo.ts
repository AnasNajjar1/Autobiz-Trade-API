import { INotificationRepo } from '../notificationRepo';
import { NotificationMap } from '../../mappers/NotificationMap';
import { Notification } from '../../domain/notification';

export class SequelizeNotificationRepo implements INotificationRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  async save(notification: Notification): Promise<void> {
    const rawSequelizeNotification = await NotificationMap.toPersistence(
      notification,
    );

    const createdNotification = await this.models.notification.create(
      rawSequelizeNotification,
    );
    if (!!createdNotification === false) {
      throw new Error('Notification create sequelize error.');
    }

    return;
  }
}
