import { IVehicleRepo } from './../../../catalog/repos/vehicleRepo';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { IApiPartnerRequestService } from '../../../../infra/partnerRequestApi/IApiPartnerService';
import { IPartnerRequestRepo } from '../../repos/partnerRequestRepo';
import {
  SendPartnerRequestDto,
  SendPartnerRequestProps,
} from './SendPartnerRequestDto';
import { SendPartnerRequestErrors } from './SendPartnerRequestErrors';
import { VpAutoMap } from './vpAuto/VpAutoMap';
import { EasyRepriseMail, emailPageVin, key, url } from './vpAuto/config';
import vpautoschema from '../../../../shared/schemas/vpauto.json';
import Partners from './Partners.js';
import { IApiUserService } from '../../../../infra/autobizApi/ApiUserService/IApiUserService';
type Response = Either<AppError.UnexpectedError, Result<void>>;

export class SendPartnerRequestUseCase
  implements UseCase<SendPartnerRequestDto, Promise<Response>>
{
  private apiPartnerRequestService: IApiPartnerRequestService;
  private partnerRequestRepo: IPartnerRequestRepo;
  private vehicleRepo: IVehicleRepo;
  private apiUserService: IApiUserService;
  constructor(
    apiPartnerRequestService: IApiPartnerRequestService,
    partnerRequestRepo: IPartnerRequestRepo,
    vehicleRepo: IVehicleRepo,
    apiUserService: IApiUserService,
  ) {
    this.apiPartnerRequestService = apiPartnerRequestService;
    this.partnerRequestRepo = partnerRequestRepo;
    this.vehicleRepo = vehicleRepo;
    this.apiUserService = apiUserService;
  }

  public async execute(request: SendPartnerRequestDto): Promise<any> {
    const { uuid } = request;
    let statusId = 2;
    let comment;

    try {
      const partnerRequest =
        await this.partnerRequestRepo.getPartnerRequestByUuid(uuid);
      if (!partnerRequest) {
        return left(
          new SendPartnerRequestErrors.PartnerNotFoundExistsError(),
        ) as Response;
      }
      const { partnerId, vehicleId, saleComment, createdBy } = partnerRequest;

      let senderEmail;
      const userInfos = await this.apiUserService.getUserInfos(createdBy);
      if (userInfos.isRight()) {
        const { email } = userInfos.value.getValue();
        senderEmail = email;
        
        if (senderEmail === emailPageVin)
          senderEmail = EasyRepriseMail[process.env.stage];
      }

      const vehicle = await this.vehicleRepo.getAdminVehicleById(vehicleId);
      const props: SendPartnerRequestProps = {
        vehicle,
        uuid,
        saleComment,
        senderEmail,
      };
      const partner = Partners.find((obj) => obj.id === partnerId);

      if (!partner?.id) {
        throw new SendPartnerRequestErrors.PartnerNotFoundExistsError();
      }
      const res = await this[partner.partner](props);

      if (res.isRight()) {
        statusId = 1;
        comment = res.value;
      } else {
        const error = res.value;
        comment = error.errorValue().message;
      }
    } catch (err) {
      comment = err?.error ? err.error.message : err.message;
    } finally {
      await this.partnerRequestRepo.updatePartnerRequests({
        uuid,
        statusId,
        comment,
      });
    }
    return statusId === 1
      ? right({ uuid: uuid, status: comment })
      : left({ uuid: uuid, status: comment });
  }

  private async VpAuto(request: SendPartnerRequestProps) {
    const vehicleVpAuto = VpAutoMap.toVpAuto(request);
    return await this.apiPartnerRequestService.sendPartnerRequest(
      'vpauto',
      vehicleVpAuto,
      vpautoschema,
      `${url}/api/autobiz/estimation?key=${key}`,
    );
  }
}
