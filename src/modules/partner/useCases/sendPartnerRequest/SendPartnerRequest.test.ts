import { VehicleCarPictures } from './../../../catalog/domain/vehicleCarPictures';
import { InMemoryVehicleRepo } from './../../../catalog/repos/implementations/inMemoryVehicleRepo';
import { SendPartnerRequestUseCase } from './SendPartnerRequestUseCase';
import { InMemoryApiPartnerService } from '../../../../infra/partnerRequestApi/InMemoryApiPartnerService';
import { InMemoryPartnerRequestRepo } from '../../repos/implementations/inMemoryPartnerRequestRepo';
import { VehicleFileNumber } from '../../../catalog/domain/vehicleFileNumber';
import { VehicleCarPicturesOthers } from '../../../catalog/domain/vehicleCarPicturesOthers';
import { InMemoryApiUserService } from '../../../../infra/autobizApi/ApiUserService/InMemoryApiUserService';

describe('Dispatch the Partner Request Post', () => {
  let sendPartnerRequestUseCase;
  const apiPartnerRequestService = new InMemoryApiPartnerService();
  const apiUserService = new InMemoryApiUserService([]);
  const getInfosSpy = jest.spyOn(apiUserService, 'getUserInfos');
  const partnerRequestRepo = new InMemoryPartnerRequestRepo([
    {
      id: 1,
      uuid: 'UUID1',
      vehicleId: 1,
      partnerId: 1,
      createdBy: 'FR_1',
    },
  ]);
  const vehicleRepo = new InMemoryVehicleRepo([
    {
      id: 1,
      uuid: 'XXXXXXXXXXXX',
      fileNumber: VehicleFileNumber.create('XXX').getValue(),
      registration: 'XX-XXX-XX',
      brandLabel: 'VOLKSWAGEN',
      modelLabel: 'POLO',
      carPictures: VehicleCarPictures.create({}).getValue(),
      carPicturesOthers: VehicleCarPicturesOthers.create([]).getValue(),
    },
  ]);

  beforeEach(() => {
    sendPartnerRequestUseCase = new SendPartnerRequestUseCase(
      apiPartnerRequestService,
      partnerRequestRepo,
      vehicleRepo,
      apiUserService,
    );
  });

  it('shouled return true with blank message', async () => {
    const notifyOrError = await sendPartnerRequestUseCase.execute({
      uuid: 'UUID1',
    });
    expect(notifyOrError.isRight()).toBe(true);
    expect(notifyOrError.value).toEqual({
      uuid: 'UUID1',
      status: 'Partner request sended',
    });
    expect(getInfosSpy).toHaveBeenCalledWith(
      'FR_1'
    );
    expect(getInfosSpy).toHaveBeenCalledTimes(1);
  });

  it('shouled return false with message of problem', async () => {
    const notifyOrError = await sendPartnerRequestUseCase.execute({
      uuid: 'UUID2',
    });
    expect(notifyOrError.isRight()).toBe(false);
    expect(notifyOrError.value.error.message).toEqual('unknown partner.');
  });
});
