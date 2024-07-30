import { MessengerController } from '../../../../core/infra/MessengerController';
import { ReceivedMessageUseCase } from './ReceivedMessageUseCase';
import { MessengerDto } from '../../../../infra/messenger/implementations/MessengerDto';
import { IMessengerService } from '../../../../infra/messenger/MessengerService';

interface Request {
  name: string;
}

export class ReceivedMessageController extends MessengerController {
  private useCase: ReceivedMessageUseCase;

  constructor(
    messengerService: IMessengerService,
    useCase: ReceivedMessageUseCase,
  ) {
    super(messengerService);
    this.useCase = useCase;
  }

  async executeImpl({ subject, data }): Promise<any> {
    try {
      const result = await this.useCase.execute({ subject, data });

      if (result.isRight()) {
        return this.success(subject);
      } else {
        const error = result.value;
        return this.fail(error.errorValue().message);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
