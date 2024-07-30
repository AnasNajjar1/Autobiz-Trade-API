import { importRepo } from '../../../fileImport/repos';
import { VehicleSaleImportUseCase } from './VehicleSaleImportUseCase';
import { fileService } from '../../../../infra/fileService';
import { ApiReferentialService } from '../../../../infra/autobizApi/ApiReferentialService/ApiReferentialService';
import { saleRepo, vehicleRepo } from '../../repos';
import { groupRepo } from '../../../group/repos';
import { translateService } from '../../../../infra/translate';
import { ApiQuotationService } from '../../../../infra/autobizApi/ApiQuotationService/ApiQuotationService';

const apiQuotationService = new ApiQuotationService();

const apiReferentialService = new ApiReferentialService();
const vehicleSaleImportUseCase = new VehicleSaleImportUseCase(
  importRepo,
  fileService,
  apiReferentialService,
  vehicleRepo,
  saleRepo,
  groupRepo,
  translateService,
  apiQuotationService,
);

export { vehicleSaleImportUseCase };
