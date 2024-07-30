import { MessengerDto } from './MessengerDto';
import { Message } from '../MessengerService';

export class SnsRequestMap {
  public static toDomain(event: MessengerDto): Message {
    const snsEvent = event.Records[0].Sns;
    console.log('sns event', snsEvent);
    const { Message: data, Subject: subject } = snsEvent;
    return {
      subject,
      data: JSON.parse(data),
    };
  }
}
