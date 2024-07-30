import { DealerImporterService } from '../infra/import/dealer/DealerImporterService';
import { AutobizDealerImporter } from '../infra/import/dealer/AutobizDealerImporter';

import { GeoCodeService } from '../infra/geocode/GeoCodeService';
import { InMemoryGeoCode } from '../infra/geocode/InMemoryGeoCode';
import { GoogleMapsGeocode } from '../infra/geocode/GoogleMapsGeocode';

const dealerImporterService = new DealerImporterService(
  new AutobizDealerImporter(),
);

const geoCodeService = new GeoCodeService(new GoogleMapsGeocode());

export { dealerImporterService, geoCodeService };
