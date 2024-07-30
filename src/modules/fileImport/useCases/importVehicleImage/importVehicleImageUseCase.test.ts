// import { ImportVehicleSaleUseCase } from './importVehicleSaleUseCase';
import { InMemoryFileService } from '../../../../infra/fileService/implementations/InMemoryFileService';
import { InMemoryImportRepo } from '../../repos/implementations/inMemoryImportRepo';
import { InMemoryMessenger } from '../../../../infra/messenger/implementations/InMemoryMessenger';
import { ImportVehicleImageUseCase } from './importVehicleImageUseCase';
describe('import zip file ', () => {
  const messenger = new InMemoryMessenger({ execute: () => {} });
  const publishSpy = jest.spyOn(messenger, 'publishMessage');
  const fileService = new InMemoryFileService();
  const importRepo = new InMemoryImportRepo([]);
  const useCase = new ImportVehicleImageUseCase(
    fileService,
    importRepo,
    messenger,
  );

  let importRepotSpy;
  beforeAll(() => {
    importRepotSpy = jest.spyOn(importRepo, 'save');
  });
  it('Should save link of zip file on DB ', async () => {
    const res = await useCase.execute({
      link: 'https://test.s3.eu-west-1.amazonaws.com/public/archive/Exemple.zip',
      createdBy: 'FR_1',
      uuid: 'uuid_1',
    });
    expect(res.isRight()).toBe(true);
    expect(res.value.getValue()).toBe(1);
    expect(importRepotSpy).toBeCalledWith(
      expect.objectContaining({
        link: 'https://test.s3.eu-west-1.amazonaws.com/public/archive/Exemple.zip',
        createdBy: 'FR_1',
        uuid: 'uuid_1',
        status: 'started',
        importType: 'vehicleImage',
      }),
    );
    expect(publishSpy).toBeCalledTimes(1);
    expect(publishSpy).toHaveBeenCalledWith('uploadVehicleImage', {
      link: 'https://test.s3.eu-west-1.amazonaws.com/public/archive/Exemple.zip',
      uuid: 'uuid_1',
    });
  });
});
