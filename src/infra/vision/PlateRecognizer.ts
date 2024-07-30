import { IVisionService } from './VisionAPIService';
import { BaseApi } from '../../core/infra/BaseApi';
import FormData from 'form-data';

export class PlateRecognizer extends BaseApi implements IVisionService {
  constructor() {
    super('https://api.platerecognizer.com/v1');
  }
  public async getPlatelocation(urlToHidePicture: string) {
    const data = await this.getBase64(urlToHidePicture);
    const bodyFormData = new FormData();
    let verticesTemp = [];
    bodyFormData.append('upload', data);
    bodyFormData.append('regions', 'fr');
    const headers = {
      Authorization: `Token ${process.env.plateRecognizerKey}`,
      'Content-Type': 'multipart/form-data; boundary=------',
    };
    const response = await this.post('/plate-reader', bodyFormData, headers);
    const verticesX_Y = [];
    try {
      verticesTemp = [];
      response.data.results.forEach((isAPlate) => {
        const verticesTemp = [];
        verticesTemp['x_1'] = isAPlate.box.xmin;
        verticesTemp['y_1'] = isAPlate.box.ymin;
        verticesTemp['x_2'] = isAPlate.box.xmax;
        verticesTemp['y_2'] = isAPlate.box.ymin;
        verticesTemp['x_3'] = isAPlate.box.xmax;
        verticesTemp['y_3'] = isAPlate.box.ymax;
        verticesTemp['x_4'] = isAPlate.box.xmin;
        verticesTemp['y_4'] = isAPlate.box.ymax;
        verticesX_Y.push(verticesTemp);
      });
      if (verticesX_Y.length > 0) {
        return verticesX_Y;
      } else {
        console.warn("Didn't Detect Any Licence Plate or not sure");
      }
    } catch {
      console.warn("Didn't Detect Any Licence Plate");
    }
  }

  private async getBase64(url) {
    try {
      const response = await this.getBase64Format(url);
      return Buffer.from(response.data, 'binary').toString('base64');
    } catch (err) {
      return 'error with url';
    }
  }
}
