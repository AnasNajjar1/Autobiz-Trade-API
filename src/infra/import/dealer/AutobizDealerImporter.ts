const axios = require('axios');
import { env } from '../../../config/env';
import { left, Result } from '../../../core/logic/Result';
import { Guard } from '../../../core/logic/Guard';
import { IDealerImporterService } from './DealerImporterService';

export class AutobizDealerImporter implements IDealerImporterService {
  public async getDealer(inputCode: String, inputCountry?: String) {
    // inputCode must be like 1234 can be FR_1234;
    // inputCountry must be like fr or null

    const autobizApiPath =
      process.env.autobizApiPath || env[process.env.NODE_ENV].autobizApiPath;
    const autobizApiSecretKey =
      process.env.autobizApiSecretKey ||
      env[process.env.NODE_ENV].autobizApiSecretKey;

    const guardedProps = [
      { argument: inputCode, argumentName: 'autobizPosId' },
      { argument: autobizApiPath, argumentName: 'autobizApiPath' },
      {
        argument: autobizApiSecretKey,
        argumentName: 'autobizApiSecretKey',
      },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail(guardResult.message);
    }

    inputCode = String(inputCode);

    let code, country;

    if (inputCode.indexOf('_') > -1) {
      const splittedCode = inputCode.split('_');
      code = splittedCode[1];
      country = splittedCode[0].toLocaleLowerCase();
    } else {
      code = inputCode;
      country = inputCountry || 'fr';
    }

    const apiRoute = `${autobizApiPath}/dealer/v1/dealerships/${code}?filter=${JSON.stringify(
      {
        country,
        mode: 'long',
      },
    )}`;

    try {
      const apiResponse = await axios.get(apiRoute, {
        headers: {
          Authorization: `Basic ${autobizApiSecretKey}`,
        },
      });

      return {
        id: apiResponse.data.id,
        name: apiResponse.data.name,
        zipCode: apiResponse.data.address.zipCode,
        city: apiResponse.data.address.city,
        latitude: apiResponse.data.latitude,
        longitude: apiResponse.data.longitude,
        country: country,
        company: apiResponse.data.company?.name
      };
    } catch (e) {
      return false;
    }
    return false;
  }
}
