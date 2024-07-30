import { apiPartnerRequestService } from './../../../../infra/partnerRequestApi';
import { SendPartnerRequestUseCase } from './SendPartnerRequestUseCase';
import { partnerRequestRepo } from '../../repos';
import { vehicleRepo } from '../../../catalog/repos';
import { apiUserService } from '../../../../infra/autobizApi/ApiUserService';

const sendPartnerRequestUseCase = new SendPartnerRequestUseCase(
  apiPartnerRequestService,
  partnerRequestRepo,
  vehicleRepo,
  apiUserService
);

export { sendPartnerRequestUseCase };
