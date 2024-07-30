import { IGeoCodeService } from './GeoCodeService';
import { BaseApi } from '../../core/infra/BaseApi';

export class GoogleMapsGeocode extends BaseApi implements IGeoCodeService {
  constructor() {
    super('https://maps.googleapis.com/maps/api/geocode/');
  }

  public async getPosition(zipCode: string, country: String) {
    const response = await this.get(
      `json?address=${zipCode},${country}&key=${process.env.googleMapsKey}`,
    );
    if (response.data.results.length > 0) {
      return response.data.results[0].geometry.location;
    }
    console.warn(response.data.error_message);
    throw new Error(response.data.error_message);
  }
}
