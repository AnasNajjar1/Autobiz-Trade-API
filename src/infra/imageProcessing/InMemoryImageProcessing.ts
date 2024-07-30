import {
  IImageProcessingService,
  platePosition,
} from './ImageProcessingService';

export class InMemoryImageProcessingService implements IImageProcessingService {
  public exportPicturePlate(
    urlToHidePicture: string,
    platePositionXy: platePosition[],
  ) {
    if (urlToHidePicture.includes('http') && platePositionXy.length != 0) {
      return Promise.resolve(new Buffer(['string']));
    }
    throw new Error('Cant modify this');
  }
  public compressPicture(urlToCompressPicture: string) {
    if (urlToCompressPicture.includes('http')) {
      return Promise.resolve(new Buffer(['string']));
    }
    throw new Error('Cant modify this');
  }
}
