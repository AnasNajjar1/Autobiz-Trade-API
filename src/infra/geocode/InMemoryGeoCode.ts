import { IGeoCodeService } from './GeoCodeService';

export class InMemoryGeoCode implements IGeoCodeService {
  public getPosition(zipCode: string, country: string) {
    if (zipCode === '75001' && country === 'france') {
      return Promise.resolve({
        lat: '48.860439',
        lng: '2.341670',
      });
    }

    throw new Error('unknow zipCode / country.');
  }
}
