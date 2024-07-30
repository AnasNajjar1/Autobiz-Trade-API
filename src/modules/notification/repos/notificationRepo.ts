import { Notification } from '../domain/notification';

export interface INotificationRepo {
  save(notification: Notification): Promise<void>;
}
