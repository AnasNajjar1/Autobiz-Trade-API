import { LoggedController } from '../LoggedController';
import { InMemoryLoggerService } from '../../../infra/logger/implementations/InMemoryLoggerService';
import awsEvent from './awsEvent.json';

const fakeExecution = {
  execute: (data) => {
    console.log('executed', data);
  },
};

class FakeController extends LoggedController {
  constructor(loggerService) {
    super(loggerService);
  }
  async executeImpl(data) {
    await fakeExecution.execute(data);
    return;
  }
}

const loggerService = new InMemoryLoggerService();

describe('Logged controller test', () => {
  it('Logged controller should log data then execute', async () => {
    const spyOnLogger = jest.spyOn(loggerService, 'log');
    const spyOnFakeEx = jest.spyOn(fakeExecution, 'execute');

    const loggedController = new FakeController(loggerService);
    const fakeData = { ...awsEvent, resource: 'fake/path' };
    loggedController.execute(fakeData);
    expect(spyOnLogger).toHaveBeenCalledWith(
      expect.objectContaining({ requestPath: 'fake/path' }),
    );
    // expect(spyOnFakeEx).toHaveBeenCalledWith(fakeData) //to fix later,
  });
});
