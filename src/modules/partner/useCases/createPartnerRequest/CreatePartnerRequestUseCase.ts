import { IVehicleRepo } from '../../../catalog/repos/vehicleRepo';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import {
  CreatePartnerRequestDto,
  CreatePartnerResponseDto,
  CreatePartnerRequestPropsDto,
} from './CreatePartnerRequestDtos';
import { IPartnerRequestRepo } from '../../repos/partnerRequestRepo';
import { decodeString } from '../../../../shared/helpers/others/StringDecoder';
import { IMessengerService } from '../../../../infra/messenger/MessengerService';
import { UuidUniqueEntityId } from '../../../../infra/uniqueIdentifier/uuidV4-uniqueIdentifier';
import { CreatePartnerRequestErrors } from './CreatePartnerRequestErrors';
type Response = Either<
  | CreatePartnerRequestErrors.VehicleNotFoundExistsError
  | CreatePartnerRequestErrors.PartnerNotFoundExistsError,
  Result<CreatePartnerResponseDto>
>;

export class CreatePartnerRequestUseCase
  implements UseCase<CreatePartnerRequestDto, Promise<Response>> {
  private partnerRequestRepo: IPartnerRequestRepo;
  private uuidUniqueEntityId: UuidUniqueEntityId;

  private messenger: IMessengerService;
  constructor(
    partnerRequestRepo: IPartnerRequestRepo,
    messenger: IMessengerService,
    uuidUniqueEntityId: UuidUniqueEntityId,
  ) {
    this.partnerRequestRepo = partnerRequestRepo;
    this.messenger = messenger;
    this.uuidUniqueEntityId = uuidUniqueEntityId;
  }

  public async execute(request: CreatePartnerRequestDto): Promise<Response> {
    const { vehicleId, partnerId, comment, createdBy } = request;
    const props: CreatePartnerRequestPropsDto = {
      vehicleId,
      partnerId,
      saleComment: decodeString(comment),
      uuid: this.uuidUniqueEntityId.generate(),
      createdBy
    };

    if (!vehicleId) {
      return left(
        new CreatePartnerRequestErrors.VehicleNotFoundExistsError(),
      ) as Response;
    }

    if (!partnerId) {
      return left(
        new CreatePartnerRequestErrors.PartnerNotFoundExistsError(),
      ) as Response;
    }

    try {
      await this.partnerRequestRepo.savePartnerRequests(props);
      await this.messenger.publishMessage('sendPartnerRequest', { uuid: props.uuid });
      return right(
        Result.ok<CreatePartnerResponseDto>({ uuid: props.uuid }),
      );
    } catch (err) {
      return left(
        new CreatePartnerRequestErrors.PartnerNotCreatedError(err.message),
      ) as Response;
    }
  }
}
