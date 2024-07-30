import { VehicleSaleImportUseCase } from './VehicleSaleImportUseCase';
import { InMemoryImportRepo } from '../../../fileImport/repos/implementations/inMemoryImportRepo';
import { InMemoryFileService } from '../../../../infra/fileService/implementations/InMemoryFileService';
import { InMemoryApiReferentialService } from '../../../../infra/autobizApi/ApiReferentialService/InMemoryApiReferentialService';
import { InMemoryApiQuotationService } from '../../../../infra/autobizApi/ApiQuotationService/InMemoryApiQuotationService';
import { InMemoryVehicleRepo } from '../../repos/implementations/inMemoryVehicleRepo';
import { InMemorySaleRepo } from '../../repos/implementations/inMemorySaleRepo';
import { InMemoryGroupRepo } from '../../../group/repos/implementations/inMemoryGroupRepo';
import { InMemoryAwsTranslateService } from '../../../../infra/translate/InMemoryAwsTranslateService';
import { fakeExcel, fakeExcel2 } from '../../assets/fakeExcelData';
import { fakeGroupData } from '../../assets/fakeGroupData';

describe('import vehicle sale test suit', () => {
  const importRepot = new InMemoryImportRepo();
  const fileService = new InMemoryFileService({
    'xxxxxxx-aaaaaaaa-zzzzzzzzz': fakeExcel,
    'xxxxxxx-aaaaaaaa-aaaaaaaaa': fakeExcel2,
  });
  const vehicleRepo = new InMemoryVehicleRepo([]);
  const saleRepo = new InMemorySaleRepo();
  const groupRepo = new InMemoryGroupRepo(fakeGroupData);
  const translateService = new InMemoryAwsTranslateService();
  const apiReferentialService = new InMemoryApiReferentialService();
  const apiQuotationService = new InMemoryApiQuotationService();
  const useCase = new VehicleSaleImportUseCase(
    importRepot,
    fileService,
    apiReferentialService,
    vehicleRepo,
    saleRepo,
    groupRepo,
    translateService,
    apiQuotationService,
  );
  let apiReferentialServiceSpy;
  let apiQuotationServiceSpy;
  let translateServiceSpy;
  let groupRepoSpy;
  let saleRepoSpy;
  let vehicleRepoSpy;
  let fileServiceSpy;
  let importRepotSpy;
  beforeAll(() => {
    apiReferentialServiceSpy = jest.spyOn(
      apiReferentialService,
      'getRegistrationDetails',
    );
    apiQuotationServiceSpy = jest.spyOn(
      apiQuotationService,
      'getQuotationByReference',
    );
    translateServiceSpy = jest.spyOn(translateService, 'translateText');
    groupRepoSpy = jest.spyOn(groupRepo, 'getGroupById');
    saleRepoSpy = jest.spyOn(saleRepo, 'save');
    vehicleRepoSpy = jest.spyOn(vehicleRepo, 'save');
    fileServiceSpy = jest.spyOn(fileService, 'getExcel');
    importRepotSpy = jest.spyOn(importRepot, 'update');
  });

  it('should not create new vehicle:wrong registration', async () => {
    const result = await useCase.execute({
      uuid: 'xxxxxxx-aaaaaaaa-zzzzzzzzz',
    });
    expect(result.isRight()).toBe(true);
    expect(result.value.getValue()).toBe('xxxxxxx-aaaaaaaa-zzzzzzzzz');
    expect(fileServiceSpy).toBeCalledWith('xxxxxxx-aaaaaaaa-zzzzzzzzz');
    expect(apiReferentialServiceSpy).toBeCalledWith('DM-392', 'FR');
    expect(importRepotSpy).toBeCalledWith(
      'row 2: Vehicle is not recognized wrong registration/vin</br> ',
      'finished',
      'xxxxxxx-aaaaaaaa-zzzzzzzzz',
    );
  });

  it('should create vehicle and sale', async () => {
    const result = await useCase.execute({
      uuid: 'xxxxxxx-aaaaaaaa-aaaaaaaaa',
    });
    expect(result.isRight()).toBe(true);
    expect(result.value.getValue()).toBe('xxxxxxx-aaaaaaaa-aaaaaaaaa');
    expect(fileServiceSpy).toBeCalledWith('xxxxxxx-aaaaaaaa-aaaaaaaaa');
    expect(apiReferentialServiceSpy).toBeCalledWith('DM-392-KB', 'FR');
    expect(vehicleRepoSpy).toBeCalledWith(
      expect.objectContaining({
        registration: 'DM-392-KB',
        versionLabel: 'GT Line',
        gcDate: '2014-12-09',
        modelLabel: 'FOCUS C-MAX',
        brandLabel: 'FORD',
      }),
    );
    expect(translateServiceSpy).toBeCalledWith('hello all');
    expect(apiQuotationServiceSpy).toBeCalledWith({
      year: 2014,
      mileage: 90000,
      doors: 5,
      country: 'FR',
      seats: 5
    });
    expect(groupRepoSpy).toBeCalledWith(1);

    expect(saleRepoSpy).toBeCalledWith(
      expect.objectContaining({
        acceptAuction: true,
        acceptImmediatePurchase: true,
        auctionReservePrice: 15000,
        auctionStartPrice: 1000,
        auctionStepPrice: 120,
      }),
    );

    expect(importRepotSpy).toBeCalledWith(
      '',
      'finished',
      'xxxxxxx-aaaaaaaa-aaaaaaaaa',
    );
  });
});
