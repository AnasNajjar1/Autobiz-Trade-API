import { InMemoryVehicleRepo } from '../../../repos/implementations/inMemoryVehicleRepo';
import { InMemoryFileService } from '../../../../../infra/fileService/implementations/InMemoryFileService';
import { InMemoryImageProcessingService } from '../../../../../infra/imageProcessing/InMemoryImageProcessing';
import { CompressingVehicleMainPhotoUseCase } from './CompressingVehicleMainPhotoUseCase';
import { VehicleFileNumber } from '../../../domain/vehicleFileNumber';
import { VehicleCarPictures } from '../../../domain/vehicleCarPictures';
import { VehicleCarPicturesOthers } from '../../../domain/vehicleCarPicturesOthers';
import { InMemoryMessenger } from '../../../../../infra/messenger/implementations/InMemoryMessenger';

const messenger = new InMemoryMessenger({ execute: () => {} });
describe('Compressing three quarters front picture ', () => {
  let compressingVehiclePhotoUseCase;
  const OLD_ENV = process.env;
  // process.env.imageBucket = 'test';

  const vehicleRepo = new InMemoryVehicleRepo([
    {
      id: 1,
      uuid: 'XXXXXXXXXXXX',
      fileNumber: VehicleFileNumber.create('XXX').getValue(),
      registration: 'XX-XXX-XX',
      brandLabel: 'VOLKSWAGEN',
      modelLabel: 'POLO',
      carPictures: VehicleCarPictures.create({
        three_quarters_front_picture: 'https://www.photo.jpeg',
      }).getValue(),
      carPicturesOthers: VehicleCarPicturesOthers.create([]).getValue(),
    },
  ]);
  const imageProcessingService = new InMemoryImageProcessingService();
  const fileService = new InMemoryFileService();

  const spyOnimageProcessingService = jest.spyOn(
    imageProcessingService,
    'compressPicture',
  );

  const spyOnPushFileService = jest.spyOn(fileService, 'setImageCompress');
  const spyMessengerPublish = jest.spyOn(messenger, 'publishMessage');

  beforeAll(() => {
    compressingVehiclePhotoUseCase = new CompressingVehicleMainPhotoUseCase(
      vehicleRepo,
      imageProcessingService,
      fileService,
      messenger,
    );
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should compress main car picture', async () => {
    const successOrError = await compressingVehiclePhotoUseCase.execute({
      id: 1,
    });
    const vehicle = await vehicleRepo.getAdminVehicleById(1);
    expect(spyOnimageProcessingService).toBeCalledWith(
      vehicle.carPicturesMain.three_quarters_front_picture,
    );
    const url = vehicle.carPicturesMain.three_quarters_front_picture;
    expect(spyOnPushFileService).toBeCalledWith(url, new Buffer(['string']));

    expect(spyMessengerPublish).toHaveBeenNthCalledWith(1, 'maskRegistration', {
      url,
    });
    expect(successOrError.isRight()).toEqual(true);
  });
});
