import { InMemoryUniqueEntityId } from './../../../../infra/uniqueIdentifier/inMemory-uniqueIdentifier';
import { InMemoryMessenger } from './../../../../infra/messenger/implementations/InMemoryMessenger';
import { CreatePartnerRequestUseCase } from './CreatePartnerRequestUseCase';
import { InMemoryPartnerRequestRepo } from '../../repos/implementations/inMemoryPartnerRequestRepo';

describe('Create Partner Request', () => {
  let createPartnerUseCase;
  const messenger = new InMemoryMessenger({ execute: () => {} });
  const publishSpy = jest.spyOn(messenger, 'publishMessage');
  const partnerRequestRepo = new InMemoryPartnerRequestRepo([]);
  const UniqueEntityId = new InMemoryUniqueEntityId();

  beforeAll(() => {
    createPartnerUseCase = new CreatePartnerRequestUseCase(
      partnerRequestRepo,
      messenger,
      UniqueEntityId,
    );
  });

  it('should be save and call publish', async () => {
    const notifyOrError = await createPartnerUseCase.execute({
      comment: 'test audi VW passat very good car with alot of fancy think',
      partnerId: 1,
      vehicleId: 1,
      createdBy: 'FR_1',
    });
    expect(notifyOrError.isRight()).toBe(true);
    expect(publishSpy).toHaveBeenNthCalledWith(
      1,
      'sendPartnerRequest',
      expect.objectContaining({
        uuid: 'UID1',
      }),
    );
  });

  it('should left with out call publish ', async () => {
    const notifyOrError = await createPartnerUseCase.execute({
      comment: 'test audi',
      partnerId: 1,
    });
    expect(notifyOrError.isLeft()).toBe(true);
    expect(publishSpy).toBeCalledTimes(1);
  });

  it('should left with out call publish', async () => {
    const notifyOrError = await createPartnerUseCase.execute({
      comment: 'test audi',
      vehicleId: 1,
    });
    expect(notifyOrError.isLeft()).toBe(true);
    expect(publishSpy).toBeCalledTimes(1);
  });
});
