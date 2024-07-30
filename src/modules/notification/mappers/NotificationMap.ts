import { Mapper } from '../../../core/infra/Mapper';
import { Notification } from '../domain/notification';

export class NotificationMap implements Mapper<Notification> {
  public static toDomain(raw: any): Notification {
    const NotificationOrError = Notification.create(
      {
        userId: raw.userId,
        type: raw.type,
        data: raw.data,
        referenceTable: raw.referenceTable,
        referenceId: raw.referenceId,
        viaMail: raw.viaMail,
        viaApp: raw.viaApp,
        mailSentAt: raw.mailSentAt,
        mailSentError: raw.mailSentError,
      },
      raw.id,
    );

    NotificationOrError.isFailure
      ? console.warn(NotificationOrError.error)
      : '';

    return NotificationOrError.isSuccess
      ? NotificationOrError.getValue()
      : null;
  }

  public static async toPersistence(notification: Notification): Promise<any> {
    return {
      userId: notification.userId,
      type: notification.type,
      data: JSON.stringify(notification.data),
      referenceTable: notification.referenceTable,
      referenceId: notification.referenceId,
      viaMail: notification.viaMail,
      viaApp: notification.viaApp,
    };
  }
}
