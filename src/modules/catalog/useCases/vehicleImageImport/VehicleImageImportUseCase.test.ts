import { InMemoryFileService } from '../../../../infra/fileService/implementations/InMemoryFileService';
import { InMemoryVehicleRepo } from '../../repos/implementations/inMemoryVehicleRepo';
import { VehicleImageImportUseCase } from './VehicleImageImportUseCase';
import { MaskRegistrationUseCase } from '../../../image/useCases/maskRegistration/MaskRegistrationUseCase';
import { InMemoryVisionAPI } from '../../../../infra/vision/InMemoryVisionAPI';
import { InMemoryImageProcessingService } from '../../../../infra/imageProcessing/InMemoryImageProcessing';
import { CompressingVehicleMainPhotoUseCase } from '../vehicles/compressingVehicleMainPhoto/CompressingVehicleMainPhotoUseCase';
import { InMemoryMessenger } from '../../../../infra/messenger/implementations/InMemoryMessenger';
import { InMemoryImportRepo } from '../../../fileImport/repos/implementations/inMemoryImportRepo';
import { Vehicle } from '../../domain/vehicle';
import { VehicleCarPictures } from '../../domain/vehicleCarPictures';
import { VehicleCarPicturesOthers } from '../../domain/vehicleCarPicturesOthers';
import { VehicleFileNumber } from '../../domain/vehicleFileNumber';

describe('import vehicle images', () => {
  const fileService = new InMemoryFileService();
  const visionService = new InMemoryVisionAPI([]);
  const imageProcessingService = new InMemoryImageProcessingService();
  const messenger = new InMemoryMessenger({ execute: () => {} });
  const vehicleRepo = new InMemoryVehicleRepo([]);
  const importRepo = new InMemoryImportRepo([]);
  const maskRegistration = new MaskRegistrationUseCase(
    fileService,
    visionService,
    imageProcessingService,
  );
  const compressVehiclePhoto = new CompressingVehicleMainPhotoUseCase(
    vehicleRepo,
    imageProcessingService,
    fileService,
    messenger,
  );
  const vehicleImageImportUseCase = new VehicleImageImportUseCase(
    importRepo,
    fileService,
    vehicleRepo,
    maskRegistration,
    compressVehiclePhoto,
  );

  let fileServiceSpy;
  let compressVehiclePhotoSpy;
  let maskRegistrationSpy;
  let importRepotSpy;
  let vehicleRepoSpySave;
  let vehicleRepoSpyLastVehic;

  beforeAll(() => {
    fileServiceSpy = jest.spyOn(fileService, 'getArchive');
    compressVehiclePhotoSpy = jest.spyOn(compressVehiclePhoto, 'execute');
    maskRegistrationSpy = jest.spyOn(maskRegistration, 'execute');
    importRepotSpy = jest.spyOn(importRepo, 'update');
    vehicleRepoSpyLastVehic = jest.spyOn(
      vehicleRepo,
      'getLastVehicleByRegistration',
    );
    vehicleRepoSpySave = jest.spyOn(vehicleRepo, 'save');
  });

  it('should found vehicle and update vehicle CarPictures', async () => {
    const result = await vehicleImageImportUseCase.execute({
      link: 'https://test/public/archive/ImportImages.zip',
      uuid: 'xxxxxxx-aaaaaaaa-zzzzzzzzz',
    });
    expect(result.isRight()).toBe(true);
    expect(result.value.getValue()).toBe('xxxxxxx-aaaaaaaa-zzzzzzzzz');
    expect(fileServiceSpy).toBeCalledWith(
      'https://test/public/archive/ImportImages.zip',
    );
/*     expect(maskRegistrationSpy).toBeCalledTimes(4);
    expect(maskRegistrationSpy).toBeCalledWith({url:'https://www.picture_1.jpeg'});
    expect(maskRegistrationSpy).toBeCalledWith({url:'https://www.picture_2.jpeg'}); */
    expect(vehicleRepoSpyLastVehic).toBeCalledTimes(2);
    expect(vehicleRepoSpyLastVehic).toBeCalledWith('XX-XXX-XX');
    expect(vehicleRepoSpyLastVehic).toBeCalledWith('YY-YYY-YY');

    const v1 = new Vehicle(
      {
        fileNumber: VehicleFileNumber.create('XXX').getValue(),
        registration: 'XX-XXX-XX',
        carPictures: VehicleCarPictures.create({
          three_quarters_front_picture: 'https://www.picture_1.jpeg',
          label_test: 'https://www.photo.jpeg',
        }).getValue(),
        carPicturesOthers: VehicleCarPicturesOthers.create([
          { title: 'counter_picture', link: 'https://www.photo1.jpeg' },
          {
            title: 'registration_card_picture',
            link: 'https://www.photo2.jpeg',
          },
          { title: '2.jpg', link: 'https://www.picture_2.jpeg' },
        ]).getValue(),
      },
      1,
    );
    expect(vehicleRepoSpySave).toHaveBeenNthCalledWith(1, v1);
    expect(compressVehiclePhotoSpy).toBeCalledTimes(2);
    expect(compressVehiclePhotoSpy).toBeCalledWith({ id: 1 });
    expect(compressVehiclePhotoSpy).toBeCalledWith({ id: 2 });
    expect(importRepotSpy).toBeCalledWith(
      '',
      'finished',
      'xxxxxxx-aaaaaaaa-zzzzzzzzz',
    );
  });
});
