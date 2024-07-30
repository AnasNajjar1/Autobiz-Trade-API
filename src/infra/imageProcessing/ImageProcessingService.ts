export interface platePosition {
  x_1: number;
  x_2: number;
  x_3: number;
  x_4: number;
  y_1: number;
  y_2: number;
  y_3: number;
  y_4: number;
}
export interface IImageProcessingService {
  exportPicturePlate(
    urlToHidePicture: string,
    platePositions: platePosition[],
  ): Promise<Buffer>;
  compressPicture(urlToCompressPicture: string): Promise<any>;
}

export class ImageProcessingService implements IImageProcessingService {
  private ImageProcessingService: IImageProcessingService;

  constructor(ImageProcessingService: IImageProcessingService) {
    this.ImageProcessingService = ImageProcessingService;
  }

  async exportPicturePlate(
    urlToHidePicture: string,
    platePositions: platePosition[],
  ): Promise<Buffer> {
    return this.ImageProcessingService.exportPicturePlate(
      urlToHidePicture,
      platePositions,
    );
  }

  async compressPicture(urlToCompressPicture: string): Promise<any> {
    return this.ImageProcessingService.compressPicture(urlToCompressPicture);
  }
}
