import { Sale } from '../sale';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { getConfig } from '../../../config/show';
import { VehicleDocuments } from '../vehicleDocuments';
import { GetSaleByUuidErrors } from '../../useCases/sales/getSaleByUuid/GetSaleByUuidErrors';
import { VehicleDamages } from '../vehicleDamages';
import { VehicleCarPictures } from '../vehicleCarPictures';
import { VehicleCarPicturesOthers } from '../vehicleCarPicturesOthers';
import { ITranslateService } from '../../../../infra/translate/translateService';
import _ from 'lodash';

interface CommentInt {
  sourceLanguage: string;
  translation: {
    fr: string;
    de: string;
    en: string;
    es: string;
  };
}

export class SaleService {
  private translateService: ITranslateService;

  constructor(translateService: ITranslateService) {
    this.translateService = translateService;
  }

  //this function alows to remove documents (confidentials, RGPD)
  //depending on a config in the admin interface
  public async filterSale(
    sale: Sale,
  ): Promise<Either<GetSaleByUuidErrors.SaleCanNotBeFiltered, Sale>> {
    try {
      const documentFilters = await getConfig('documentFilters');

      const {
        documents,
        carPictures,
        carPicturesOthers,
        damages,
      } = sale.vehicle;

      let config = {
        documents: [],
        pictures: [],
        damages: [],
      };
      if (sale.supplyType === 'OFFER_TO_PRIVATE') {
        config = documentFilters.offerToPrivate;
      }

      if (sale.supplyType === 'STOCK') {
        config = documentFilters.stock;
      }

      // Remove unwanted documents for public
      if (documents.value) {
        const removeDocs = config.documents.map((doc) => doc?.id);
        const filteredDocuments = _.filter(
          documents.value,
          (document) => !removeDocs.includes(document?.title),
        );
        sale.vehicle.updateDocuments(
          VehicleDocuments.create(filteredDocuments).getValue(),
        );
      }

      // Remove unwanted damages for public
      // if (sale.vehicle?.damages?.value) {
      //   const removeDamages = config.damages.map((damage) => damage.id);

      //   const filteredDamages = sale.vehicle.damages?.value.filter(
      //     (damage) => !damage.element.includes(removeDamages),
      //   );
      //   sale.vehicle.updateDamages(
      //     VehicleDamages.create(filteredDamages).getValue(),
      //   );
      // }

      // Remove unwanted carPictures for public
      let filtredPictureOthers = carPicturesOthers.value;
      const removePictures = config.pictures.map((picture) => picture?.id);
      removePictures.map((rp) => {
        if (carPictures.value) delete carPictures.value[rp];
        filtredPictureOthers = _.filter(
          filtredPictureOthers,
          (picture) => picture?.title !== rp,
        );
      });
      sale.vehicle.updateGallery(
        VehicleCarPictures.create(carPictures.value).getValue(),
        VehicleCarPicturesOthers.create(filtredPictureOthers).getValue(),
      );

      return right(sale);
    } catch (error) {
      return left(new GetSaleByUuidErrors.SaleCanNotBeFiltered(sale.uuid));
    }
  }
}
