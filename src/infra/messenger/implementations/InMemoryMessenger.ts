import { IMessengerService, Message } from '../MessengerService';
export class InMemoryMessenger implements IMessengerService {
  private useCase;

  constructor(useCase) {
    this.useCase = useCase;
  }

  public async publishMessage(subject: string, data: any) {
    console.log('send local message');
    console.log({ subject, data });
    await this.useCase.execute({ subject, data });
    return;
  }

  public receiveMessage(req: any): Message {
    console.log('receive local message');
    const { subject, data } = req;
    return {
      subject,
      data,
    };
  }
}
