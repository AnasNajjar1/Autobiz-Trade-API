import { IVisionService, PlatePosition } from './VisionAPIService';

export class InMemoryVisionAPI implements IVisionService {
  private platePositions: PlatePosition[];

  constructor(platePositions: PlatePosition[]) {
    this.platePositions = platePositions;
  }

  public getPlatelocation(urlToHidePicture: string) {
    if (
      urlToHidePicture.includes('http') &&
      urlToHidePicture.includes('.jpg')
    ) {
      return Promise.resolve(this.platePositions);
    }
    throw new Error('This is not image URL');
  }
}
