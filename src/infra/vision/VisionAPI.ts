import { IVisionService } from './VisionAPIService';
import { BaseApi } from '../../core/infra/BaseApi';

export class VisionAPI extends BaseApi implements IVisionService {
  constructor() {
    super('https://vision.googleapis.com/v1/images:annotate?');
  }
 

  public async getPlatelocation(urlToHidePicture: string) {
    const vision_object = {
      requests: [
        {
          image: {
            source: {
              imageUri: urlToHidePicture,
            },
          },
          features: [
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 50,
            },
            {
              type: 'TEXT_DETECTION',
              maxResults: 50,
              model: 'builtin/latest',
            },
          ],
        },
      ],
    };
    const response = await this.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.googleMapsKey}`,
      vision_object,
    );
    const caracterChecker = response.data.responses[0].textAnnotations[0].description.split(
      '\n',
    );
    const dimensions = {
      width: response.data.responses[0].fullTextAnnotation.pages[0].width,
      height: response.data.responses[0].fullTextAnnotation.pages[0].height,
    };
    const verticesX_Y = [];
    response.data.responses[0].localizedObjectAnnotations.forEach(
      (isAPlate) => {
        if (isAPlate.name === 'License plate' && isAPlate.score >= 0.6) {
          let iteration = 1;
          const verticesTemp = [];
          isAPlate.boundingPoly.normalizedVertices.forEach((position) => {
            verticesTemp['x_' + iteration] = position['x'] * dimensions.width;
            verticesTemp['y_' + iteration] = position['y'] * dimensions.height;
            iteration++;
          });
          verticesX_Y.push(verticesTemp);
        }
      },
    );
    let plateChecker: boolean = false;
    caracterChecker.forEach((textDetected) => {
      textDetected =  this.removeSpecialCharacters(textDetected)
      if (textDetected.includes('auto', 'autobiz', 'biz')) {
        plateChecker = false;
        return false;
      } else if (
        textDetected.match(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%* #+=()^?&]{4,}$/,
        )
      ) {
        plateChecker = true;
      }
    });
    if (verticesX_Y.length > 0 && plateChecker) {
      return verticesX_Y;
    } else {
      console.warn("Didn't Detect Any Licence Plate or not sure");
    }
  }
  public removeSpecialCharacters(textFromVision: string) {
    textFromVision = textFromVision.split(/[^A-Z0-9]/ig).join('')
    return textFromVision;
  }

}
