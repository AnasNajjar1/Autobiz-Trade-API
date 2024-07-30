import { left, Result, right } from '../../core/logic/Result';
import Ajv from 'ajv';
import { savePartnerBody } from '../fileStorage/s3-lib';
import axios from 'axios';
import { ApiResponse } from './ApiPartnerServiceDtos';
import { ApiPartnerServiceErrors } from './ApiPartnerServiceErrors';
import { IApiPartnerRequestService } from './IApiPartnerService';

export class ApiPartnerRequestService implements IApiPartnerRequestService {
  public async sendPartnerRequest(
    partner,
    vehicle,
    schema,
    url,
  ): Promise<ApiResponse<any>> {
    const validate = new Ajv().compile(schema);
    const isValid = validate(vehicle);
    if (!isValid) {
      return left(
        new ApiPartnerServiceErrors.ValidationFailed(
          `${validate.errors[0].dataPath} ${validate.errors[0].message}`,
        ),
      );
    }

    try {
      // SAVE PARTNER JSON TO S3
      await savePartnerBody(JSON.stringify(vehicle), partner, vehicle.request);
      console.log(vehicle.request, '1');
      const res = await axios.post(url, vehicle);
      console.log(res, '2');
      if (res.status > 299) throw new Error(res.data);
      return right(Result.ok(res.data));
    } catch (e) {
      console.log(e.response, '3');
      if (e.response?.data?.message_erreur)
        return left(
          new ApiPartnerServiceErrors.PartnerRequestFailed(
            e.response?.data?.message_erreur,
          ),
        );
      if (e.response.status > 499)
        return left(
          new ApiPartnerServiceErrors.PartnerRequestFailed(
            'server respond with status 500',
          ),
        );
      return left(new ApiPartnerServiceErrors.PartnerRequestInterruption());
    }
  }
}
