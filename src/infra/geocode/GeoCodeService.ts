export interface IGeoCodeService {
  getPosition(zipCode: string, country: string): Promise<any>;
}

interface Response {
  lng: string;
  lat: string;
}

export class GeoCodeService implements IGeoCodeService {
  private geoCodeService: IGeoCodeService;

  constructor(geoCodeService: IGeoCodeService) {
    this.geoCodeService = geoCodeService;
  }

  async getPosition(zipCode: string, country: string): Promise<Response> {
    return this.geoCodeService.getPosition(zipCode, country);
  }
}
