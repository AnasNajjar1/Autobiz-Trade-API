import { InMemoryVisionAPI } from '../../../../infra/vision/InMemoryVisionAPI';
import { InMemoryFileService } from '../../../../infra/fileService/implementations/InMemoryFileService';
import { InMemoryImageProcessingService } from '../../../../infra/imageProcessing/InMemoryImageProcessing';
import { MaskRegistrationUseCase } from './MaskRegistrationUseCase';

let maskRegistrationUseCase;

let fileService;
let visionService;
let imageProcessingService;

const fakePlateLocation1 = {
  x_1: 94.02470399999999,
  y_1: 629.346924,
  x_2: 206.539176,
  y_2: 629.346924,
  x_3: 206.539176,
  y_3: 736.47261,
  x_4: 94.02470399999999,
  y_4: 736.47261,
};
const fakePlateLocation2 = {
  x_1: 39,
  y_1: 32.346924,
  x_2: 30.539176,
  y_2: 32.346924,
  x_3: 190.539176,
  y_3: 23.47261,
  x_4: 32.02470399999999,
  y_4: 23.47261,
};
const fakePlateLocations = [fakePlateLocation1, fakePlateLocation2];

describe('get mask registration on picture from a picture', () => {
  it('it retrieve registration from fileService', async () => {
    fileService = new InMemoryFileService();
    visionService = new InMemoryVisionAPI(fakePlateLocations);
    imageProcessingService = new InMemoryImageProcessingService();
    maskRegistrationUseCase = new MaskRegistrationUseCase(
      fileService,
      visionService,
      imageProcessingService,
    );

    const url =
      'https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/carcheck/35843/cecf997d-4368-4ad8-bd84-fccd2215a63f.jpg';
    // const spyOnFileService = jest.spyOn(fileService, 'getImage');
    const spyOnVisionService = jest.spyOn(visionService, 'getPlatelocation');
    const spyOnimageProcessingService = jest.spyOn(
      imageProcessingService,
      'exportPicturePlate',
    );
    const spyOnPushFileService = jest.spyOn(fileService, 'setImage');
    const resImage = await maskRegistrationUseCase.execute({
      url,
    });
    expect(resImage.isRight()).toEqual(true);
    // expect(spyOnFileService).toHaveBeenCalledWith(urlKey);
    // const fakeImage = await fileService.getImage(urlKey)
    expect(spyOnVisionService).toHaveBeenCalledWith(url);
    expect(spyOnimageProcessingService).toBeCalledWith(url, fakePlateLocations);
    expect(spyOnPushFileService).toBeCalledWith(url, new Buffer(['string']));
  });

  /*it('Succed and doest call image processing if no plate detected');
  {
    fileService = new InMemoryFileService();
    visionService = new InMemoryVisionAPI();
    maskRegistrationUseCase = new MaskRegistrationUseCase(
      fileService,
      visionService,
      imageProcessingService,
    );
  }
  expect(maskRegistrationUseCase.isRight()).toEqual(true);*/
});
