import { IMessengerService } from '../../infra/messenger/MessengerService';

export abstract class MessengerController {
  private messengerService: IMessengerService;

  constructor(messengerService: IMessengerService) {
    this.messengerService = messengerService;
  }

  protected abstract executeImpl({
    subject: string,
    data: any,
  }): Promise<void | any>;

  public async execute(req: any): Promise<any> {
    const { subject, data } = this.messengerService.receiveMessage(req);
    try {
      return await this.executeImpl({ subject, data });
    } catch (err) {
      this.fail('An unexpected error occurred');
    }
  }

  public fail(error: Error | string) {
    return MessengerController.error(error.toString());
  }

  public success(message) {
    console.log('Message handled with success', message);
  }

  public static error(message: string) {
    throw Error(message);
  }
}
