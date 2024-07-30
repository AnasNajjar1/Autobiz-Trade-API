import { MaskRegistrationListUseCase } from './MaskRegistrationListUseCase';
import { MaskRegistrationController } from '../../useCases/maskRegistration/MaskRegistrationController';
import { messengerService } from '../../../../infra/messenger';

const maskRegistrationListUseCase = new MaskRegistrationListUseCase(
  messengerService,
);

export { maskRegistrationListUseCase };
