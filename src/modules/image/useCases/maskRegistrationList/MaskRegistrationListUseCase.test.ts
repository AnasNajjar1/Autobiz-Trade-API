import { InMemoryMessenger } from '../../../../infra/messenger/implementations/InMemoryMessenger';
import { MaskRegistrationListUseCase } from './MaskRegistrationListUseCase';

let maskRegistrationListUseCase;
const messenger = new InMemoryMessenger({ execute: () => {} });

describe('Try to send notifications', () => {
  it('Send table with {title,url} to check', async () => {
    maskRegistrationListUseCase = new MaskRegistrationListUseCase(messenger);
    const spyMessengerPublish = jest.spyOn(messenger, 'publishMessage');
    const resImage = await maskRegistrationListUseCase.execute([
      {
        title: 'back_picture',
        url: 'url1',
      },
      {
        title: 'inside_picture',
        url: 'url2',
      },
      {
        title: 'three_quarters_back_picture',
        url: 'url3',
      },
    ]);

    expect(resImage.isRight()).toEqual(true);

    expect(spyMessengerPublish).toHaveBeenNthCalledWith(1, 'maskRegistration', {
      title: 'back_picture',
      url: 'url1',
    });
    expect(spyMessengerPublish).toHaveBeenNthCalledWith(2, 'maskRegistration', {
      title: 'three_quarters_back_picture',
      url: 'url3',
    });
  });
});
