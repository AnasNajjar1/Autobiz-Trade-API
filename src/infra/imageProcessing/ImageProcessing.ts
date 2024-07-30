import {
  IImageProcessingService,
  platePosition,
} from './ImageProcessingService';
import Jimp from 'jimp';

export class ImageProcessing implements IImageProcessingService {
  public async exportPicturePlate(
    urlToHidePicture: string,
    platePositions: platePosition[],
  ) {
    const imageToPushToS3 = await Jimp.read(urlToHidePicture);
    let blurRatio;
    if (imageToPushToS3.bitmap.width <= 1600) {
      blurRatio = 9;
    } else if (imageToPushToS3.bitmap.width > 1600) {
      blurRatio = 17;
    }
    if (platePositions && platePositions.length > 0)
      platePositions.forEach((positionXy) => {
        const gap_x = positionXy.x_2 - positionXy.x_1;
        const gap_y = positionXy.y_3 - positionXy.y_2;
        imageToPushToS3.pixelate(
          blurRatio,
          positionXy.x_1,
          positionXy.y_1,
          gap_x,
          gap_y,
        );
      });
    imageToPushToS3.quality(75);
    return await imageToPushToS3.getBufferAsync(imageToPushToS3.getMIME());
  }

  public async compressPicture(urlToCompressPicture: string) {
    const RESIZE_WIDTH = 400;
    const imageCompress = await Jimp.read(urlToCompressPicture);
    imageCompress.resize(RESIZE_WIDTH, Jimp.AUTO);
    return await imageCompress.getBufferAsync(imageCompress.getMIME());
  }
}
