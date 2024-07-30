export * from './implementations/InMemoryMessenger';
export * from './MessengerService';
export * from './implementations/SNSMessenger';
import { SNSMessenger } from './implementations/SNSMessenger';
import { InMemoryMessenger } from './implementations/InMemoryMessenger';
import { receivedMessageUseCase } from '../../modules/events/useCases/receivedMessage';

let messengerService;
if (['test', 'dev'].includes(process.env.stage)) {
  messengerService = new InMemoryMessenger(receivedMessageUseCase);
} else {
  messengerService = new SNSMessenger();
}
export { messengerService };
