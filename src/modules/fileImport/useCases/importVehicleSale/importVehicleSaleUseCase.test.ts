import { ImportVehicleSaleUseCase } from './importVehicleSaleUseCase';
import { InMemoryFileService } from '../../../../infra/fileService/implementations/InMemoryFileService';
import { InMemoryImportRepo } from '../../repos/implementations/inMemoryImportRepo';
import { InMemoryMessenger } from '../../../../infra/messenger/implementations/InMemoryMessenger';
describe('import xlsx file and save it on aws ', () => {
  const messenger = new InMemoryMessenger({ execute: () => {} });
  const publishSpy = jest.spyOn(messenger, 'publishMessage');
  const fileService = new InMemoryFileService();
  const importRepo = new InMemoryImportRepo([]);
  const useCase = new ImportVehicleSaleUseCase(
    fileService,
    importRepo,
    messenger,
  );

  it('Should create new file in aws and save it on DB ', async () => {
    const res = await useCase.execute({
      file: Buffer.from('48674abc', 'base64'),
      createdBy: 'FR_1',
      uuid: 'uuid_1',
    });
    expect(res.isRight()).toBe(true);
    expect(res.value.getValue()).toBe(1);
    expect(publishSpy).toBeCalledTimes(1);
    expect(publishSpy).toHaveBeenCalledWith('createSaleVehicle', {
      uuid: 'uuid_1',
    });
  });
});
