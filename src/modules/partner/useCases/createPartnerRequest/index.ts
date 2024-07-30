import { CreatePartnerRequestUseCase } from './CreatePartnerRequestUseCase';
import { CreatePartnerRequestController } from './CreatePartnerRequestController';
import { partnerRequestRepo } from '../../repos';
import { messengerService } from '../../../../infra/messenger';
import { UuidUniqueEntityId } from '../../../../infra/uniqueIdentifier/uuidV4-uniqueIdentifier';

const uuidUniqueEntityId = new UuidUniqueEntityId();
const createPartnerRequestUseCase = new CreatePartnerRequestUseCase(
  partnerRequestRepo,
  messengerService,
  uuidUniqueEntityId,
);

const createPartnerRequestController = new CreatePartnerRequestController(
  createPartnerRequestUseCase,
);

export { createPartnerRequestController, createPartnerRequestUseCase };
