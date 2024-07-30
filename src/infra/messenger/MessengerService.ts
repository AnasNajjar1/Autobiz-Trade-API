import { MessageSubjects } from '../../modules/events/useCases/receivedMessage/ReceivedMessageDto';

export interface Message {
  subject: MessageSubjects;
  data: any;
}

export interface IMessengerService {
  publishMessage(subject: string, data: any): Promise<any>;
  receiveMessage(message: any): Message;
}
